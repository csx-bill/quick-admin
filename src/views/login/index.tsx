import type { LoginParams, UserInfo } from '@/types'
import { type FC, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Form, Input, Checkbox, Button, message, Select, Modal } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useAppSelector, useAppDispatch } from '@/stores'
import { setToken, setUserInfo, setSessionTimeout } from '@/stores/modules/user'
import { setTenantRouter } from '@/stores/modules/tenant-router'
import { getAuthCache } from '@/utils/auth'
import { TOKEN_KEY } from '@/enums/cacheEnum'
import { loginApi, getUserInfo, getUserTenantList, getRoutesList } from '@/api'
import logoIcon from '@/assets/images/logo_name.png'
import classNames from 'classnames'
import styles from './index.module.less'

import { genFullPath } from '../../router/helpers'
import { LazyLoad } from '@/components/LazyLoad'
import { lazy } from '@loadable/component'
import { LayoutGuard } from '../../router/guard'

/**
 *
 * @returns 租户列表
 */
const Tenant = ({ tenantList, selectedTenant, onChangeTenant }) => {
  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').includes(input)

  tenantList[0].value

  return (
    <div>
      <Select
        showSearch
        variant='borderless'
        style={{ flex: 1 }}
        options={tenantList}
        value={selectedTenant}
        filterOption={filterOption}
        onChange={onChangeTenant}
        placeholder='请选择'
      />
    </div>
  )
}

const LoginPage: FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  // 用于处理模态框确认后的 Promise
  const [modalPromise, setModalPromise] = useState<{ resolve: Function } | null>(null)

  const [tenantList, setTenantList] = useState(null)
  // 初始化
  const [selectedTenant, setSelectedTenant] = useState(null)

  const dispatch = useAppDispatch()

  const { token, sessionTimeout } = useAppSelector(state => state.user)
  const getToken = (): string => {
    return token || getAuthCache<string>(TOKEN_KEY)
  }

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const handleLogin = async (values: any) => {
    try {
      setLoading(true)
      const userInfo = await loginAction({
        username: values.username,
        password: values.password
      })
      if (userInfo) {
        message.success('登陆成功！')
      }
    } catch (error) {
      message.error((error as unknown as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const loginAction = async (
    params: LoginParams & {
      goHome?: boolean
    }
  ): Promise<UserInfo | null> => {
    try {
      const { goHome = true, ...loginParams } = params
      const data = await loginApi(loginParams)

      // 保存 Token
      dispatch(setToken(data?.tokenValue))
      return afterLoginAction(goHome)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // afterLoginAction 函数中创建了一个新的 Promise
  // 并在状态中保存其 resolve 函数。在 handleOk 函数中，
  // 当用户选择了租户并点击确定时，resolve 函数会被调用，
  // 从而触发 getUserInfoAction 的执行。
  // 这样可以确保 getUserInfoAction 必须等待 setIsModalOpen(true) 和 handleOk 调用之后再执行
  const afterLoginAction = async (goHome?: boolean): Promise<UserInfo | null> => {
    if (!getToken()) return null

    // 选择租户
    const userTenantList = await getUserTenantListAction()
    setTenantList(userTenantList)
    // 打开租户选择的模态框
    setIsModalOpen(true)

    // 创建一个 promise 并在 state 中保存其 resolve 函数
    const promise = new Promise<UserInfo | null>((resolve, reject) => {
      setModalPromise({ resolve })
    })

    const userInfo = await promise.then(() => getUserInfoAction())

    // 如果 session 超时，处理这些逻辑
    if (sessionTimeout) {
      dispatch(setSessionTimeout(false))
    } else {
      const redirect = searchParams.get('redirect')
      if (redirect) {
        navigate(redirect)
      } else {
        goHome && navigate(userInfo?.homePath || '/home')
      }
    }

    return userInfo
  }

  const getUserInfoAction = async (): Promise<UserInfo | null> => {
    if (!getToken()) return null

    // 合并路由
    await fetchAndMergeRoutes()

    const userInfo = await getUserInfo()

    dispatch(setUserInfo(userInfo))

    return userInfo
  }

  const getUserTenantListAction = async (): Promise<any | null> => {
    if (!getToken()) return null

    const userTenantList = await getUserTenantList()

    const options = userTenantList.map(tenant => ({
      value: tenant.id,
      label: tenant.name
    }))
    // 默认选择第一个租户
    setSelectedTenant(options[0].value)
    // 缓存租户
    localStorage.setItem('X-Tenant-Id', options[0].value)
    return options
  }

  // 确认已选择的租户
  const handleOk = () => {
    localStorage.setItem('X-Tenant-Id', selectedTenant)
    setIsModalOpen(false)
    // resolve promise，触发 afterLoginAction 中的 getUserInfoAction 执行
    if (modalPromise) {
      modalPromise.resolve()
    }
  }

  // 切换租户
  const onChangeTenant = (value: string) => {
    setSelectedTenant(value)
  }

  // 定义一个函数用于从API获取路由并合并到routeList中
  async function fetchAndMergeRoutes() {
    try {
      const apiRoutes = await getRoutesList() // 假设这会返回一个RouteObject[]类型的响应
      console.log('apiRoutes res:', apiRoutes)
      // 根据实际返回结构可能需要适当地调整
      if (apiRoutes && Array.isArray(apiRoutes)) {
        traverse(apiRoutes)

        // 处理apiRoutes，如有必要生成完整路径
        genFullPath(apiRoutes)

        console.log('apiRoutes:', apiRoutes)
        // 合并路由
        dispatch(setTenantRouter(apiRoutes))
      }
    } catch (error) {
      console.error('Failed to fetch routes: ', error)
    }
  }

  // 递归遍历
  function traverse(routes: any) {
    routes.forEach(route => {
      if (route.menuType === 'DIR') {
        route.element = <LayoutGuard />
        route.meta = {
          title: route.name,
          icon: route.icon,
          orderNo: route.orderNo
        }
      }

      if (route.menuType === 'MENU') {
        route.key = route.id
        route.element = LazyLoad(lazy(() => import(/* @vite-ignore */ route.component)))
        route.meta = {
          title: route.name,
          key: route.id,
          orderNo: route.orderNo
        }
      }

      if (route.children && route.children.length > 0) {
        traverse(route.children)
      }
    })
  }

  return (
    <div className={styles['login-wrapper']}>
      <div className={styles['login-box']}>
        <Modal
          title='请选择登录的企业'
          footer={[
            <Button key='submit' type='primary' onClick={handleOk}>
              确定
            </Button>
          ]}
          open={isModalOpen}
          onOk={handleOk}
          maskClosable={false}
          closable={false}
        >
          <Tenant tenantList={tenantList} selectedTenant={selectedTenant} onChangeTenant={onChangeTenant} />
        </Modal>

        <div className={styles['login-box-title']}>
          <img src={logoIcon} alt='icon' />
          <p>账 号 登 录</p>
        </div>
        <Form
          form={form}
          initialValues={{
            username: 'admin',
            password: '123456',
            remember: true
          }}
          className={styles['login-box-form']}
          onFinish={handleLogin}
        >
          <Form.Item name='username' rules={[{ required: true, message: '请输入账号' }]}>
            <Input
              placeholder='请输入账号'
              prefix={<UserOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} rev={undefined} />}
            />
          </Form.Item>
          <Form.Item name='password' rules={[{ required: true, message: '请输入密码' }]}>
            <Input
              type='password'
              placeholder='请输入密码'
              prefix={<LockOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} rev={undefined} />}
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name='remember' className={classNames('fl', styles['no-margin'])} valuePropName='checked'>
              <Checkbox>记住我</Checkbox>
            </Form.Item>
            <Form.Item className={classNames('fr', styles['no-margin'])}>
              <a href=''>忘记密码？</a>
            </Form.Item>
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' className={styles['login-btn']} loading={loading}>
              登 录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default LoginPage

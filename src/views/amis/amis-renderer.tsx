import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getSchema } from '@/api'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import copy from 'copy-to-clipboard'
import { render as renderAmis, type SchemaObject } from 'amis'
import { ToastComponent, AlertComponent, toast } from 'amis-ui'
import 'amis/lib/themes/antd.css'
import 'amis/lib/helper.css'
import 'amis/sdk/iconfont.css'
import { fetcher, theme } from '@/utils/amisEnvUtils'
import { getAuthCache } from '@/utils/auth'
import { PERMS_CODE_KEY, TOKEN_KEY, X_Tenant_Id_KEY } from '@/enums/cacheEnum'

const AmisRenderer: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [schema, setSchema] = useState<SchemaObject>({} as SchemaObject)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    // 接口获取
    async function findCurrentMenu(path: any) {
      const res = await getSchema({ id: searchParams.get('mid') })
      setSchema(res.data.data?.schema !== null ? JSON.parse(res.data.data?.schema) : {})
    }

    const pathname = location.pathname
    findCurrentMenu(pathname)
  }, [])

  return (
    <div>
      <ToastComponent theme={theme} key='toast' position={'top-center'} />
      <AlertComponent theme={theme} key='alert' />

      {renderAmis(
        schema,
        {
          // props...
          //locale: curLanguage, // 请参考「多语言」的文档
          // scopeRef: (ref: any) => (amisScoped = ref)  // 功能和前面 SDK 的 amisScoped 一样
          context: {
            // 全局上下文数据, 非受控的数据，无论哪一层都能获取到，包括弹窗自定义数据映射后都能获取到。
            // 取值方式 ${permsCode}
            permsCode: getAuthCache<string[]>(PERMS_CODE_KEY),
            // 添加 X-Tenant-Id、token获取，解决在开启Storage加密时，无法直接通过ls标签获取token、租户信息
            // X-Tenant-Id，取值方式 ${xTenantId}
            xTenantId: getAuthCache<string>(X_Tenant_Id_KEY),
            // X-Access-Token, 取值方式 ${xAccessToken}
            xAccessToken: getAuthCache<string>(TOKEN_KEY)
          }
        },
        {
          // 下面三个接口必须实现
          fetcher,
          isCancel: (value: any) => (axios as any).isCancel(value),
          copy: content => {
            copy(content)
            toast.success('内容已复制到粘贴板')
          },
          theme,
          // 默认是地址跳转
          jumpTo: (location: string /*目标地址*/, action: any /* action对象*/) => {
            // 实现 amis 触发 多页签打开
            // 用来实现页面跳转, actionType:link、url 都会进来。
            if (action && action.actionType === 'url' && action.blank === false) {
              navigate(location)
              return
            } else if (action && action.blank) {
              // hash 路由 新窗口打开
              window.open(`#${location}`, '_blank')
              return
            } else {
              navigate(location)
            }
          }
        }
      )}
    </div>
  )
}
export default AmisRenderer

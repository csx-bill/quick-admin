import type { MenuProps } from 'antd'
import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import { Menu, Spin } from 'antd'
import type { AppMenu } from '@/router/types'
import { setMenuList } from '@/stores/modules/menu'
import { getOpenKeys } from '@/utils/helper/menuHelper'
import SvgIcon from '@/components/SvgIcon'
import { getUserPermission } from '@/api'
import { setAuthCache } from '@/utils/auth'
import { PERMS_CODE_KEY } from '@/enums/cacheEnum'

type MenuItem = Required<MenuProps>['items'][number]

// 定义生成菜单项的函数
const getItem = ({
  label,
  key,
  icon,
  path,
  children,
  type,
  hideMenu
}: {
  label: React.ReactNode
  key: React.Key
  path: String
  icon?: React.ReactNode
  children?: MenuItem[]
  type?: 'group'
  hideMenu?: boolean
}): MenuItem => {
  return {
    path,
    label,
    key,
    icon,
    children,
    type,
    hideMenu
  } as MenuItem
}

const LayoutMenu = (props: any) => {
  const { pathname } = useLocation()
  //const { setMenuList: setMenuListAction } = props
  const [loading, setLoading] = useState(false)
  const [menuList, setMenuList] = useState<MenuItem[]>([])
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([pathname])
  const menuKeys = useMemo(() => {
    const map: Record<string, string[]> = {}
    const func = (arr: any[], keys: string[]) => {
      ;(arr ?? []).reduce((map, item) => {
        if (item) {
          map[(item as any).path] = [...keys, item.key as string]
          if (item.children) {
            func(item.children, map[(item as any).path])
          }
        }
        return map
      }, map)
    }
    func(menuList, [])
    return map
  }, [menuList])
  useEffect(() => {
    const keys = menuKeys[pathname] ?? []
    setSelectedKeys([keys[keys.length - 1]].filter(Boolean))
    setOpenKeys(keys)
  }, [pathname, menuKeys])

  // 定义添加图标的函数
  const addIcon = (icon?: string) => {
    if (!icon) return null
    return (
      <span className='anticon'>
        <SvgIcon name={icon} size={16} />
      </span>
    )
  }

  // 遍历路由配置，生成菜单项
  const getMenuItem = (data: AppMenu[], list: MenuItem[] = []) => {
    data.forEach((item: AppMenu) => {
      // 是否隐藏菜单
      if (item.hideInMenu === 'Y') {
        item.hideMenu = true
      }
      if (!item?.children?.length) {
        return list.push(
          getItem({
            label: item.name,
            path: item.path,
            key: item.id,
            icon: addIcon(item.icon),
            children: void 0,
            type: void 0,
            hideMenu: item.hideMenu
          })
        )
      }
      list.push(
        getItem({
          label: item.name,
          path: item.path,
          key: item.id,
          icon: addIcon(item.icon),
          children: getMenuItem(item.children),
          type: void 0,
          hideMenu: item.hideMenu
        })
      )
    })
    return list.filter(item => {
      return !(item as unknown as AppMenu).hideMenu
    })
  }

  // 异步获取菜单数据
  const getMenuList = async () => {
    setLoading(true)
    try {
      const res = await getUserPermission()
      setMenuList(getMenuItem(res.data.data.userMenuTree))
      // 缓存 按钮权限
      setAuthCache(PERMS_CODE_KEY, res.data.data.permsCode)
    } finally {
      setLoading(false)
    }
  }

  // 初始化时菜单数据
  useEffect(() => {
    getMenuList()
  }, [])

  // 处理SubMenu的展开变化
  const handleOpenChange: MenuProps['onOpenChange'] = (keys: string[]) => {
    if (keys.length === 0 || keys.length === 1) return setOpenKeys(keys)
    const latestKey = keys[keys.length - 1]
    if (latestKey.includes(keys[0])) return setOpenKeys(keys)
    setOpenKeys([latestKey])
  }

  const navigate = useNavigate()
  // 处理菜单项的点击事件，进行页面跳转
  const handleMenuClick = ({ item, key }: { item: React.ReactElement; key: string }) => {
    navigate(item.props.path + `?mid=${key}`)
  }
  return (
    <div className='layout_menu'>
      <Spin spinning={loading} tip='Loading...'>
        <Menu
          theme='dark'
          mode='inline'
          triggerSubMenuAction='click'
          inlineIndent={20}
          subMenuOpenDelay={0.2}
          openKeys={openKeys}
          selectedKeys={selectedKeys}
          items={menuList}
          onClick={handleMenuClick as unknown as MenuProps['onClick']}
          onOpenChange={handleOpenChange}
        />
      </Spin>
    </div>
  )
}

const mapStateToProps = (state: any) => state.menu
const mapDispatchToProps = { setMenuList }

export default connect(mapStateToProps, mapDispatchToProps)(LayoutMenu)

import type { MenuProps } from 'antd'
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import { Menu, Spin } from 'antd'
import { getAsyncMenus } from '@/router/menus'
import type { AppMenu } from '@/router/types'
import { setMenuList } from '@/stores/modules/menu'
import { getOpenKeys } from '@/utils/helper/menuHelper'
import SvgIcon from '@/components/SvgIcon'
import { transformRouteToMenu } from '@/router/helpers'

import { useAppSelector, useAppDispatch } from '@/stores'
import { getAsyncRoutes } from '@/router/dynamic-routing'
import { setTenantRouter } from '@/stores/modules/tenant-router'

type MenuItem = Required<MenuProps>['items'][number]

// 定义生成菜单项的函数
const getItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem => {
  return {
    label,
    key,
    icon,
    children,
    type
  } as MenuItem
}

const LayoutMenu = (props: any) => {
  const { pathname } = useLocation()
  const { setMenuList: setMenuListAction } = props
  const [loading, setLoading] = useState(false)
  const [menuList, setMenuList] = useState<MenuItem[]>([])
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([pathname])
  const { tenantRouter } = useAppSelector(state => state.tenantRouter)
  const dispatch = useAppDispatch()

  useEffect(() => {
    setSelectedKeys([pathname])

    setOpenKeys(getOpenKeys(pathname))
  }, [pathname])

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
      if (!item?.children?.length) {
        return list.push(getItem(item.name, item.path, addIcon(item.icon)))
      }
      list.push(getItem(item.name, item.path, addIcon(item.icon), getMenuItem(item.children)))
    })
    return list
  }

  // 异步获取菜单数据
  const getMenuList = async () => {
    setLoading(true)
    try {
      // 本地路由转menus
      const menus = await getAsyncMenus()
      // 接口动态路由 转menus
      const tenantMenus = transformRouteToMenu(tenantRouter)
      // 合并menus
      const mergeMenus = [...menus, ...tenantMenus]

      setMenuList(getMenuItem(mergeMenus))
      setMenuListAction(mergeMenus)
    } finally {
      setLoading(false)
    }
  }

  // 异步获取动态路由数据
  const getRoutesList = async () => {
    setLoading(true)
    try {
      const routes = await getAsyncRoutes()
      // 添加动态路由
      dispatch(setTenantRouter(routes))
    } finally {
      setLoading(false)
    }
  }

  // 初始化时加载路由 & 菜单数据
  useEffect(() => {
    getRoutesList()
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
  const handleMenuClick: MenuProps['onClick'] = ({ key }: { key: string }) => {
    navigate(key)
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
          onClick={handleMenuClick}
          onOpenChange={handleOpenChange}
        />
      </Spin>
    </div>
  )
}

const mapStateToProps = (state: any) => state.menu
const mapDispatchToProps = { setMenuList }

export default connect(mapStateToProps, mapDispatchToProps)(LayoutMenu)

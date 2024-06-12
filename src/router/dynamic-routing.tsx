import { getRoutes } from '@/api'
import { genFullPath } from '@/router/helpers'
import { LazyLoad } from '@/components/LazyLoad'
import { lazy } from '@loadable/component'
import { LayoutGuard } from '@/router/guard'
import React from 'react'
const modules = import.meta.glob<false, 'default', React.FC>([
  '../views/**/*.tsx',
  '!../views/exception', // 排除
  '!../views/flow', // 排除
  '!../views/login' // 排除
])

// 定义一个函数用于从API获取路由
export async function getAsyncRoutes() {
  try {
    const res = await getRoutes()
    const apiRoutes = res.data.data
    if (apiRoutes && Array.isArray(apiRoutes)) {
      traverse(apiRoutes)
      // 处理apiRoutes，如有必要生成完整路径
      genFullPath(apiRoutes)
    }
    return apiRoutes
  } catch (error) {
    console.error('Failed to fetch routes: ', error)
  }
}

// 递归遍历
export async function traverse(routes: any) {
  routes.forEach((route: any) => {
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
      const key = ['../views/', route.component, '.tsx'].join('')
      route.element = LazyLoad(lazy(modules[key]))
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

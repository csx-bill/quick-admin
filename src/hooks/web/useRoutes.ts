import { useState } from 'react'

import { useAppDispatch } from '@/stores'

import { setTenantRouter } from '@/stores/modules/tenant-router'
import { getAsyncRoutes } from '@/router/dynamic-routing'
export default function () {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(true)
  // 异步获取动态路由数据
  const getRoutes = async () => {
    setLoading(true)
    try {
      const routes = await getAsyncRoutes()
      // 添加动态路由
      dispatch(setTenantRouter(routes))
    } catch (error) {
      console.log('getRoutes ~ error:', error)
      dispatch(setTenantRouter([]))
    } finally {
      setLoading(false)
    }
  }
  return {
    loading,
    loadRoutes: getRoutes
  }
}

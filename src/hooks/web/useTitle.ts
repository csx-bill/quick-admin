import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTitle as usePageTitle } from 'ahooks'
import { searchRoute } from '@/utils'
import { basicRoutes } from '@/router'
import { useAppSelector } from '@/stores'

// 监听页面变化和动态改变网站标题
export function useTitle() {
  const [pageTitle, setPageTitle] = useState('react-admin-design')
  const { pathname } = useLocation()
  const { tenantRouter } = useAppSelector(state => state.tenantRouter)

  useEffect(() => {
    const routes = [...basicRoutes, ...tenantRouter]
    const currRoute = searchRoute(pathname, routes)
    setPageTitle(currRoute?.meta.title)
  }, [pathname])

  usePageTitle(pageTitle)
}

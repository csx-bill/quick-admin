import { useEffect } from 'react'
import { RouterProvider, createHashRouter } from 'react-router-dom'
import { rootRoutes } from '@/router'
import { createContext } from 'react'
import { useAppSelector } from '@/stores'
import useMenuList from '@/hooks/web/useMenuList'
import { setTenantRouter } from '@/stores/modules/tenant-router'
import { Spin } from 'antd'
export const AppContext = createContext({})
const FormProvider = AppContext.Provider
function App() {
  const { tenantRouter } = useAppSelector(state => state.tenantRouter)
  const router = createHashRouter([...rootRoutes, ...tenantRouter])

  const { loading, loadMenuList } = useMenuList()

  // 初始化时加载路由 & 菜单数据
  useEffect(() => {
    loadMenuList()
  }, [])

  return (
    <FormProvider value={{ setTenantRouter }}>
      {loading ? (
        <div style={{ textAlign: 'center', paddingTop: 200 }}>
          <Spin size='large' />
        </div>
      ) : (
        <RouterProvider router={router} />
      )}
    </FormProvider>
  )
}

export default App

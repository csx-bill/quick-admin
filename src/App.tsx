import { useEffect } from 'react'
import { RouterProvider, createHashRouter } from 'react-router-dom'
import { rootRoutes } from '@/router'
import { createContext } from 'react'
import { useAppSelector } from '@/stores'
import useRoutes from '@/hooks/web/useRoutes'
import { setTenantRouter } from '@/stores/modules/tenant-router'
import { Spin } from 'antd'
export const AppContext = createContext({})
const FormProvider = AppContext.Provider
function App() {
  const { tenantRouter } = useAppSelector(state => state.tenantRouter)
  const router = createHashRouter([...rootRoutes, ...tenantRouter])
  const { loading, loadRoutes } = useRoutes()

  // 初始化时加载路由
  useEffect(() => {
    loadRoutes()
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

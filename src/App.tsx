import { RouterProvider, createHashRouter } from 'react-router-dom'
import { rootRoutes } from '@/router'
import { createContext } from 'react'
import { useAppSelector } from '@/stores'
import { setTenantRouter } from '@/stores/modules/tenant-router'

export const AppContext = createContext({})
const FormProvider = AppContext.Provider
function App() {
  const { tenantRouter } = useAppSelector(state => state.tenantRouter)
  const router = createHashRouter([...rootRoutes, ...tenantRouter])
  return (
    <FormProvider value={{ setTenantRouter }}>
      <RouterProvider router={router} />
    </FormProvider>
  )
}

export default App

import type { TenantRouterState } from '@/stores/types'
import { createSlice } from '@reduxjs/toolkit'

const initialState: TenantRouterState = {
  tenantRouter: []
}

const tenantRouter = createSlice({
  name: 'tenantRouter',
  initialState,
  reducers: {
    // 赋值租户路由
    setTenantRouter: (state, action) => {
      state.tenantRouter = action.payload ? action.payload : []
    },
    // 重置租户路由
    resetTenantRouterState(state) {
      state.tenantRouter = []
    }
  }
})

export const { setTenantRouter, resetTenantRouterState } = tenantRouter.actions

export default tenantRouter.reducer

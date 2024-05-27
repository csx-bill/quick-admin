import { service } from '@/utils/axios'

interface LoginParams {
  username: string
  password: string
}

// User login api
export function loginApi(data: LoginParams): Promise<any> {
  return service({
    url: '/auth/doLogin',
    method: 'post',
    data
  })
}

// Get User info
export function getUserInfo(): Promise<any> {
  return service({
    url: '/system/user/getUserInfo',
    method: 'get'
  })
}

// User logout api
export function logoutApi() {
  return service({
    url: '/auth/logout',
    method: 'get'
  })
}

// Table list
export function getTableList(params: any) {
  return service({
    url: '/table/getTableList',
    method: 'get',
    params
  })
}

// 获取用户租户集合
export function getUserTenantList() {
  return service({
    url: '/system/user/getUserTenantList',
    method: 'get'
  })
}

// 获取全局路由
export function getRoutesList() {
  return service({
    url: '/system/menu/getRoutes',
    method: 'get'
  })
}

// 获取菜单 amis schema
export function getSchemaByPath(params: any) {
  return service({
    url: '/system/menu/getSchemaByPath',
    method: 'get',
    params
  })
}

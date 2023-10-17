// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取全局路由 GET /api/system/SysMenu/getRoutes */
export async function getRoutes() {
  return request<API.RoutesNodeResult>('/api/system/SysMenu/getRoutes', {
    method: 'GET',
  });
}

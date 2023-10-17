// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取当前的用户 GET /api/system/SysUser/getUserInfo */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/system/SysUser/getUserInfo', {
    method: 'GET',
    ...(options || {}),
  });
}

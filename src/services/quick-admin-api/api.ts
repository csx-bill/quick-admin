// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/system/SysUser/getUserInfo', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/auth/logout', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 登录接口 POST */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/auth/doLogin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

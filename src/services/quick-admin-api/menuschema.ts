// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取菜单Schema GET */
export async function getMenuSchema(  params: {
  /** 当前的菜单ID */
  menuId?: string;
},options?: { [key: string]: any }) {
    return request<{
      data: API.SysMenuSchema;
    }>('/api/system/SysMenuSchema/getMenuSchema', {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
}

/** 保存接口 POST */
export async function save(body: API.SysMenuSchema, options?: { [key: string]: any }) {
  return request('/api/system/SysMenuSchema/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

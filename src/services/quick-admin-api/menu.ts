// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取当前的用户菜单 GET */
export async function getUserMenu(options?: { [key: string]: any }) {
    return request<{
      data: API.CurrentUser;
    }>('/api/system/SysMenu/getUserMenu', {
      method: 'GET',
      ...(options || {}),
    });
  }

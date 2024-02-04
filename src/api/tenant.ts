// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取租户集合 GET */
export async function getTenantList(
    params: {},
    options?: { [key: string]: any },
  ) {
    return request<Record<string, any>>('/api/system/tenant/list', {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
}

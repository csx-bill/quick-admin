// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取菜单 amis schema GET */
export async function getSchema(
  params: {
    id?: string;
  },
  options?: { [key: string]: any },
) {
  return request<Record<string, any>>('/api/system/menu/getSchemaById', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新接口 PUT */
export async function updateSchema(body: Record<string, any>, options?: { [key: string]: any }) {
  return request('/api/system/menu/updateSchemaById', {
    method: 'PUT',
    data: body,
    ...(options || {}),
  });
}


/** 获取菜单 amis schema GET */
export async function getOnlineSchema(
  params: {
    id?: string;
  },
  options?: { [key: string]: any },
) {
  return request<Record<string, any>>('/api/online/access/getAccessSchemaById', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}


/** 获取菜单 amis schema GET */
export async function getSchemaByPath(
  params: {
    path?: string;
  },
  options?: { [key: string]: any },
) {
  return request<Record<string, any>>('/api/system/menu/getSchemaByPath', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

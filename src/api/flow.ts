// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取流程定义信息 GET */
export async function getById(
    params: {
      id?: string;
    },
    options?: { [key: string]: any },
  ) {
    return request<Record<string, any>>('/api/flow/definition/getById', {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
  }

  /** 获取流程定义XML GET */
export async function getByIdXml(
  params: {
    id?: string;
  },
  options?: { [key: string]: any },
) {
  return request<Record<string, any>>('/api/flow/definition/xmlString', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}



/** 保存流程定义接口 */
export async function saveXml(body: Record<string, any>, options?: { [key: string]: any }) {
  return request('/api/flow/definition/saveXml', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

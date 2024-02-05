import { request } from '@umijs/max';
// amis 公共配置
export const fetcher = ({
  url, // 接口地址
  method, // 请求方法 get、post、put、delete
  data, // 请求数据
  responseType,
  config, // 其他配置
  headers, // 请求头
}: any) => {
  let newData = data;
  let newConfig = config || {};
  newConfig.withCredentials = true;
  newConfig.getResponse = true;
  newConfig.method = method;
  if (responseType) {
    newConfig.responseType = responseType;
  }

  newConfig.headers = headers || {};
  if (newData && newData instanceof FormData) {
    newConfig.headers = newConfig.headers || {};
    newConfig.headers['Content-Type'] = 'multipart/form-data';
  } else if (
    newData &&
    typeof newData !== 'string' &&
    !(newData instanceof Blob) &&
    !(newData instanceof ArrayBuffer)
  ) {
    newData = JSON.stringify(newData);
    newConfig.headers = config.headers || {};
    newConfig.headers['Content-Type'] = 'application/json';
  }

  return request(url, { method, data: newData, ...newConfig });
};

export const theme='antd'

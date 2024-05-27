import axios from 'axios'
// amis 公共配置
export const fetcher = ({
  url, // 接口地址
  method, // 请求方法 get、post、put、delete
  data, // 请求数据
  responseType,
  config, // 其他配置
  headers // 请求头
}: any) => {
  config = config || {}
  config.withCredentials = true
  responseType && (config.responseType = responseType)

  if (config.cancelExecutor) {
    config.cancelToken = new (axios as any).CancelToken(config.cancelExecutor)
  }

  config.headers = headers || {}

  if (method !== 'post' && method !== 'put' && method !== 'patch') {
    if (data) {
      config.params = data
    }

    return (axios as any)[method](url, config)
  } else if (data && data instanceof FormData) {
    config.headers = config.headers || {}
    config.headers['Content-Type'] = 'multipart/form-data'
  } else if (data && typeof data !== 'string' && !(data instanceof Blob) && !(data instanceof ArrayBuffer)) {
    data = JSON.stringify(data)
    config.headers = config.headers || {}
    config.headers['Content-Type'] = 'application/json'
  }
  config.headers['X-Tenant-Id'] = '1'
  return (axios as any)[method](url, data, config)
}

export const theme = 'antd'

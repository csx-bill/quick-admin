import axios from 'axios'
import { getToken, getAuthCache } from '@/utils/auth'
import { X_Tenant_Id_KEY } from '@/enums/cacheEnum'
import { service } from '@/utils/axios'

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
  config.headers = config.headers || {}
  config.withCredentials = true

  if (config.cancelExecutor) {
    config.cancelToken = new axios.CancelToken(config.cancelExecutor)
  }

  config.headers = headers || {}
  config.method = method

  if (method === 'get' && data) {
    config.params = data
  } else if (data && data instanceof FormData) {
    config.headers = config.headers || {}
    config.headers['Content-Type'] = 'multipart/form-data'
  } else if (data && typeof data !== 'string' && !(data instanceof Blob) && !(data instanceof ArrayBuffer)) {
    data = JSON.stringify(data)
    config.headers = config.headers || {}
    config.headers['Content-Type'] = 'application/json'
  }

  data && (config.data = data)
  config.url = url
  return service(config)
}

export const theme = 'antd'

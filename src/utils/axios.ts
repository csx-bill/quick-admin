import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import axios from 'axios'
import { message } from 'antd'
import { getToken, clearAuthCache } from '@/utils/auth'

// Create axios instance
const service = axios.create({
  baseURL: '/api',
  timeout: 10 * 1000
})

// Handle Error
const handleError = (error: AxiosError): Promise<AxiosError> => {
  if (error.response?.status === 401 || error.response?.status === 504) {
    clearAuthCache()
    location.href = '/login'
  }
  message.error(error.message || 'error')
  return Promise.reject(error)
}

// Request interceptors configuration
service.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken()
  if (token) {
    ;(config as Recordable).headers['X-Access-Token'] = `${token}`
  }
  ;(config as Recordable).headers['Content-Type'] = 'application/json'
  const tenantId = localStorage.getItem('X-Tenant-Id')
  ;(config as Recordable).headers['X-Tenant-Id'] = `${tenantId}`
  return config
}, handleError)

// Respose interceptors configuration
service.interceptors.response.use((response: AxiosResponse) => {
  const data = response.data

  if (data.status === 0) {
    return data.data
  } else {
    message.error(data.msg)

    return Promise.reject('error')
  }
}, handleError)

export { service }

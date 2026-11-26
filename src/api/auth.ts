import { request, setApiToken } from './client'
import type { ApiResponse, AuthUser, CustomerInfo } from './types'

export async function login(mobile: string, password: string): Promise<AuthUser> {
  const res = await request<ApiResponse<AuthUser>>('/contact/login', {
    method: 'POST',
    body: { mobile, password, device_type: 'web' },
  })
  const token = res.token ?? res.data.token
  setApiToken(token)
  return { ...res.data, token }
}

export async function register(
  name: string,
  mobile: string,
  email: string,
  password: string,
): Promise<AuthUser> {
  await request<ApiResponse<AuthUser>>('/contact/signup-email', {
    method: 'POST',
    body: { name, mobile, email, password },
  })
  try {
    return await login(mobile, password)
  } catch {
    throw new Error('AUTO_LOGIN_FAILED')
  }
}

export function checkPhone(mobile: string) {
  return request<ApiResponse<unknown>>('/auth/check-phone', {
    method: 'POST',
    body: { mobile },
  })
}

export function forgotPassword(mobile: string) {
  return request<ApiResponse<unknown>>('/contact/forgot-password', {
    method: 'POST',
    body: { mobile },
  })
}

export function resetPassword(mobile: string, otp: string, newPassword: string) {
  return request<ApiResponse<unknown>>('/contact/reset-password', {
    method: 'POST',
    body: { mobile, otp, new_password: newPassword },
  })
}

let customerInfoInflight: Promise<CustomerInfo> | null = null

export function getCustomerInfo(): Promise<CustomerInfo> {
  customerInfoInflight ??= request<ApiResponse<CustomerInfo>>('/connector/api/Info/customer')
    .then((r) => r.data)
    .finally(() => {
      customerInfoInflight = null
    })
  return customerInfoInflight
}

import { API_BASE_URL } from '../config'

const TOKEN_KEY = 'legendprotek-token'

let apiToken: string | null = localStorage.getItem(TOKEN_KEY)

export function setApiToken(token: string | null) {
  apiToken = token
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

export function getApiToken() {
  return apiToken
}

export class ApiError extends Error {
  status: number
  body: unknown

  constructor(message: string, status: number, body: unknown) {
    super(message)
    this.status = status
    this.body = body
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(apiToken ? { Authorization: `Bearer ${apiToken}` } : {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

  const json = await res.json().catch(() => null)
  if (!res.ok) {
    const message =
      (json as { message?: string } | null)?.message ?? `Request failed: ${res.status}`
    throw new ApiError(message, res.status, json)
  }
  return json as T
}

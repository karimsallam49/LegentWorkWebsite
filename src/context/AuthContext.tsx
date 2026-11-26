import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { getApiToken, setApiToken } from '../api/client'
import {
  getCustomerInfo,
  login as apiLogin,
  register as apiRegister,
} from '../api/auth'
import type { CustomerInfo } from '../api/types'

interface AuthContextValue {
  user: CustomerInfo | null
  loading: boolean
  isAuthenticated: boolean
  login: (mobile: string, password: string) => Promise<void>
  register: (name: string, mobile: string, email: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CustomerInfo | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    const info = await getCustomerInfo()
    setUser(info)
  }, [])

  useEffect(() => {
    if (!getApiToken()) {
      setLoading(false)
      return
    }
    getCustomerInfo()
      .then(setUser)
      .catch(() => setApiToken(null))
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(
    async (mobile: string, password: string) => {
      await apiLogin(mobile, password)
      await refreshUser()
    },
    [refreshUser],
  )

  const register = useCallback(
    async (name: string, mobile: string, email: string, password: string) => {
      await apiRegister(name, mobile, email, password)
      await refreshUser()
    },
    [refreshUser],
  )

  const logout = useCallback(() => {
    setApiToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated: !!user, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

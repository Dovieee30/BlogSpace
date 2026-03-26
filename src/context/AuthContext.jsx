import { createContext, useContext, useEffect, useState } from 'react'
import { getToken, removeToken, saveToken, api } from '../lib/api'

const AuthContext = createContext(null)

// Decode JWT payload without a library (JWTs are public — only the signature is secret)
function parseToken(token) {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount, restore user from stored token
  useEffect(() => {
    const token = getToken()
    if (token) {
      const decoded = parseToken(token)
      // Check token hasn't expired
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser({ id: decoded.id, email: decoded.email })
      } else {
        removeToken() // expired — clear it
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const { data, error } = await api.auth.login(email, password)
    if (error) return { error }
    saveToken(data.token)
    setUser(data.user)
    return { error: null }
  }

  const signup = async (email, password) => {
    const { data, error } = await api.auth.signup(email, password)
    if (error) return { error }
    return { data, error: null }
  }

  const logout = () => {
    removeToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

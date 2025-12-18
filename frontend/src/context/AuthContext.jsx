import React, { createContext, useEffect, useState } from 'react'
import API from '../api/api'

export const AuthContext = createContext()

export default function AuthProvider({ children }){
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const t = localStorage.getItem('token')
    const u = localStorage.getItem('user')
    if (t && u) setUser(JSON.parse(u))
    setLoading(false)
  },[])

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    setUser(res.data.user)
  }

  const signup = async (name, email, password) => {
    const res = await API.post('/auth/register', { name, email, password })
    if (res.data.token) {
      localStorage.setItem('token', res.data.token)
    }
    if (res.data.user) localStorage.setItem('user', JSON.stringify(res.data.user))
    setUser(res.data.user || null)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

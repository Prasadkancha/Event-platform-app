import React, { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext)
  const loc = useLocation()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace state={{ from: loc }} />
  return children
}

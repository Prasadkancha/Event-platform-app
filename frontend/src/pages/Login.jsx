import React, { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate, useLocation, Link } from 'react-router-dom'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useContext(AuthContext)
  const nav = useNavigate()
  const loc = useLocation()

  const submit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
      const to = loc.state?.from?.pathname || '/events'
      nav(to, { replace: true })
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg ring-1 ring-gray-100">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold py-3 text-gray-900">Welcome back</h2>
         
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
              value={email}
              onChange={e=>setEmail(e.target.value)}
              placeholder="you@domain.com"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
              value={password}
              onChange={e=>setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
              Remember me
            </label>
            <Link to="#" className="text-blue-600 hover:underline">Forgot?</Link>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium">Login</button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account? <Link to="/signup" className="text-blue-600 font-medium">Sign up</Link>
        </div>
      </div>
    </div>
  )
}

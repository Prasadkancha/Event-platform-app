import React, { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Signup(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signup } = useContext(AuthContext)
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      await signup(name, email, password)
      nav('/events')
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed')
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg ring-1 ring-gray-100">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 py-3">Create your account</h2>
          
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Full name</label>
            <input
              className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
              value={name}
              onChange={e=>setName(e.target.value)}
              placeholder="Your full name"
              required
            />
          </div>

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
              placeholder="Choose a strong password"
              required
            />
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium">Sign up</button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 font-medium">Login</Link>
        </div>
      </div>
    </div>
  )
}

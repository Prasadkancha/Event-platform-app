import React, { useContext, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import logo from '../assets/event-logo.png'

export default function NavBar(){
  const { user, logout } = useContext(AuthContext)
  const nav = useNavigate()
  const [open, setOpen] = useState(false)

  const doLogout = () => {
    logout()
    nav('/login')
  }

  const linkClass = ({ isActive }) =>
    `text-sm px-2 py-1 ${isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-600'}`

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow">
      <div className="w-3/4 sm:flex-row md:w-3/4 sm:w-3/4 mx-auto flex items-center justify-between py-3 h-16">
        <div className="flex items-center gap-4">
          <NavLink to="/" className="font-bold text-xl text-gray-900">
          <img className='w-36 rounded' src={logo} alt="" />
          </NavLink>
         
        </div>
          <button
            className="md:hidden p-2 rounded hover:bg-gray-100"
            aria-label="Toggle menu"
            onClick={()=>setOpen(o=>!o)}
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
         <div className={`flex-1 md:flex md:items-center md:justify-end ${open ? 'block' : 'hidden'} md:block`}>
          <div className="flex flex-col md:flex-row md:items-center md:gap-3 gap-2">
            <NavLink to="/events" className={linkClass}>Events</NavLink>
            <NavLink to="/about" className={linkClass}>About</NavLink>
            <NavLink to="/contact" className={linkClass}>Contact</NavLink>

           </div>
        </div>

        <div className={`flex-1 md:flex md:items-center md:justify-end ${open ? 'block' : 'hidden'} md:block`}>
          <div className="flex flex-col md:flex-row md:items-center md:gap-3 gap-2">
            {user ? (
              <>
                <NavLink to="/create" className={linkClass}>Create</NavLink>
                <div className="flex items-center gap-2">
                  
                  <button onClick={doLogout} className="text-sm text-gray-600 hover:text-red-600">Logout</button>
                </div>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass}>Login</NavLink>
                <NavLink to="/signup" className={linkClass}>Sign up</NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

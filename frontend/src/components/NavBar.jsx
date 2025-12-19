import React, { useContext, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import logo from '../assets/event-logo.png'

export default function NavBar() {
  const { user, logout } = useContext(AuthContext)
  const nav = useNavigate()
  const [open, setOpen] = useState(false)

  const doLogout = () => {
    logout()
    setOpen(false)
    nav('/login')
  }

  const closeMenu = () => setOpen(false)

  const linkClass = ({ isActive }) =>
    `text-sm px-2 py-1 ${isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-600'}`

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow">
      <div className="w-3/4 mx-auto flex items-center justify-between h-16">
        <div className="flex items-center gap-4">
          <NavLink to="/" className="font-bold text-xl text-gray-900" onClick={closeMenu}>
            <img className='w-36 rounded' src={logo} alt="Event Logo" />
          </NavLink>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex flex-1 items-center justify-end gap-8">
          <div className="flex items-center gap-6">
            <NavLink to="/events" className={linkClass}>Events</NavLink>
            <NavLink to="/about" className={linkClass}>About</NavLink>
            <NavLink to="/contact" className={linkClass}>Contact</NavLink>
          </div>

          <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
            {user ? (
              <>
                <NavLink to="/create" className={linkClass}>Create</NavLink>
                <button onClick={doLogout} className="text-sm text-gray-600 hover:text-red-600 font-medium">Logout</button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass}>Login</NavLink>
                <NavLink to="/signup" className={linkClass}>Sign up</NavLink>
              </>
            )}
          </div>
        </div>

        {/* Hamburger Button */}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-100"
          aria-label="Toggle menu"
          onClick={() => setOpen(o => !o)}
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="w-3/4 mx-auto flex flex-col py-4 gap-4">
            <NavLink to="/events" className={linkClass} onClick={closeMenu}>Events</NavLink>
            <NavLink to="/about" className={linkClass} onClick={closeMenu}>About</NavLink>
            <NavLink to="/contact" className={linkClass} onClick={closeMenu}>Contact</NavLink>
            <hr className="border-gray-100" />
            {user ? (
              <>
                <NavLink to="/create" className={linkClass} onClick={closeMenu}>Create</NavLink>
                <button onClick={doLogout} className="text-left text-sm text-gray-600 hover:text-red-600 px-2 py-1">Logout</button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass} onClick={closeMenu}>Login</NavLink>
                <NavLink to="/signup" className={linkClass} onClick={closeMenu}>Sign up</NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

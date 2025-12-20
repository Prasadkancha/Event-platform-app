import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { SpeedInsights } from '@vercel/speed-insights/react'
import Home from './pages/Home'
import NavBar from './components/NavBar'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import CreateEvent from './pages/CreateEvent'
import EditEvent from './pages/EditEvent'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AuthProvider from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Footer from './components/Footer'

import About from './pages/About'
import Contact from './pages/Contact'

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <main className="pt-20 pb-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/create" element={
              <ProtectedRoute><CreateEvent /></ProtectedRoute>
            } />
            <Route path="/events/:id/edit" element={
              <ProtectedRoute><EditEvent /></ProtectedRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
        <Footer />
        <SpeedInsights />
      </div>
    </AuthProvider>
  )
}

import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import API from '../api/api'
import EventCard from '../components/EventCard'
import heroImage from '../assets/event-hero1.png'

export default function Home() {
  const { user } = useContext(AuthContext)
  const [upcomingEvents, setUpcomingEvents] = useState([])

  useEffect(() => {
    API.get('/events').then(res => {
      // Take first 3 events as "Upcoming"
      setUpcomingEvents(res.data.slice(0, 3))
    }).catch(err => console.error("Failed to load upcoming events", err))
  }, [])

  return (
    <div className="flex flex-col">

      {/* Hero Section */}
      <section className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">

            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl flex flex-col">
                <span className="block xl:inline">Connect, Celebrate,</span>
                <span className="block text-indigo-600 xl:inline">Create Memories</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Discover local events, manage RSVPs, and bring your community together. From tech meetups to coffee chats, it all happens here.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link to="/events" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 shadow-md">
                    Browse Events
                  </Link>
                  {user ? (
                    <Link to="/create" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10 shadow-sm">
                      Create Event
                    </Link>
                  ) : (
                    <Link to="/login" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10 shadow-sm">
                      Get Started
                    </Link>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <img
                  className="w-full rounded-lg shadow-xl ring-1 ring-black ring-opacity-5"
                  src={heroImage}
                  alt="People enjoying an event"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Upcoming Events
            </h3>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Mark your calendars! These exclusive experiences are coming soon.
            </p>
          </div>

          <div className="space-y-12">
            {upcomingEvents.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map(event => (
                  <EventCard key={event._id} event={event} currentUser={user} onRsvp={() => { }} onDelete={() => { }} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No upcoming events found. Be the first to create one!</p>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-10">
            <p className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</p>
            <h3 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 text-indigo-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Create Events</h3>
              <p className="text-gray-500">Launch your event in minutes with our intuitive creation tools. Public or private, big or small.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 text-green-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Easy RSVPs</h3>
              <p className="text-gray-500">Track attendees in real-time. Managing guest lists has never been easier.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 text-purple-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Platform</h3>
              <p className="text-gray-500">Your data is safe with us. We prioritize privacy and security for all users.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

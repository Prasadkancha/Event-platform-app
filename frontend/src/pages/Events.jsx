import React, { useEffect, useState, useContext } from 'react'
import API from '../api/api'
import EventCard from '../components/EventCard'
import { AuthContext } from '../context/AuthContext'


// 1. UPDATED SAMPLES TO MATCH BACKEND SCHEMA
const SAMPLE_EVENTS = [
  {
    _id: 'sample-1',
    title: 'Community Meetup',
    description: 'Tech and coffee.',
    capacity: 50,
    attendees: [],
    location: 'Main Hall',
    datetime: new Date().toISOString(),
    imageUrl: null
  },
  // ...
]

export default function Events() {
  const { user } = useContext(AuthContext)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await API.get('/events')
      setEvents(res.data)
    } catch (err) {
      console.error('Failed to load events', err);
      const isNetwork = !err.response && (err.message?.includes('Network') || err.code?.includes('ERR_NETWORK')) // simplified check
      if (isNetwork) {
        setEvents(SAMPLE_EVENTS)
        setError({ message: 'Backend unreachable — showing local sample data (dev fallback).' })
      } else {
        setEvents([])
        setError(err)
      }
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => { load() }, [])

  // 2. UPDATED LOGIC TO HANDLE BOTH RSVP AND CANCEL
  const handleToggleRsvp = async (event) => {
    if (!user) {
      alert('Please login to RSVP');
      return;
    }
    const userId = user.id;
    const isAttending = event.attendees?.some(a => a === userId || a._id === userId);

    try {
      if (isAttending) {
        await API.post(`/events/${event._id}/cancel`)
        alert('RSVP Cancelled')
      } else {
        await API.post(`/events/${event._id}/rsvp`)
        alert('RSVP Successful')
      }
      await load() // Refresh list to update counts
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed')
    }
  }

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await API.delete(`/events/${eventId}`)
      alert('Event deleted')
      await load()
    } catch (err) {
      // alert(err.response?.data?.message || 'Delete failed')
      // For demo, if 403 (unauthorized/not creator), we might show a friendly error
      const msg = err.response?.data?.message || 'Delete failed';
      alert(msg);
    }
  }

  // ... (Loading and Error UI remains the same) ...

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Error banner code... */}

      {/* 3. ADD HEADER WITH CREATE BUTTON */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Events</h2>
        {/* Assuming you have a route for creating events */}
        <button onClick={() => window.location.href = '/create'} className="bg-indigo-600 text-white px-4 py-2 rounded shadow">
          Create Event
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map(e => (
          <EventCard
            key={e._id}
            event={e}
            currentUser={user}
            // 4. PASS THE NEW TOGGLE FUNCTION
            onRsvp={() => handleToggleRsvp(e)}
            onDelete={() => handleDelete(e._id)}
          />
        ))}
      </div>
    </div>
  )
}
import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../api/api'
import { AuthContext } from '../context/AuthContext'

export default function EventDetail() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    API.get(`/events/${id}`).then(res => setEvent(res.data))
  }, [id])

  const rsvp = async () => {
    try {
      await API.post(`/events/${id}/rsvp`)
      const res = await API.get(`/events/${id}`)
      setEvent(res.data)
      alert('RSVP successful')
    } catch (err) {
      alert(err.response?.data?.message || 'Could not RSVP')
    }
  }

  if (!event) return <div>Loading...</div>

  return (
    <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">{event.title}</h1>
      <p className="text-gray-700 mt-2">{event.description}</p>
      <div className="mt-4 text-sm text-gray-600">
        <div>Capacity: {event.capacity}</div>
        <div>Attendees: {event.attendees?.length || 0}</div>
      </div>
      <div className="mt-4 flex space-x-4">
        <button onClick={rsvp} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">RSVP</button>
        {user && (user.isAdmin || (event.creator && event.creator === user.id)) && (
          <button
            onClick={() => navigate(`/events/${id}/edit`)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Edit Event
          </button>
        )}
      </div>
    </div>
  )
}

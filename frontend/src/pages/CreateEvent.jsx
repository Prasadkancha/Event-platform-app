import React, { useState, useEffect } from 'react'
import API from '../api/api'
import { useNavigate } from 'react-router-dom'

// CreateEvent component with image upload, preview and client-side validation
// Expects backend to accept multipart/form-data under the field name 'image'

export default function CreateEvent() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    dateTime: '',
    location: '',
    capacity: 10
  })
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [uploading, setUploading] = useState(false)
  const nav = useNavigate()

  useEffect(() => {
    return () => {
      // cleanup object URL when component unmounts or preview changes
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // simple client-side validation
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file')
      return
    }
    const maxMB = 5
    if (file.size > maxMB * 1024 * 1024) {
      alert(`Image is too large. Max ${maxMB} MB allowed.`)
      return
    }

    // revoke previous preview URL
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setImageFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const submit = async (e) => {
    e.preventDefault()

    if (!imageFile) {
      alert('Please upload an image before creating the event')
      return
    }

    const formData = new FormData()
    formData.append('title', form.title)
    formData.append('description', form.description)
    formData.append('datetime', form.dateTime)  // Add this line
    formData.append('location', form.location)  // Add this line
    formData.append('capacity', String(form.capacity))
    formData.append('image', imageFile)

    try {
      setUploading(true)
      await API.post('/events', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      alert('Event created')
      nav('/events')
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Create failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create New Event</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Share your next big event with the community
          </p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-200"
                placeholder="e.g. Tech Conference"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="description"
                name="description"
                rows="4"
                required
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-200"
                placeholder="What is this event about?"
              />
            </div>

            <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  required
                  value={form.capacity}
                  onChange={e => setForm({ ...form, capacity: Number(e.target.value) })}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                />
              </div>

              <div>
                <label htmlFor="datetime" className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                <input
                  id="datetime"
                  name="datetime"
                  type="datetime-local"
                  required
                  value={form.dateTime}
                  onChange={e => setForm({ ...form, dateTime: e.target.value })}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                />
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                id="location"
                name="location"
                type="text"
                required
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                placeholder="e.g. Hyderabad"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Image</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors duration-200 group relative">
                <div className="space-y-1 text-center">
                  {!previewUrl ? (
                    <>

                      <div className="flex text-sm text-gray-600 justify-center">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                        </label>
                      </div>
                    </>
                  ) : (
                    <div className="relative">
                      <img src={previewUrl} alt="preview" className="mx-auto h-48 object-contain rounded-md" />
                      <button
                        type="button"
                        onClick={() => { setImageFile(null); setPreviewUrl(null); }}
                        className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={uploading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {uploading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                'Create Event'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

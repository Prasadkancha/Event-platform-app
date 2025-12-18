import React, { useState, useEffect, useContext } from 'react'
import API, { SERVER_URL } from '../api/api'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function EditEvent() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useContext(AuthContext)

    const [form, setForm] = useState({
        title: '',
        description: '',
        capacity: 0,
        dateTime: '',
        location: ''
    })
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [imageFile, setImageFile] = useState(null)

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await API.get(`/events/${id}`)
                const e = res.data
                // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
                const dateStr = e.datetime ? new Date(e.datetime).toISOString().slice(0, 16) : ''

                setForm({
                    title: e.title,
                    description: e.description,
                    capacity: e.capacity,
                    dateTime: dateStr,
                    location: e.location
                })
                if (e.imageUrl) {
                    setPreviewUrl(`${SERVER_URL}${e.imageUrl}`)
                }
                setLoading(false)
            } catch (err) {
                alert('Failed to load event')
                navigate('/events')
            }
        }
        fetchEvent()
    }, [id, navigate])

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    const submit = async (e) => {
        e.preventDefault()
        setUploading(true)

        // Validate date
        if (new Date(form.dateTime) < new Date()) {
            alert('Date must be in the future')
            setUploading(false)
            return
        }

        const formData = new FormData()
        Object.keys(form).forEach(key => {
            formData.append(key, form[key])
        })
        if (imageFile) {
            formData.append('image', imageFile)
        }

        try {
            await API.put(`/events/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            alert('Event updated successfully!')
            navigate('/events')
        } catch (err) {
            console.error(err)
            alert(err.response?.data?.message || 'Failed to update event')
        } finally {
            setUploading(false)
        }
    }

    if (loading) return <div className="text-center mt-10">Loading...</div>

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Edit Event</h2>
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
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Event Image</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors duration-200 group relative">
                                <div className="space-y-1 text-center">
                                    {!previewUrl ? (
                                        <>
                                            {/* SVG Icon */}
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
                                            >Change</button>
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
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 shadow-md hover:shadow-lg"
                        >
                            {uploading ? 'Updating...' : 'Update Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

import axios from 'axios'

// Ensure the base URL is a fully-qualified URL. Normalize common malformed values
let rawBase = import.meta.env.VITE_API_URL || https://event-platform-app-backend.onrender.com'
function normalizeBase(raw) {
  if (!raw) return 'https://event-platform-app-backend.onrender.com'
  // If starts with ':' (like ':4000/api') use current hostname
  if (raw.startsWith(':')) {
    return `${window.location.protocol}//${window.location.hostname}${raw}`
  }
  // If protocol-relative (//host/path)
  if (raw.startsWith('//')) {
    return `${window.location.protocol}${raw}`
  }
  // If starts with single slash, make absolute on current host
  if (raw.startsWith('/')) {
    return `${window.location.protocol}//${window.location.hostname}${raw}`
  }
  return raw
}

const baseURL = normalizeBase(rawBase)
console.info('[API] baseURL =', baseURL)

const API = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

API.interceptors.request.use(req => {
  const token = localStorage.getItem('token')
  if (token) req.headers.Authorization = `Bearer ${token}`
  return req
})

export default API

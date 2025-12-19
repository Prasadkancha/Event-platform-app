import axios from 'axios'

// 1. Get raw URL from env or default
const envUrl = import.meta.env.VITE_API_URL;
const defaultUrl = 'https://event-platform-app-backend.onrender.com';

// 2. Helper to normalize to a full server root (WITHOUT /api suffix)
function getNormalizedServerRoot(raw, backup) {
  let url = raw || backup;

  // Handle protocol-relative or partials
  if (!url) return 'https://event-platform-app-backend.onrender.com';
  if (url.startsWith(':')) url = `${window.location.protocol}//${window.location.hostname}${url}`;
  if (url.startsWith('//')) url = `${window.location.protocol}${url}`;
  if (url.startsWith('/')) url = `${window.location.protocol}//${window.location.hostname}${url}`;

  // Strip trailing slashes
  url = url.replace(/\/+$/, '');

  // Strip trailing /api if present (case insensitive)
  url = url.replace(/\/api$/i, '');

  return url;
}

// 3. Define constants
const serverRoot = getNormalizedServerRoot(envUrl, defaultUrl);

// SERVER_URL: The root for static assets (e.g. images) -> http://localhost:4000
export const SERVER_URL = serverRoot;

// API_URL: The endpoint for data calls -> http://localhost:4000/api
export const API_URL = `${serverRoot}/api`;

console.info('[Config] Server Root:', SERVER_URL);
console.info('[Config] API Endpoint:', API_URL);

// 4. Create Axios instance
const API = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

API.interceptors.request.use(req => {
  const token = localStorage.getItem('token')
  if (token) req.headers.Authorization = `Bearer ${token}`
  return req
})

export default API

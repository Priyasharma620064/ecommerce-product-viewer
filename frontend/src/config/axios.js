import axios from 'axios'

// Get the API URL from environment variable, fallback to relative path for development
const API_URL = import.meta.env.VITE_API_URL || ''

// Create axios instance with base URL
const api = axios.create({
    baseURL: API_URL,
    timeout: 30000, // 30 second timeout
    withCredentials: true, // Enable credentials for CORS
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle network errors
        if (!error.response) {
            if (error.code === 'ECONNABORTED') {
                error.message = 'Request timeout. Please check your connection and try again.'
            } else if (error.message === 'Network Error') {
                error.message = 'Unable to connect to server. Please check if the backend is running.'
            } else {
                error.message = 'Network error. Please check your internet connection.'
            }
        }
        return Promise.reject(error)
    }
)

export default api


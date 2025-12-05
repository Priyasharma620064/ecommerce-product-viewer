import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../config/axios'

// Async thunk for user login
export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/auth/login', credentials)
            localStorage.setItem('token', response.data.token)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Login failed')
        }
    }
)

// Async thunk for user signup
export const signup = createAsyncThunk(
    'auth/signup',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/auth/signup', userData)
            // Don't save token or auto-login, just return success message
            return { message: 'Account created successfully! Please login to continue.', user: response.data.user }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Signup failed')
        }
    }
)

// Async thunk to load user from token
export const loadUser = createAsyncThunk(
    'auth/loadUser',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                return rejectWithValue('No token found')
            }

            const response = await api.get('/api/auth/me')
            return response.data
        } catch (error) {
            localStorage.removeItem('token')
            return rejectWithValue(error.response?.data?.message || 'Failed to load user')
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: localStorage.getItem('token'),
        isAuthenticated: false,
        loading: false,
        error: null,
        signupSuccess: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null
            state.token = null
            state.isAuthenticated = false
            localStorage.removeItem('token')
        },
        clearError: (state) => {
            state.error = null
        },
        clearSignupSuccess: (state) => {
            state.signupSuccess = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false
                state.isAuthenticated = true
                state.user = action.payload.user
                state.token = action.payload.token
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // Signup
            .addCase(signup.pending, (state) => {
                state.loading = true
                state.error = null
                state.signupSuccess = null
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.loading = false
                state.isAuthenticated = false  // Don't auto-login
                state.signupSuccess = action.payload.message
                // Don't set user or token
            })
            .addCase(signup.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
                state.signupSuccess = null
            })
            // Load user
            .addCase(loadUser.pending, (state) => {
                state.loading = true
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loading = false
                state.isAuthenticated = true
                state.user = action.payload
            })
            .addCase(loadUser.rejected, (state) => {
                state.loading = false
                state.isAuthenticated = false
                state.user = null
                state.token = null
            })
    },
})

export const { logout, clearError, clearSignupSuccess } = authSlice.actions
export default authSlice.reducer

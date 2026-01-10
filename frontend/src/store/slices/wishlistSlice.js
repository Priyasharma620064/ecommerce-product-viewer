import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../config/axios'

// Get wishlist
export const getWishlist = createAsyncThunk(
    'wishlist/get',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/api/profile/wishlist')
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist')
        }
    }
)

// Add to wishlist
export const addToWishlist = createAsyncThunk(
    'wishlist/add',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await api.post(`/api/profile/wishlist/${productId}`)
            return productId
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist')
        }
    }
)

// Remove from wishlist
export const removeFromWishlist = createAsyncThunk(
    'wishlist/remove',
    async (productId, { rejectWithValue }) => {
        try {
            await api.delete(`/api/profile/wishlist/${productId}`)
            return productId
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to remove from wishlist')
        }
    }
)

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearWishlistError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Get wishlist
            .addCase(getWishlist.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getWishlist.fulfilled, (state, action) => {
                state.loading = false
                state.items = action.payload
            })
            .addCase(getWishlist.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // Add to wishlist
            .addCase(addToWishlist.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.loading = false
                // Product ID is returned, we'll fetch full wishlist after
            })
            .addCase(addToWishlist.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // Remove from wishlist
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item._id !== action.payload)
            })
    },
})

export const { clearWishlistError } = wishlistSlice.actions
export default wishlistSlice.reducer

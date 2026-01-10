import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../config/axios'

// Create order
export const createOrder = createAsyncThunk(
    'orders/create',
    async (orderData, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/orders', orderData)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create order')
        }
    }
)

// Get user orders
export const getUserOrders = createAsyncThunk(
    'orders/getUserOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/api/orders/myorders')
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders')
        }
    }
)

// Get single order
export const getOrderById = createAsyncThunk(
    'orders/getById',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/api/orders/${orderId}`)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch order')
        }
    }
)

// Update order status (admin)
export const updateOrderStatus = createAsyncThunk(
    'orders/updateStatus',
    async ({ orderId, orderStatus }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/api/orders/${orderId}/status`, { orderStatus })
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update order')
        }
    }
)

// Get all orders (admin)
export const getAllOrders = createAsyncThunk(
    'orders/getAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/api/orders')
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders')
        }
    }
)

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [],
        currentOrder: null,
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        clearOrderError: (state) => {
            state.error = null
        },
        clearOrderSuccess: (state) => {
            state.success = false
        },
        clearCurrentOrder: (state) => {
            state.currentOrder = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Create order
            .addCase(createOrder.pending, (state) => {
                state.loading = true
                state.error = null
                state.success = false
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false
                state.currentOrder = action.payload
                state.success = true
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // Get user orders
            .addCase(getUserOrders.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getUserOrders.fulfilled, (state, action) => {
                state.loading = false
                state.orders = action.payload
            })
            .addCase(getUserOrders.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // Get order by ID
            .addCase(getOrderById.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getOrderById.fulfilled, (state, action) => {
                state.loading = false
                state.currentOrder = action.payload
            })
            .addCase(getOrderById.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // Update order status
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.currentOrder = action.payload
                const index = state.orders.findIndex(order => order._id === action.payload._id)
                if (index !== -1) {
                    state.orders[index] = action.payload
                }
            })
            // Get all orders (admin)
            .addCase(getAllOrders.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getAllOrders.fulfilled, (state, action) => {
                state.loading = false
                state.orders = action.payload
            })
            .addCase(getAllOrders.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

export const { clearOrderError, clearOrderSuccess, clearCurrentOrder } = orderSlice.actions
export default orderSlice.reducer

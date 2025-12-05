import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../config/axios'

// Async thunk to fetch products with filters
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (filters = {}) => {
        const params = new URLSearchParams()

        // Handle multiple categories
        if (filters.category && filters.category.length > 0) {
            params.append('category', filters.category.join(','))
        }
        if (filters.minPrice) params.append('minPrice', filters.minPrice)
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
        if (filters.minDiscount && filters.minDiscount.length > 0) {
            params.append('minDiscount', filters.minDiscount.join(','))
        }
        if (filters.search) params.append('search', filters.search)
        if (filters.sort) params.append('sort', filters.sort)

        const response = await api.get(`/api/products?${params.toString()}`)
        return response.data
    }
)

// Async thunk to fetch single product
export const fetchProductById = createAsyncThunk(
    'products/fetchProductById',
    async (id) => {
        const response = await api.get(`/api/products/${id}`)
        return response.data
    }
)

const productSlice = createSlice({
    name: 'products',
    initialState: {
        items: [],
        currentProduct: null,
        filters: {
            category: [],
            minPrice: 0,
            maxPrice: 50000,
            minDiscount: [],
            search: '',
            sort: 'featured',
        },
        loading: false,
        error: null,
    },
    reducers: {
        setCategory: (state, action) => {
            state.filters.category = action.payload
        },
        setPriceRange: (state, action) => {
            state.filters.minPrice = action.payload.min
            state.filters.maxPrice = action.payload.max
        },
        setDiscount: (state, action) => {
            state.filters.minDiscount = action.payload
        },
        setSearch: (state, action) => {
            state.filters.search = action.payload
        },
        setSort: (state, action) => {
            state.filters.sort = action.payload
        },
        clearFilters: (state) => {
            state.filters = {
                category: [],
                minPrice: 0,
                maxPrice: 50000,
                minDiscount: [],
                search: '',
                sort: 'featured',
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch products
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false
                state.items = action.payload
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            // Fetch single product
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.loading = false
                state.currentProduct = action.payload
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
    },
})

export const { setCategory, setPriceRange, setDiscount, setSearch, setSort, clearFilters } = productSlice.actions
export default productSlice.reducer

import { configureStore } from '@reduxjs/toolkit'
import productReducer from './slices/productSlice'
import cartReducer from './slices/cartSlice'
import authReducer from './slices/authSlice'
import orderReducer from './slices/orderSlice'
import wishlistReducer from './slices/wishlistSlice'
import { clearCart } from './slices/cartSlice'

// Middleware to clear cart on login
const clearCartOnLogin = (store) => (next) => (action) => {
    const result = next(action)

    // Clear cart when user successfully logs in
    if (action.type === 'auth/login/fulfilled') {
        store.dispatch(clearCart())
    }

    return result
}

const store = configureStore({
    reducer: {
        products: productReducer,
        cart: cartReducer,
        auth: authReducer,
        orders: orderReducer,
        wishlist: wishlistReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(clearCartOnLogin),
})

export default store

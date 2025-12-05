import { createSlice } from '@reduxjs/toolkit'

const loadCartFromLocalStorage = () => {
    try {
        const cart = localStorage.getItem('cart')
        return cart ? JSON.parse(cart) : []
    } catch (error) {
        return []
    }
}

const saveCartToLocalStorage = (cart) => {
    try {
        localStorage.setItem('cart', JSON.stringify(cart))
    } catch (error) {
        console.error('Failed to save cart to localStorage:', error)
    }
}

const calculateTotals = (items) => {
    const subtotal = items.reduce((total, item) => {
        const price = item.discount > 0
            ? item.price - (item.price * item.discount / 100)
            : item.price
        return total + (price * item.quantity)
    }, 0)

    const discount = items.reduce((total, item) => {
        if (item.discount > 0) {
            return total + ((item.price * item.discount / 100) * item.quantity)
        }
        return total
    }, 0)

    const shipping = subtotal > 0 ? 50 : 0
    const total = subtotal + shipping

    return { subtotal, discount, shipping, total }
}

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: loadCartFromLocalStorage(),
        totals: calculateTotals(loadCartFromLocalStorage()),
    },
    reducers: {
        addToCart: (state, action) => {
            const { product, quantity = 1, size } = action.payload
            const existingItem = state.items.find(
                item => item._id === product._id && item.size === size
            )

            if (existingItem) {
                // Check if adding quantity would exceed stock
                const newQuantity = existingItem.quantity + quantity
                if (product.stock && newQuantity > product.stock) {
                    // Set to max available stock
                    existingItem.quantity = product.stock
                    console.warn(`Cannot add more than ${product.stock} items (stock limit reached)`)
                } else {
                    existingItem.quantity = newQuantity
                }
            } else {
                // Check stock before adding new item
                const itemQuantity = product.stock && quantity > product.stock
                    ? product.stock
                    : quantity

                state.items.push({
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    discount: product.discount || 0,
                    image: product.images[0],
                    category: product.category,
                    size: size || null,
                    quantity: itemQuantity,
                    stock: product.stock, // Store stock info
                })
            }

            state.totals = calculateTotals(state.items)
            saveCartToLocalStorage(state.items)
        },
        removeFromCart: (state, action) => {
            const { productId, size } = action.payload
            console.log('Removing item:', { productId, size })
            console.log('Current cart items:', state.items)

            state.items = state.items.filter(item => {
                // Handle both cases: items with size and items without size
                if (size === null || size === undefined) {
                    return !(item._id === productId && (item.size === null || item.size === undefined))
                }
                return !(item._id === productId && item.size === size)
            })

            console.log('Cart after removal:', state.items)
            state.totals = calculateTotals(state.items)
            saveCartToLocalStorage(state.items)
        },
        updateQuantity: (state, action) => {
            const { productId, size, quantity, stock } = action.payload
            console.log('Updating quantity:', { productId, size, quantity, stock })

            const item = state.items.find(item => {
                // Handle both cases: items with size and items without size
                if (size === null || size === undefined) {
                    return item._id === productId && (item.size === null || item.size === undefined)
                }
                return item._id === productId && item.size === size
            })

            if (item && quantity > 0) {
                // Check stock limit if stock info is provided
                if (stock !== undefined && quantity > stock) {
                    item.quantity = stock
                    console.warn(`Quantity capped at ${stock} (stock limit)`)
                } else {
                    item.quantity = quantity
                }
                console.log('Updated item:', item)
            }

            state.totals = calculateTotals(state.items)
            saveCartToLocalStorage(state.items)
        },
        clearCart: (state) => {
            state.items = []
            state.totals = { subtotal: 0, discount: 0, shipping: 0, total: 0 }
            saveCartToLocalStorage([])
        },
    },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions

// Selectors
export const selectCartItemCount = (state) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0)

export const selectCartTotal = (state) => state.cart.totals.total

export default cartSlice.reducer

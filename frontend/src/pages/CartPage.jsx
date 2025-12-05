import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { removeFromCart, updateQuantity } from '../store/slices/cartSlice'
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi'

const CartPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { items, totals } = useSelector((state) => state.cart)

    const handleQuantityChange = (productId, size, newQuantity) => {
        if (newQuantity > 0) {
            dispatch(updateQuantity({ productId, size, quantity: newQuantity }))
        }
    }

    const handleRemove = (productId, size) => {
        console.log('Delete clicked for:', { productId, size })
        dispatch(removeFromCart({ productId, size }))
    }

    const handleCheckout = () => {
        alert('Checkout functionality will be implemented in the stretch goals!')
    }

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="text-center">
                    <FiShoppingBag className="text-6xl text-slate-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Your cart is empty</h2>
                    <p className="text-slate-600 mb-6">Add some products to get started!</p>
                    <Link to="/products" className="btn-primary inline-block">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => {
                        const itemPrice = item.discount > 0
                            ? item.price - (item.price * item.discount / 100)
                            : item.price
                        const originalPrice = item.price

                        return (
                            <div key={`${item._id}-${item.size}`} className="card p-4">
                                <div className="flex items-start space-x-4">
                                    {/* Product Image */}
                                    <img
                                        src={item.image || '/placeholder.jpg'}
                                        alt={item.name}
                                        className="w-24 h-24 object-cover rounded-lg bg-slate-100"
                                    />

                                    {/* Product Info */}
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-slate-800 mb-1">{item.name}</h3>
                                        <p className="text-sm text-slate-500 mb-2">Category: {item.category}</p>
                                        {item.size && (
                                            <p className="text-sm text-slate-500 mb-2">Size: {item.size}</p>
                                        )}

                                        {/* Price */}
                                        <div className="flex items-center space-x-2 mb-3">
                                            <span className="text-lg font-bold text-primary-600">
                                                ₹{Math.round(itemPrice)}
                                            </span>
                                            {item.discount > 0 && (
                                                <span className="text-sm text-slate-400 line-through">
                                                    ₹{originalPrice}
                                                </span>
                                            )}
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={() => handleQuantityChange(item._id, item.size, item.quantity - 1)}
                                                className="p-1.5 border border-slate-300 rounded hover:bg-slate-100"
                                            >
                                                <FiMinus className="text-sm" />
                                            </button>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(item._id, item.size, parseInt(e.target.value) || 1)}
                                                className="w-16 text-center border border-slate-300 rounded py-1"
                                            />
                                            <button
                                                onClick={() => handleQuantityChange(item._id, item.size, item.quantity + 1)}
                                                className="p-1.5 border border-slate-300 rounded hover:bg-slate-100"
                                            >
                                                <FiPlus className="text-sm" />
                                            </button>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => handleRemove(item._id, item.size)}
                                                className="ml-auto p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="card p-6 sticky top-24">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">Order Summary</h2>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-slate-600">
                                <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                                <span>₹{Math.round(totals.subtotal)}</span>
                            </div>

                            {totals.discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span>-₹{Math.round(totals.discount)}</span>
                                </div>
                            )}

                            <div className="flex justify-between text-slate-600">
                                <span>Shipping</span>
                                <span>₹{totals.shipping}</span>
                            </div>

                            <div className="border-t border-slate-200 pt-3">
                                <div className="flex justify-between text-xl font-bold text-slate-800">
                                    <span>Total</span>
                                    <span>₹{Math.round(totals.total)}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="btn-primary w-full mb-3"
                        >
                            Proceed to Checkout
                        </button>

                        <Link
                            to="/products"
                            className="btn-secondary w-full text-center block"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartPage

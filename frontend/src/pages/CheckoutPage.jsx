import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createOrder, clearOrderSuccess } from '../store/slices/orderSlice'
import { clearCart } from '../store/slices/cartSlice'
import PaymentModal from '../components/payment/PaymentModal'

const CheckoutPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { items } = useSelector((state) => state.cart)
    const { user } = useSelector((state) => state.auth)
    const { loading, success, currentOrder } = useSelector((state) => state.orders)

    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [shippingAddress, setShippingAddress] = useState({
        fullName: user?.name || '',
        phone: user?.phone || '',
        address: user?.address?.address || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        pincode: user?.address?.pincode || '',
    })

    // Calculate prices
    const itemsPrice = items.reduce((acc, item) => {
        const discountedPrice = item.price - (item.price * item.discount / 100)
        return acc + (discountedPrice * item.quantity)
    }, 0)
    const shippingPrice = itemsPrice > 500 ? 0 : 40
    const totalPrice = itemsPrice + shippingPrice

    // Redirect if cart is empty
    useEffect(() => {
        if (items.length === 0) {
            navigate('/cart')
        }
    }, [items, navigate])

    // Redirect to order confirmation after successful order creation
    useEffect(() => {
        if (success && currentOrder) {
            dispatch(clearCart())
            dispatch(clearOrderSuccess())
            navigate(`/orders/${currentOrder._id}`)
        }
    }, [success, currentOrder, dispatch, navigate])

    const handleChange = (e) => {
        const { name, value } = e.target
        setShippingAddress(prev => ({ ...prev, [name]: value }))
    }

    const handleProceedToPayment = (e) => {
        e.preventDefault()
        setShowPaymentModal(true)
    }

    const handlePaymentSuccess = (paymentId) => {
        const orderData = {
            orderItems: items.map(item => ({
                product: item._id,
                name: item.name,
                quantity: item.quantity,
                price: item.price - (item.price * item.discount / 100),
                image: item.image,
            })),
            shippingAddress,
            paymentInfo: {
                paymentId,
                paymentMethod: 'Card',
                status: 'Completed',
            },
            itemsPrice,
            shippingPrice,
            totalPrice,
        }

        dispatch(createOrder(orderData))
        setShowPaymentModal(false)
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-3xl font-bold text-slate-800 mb-8">Checkout</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Shipping Address Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-bold text-slate-800 mb-6">Shipping Address</h2>

                            <form onSubmit={handleProceedToPayment} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={shippingAddress.fullName}
                                        onChange={handleChange}
                                        required
                                        className="input-field"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={shippingAddress.phone}
                                        onChange={handleChange}
                                        required
                                        className="input-field"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Address *
                                    </label>
                                    <textarea
                                        name="address"
                                        value={shippingAddress.address}
                                        onChange={handleChange}
                                        required
                                        rows="3"
                                        className="input-field"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={shippingAddress.city}
                                            onChange={handleChange}
                                            required
                                            className="input-field"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            State *
                                        </label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={shippingAddress.state}
                                            onChange={handleChange}
                                            required
                                            className="input-field"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Pincode *
                                    </label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={shippingAddress.pincode}
                                        onChange={handleChange}
                                        required
                                        maxLength="6"
                                        className="input-field"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn-primary w-full mt-6"
                                    disabled={loading}
                                >
                                    Proceed to Payment
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-slate-800 mb-4">Order Summary</h2>

                            <div className="space-y-3 mb-4">
                                {items.map((item) => {
                                    const discountedPrice = item.price - (item.price * item.discount / 100)
                                    return (
                                        <div key={item._id} className="flex gap-3">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-slate-800 line-clamp-1">
                                                    {item.name}
                                                </p>
                                                <p className="text-sm text-slate-600">
                                                    Qty: {item.quantity}
                                                </p>
                                                <p className="text-sm font-semibold text-slate-800">
                                                    ₹{(discountedPrice * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="border-t border-slate-200 pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Subtotal</span>
                                    <span className="font-medium text-slate-800">₹{itemsPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Shipping</span>
                                    <span className="font-medium text-slate-800">
                                        {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-slate-800 pt-2 border-t border-slate-200">
                                    <span>Total</span>
                                    <span className="text-primary-600">₹{totalPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            {shippingPrice === 0 && (
                                <p className="text-xs text-green-600 mt-3 text-center">
                                    🎉 You got free shipping!
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onSuccess={handlePaymentSuccess}
                totalAmount={totalPrice}
            />
        </div>
    )
}

export default CheckoutPage

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import { getOrderById } from '../store/slices/orderSlice'

const OrderDetailPage = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const { currentOrder: order, loading } = useSelector((state) => state.orders)

    useEffect(() => {
        dispatch(getOrderById(id))
    }, [dispatch, id])

    const getStatusColor = (status) => {
        const colors = {
            Pending: 'bg-yellow-100 text-yellow-800',
            Processing: 'bg-blue-100 text-blue-800',
            Shipped: 'bg-purple-100 text-purple-800',
            Delivered: 'bg-green-100 text-green-800',
            Cancelled: 'bg-red-100 text-red-800',
        }
        return colors[status] || 'bg-slate-100 text-slate-800'
    }

    if (loading || !order) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading order details...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="container mx-auto px-4 max-w-5xl">
                <Link to="/orders" className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1 mb-6">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Orders
                </Link>

                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Order Details</h1>
                            <p className="text-slate-600 mt-1">
                                Order ID: <span className="font-mono font-medium">#{order._id.slice(-8).toUpperCase()}</span>
                            </p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus}
                        </span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-6 pb-6 border-b border-slate-200">
                        <div>
                            <p className="text-sm text-slate-600 mb-1">Order Date</p>
                            <p className="font-medium text-slate-800">
                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-600 mb-1">Payment Method</p>
                            <p className="font-medium text-slate-800">{order.paymentInfo.paymentMethod}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-600 mb-1">Payment Status</p>
                            <p className="font-medium text-green-600">{order.paymentInfo.status}</p>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Shipping Address</h2>
                        <div className="bg-slate-50 rounded-lg p-4">
                            <p className="font-medium text-slate-800">{order.shippingAddress.fullName}</p>
                            <p className="text-slate-600 mt-1">{order.shippingAddress.address}</p>
                            <p className="text-slate-600">
                                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                            </p>
                            <p className="text-slate-600 mt-1">Phone: {order.shippingAddress.phone}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Order Items</h2>

                    <div className="space-y-4">
                        {order.orderItems.map((item, index) => (
                            <div key={index} className="flex gap-4 pb-4 border-b border-slate-200 last:border-0">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-24 h-24 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                    <h3 className="font-medium text-slate-800 mb-1">{item.name}</h3>
                                    <p className="text-sm text-slate-600">Quantity: {item.quantity}</p>
                                    <p className="text-sm text-slate-600">Price: ₹{item.price.toFixed(2)} each</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-800">
                                        ₹{(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-200">
                        <div className="max-w-sm ml-auto space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Subtotal</span>
                                <span className="font-medium text-slate-800">₹{order.itemsPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Shipping</span>
                                <span className="font-medium text-slate-800">
                                    {order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice.toFixed(2)}`}
                                </span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-slate-800 pt-2 border-t border-slate-200">
                                <span>Total</span>
                                <span className="text-primary-600">₹{order.totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderDetailPage

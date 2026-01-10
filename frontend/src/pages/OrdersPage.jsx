import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getUserOrders } from '../store/slices/orderSlice'

const OrdersPage = () => {
    const dispatch = useDispatch()
    const { orders, loading } = useSelector((state) => state.orders)
    const { user } = useSelector((state) => state.auth)

    useEffect(() => {
        dispatch(getUserOrders())
    }, [dispatch])

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

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading orders...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-3xl font-bold text-slate-800 mb-8">My Orders</h1>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">No Orders Yet</h2>
                        <p className="text-slate-600 mb-6">You haven't placed any orders yet.</p>
                        <Link to="/products" className="btn-primary inline-block">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                        <div>
                                            <p className="text-sm text-slate-600">Order ID</p>
                                            <p className="font-mono text-sm font-medium text-slate-800">
                                                #{order._id.slice(-8).toUpperCase()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-600">Order Date</p>
                                            <p className="font-medium text-slate-800">
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-600">Total Amount</p>
                                            <p className="font-bold text-lg text-primary-600">
                                                ₹{order.totalPrice.toFixed(2)}
                                            </p>
                                        </div>
                                        <div>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                                                {order.orderStatus}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-200 pt-4">
                                        <div className="flex flex-wrap gap-4 mb-4">
                                            {order.orderItems.slice(0, 3).map((item, index) => (
                                                <div key={index} className="flex gap-3">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-16 h-16 object-cover rounded-lg"
                                                    />
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-800 line-clamp-1">
                                                            {item.name}
                                                        </p>
                                                        <p className="text-sm text-slate-600">
                                                            Qty: {item.quantity}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                            {order.orderItems.length > 3 && (
                                                <div className="flex items-center text-sm text-slate-600">
                                                    +{order.orderItems.length - 3} more items
                                                </div>
                                            )}
                                        </div>

                                        <Link
                                            to={`/orders/${order._id}`}
                                            className="text-primary-600 hover:text-primary-700 font-medium text-sm inline-flex items-center gap-1"
                                        >
                                            View Order Details
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default OrdersPage

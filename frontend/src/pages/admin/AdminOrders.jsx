import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrders, updateOrderStatus } from '../../store/slices/orderSlice'

const AdminOrders = () => {
    const dispatch = useDispatch()
    const { orders, loading } = useSelector((state) => state.orders)
    const [selectedStatus, setSelectedStatus] = useState({})

    useEffect(() => {
        dispatch(getAllOrders())
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

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await dispatch(updateOrderStatus({ orderId, orderStatus: newStatus })).unwrap()
            alert('Order status updated successfully!')
        } catch (error) {
            alert('Failed to update order status')
        }
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
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Order Management</h1>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-slate-600">
                    <p className="text-sm text-slate-600 mb-1">Total Orders</p>
                    <p className="text-3xl font-bold text-slate-800">{orders.length}</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-600">
                    <p className="text-sm text-slate-600 mb-1">Pending</p>
                    <p className="text-3xl font-bold text-yellow-600">
                        {orders.filter(o => o.orderStatus === 'Pending').length}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
                    <p className="text-sm text-slate-600 mb-1">Processing</p>
                    <p className="text-3xl font-bold text-blue-600">
                        {orders.filter(o => o.orderStatus === 'Processing').length}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-600">
                    <p className="text-sm text-slate-600 mb-1">Shipped</p>
                    <p className="text-3xl font-bold text-purple-600">
                        {orders.filter(o => o.orderStatus === 'Shipped').length}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-600">
                    <p className="text-sm text-slate-600 mb-1">Delivered</p>
                    <p className="text-3xl font-bold text-green-600">
                        {orders.filter(o => o.orderStatus === 'Delivered').length}
                    </p>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Order ID</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Customer</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Date</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Items</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Total</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-mono text-sm font-medium text-slate-800">
                                            #{order._id.slice(-8).toUpperCase()}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-slate-800">{order.user?.name}</p>
                                        <p className="text-sm text-slate-600">{order.user?.email}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-slate-800">
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-slate-800">{order.orderItems.length} items</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-primary-600">₹{order.totalPrice.toFixed(2)}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <select
                                                value={selectedStatus[order._id] || order.orderStatus}
                                                onChange={(e) => setSelectedStatus({ ...selectedStatus, [order._id]: e.target.value })}
                                                className="text-sm border border-slate-300 rounded px-2 py-1"
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                            <button
                                                onClick={() => handleStatusChange(order._id, selectedStatus[order._id] || order.orderStatus)}
                                                className="text-sm bg-primary-600 text-white px-3 py-1 rounded hover:bg-primary-700"
                                            >
                                                Update
                                            </button>
                                            <Link
                                                to={`/orders/${order._id}`}
                                                className="text-sm text-primary-600 hover:text-primary-700 underline"
                                            >
                                                View
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {orders.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-slate-500">No orders found</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminOrders

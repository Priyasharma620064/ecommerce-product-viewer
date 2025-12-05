import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../../config/axios'
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi'
import Loader from '../../components/common/Loader'

const AdminDashboard = () => {
    const { token } = useSelector((state) => state.auth)
    const [products, setProducts] = useState([])
    const [stats, setStats] = useState({
        total: 0,
        inStock: 0,
        lowStock: 0,
        outOfStock: 0,
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const response = await api.get('/api/products')

            const productsData = response.data
            setProducts(productsData)

            // Calculate stats
            const total = productsData.length
            const inStock = productsData.filter(p => p.stock > 10).length
            const lowStock = productsData.filter(p => p.stock > 0 && p.stock <= 10).length
            const outOfStock = productsData.filter(p => p.stock === 0).length

            setStats({ total, inStock, lowStock, outOfStock })
            setLoading(false)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch products')
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return

        try {
            await api.delete(`/api/products/${id}`)
            alert('Product deleted successfully!')
            fetchProducts()
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete product')
        }
    }

    if (loading) return <Loader />

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Product Management</h1>
                <Link to="/admin/product/new" className="btn-primary flex items-center space-x-2">
                    <FiPlus />
                    <span>Add New Product</span>
                </Link>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-primary-600">
                    <p className="text-sm text-slate-600 mb-1">Total Products</p>
                    <p className="text-3xl font-bold text-primary-600">{stats.total}</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-600">
                    <p className="text-sm text-slate-600 mb-1">In Stock</p>
                    <p className="text-3xl font-bold text-green-600">{stats.inStock}</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-600">
                    <p className="text-sm text-slate-600 mb-1">Low Stock</p>
                    <p className="text-3xl font-bold text-orange-600">{stats.lowStock}</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-600">
                    <p className="text-sm text-slate-600 mb-1">Out of Stock</p>
                    <p className="text-3xl font-bold text-red-600">{stats.outOfStock}</p>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Image</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Product Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Category</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Price</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Stock</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <img
                                            src={product.images?.[0] || '/placeholder.jpg'}
                                            alt={product.name}
                                            className="w-16 h-16 object-cover rounded-lg bg-slate-100"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-slate-800">{product.name}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-slate-600">{product.category}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-slate-800">₹{product.price}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {product.stock === 0 ? (
                                            <span className="badge-danger">Out of Stock</span>
                                        ) : product.stock <= 10 ? (
                                            <span className="badge-warning">Low Stock</span>
                                        ) : (
                                            <span className="badge-success">In Stock</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <Link
                                                to={`/admin/product/edit/${product._id}`}
                                                className="text-primary-600 hover:text-primary-700 transition-colors"
                                            >
                                                <FiEdit2 className="text-lg" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="text-red-600 hover:text-red-700 transition-colors"
                                            >
                                                <FiTrash2 className="text-lg" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {products.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-slate-500">No products found. Add your first product!</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminDashboard

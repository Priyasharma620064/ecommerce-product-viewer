import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'
import { FiShoppingCart, FiUser, FiSearch, FiMenu, FiX, FiLogOut } from 'react-icons/fi'
import { selectCartItemCount } from '../../store/slices/cartSlice'
import { logout } from '../../store/slices/authSlice'
import { setSearch } from '../../store/slices/productSlice'

const Header = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const cartItemCount = useSelector(selectCartItemCount)
    const { isAuthenticated, user } = useSelector((state) => state.auth)
    const [searchQuery, setSearchQuery] = useState('')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)

    const handleSearch = (e) => {
        e.preventDefault()
        dispatch(setSearch(searchQuery))
        navigate('/')
    }

    const handleCartClick = () => {
        navigate('/cart')
    }

    const handleProfileClick = () => {
        setShowUserMenu(!showUserMenu)
    }

    const handleLogout = () => {
        dispatch(logout())
        setShowUserMenu(false)
        navigate('/')
    }

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4">
                {/* Top Bar */}
                <div className="flex items-center justify-between py-4">
                    {/* Logo */}
                    <Link to="/products" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">PS</span>
                        </div>
                        <div className="hidden md:block">
                            <h1 className="text-xl font-bold text-slate-800">ShopHub</h1>
                            <p className="text-xs text-slate-500">by Priya Sharma</p>
                        </div>
                    </Link>

                    {/* Search Bar - Desktop */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-xl" />
                        </div>
                    </form>

                    {/* Right Icons */}
                    <div className="flex items-center space-x-4">
                        {/* Cart Icon */}
                        <button
                            onClick={handleCartClick}
                            className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <FiShoppingCart className="text-2xl text-slate-700" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                                    {cartItemCount}
                                </span>
                            )}
                        </button>

                        {/* User Icon */}
                        <div className="relative">
                            <button
                                onClick={handleProfileClick}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <FiUser className="text-2xl text-slate-700" />
                            </button>

                            {/* User Dropdown Menu */}
                            {showUserMenu && isAuthenticated && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-2 animate-fade-in">
                                    <div className="px-4 py-2 border-b border-slate-200">
                                        <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                                        <p className="text-xs text-slate-500">{user?.email}</p>
                                    </div>
                                    {user?.role === 'admin' ? (
                                        <>
                                            <Link
                                                to="/admin"
                                                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                Admin Dashboard
                                            </Link>
                                            <Link
                                                to="/admin/orders"
                                                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                Manage Orders
                                            </Link>
                                            <Link
                                                to="/admin/product/new"
                                                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                Add Product
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                My Profile
                                            </Link>
                                            <Link
                                                to="/orders"
                                                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                My Orders
                                            </Link>
                                            <Link
                                                to="/wishlist"
                                                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                My Wishlist
                                            </Link>
                                        </>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                    >
                                        <FiLogOut />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            {mobileMenuOpen ? (
                                <FiX className="text-2xl text-slate-700" />
                            ) : (
                                <FiMenu className="text-2xl text-slate-700" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Navigation Links - Desktop */}
                <nav className="hidden md:flex space-x-8 pb-4 border-t border-slate-200 pt-4">
                    <Link to="/products" className="text-slate-700 hover:text-primary-600 font-medium transition-colors">
                        All Products
                    </Link>
                </nav>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-slate-200 animate-fade-in">
                        {/* Mobile Search */}
                        <form onSubmit={handleSearch} className="mb-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-xl" />
                            </div>
                        </form>

                        {/* Mobile Navigation */}
                        <nav className="flex flex-col space-y-2">
                            <Link
                                to="/products"
                                className="text-slate-700 hover:text-primary-600 font-medium py-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                All Products
                            </Link>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Header

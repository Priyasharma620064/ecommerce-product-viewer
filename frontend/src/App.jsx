import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadUser } from './store/slices/authSlice'

// Layout
import Header from './components/layout/Header'

// Pages
import HomePage from './pages/HomePage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import AuthPage from './pages/AuthPage'
import CheckoutPage from './pages/CheckoutPage'
import OrdersPage from './pages/OrdersPage'
import OrderDetailPage from './pages/OrderDetailPage'
import ProfilePage from './pages/ProfilePage'
import WishlistPage from './pages/WishlistPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminOrders from './pages/admin/AdminOrders'
import ProductForm from './pages/admin/ProductForm'
import NotFoundPage from './pages/NotFoundPage'

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isAuthenticated, user } = useSelector((state) => state.auth)

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />
    }

    if (adminOnly && user?.role !== 'admin') {
        return <Navigate to="/products" replace />
    }

    return children
}

// Auth Route - Redirect if already authenticated
const AuthRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.auth)

    if (isAuthenticated) {
        return <Navigate to="/products" replace />
    }

    return children
}

function App() {
    const dispatch = useDispatch()
    const location = useLocation()

    useEffect(() => {
        dispatch(loadUser())
    }, [dispatch])

    // Routes where Header should NOT be shown
    const hideHeaderRoutes = ['/', '/auth']
    const showHeader = !hideHeaderRoutes.includes(location.pathname)

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            {showHeader && <Header />}
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={
                        <AuthRoute>
                            <AuthPage />
                        </AuthRoute>
                    } />
                    <Route path="/auth" element={
                        <AuthRoute>
                            <AuthPage />
                        </AuthRoute>
                    } />
                    <Route
                        path="/products"
                        element={
                            <ProtectedRoute>
                                <HomePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/product/:id"
                        element={
                            <ProtectedRoute>
                                <ProductDetailPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/cart"
                        element={
                            <ProtectedRoute>
                                <CartPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/checkout"
                        element={
                            <ProtectedRoute>
                                <CheckoutPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/orders"
                        element={
                            <ProtectedRoute>
                                <OrdersPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/orders/:id"
                        element={
                            <ProtectedRoute>
                                <OrderDetailPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/wishlist"
                        element={
                            <ProtectedRoute>
                                <WishlistPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Admin Routes */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute adminOnly>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/orders"
                        element={
                            <ProtectedRoute adminOnly>
                                <AdminOrders />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/product/new"
                        element={
                            <ProtectedRoute adminOnly>
                                <ProductForm />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/product/edit/:id"
                        element={
                            <ProtectedRoute adminOnly>
                                <ProductForm />
                            </ProtectedRoute>
                        }
                    />

                    {/* 404 Catch-all route */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>
        </div>
    )
}

export default App

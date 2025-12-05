import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login, signup, clearError, clearSignupSuccess } from '../store/slices/authSlice'

const AuthPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isAuthenticated, loading, error, signupSuccess } = useSelector((state) => state.auth)

    const [activeTab, setActiveTab] = useState('login')
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    })

    // Only redirect on login, not after signup
    useEffect(() => {
        if (isAuthenticated && activeTab === 'login') {
            navigate('/products')
        }
    }, [isAuthenticated, activeTab, navigate])

    useEffect(() => {
        dispatch(clearError())
        dispatch(clearSignupSuccess())
    }, [activeTab, dispatch])

    // Clear form after successful signup
    useEffect(() => {
        if (signupSuccess) {
            setFormData({
                name: '',
                email: '',
                password: '',
            })
        }
    }, [signupSuccess])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (activeTab === 'login') {
            dispatch(login({
                email: formData.email,
                password: formData.password,
            }))
        } else {
            dispatch(signup({
                name: formData.name,
                email: formData.email,
                password: formData.password,
            }))
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-slate-800 mb-8">
                    {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
                </h1>

                {/* Tab Navigation */}
                <div className="flex mb-8 bg-slate-100 rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab('login')}
                        className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${activeTab === 'login'
                            ? 'bg-primary-600 text-white shadow-md'
                            : 'text-slate-600 hover:text-slate-800'
                            }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setActiveTab('signup')}
                        className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${activeTab === 'signup'
                            ? 'bg-primary-600 text-white shadow-md'
                            : 'text-slate-600 hover:text-slate-800'
                            }`}
                    >
                        Signup
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                {/* Success Message after Signup */}
                {signupSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
                        {signupSuccess}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name Field (Signup only) */}
                    {activeTab === 'signup' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                                className="input-field"
                            />
                        </div>
                    )}

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            className="input-field"
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            minLength={6}
                            className="input-field"
                        />
                    </div>



                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full disabled:bg-slate-400 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center space-x-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>{activeTab === 'login' ? 'Logging in...' : 'Signing up...'}</span>
                            </span>
                        ) : (
                            activeTab === 'login' ? 'Login' : 'Sign Up'
                        )}
                    </button>
                </form>

                {/* Additional Info */}
                <p className="text-center text-sm text-slate-600 mt-6">
                    {activeTab === 'login' ? (
                        <>
                            Don't have an account?{' '}
                            <button
                                onClick={() => setActiveTab('signup')}
                                className="text-primary-600 hover:text-primary-700 font-medium"
                            >
                                Sign up
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?{' '}
                            <button
                                onClick={() => setActiveTab('login')}
                                className="text-primary-600 hover:text-primary-700 font-medium"
                            >
                                Login
                            </button>
                        </>
                    )}
                </p>
            </div>
        </div>
    )
}

export default AuthPage

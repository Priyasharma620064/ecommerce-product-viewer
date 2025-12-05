import { Link } from 'react-router-dom'
import { FiHome, FiAlertCircle } from 'react-icons/fi'

const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
            <div className="max-w-md w-full text-center">
                {/* Error Icon */}
                <div className="mb-8 flex justify-center">
                    <div className="bg-red-100 p-6 rounded-full">
                        <FiAlertCircle className="text-6xl text-red-500" />
                    </div>
                </div>

                {/* 404 Text */}
                <h1 className="text-9xl font-bold text-slate-800 mb-4">404</h1>

                {/* Error Message */}
                <h2 className="text-2xl font-semibold text-slate-700 mb-4">
                    Page Not Found
                </h2>
                <p className="text-slate-500 mb-8">
                    Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
                </p>

                {/* Home Button */}
                <Link
                    to="/products"
                    className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
                >
                    <FiHome className="text-xl" />
                    <span>Go to Home</span>
                </Link>

                {/* Additional Info */}
                <div className="mt-12 text-sm text-slate-400">
                    <p>Error Code: 404 - Page Not Found</p>
                </div>
            </div>
        </div>
    )
}

export default NotFoundPage

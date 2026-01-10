import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getWishlist, removeFromWishlist } from '../store/slices/wishlistSlice'
import { addToCart } from '../store/slices/cartSlice'

const WishlistPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { items, loading } = useSelector((state) => state.wishlist)

    useEffect(() => {
        dispatch(getWishlist())
    }, [dispatch])

    const handleRemove = (productId) => {
        dispatch(removeFromWishlist(productId))
    }

    const handleAddToCart = (product) => {
        dispatch(addToCart(product))
        dispatch(removeFromWishlist(product._id))
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading wishlist...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-3xl font-bold text-slate-800 mb-8">My Wishlist</h1>

                {items.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Your Wishlist is Empty</h2>
                        <p className="text-slate-600 mb-6">Save your favorite items here!</p>
                        <button
                            onClick={() => navigate('/products')}
                            className="btn-primary inline-block"
                        >
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {items.map((product) => {
                            const discountedPrice = product.price - (product.price * product.discount / 100)

                            return (
                                <div key={product._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                                    <div className="relative">
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className="w-full h-48 object-cover cursor-pointer"
                                            onClick={() => navigate(`/products/${product._id}`)}
                                        />
                                        {product.discount > 0 && (
                                            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                {product.discount}% OFF
                                            </span>
                                        )}
                                        <button
                                            onClick={() => handleRemove(product._id)}
                                            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
                                        >
                                            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="p-4">
                                        <h3
                                            className="font-semibold text-slate-800 mb-2 line-clamp-2 cursor-pointer hover:text-primary-600"
                                            onClick={() => navigate(`/products/${product._id}`)}
                                        >
                                            {product.name}
                                        </h3>

                                        <div className="flex items-baseline gap-2 mb-3">
                                            <span className="text-xl font-bold text-primary-600">
                                                ₹{discountedPrice.toFixed(2)}
                                            </span>
                                            {product.discount > 0 && (
                                                <span className="text-sm text-slate-500 line-through">
                                                    ₹{product.price.toFixed(2)}
                                                </span>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            className="btn-primary w-full text-sm"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default WishlistPage

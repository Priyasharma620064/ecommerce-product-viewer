import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FiHeart } from 'react-icons/fi'
import { addToWishlist, removeFromWishlist, getWishlist } from '../../store/slices/wishlistSlice'
import { useEffect, useState } from 'react'

const ProductCard = ({ product }) => {
    const dispatch = useDispatch()
    const { items: wishlistItems } = useSelector((state) => state.wishlist)
    const { isAuthenticated } = useSelector((state) => state.auth)
    const [isInWishlist, setIsInWishlist] = useState(false)

    useEffect(() => {
        setIsInWishlist(wishlistItems.some(item => item._id === product._id))
    }, [wishlistItems, product._id])

    const discountedPrice = product.discount > 0
        ? product.price - (product.price * product.discount / 100)
        : product.price

    const handleWishlistToggle = (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (!isAuthenticated) {
            return
        }

        if (isInWishlist) {
            dispatch(removeFromWishlist(product._id))
        } else {
            dispatch(addToWishlist(product._id)).then(() => {
                dispatch(getWishlist())
            })
        }
    }

    return (
        <div className="card overflow-hidden group">
            {/* Product Image */}
            <div className="relative overflow-hidden bg-slate-100 aspect-square">
                <Link to={`/product/${product._id}`}>
                    <img
                        src={product.images?.[0] || '/placeholder.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                </Link>
                {product.discount > 0 && (
                    <span className="absolute top-3 left-3 badge-discount">
                        {product.discount}% OFF
                    </span>
                )}

                {/* Wishlist Heart Icon */}
                {isAuthenticated && (
                    <button
                        onClick={handleWishlistToggle}
                        className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform z-10"
                    >
                        <FiHeart
                            className={`text-xl ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-slate-600'}`}
                            style={{ fill: isInWishlist ? 'currentColor' : 'none' }}
                        />
                    </button>
                )}

                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">Out of Stock</span>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-4">
                <Link to={`/product/${product._id}`}>
                    <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2 h-12 hover:text-primary-600 transition-colors">
                        {product.name}
                    </h3>
                </Link>

                {/* Price */}
                <div className="flex items-center space-x-2 mb-3">
                    <span className="text-xl font-bold text-primary-600">
                        ₹{Math.round(discountedPrice)}
                    </span>
                    {product.discount > 0 && (
                        <span className="text-sm text-slate-400 line-through">
                            ₹{product.price}
                        </span>
                    )}
                </div>

                {/* View Button */}
                <Link
                    to={`/product/${product._id}`}
                    className="btn-primary w-full text-center block"
                >
                    View Details
                </Link>
            </div>
        </div>
    )
}

export default ProductCard

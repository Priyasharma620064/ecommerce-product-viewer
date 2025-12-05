import { Link } from 'react-router-dom'
import { FiStar } from 'react-icons/fi'

const ProductCard = ({ product }) => {
    const discountedPrice = product.discount > 0
        ? product.price - (product.price * product.discount / 100)
        : product.price

    return (
        <div className="card overflow-hidden group">
            {/* Product Image */}
            <div className="relative overflow-hidden bg-slate-100 aspect-square">
                <img
                    src={product.images?.[0] || '/placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {product.discount > 0 && (
                    <span className="absolute top-3 right-3 badge-discount">
                        {product.discount}% OFF
                    </span>
                )}
                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">Out of Stock</span>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-4">
                <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2 h-12">
                    {product.name}
                </h3>

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
                    View
                </Link>
            </div>
        </div>
    )
}

export default ProductCard

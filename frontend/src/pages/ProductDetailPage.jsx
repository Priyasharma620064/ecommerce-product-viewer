import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductById } from '../store/slices/productSlice'
import { addToCart } from '../store/slices/cartSlice'
import Loader from '../components/common/Loader'
import { FiStar, FiMinus, FiPlus, FiChevronRight } from 'react-icons/fi'

const ProductDetailPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { currentProduct: product, loading, error } = useSelector((state) => state.products)

    const [selectedImage, setSelectedImage] = useState(0)
    const [selectedSize, setSelectedSize] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [sizeError, setSizeError] = useState(false)

    useEffect(() => {
        dispatch(fetchProductById(id))
    }, [dispatch, id])

    useEffect(() => {
        if (product?.images?.length > 0) {
            setSelectedImage(0)
        }
    }, [product])

    const handleAddToCart = () => {
        if (product.category === 'Clothing' && !selectedSize) {
            setSizeError(true)
            return
        }

        // Validate stock
        if (quantity > product.stock) {
            alert(`Only ${product.stock} items available in stock!`)
            setQuantity(product.stock)
            return
        }

        dispatch(addToCart({ product, quantity, size: selectedSize }))
        alert('Product added to cart!')
    }

    const handleBuyNow = () => {
        if (product.category === 'Clothing' && !selectedSize) {
            setSizeError(true)
            return
        }

        // Validate stock
        if (quantity > product.stock) {
            alert(`Only ${product.stock} items available in stock!`)
            setQuantity(product.stock)
            return
        }

        dispatch(addToCart({ product, quantity, size: selectedSize }))
        navigate('/cart')
    }

    const handleSizeSelect = (size) => {
        setSelectedSize(size)
        setSizeError(false)
    }

    const discountedPrice = product?.discount > 0
        ? product.price - (product.price * product.discount / 100)
        : product?.price

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

    if (!product) return null

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-slate-600 mb-6">
                <Link to="/products" className="hover:text-primary-600">Home</Link>
                <FiChevronRight className="text-slate-400" />
                <Link to={`/products?category=${product.category}`} className="hover:text-primary-600">
                    {product.category}
                </Link>
                <FiChevronRight className="text-slate-400" />
                <span className="text-slate-800 font-medium">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Image Gallery */}
                <div>
                    {/* Main Image */}
                    <div className="bg-slate-100 rounded-xl overflow-hidden mb-4 aspect-square">
                        <img
                            src={product.images?.[selectedImage] || '/placeholder.jpg'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Thumbnail Strip */}
                    <div className="grid grid-cols-4 gap-4">
                        {product.images?.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={`bg-slate-100 rounded-lg overflow-hidden aspect-square border-2 transition-all ${selectedImage === index
                                    ? 'border-primary-600 scale-105'
                                    : 'border-transparent hover:border-slate-300'
                                    }`}
                            >
                                <img
                                    src={image}
                                    alt={`${product.name} ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Product Info */}
                <div>
                    {/* Category Tags */}
                    <div className="flex items-center space-x-2 mb-4">
                        <span className="badge bg-primary-100 text-primary-800">
                            {product.category}
                        </span>
                        {product.brand && (
                            <span className="badge bg-slate-100 text-slate-800">
                                {product.brand}
                            </span>
                        )}
                    </div>

                    {/* Product Name */}
                    <h1 className="text-3xl font-bold text-slate-800 mb-4">{product.name}</h1>

                    {/* Price */}
                    <div className="flex items-center space-x-4 mb-6">
                        <span className="text-4xl font-bold text-primary-600">
                            ₹{Math.round(discountedPrice)}
                        </span>
                        {product.discount > 0 && (
                            <>
                                <span className="text-xl text-slate-400 line-through">
                                    ₹{product.price}
                                </span>
                                <span className="badge-discount text-base">
                                    {product.discount}% OFF
                                </span>
                            </>
                        )}
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-slate-800 mb-2">Description</h3>
                        <p className="text-slate-600 leading-relaxed">{product.description}</p>
                    </div>

                    {/* Size Selection (for Clothing) */}
                    {product.category === 'Clothing' && (
                        <div className="mb-6">
                            <h3 className="font-semibold text-slate-800 mb-2">Select Size</h3>
                            <div className="flex items-center space-x-3">
                                {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => handleSizeSelect(size)}
                                        className={`px-6 py-2 border-2 rounded-lg font-medium transition-all ${selectedSize === size
                                            ? 'border-primary-600 bg-primary-50 text-primary-600'
                                            : 'border-slate-300 hover:border-slate-400'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                            {sizeError && (
                                <p className="text-red-600 text-sm mt-2">* Please select a size to proceed</p>
                            )}
                        </div>
                    )}

                    {/* Quantity */}
                    <div className="mb-8">
                        <h3 className="font-semibold text-slate-800 mb-2"></h3>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="p-2 border border-slate-300 rounded-lg hover:bg-slate-100"
                            >
                                <FiMinus />
                            </button>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value) || 1
                                    setQuantity(Math.max(1, Math.min(product.stock || val, val)))
                                }}
                                min="1"
                                max={product.stock}
                                className="w-20 text-center border border-slate-300 rounded-lg py-2"
                            />
                            <button
                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                disabled={quantity >= product.stock}
                                className="p-2 border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FiPlus />
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className="btn-primary flex-1 disabled:bg-slate-400 disabled:cursor-not-allowed"
                        >
                            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                        <button
                            onClick={handleBuyNow}
                            disabled={product.stock === 0}
                            className="bg-orange-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-orange-700 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg flex-1 disabled:bg-slate-400 disabled:cursor-not-allowed"
                        >
                            Buy Now
                        </button>
                    </div>

                    {/* Stock Info */}
                    {product.stock > 0 && product.stock < 10 && (
                        <p className="text-orange-600 text-sm mt-4">
                            Only {product.stock} left in stock - order soon!
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProductDetailPage

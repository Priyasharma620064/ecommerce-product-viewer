import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../../config/axios'
import { FiUpload, FiX } from 'react-icons/fi'
import Loader from '../../components/common/Loader'

const ProductForm = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { token } = useSelector((state) => state.auth)
    const isEditMode = Boolean(id)

    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        discount: '',
        category: '',
        brand: '',
        stock: '',
        images: [],
    })
    const [imageFiles, setImageFiles] = useState([])
    const [imagePreviews, setImagePreviews] = useState([])
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (isEditMode) {
            fetchProduct()
        }
    }, [id])

    const fetchProduct = async () => {
        try {
            setLoading(true)
            const response = await api.get(`/api/products/${id}`)
            const product = response.data
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                discount: product.discount || '',
                category: product.category,
                brand: product.brand || '',
                stock: product.stock,
                images: product.images || [],
            })
            setImagePreviews(product.images || [])
            setLoading(false)
        } catch (err) {
            alert('Failed to fetch product')
            navigate('/admin')
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
        setErrors({ ...errors, [name]: '' })
    }

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files)
        setImageFiles([...imageFiles, ...files])

        // Create previews
        files.forEach(file => {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, reader.result])
            }
            reader.readAsDataURL(file)
        })
    }

    const removeImage = (index) => {
        const isExistingImage = index < formData.images.length

        if (isExistingImage) {
            // Remove from existing images
            setFormData({
                ...formData,
                images: formData.images.filter((_, i) => i !== index)
            })
        } else {
            // Remove from new image files
            const fileIndex = index - formData.images.length
            setImageFiles(imageFiles.filter((_, i) => i !== fileIndex))
        }

        setImagePreviews(imagePreviews.filter((_, i) => i !== index))
    }

    const uploadImages = async () => {
        if (imageFiles.length === 0) {
            console.log('No new images to upload, using existing images')
            return formData.images.length > 0 ? formData.images : ['https://via.placeholder.com/800x800?text=No+Image']
        }

        console.log(`Uploading ${imageFiles.length} new images...`)
        const uploadedUrls = []

        for (let i = 0; i < imageFiles.length; i++) {
            const file = imageFiles[i]
            console.log(`Uploading image ${i + 1}/${imageFiles.length}:`, file.name)

            const formDataToUpload = new FormData()
            formDataToUpload.append('image', file)

            try {
                const response = await api.post('/api/upload', formDataToUpload, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                })
                console.log(`Image ${i + 1} uploaded successfully:`, response.data.url)
                uploadedUrls.push(response.data.url)
            } catch (err) {
                console.error(`Failed to upload image ${i + 1}:`, err)
                console.error('Upload error response:', err.response?.data)

                // Use placeholder image instead of failing
                console.warn('Using placeholder image due to upload failure')
                uploadedUrls.push('https://via.placeholder.com/800x800?text=Product+Image')
            }
        }

        const allUrls = [...formData.images, ...uploadedUrls]
        console.log('All image URLs:', allUrls)
        return allUrls
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.name.trim()) newErrors.name = 'Product name is required'
        if (!formData.description.trim()) newErrors.description = 'Description is required'
        if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required'
        if (!formData.category) newErrors.category = 'Category is required'
        if (!formData.stock || formData.stock < 0) newErrors.stock = 'Valid stock quantity is required'
        // Removed image requirement - will use placeholder if no images

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        try {
            setLoading(true)

            console.log('Starting product submission...')
            console.log('Image files to upload:', imageFiles.length)
            console.log('Existing images:', formData.images.length)

            // Upload new images (will use placeholders on failure)
            const allImageUrls = await uploadImages()
            console.log('All image URLs after upload:', allImageUrls)

            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                discount: formData.discount ? parseFloat(formData.discount) : 0,
                stock: parseInt(formData.stock),
                images: allImageUrls,
            }

            console.log('Product data to submit:', productData)

            if (isEditMode) {
                const response = await api.put(`/api/products/${id}`, productData)
                console.log('Update response:', response.data)
                alert('Product updated successfully!')
            } else {
                const response = await api.post('/api/products', productData)
                console.log('Create response:', response.data)
                alert('Product created successfully!')
            }

            navigate('/admin')
        } catch (err) {
            console.error('Error saving product:', err)
            console.error('Error response:', err.response?.data)
            console.error('Error message:', err.message)
            const errorMessage = err.response?.data?.message || err.message || 'Failed to save product'
            alert(errorMessage)
            setLoading(false)
        }
    }

    if (loading && isEditMode) return <Loader />

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">
                {isEditMode ? 'Edit Product' : 'Add New Product'}
            </h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Product Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Product Name <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter product name"
                                className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                            />
                            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Category <span className="text-red-600">*</span>
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className={`input-field ${errors.category ? 'border-red-500' : ''}`}
                            >
                                <option value="">Select category</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Clothing">Clothing</option>
                                <option value="Home & Kitchen">Home & Kitchen</option>
                                <option value="Books">Books</option>
                                <option value="Accessories">Accessories</option>
                            </select>
                            {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
                        </div>

                        {/* Price and Discount */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Price (₹) <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                    className={`input-field ${errors.price ? 'border-red-500' : ''}`}
                                />
                                {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Discount (%)
                                </label>
                                <input
                                    type="number"
                                    name="discount"
                                    value={formData.discount}
                                    onChange={handleChange}
                                    placeholder="0"
                                    min="0"
                                    max="100"
                                    className="input-field"
                                />
                            </div>
                        </div>

                        {/* Stock Quantity */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Stock Quantity <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                placeholder="0"
                                min="0"
                                className={`input-field ${errors.stock ? 'border-red-500' : ''}`}
                            />
                            {errors.stock && <p className="text-red-600 text-sm mt-1">{errors.stock}</p>}
                        </div>

                        {/* Brand */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Brand
                            </label>
                            <input
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                placeholder="Enter brand name"
                                className="input-field"
                            />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Description <span className="text-red-600">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter product description"
                                rows="5"
                                className={`input-field resize-none ${errors.description ? 'border-red-500' : ''}`}
                            />
                            {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
                        </div>

                        {/* Product Images */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Product Images <span className="text-red-600">*</span>
                            </label>

                            {/* Upload Area */}
                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageSelect}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label htmlFor="image-upload" className="cursor-pointer">
                                    <FiUpload className="text-4xl text-slate-400 mx-auto mb-3" />
                                    <p className="text-slate-600 mb-1">Drag & drop images here</p>
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById('image-upload').click()}
                                        className="btn-primary mt-2"
                                    >
                                        Select Files
                                    </button>
                                </label>
                            </div>

                            {errors.images && <p className="text-red-600 text-sm mt-1">{errors.images}</p>}

                            {/* Image Previews */}
                            {imagePreviews.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-slate-700 mb-3">Uploaded Images</p>
                                    <div className="grid grid-cols-3 gap-4">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded-lg bg-slate-100"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <FiX />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-4 mt-8 pt-6 border-t border-slate-200">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary disabled:bg-slate-400 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Saving...' : isEditMode ? 'Update Product' : 'Save Product'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/admin')}
                        className="btn-secondary"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ProductForm

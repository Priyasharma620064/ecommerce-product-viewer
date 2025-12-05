import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: 0,
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Accessories'],
    },
    brand: {
        type: String,
        trim: true,
    },
    images: [{
        type: String,
        required: true,
    }],
    stock: {
        type: Number,
        required: [true, 'Stock quantity is required'],
        min: 0,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function () {
    if (this.discount > 0) {
        return this.price - (this.price * this.discount / 100)
    }
    return this.price
})

// Ensure virtuals are included in JSON
productSchema.set('toJSON', { virtuals: true })
productSchema.set('toObject', { virtuals: true })

const Product = mongoose.model('Product', productSchema)

export default Product

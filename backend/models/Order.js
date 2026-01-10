import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    orderItems: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        price: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
    }],
    shippingAddress: {
        fullName: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        pincode: {
            type: String,
            required: true,
        },
    },
    paymentInfo: {
        paymentId: {
            type: String,
            required: true,
        },
        paymentMethod: {
            type: String,
            default: 'Card',
        },
        status: {
            type: String,
            enum: ['Pending', 'Completed', 'Failed'],
            default: 'Pending',
        },
    },
    itemsPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending',
    },
    deliveredAt: Date,
}, {
    timestamps: true,
})

const Order = mongoose.model('Order', orderSchema)

export default Order

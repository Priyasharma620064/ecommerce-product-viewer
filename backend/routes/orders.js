import express from 'express'
import Order from '../models/Order.js'
import { auth, isAdmin } from '../middleware/auth.js'

const router = express.Router()

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentInfo,
            itemsPrice,
            shippingPrice,
            totalPrice,
        } = req.body

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' })
        }

        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentInfo,
            itemsPrice,
            shippingPrice,
            totalPrice,
        })

        const createdOrder = await order.save()
        res.status(201).json(createdOrder)
    } catch (error) {
        console.error('Create order error:', error)
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

// @route   GET /api/orders/myorders
// @desc    Get logged in user orders
// @access  Private
router.get('/myorders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate('orderItems.product', 'name images')

        res.json(orders)
    } catch (error) {
        console.error('Get user orders error:', error)
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('orderItems.product', 'name images')

        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }

        // Check if user owns this order or is admin
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view this order' })
        }

        res.json(order)
    } catch (error) {
        console.error('Get order error:', error)
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/:id/status', auth, isAdmin, async (req, res) => {
    try {
        const { orderStatus } = req.body

        const order = await Order.findById(req.params.id)

        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }

        order.orderStatus = orderStatus

        if (orderStatus === 'Delivered') {
            order.deliveredAt = Date.now()
        }

        const updatedOrder = await order.save()
        res.json(updatedOrder)
    } catch (error) {
        console.error('Update order status error:', error)
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

// @route   GET /api/orders
// @desc    Get all orders (admin)
// @access  Private/Admin
router.get('/', auth, isAdmin, async (req, res) => {
    try {
        const orders = await Order.find({})
            .sort({ createdAt: -1 })
            .populate('user', 'name email')
            .populate('orderItems.product', 'name images')

        res.json(orders)
    } catch (error) {
        console.error('Get all orders error:', error)
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

export default router

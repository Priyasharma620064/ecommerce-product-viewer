import express from 'express'
import User from '../models/User.js'
import Product from '../models/Product.js'
import { auth } from '../middleware/auth.js'
import bcrypt from 'bcryptjs'

const router = express.Router()

// @route   GET /api/profile
// @desc    Get user profile
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password')
        res.json(user)
    } catch (error) {
        console.error('Get profile error:', error)
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

// @route   PUT /api/profile
// @desc    Update user profile
// @access  Private
router.put('/', auth, async (req, res) => {
    try {
        const { name, email, phone, address } = req.body

        const user = await User.findById(req.user._id)

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        // Check if email is being changed and if it's already taken
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email })
            if (emailExists) {
                return res.status(400).json({ message: 'Email already in use' })
            }
            user.email = email
        }

        if (name) user.name = name
        if (phone) user.phone = phone
        if (address) user.address = address

        await user.save()

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
        })
    } catch (error) {
        console.error('Update profile error:', error)
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

// @route   PUT /api/profile/password
// @desc    Change password
// @access  Private
router.put('/password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Please provide current and new password' })
        }

        const user = await User.findById(req.user._id)

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword)
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' })
        }

        // Update password
        user.password = newPassword
        await user.save()

        res.json({ message: 'Password changed successfully' })
    } catch (error) {
        console.error('Change password error:', error)
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

// @route   GET /api/profile/wishlist
// @desc    Get user wishlist
// @access  Private
router.get('/wishlist', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('wishlist')
        res.json(user.wishlist || [])
    } catch (error) {
        console.error('Get wishlist error:', error)
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

// @route   POST /api/profile/wishlist/:productId
// @desc    Add product to wishlist
// @access  Private
router.post('/wishlist/:productId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        const product = await Product.findById(req.params.productId)

        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        // Check if already in wishlist
        if (user.wishlist.includes(req.params.productId)) {
            return res.status(400).json({ message: 'Product already in wishlist' })
        }

        user.wishlist.push(req.params.productId)
        await user.save()

        res.json({ message: 'Product added to wishlist', wishlist: user.wishlist })
    } catch (error) {
        console.error('Add to wishlist error:', error)
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

// @route   DELETE /api/profile/wishlist/:productId
// @desc    Remove product from wishlist
// @access  Private
router.delete('/wishlist/:productId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)

        user.wishlist = user.wishlist.filter(
            (item) => item.toString() !== req.params.productId
        )

        await user.save()

        res.json({ message: 'Product removed from wishlist', wishlist: user.wishlist })
    } catch (error) {
        console.error('Remove from wishlist error:', error)
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

export default router

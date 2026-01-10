import express from 'express'
import crypto from 'crypto'
import { auth } from '../middleware/auth.js'

const router = express.Router()

// @route   POST /api/payment/process
// @desc    Process mock payment
// @access  Private
router.post('/process', auth, async (req, res) => {
    try {
        const { amount, cardNumber, cardName, expiryDate, cvv } = req.body

        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Generate mock payment ID
        const paymentId = 'pay_' + crypto.randomBytes(12).toString('hex')

        // Simulate random success/failure (90% success rate)
        const isSuccess = Math.random() > 0.1

        if (isSuccess) {
            res.json({
                success: true,
                paymentId,
                message: 'Payment processed successfully',
            })
        } else {
            res.status(400).json({
                success: false,
                message: 'Payment failed. Please try again.',
            })
        }
    } catch (error) {
        console.error('Payment processing error:', error)
        res.status(500).json({
            success: false,
            message: 'Payment processing failed',
            error: error.message,
        })
    }
})

export default router

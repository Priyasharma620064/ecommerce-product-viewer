import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

// Import routes
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import uploadRoutes from './routes/upload.js'
import orderRoutes from './routes/orders.js'
import paymentRoutes from './routes/payment.js'
import profileRoutes from './routes/profile.js'

// Load environment variables
dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce')
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => console.error('MongoDB connection error:', err))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/profile', profileRoutes)

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' })
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ message: 'Something went wrong!', error: err.message })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

import express from 'express'
import Product from '../models/Product.js'
import { auth, isAdmin } from '../middleware/auth.js'

const router = express.Router()

// @route   GET /api/products
// @desc    Get all products with filters
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, minPrice, maxPrice, minDiscount, search, sort } = req.query

        console.log('Filter request:', { category, minPrice, maxPrice, minDiscount, search, sort })

        // Build aggregation pipeline to filter and sort by discounted price
        const pipeline = []

        // Step 1: First match on fields that exist (category, discount, search)
        const initialMatchFilter = {}

        if (category) {
            const categories = category.split(',')
            if (categories.length === 1) {
                initialMatchFilter.category = categories[0]
            } else {
                initialMatchFilter.category = { $in: categories }
            }
        }

        if (minDiscount) {
            const discounts = minDiscount.split(',').map(d => parseFloat(d))
            if (discounts.length === 1) {
                initialMatchFilter.discount = { $gte: discounts[0] }
            } else if (discounts.length > 1) {
                const minDiscountValue = Math.min(...discounts)
                initialMatchFilter.discount = { $gte: minDiscountValue }
            }
        }

        if (search) {
            initialMatchFilter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ]
        }

        // Apply initial match if we have filters
        if (Object.keys(initialMatchFilter).length > 0) {
            pipeline.push({ $match: initialMatchFilter })
        }

        // Step 2: Add discounted price as a calculated field
        pipeline.push({
            $addFields: {
                discountedPrice: {
                    $subtract: [
                        '$price',
                        { $multiply: ['$price', { $divide: ['$discount', 100] }] }
                    ]
                }
            }
        })

        // Step 3: Now filter by DISCOUNTED price range
        if (minPrice || maxPrice) {
            const priceMatchFilter = {}
            if (minPrice) priceMatchFilter.discountedPrice = { $gte: parseFloat(minPrice) }
            if (maxPrice) {
                if (priceMatchFilter.discountedPrice) {
                    priceMatchFilter.discountedPrice.$lte = parseFloat(maxPrice)
                } else {
                    priceMatchFilter.discountedPrice = { $lte: parseFloat(maxPrice) }
                }
            }
            pipeline.push({ $match: priceMatchFilter })
        }

        // Step 4: Sort
        let sortOption = {}
        if (sort === 'price-low') {
            sortOption = { discountedPrice: 1 }
        } else if (sort === 'price-high') {
            sortOption = { discountedPrice: -1 }
        } else {
            sortOption = { createdAt: -1 }
        }
        pipeline.push({ $sort: sortOption })

        console.log('Aggregation pipeline:', JSON.stringify(pipeline, null, 2))

        const products = await Product.aggregate(pipeline)
        console.log(`Found ${products.length} products`)

        res.json(products)
    } catch (error) {
        console.error('Products filter error:', error)
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        res.json(product)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

// @route   POST /api/products
// @desc    Create new product
// @access  Private/Admin
router.post('/', auth, isAdmin, async (req, res) => {
    try {
        const { name, description, price, discount, category, brand, images, stock } = req.body

        const product = new Product({
            name,
            description,
            price,
            discount,
            category,
            brand,
            images,
            stock,
        })

        await product.save()
        res.status(201).json({ message: 'Product created successfully', product })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private/Admin
router.put('/:id', auth, isAdmin, async (req, res) => {
    try {
        const { name, description, price, discount, category, brand, images, stock } = req.body

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { name, description, price, discount, category, brand, images, stock },
            { new: true, runValidators: true }
        )

        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        res.json({ message: 'Product updated successfully', product })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private/Admin
router.delete('/:id', auth, isAdmin, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id)

        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        res.json({ message: 'Product deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

export default router

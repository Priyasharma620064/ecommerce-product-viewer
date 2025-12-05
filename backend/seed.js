import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from './models/User.js'
import Product from './models/Product.js'

dotenv.config()

// Sample products data
const sampleProducts = [
    {
        name: 'Wireless Bluetooth Headphones',
        description: 'Premium quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
        price: 2999,
        discount: 20,
        category: 'Electronics',
        brand: 'AudioTech',
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
    },
    {
        name: 'Cotton T-Shirt - Premium Quality',
        description: 'Comfortable cotton t-shirt with breathable fabric. Perfect for casual wear and everyday use.',
        price: 499,
        discount: 30,
        category: 'Clothing',
        brand: 'FashionHub',
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'],
        stock: 100,
    },
    {
        name: 'Stainless Steel Cookware Set',
        description: '10-piece stainless steel cookware set with non-stick coating. Includes pots, pans, and lids.',
        price: 4999,
        discount: 15,
        category: 'Home & Kitchen',
        brand: 'KitchenPro',
        images: ['https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800'],
        stock: 25,
    },
    {
        name: 'The Complete Guide to Web Development',
        description: 'Comprehensive guide covering HTML, CSS, JavaScript, React, and Node.js. Perfect for beginners and intermediate developers.',
        price: 899,
        discount: 0,
        category: 'Books',
        brand: 'TechBooks',
        images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800'],
        stock: 75,
    },
    {
        name: 'Smart Watch - Fitness Tracker',
        description: 'Advanced fitness tracker with heart rate monitor, sleep tracking, and 7-day battery life.',
        price: 3499,
        discount: 25,
        category: 'Electronics',
        brand: 'FitTech',
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
        stock: 40,
    },
    {
        name: 'Denim Jeans - Slim Fit',
        description: 'Classic slim-fit denim jeans with comfortable stretch fabric. Available in multiple sizes.',
        price: 1299,
        discount: 20,
        category: 'Clothing',
        brand: 'DenimCo',
        images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800'],
        stock: 60,
    },
]

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Connected to MongoDB')

        // Clear existing data
        await Product.deleteMany({})
        console.log('Cleared existing products')

        // Insert sample products
        await Product.insertMany(sampleProducts)
        console.log('Sample products added')

        // Create admin user if doesn't exist
        const adminExists = await User.findOne({ email: 'admin@shophub.com' })
        if (!adminExists) {
            const admin = new User({
                name: 'Admin User',
                email: 'admin@shophub.com',
                password: 'admin123',
                role: 'admin',
            })
            await admin.save()
            console.log('Admin user created')
            console.log('   Email: admin@shophub.com')
            console.log('   Password: admin123')
        } else {
            console.log('Admin user already exists')
        }

        console.log('Database seeded successfully!')
        process.exit(0)
    } catch (error) {
        console.error('Error seeding database:', error)
        process.exit(1)
    }
}

seedDatabase()

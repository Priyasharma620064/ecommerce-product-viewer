import express from 'express'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { auth, isAdmin } from '../middleware/auth.js'

const router = express.Router()

// Configure Multer for memory storage
const storage = multer.memoryStorage()
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true)
        } else {
            cb(new Error('Only image files are allowed'), false)
        }
    },
})

// @route   POST /api/upload
// @desc    Upload image to Cloudinary
// @access  Private/Admin
router.post('/', auth, isAdmin, upload.single('image'), async (req, res) => {
    try {
        console.log('Upload request received')

        if (!req.file) {
            console.log('No file in request')
            return res.status(400).json({ message: 'No file uploaded' })
        }

        console.log('File details:', {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        })

        // Configure Cloudinary here to ensure env vars are loaded
        const cloudinaryConfig = {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        }

        console.log('Cloudinary config:', {
            cloud_name: cloudinaryConfig.cloud_name,
            api_key: cloudinaryConfig.api_key ? '***configured***' : 'MISSING',
            api_secret: cloudinaryConfig.api_secret ? '***configured***' : 'MISSING'
        })

        console.log('Actual API Key (first 5 chars):', cloudinaryConfig.api_key?.substring(0, 5))

        // Configure cloudinary with the config
        cloudinary.config(cloudinaryConfig)

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'ecommerce-products',
                    transformation: [
                        { width: 800, height: 800, crop: 'limit' },
                        { quality: 'auto' },
                    ],
                },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error)
                        reject(error)
                    } else {
                        console.log('Cloudinary upload success:', result.secure_url)
                        resolve(result)
                    }
                }
            )

            uploadStream.end(req.file.buffer)
        })

        res.json({
            message: 'Image uploaded successfully',
            url: result.secure_url,
            publicId: result.public_id,
        })
    } catch (error) {
        console.error('Upload route error:', error.message)
        console.error('Full error:', error)
        res.status(500).json({ message: 'Upload failed', error: error.message })
    }
})

export default router

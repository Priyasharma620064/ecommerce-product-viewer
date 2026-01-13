# ShopHub - E-Commerce Platform

A full-stack e-commerce web application built with the MERN stack. This project was developed as part of my learning journey to understand modern web development and create a production-ready application.

## 🔗 Live Demo

**[View Live Demo](https://ecommerce-product-viewer-eta.vercel.app)** 

## What I Built

This is a complete e-commerce platform where users can browse products, add them to cart, place orders, and track their purchases. Admins can manage products and orders through a dedicated dashboard.

### Main Features

**For Customers:**
- Browse and search products with filters
- Add products to cart and wishlist
- Complete checkout with payment
- Track order status
- Manage profile and shipping address

**For Admins:**
- Add, edit, and delete products
- View and manage all orders
- Update order status
- Track inventory

## Tech Stack

- **Frontend:** React, Redux Toolkit, React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Image Storage:** Cloudinary
- **Authentication:** JWT

## Getting Started

### Prerequisites

You'll need Node.js, MongoDB, and a Cloudinary account.

### Installation

1. Clone the repository
```bash
git clone https://github.com/Priyasharma620064/ecommerce-product-viewer.git
cd ecommerce-product-viewer
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Set up environment variables

Create `.env` in the backend folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create `.env` in the frontend folder:
```env
VITE_API_URL=http://localhost:5000
```

5. Run the application

Start backend (from backend folder):
```bash
npm run dev
```

Start frontend (from frontend folder):
```bash
npm run dev
```

The app will be running at `http://localhost:3000`

## Project Structure

```
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   └── server.js        # Express server
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── store/       # Redux store and slices
│   │   └── App.jsx      # Main app component
│   └── package.json
│
└── README.md
```

## Key Features I Implemented

### 1. User Authentication
- Secure login and signup with JWT
- Password hashing with bcrypt
- Protected routes based on user roles

### 2. Product Management
- CRUD operations for products
- Image upload to Cloudinary
- Advanced filtering (category, price, discount)
- Search functionality

### 3. Shopping Cart
- Add/remove products
- Update quantities
- Persistent cart using localStorage
- Real-time price calculations

### 4. Order System
- Complete checkout flow
- Mock payment gateway
- Order tracking with status updates
- Order history for users

### 5. Admin Dashboard
- Product inventory management
- Order management with status updates
- Statistics and analytics

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/myorders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Profile & Wishlist
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `GET /api/profile/wishlist` - Get wishlist
- `POST /api/profile/wishlist/:productId` - Add to wishlist
- `DELETE /api/profile/wishlist/:productId` - Remove from wishlist

## What I Learned

Building this project helped me understand:
- How to structure a full-stack application
- State management with Redux
- RESTful API design
- Authentication and authorization
- File uploads and cloud storage
- Responsive design principles
- Database modeling with MongoDB

## Challenges I Faced

1. **State Management:** Managing cart state across page refreshes was tricky. Solved it by persisting cart data in localStorage.

2. **Image Uploads:** Initially struggled with handling multiple image uploads. Implemented Cloudinary which made it much easier.

3. **Order Flow:** Creating a seamless checkout to order confirmation flow required careful state management and route protection.

## Future Improvements

- Add product reviews and ratings
- Implement email notifications for orders
- Add real payment gateway integration (Stripe/Razorpay)
- Create a recommendation system
- Add order cancellation feature
- Implement coupon codes



## Contact

Feel free to reach out if you have any questions or suggestions!

- **GitHub:** [@Priyasharma620064](https://github.com/Priyasharma620064)
- **LinkedIn:** [Priya Sharma](https://www.linkedin.com/in/priya-sharma-336489334/)

---

**Note:** This project uses a mock payment gateway for demonstration purposes. For production use, integrate a real payment service like Stripe or Razorpay.

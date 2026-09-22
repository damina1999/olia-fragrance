# Olia Fragrance - Comprehensive Project Documentation

**Document Version:** 1.0  
**Date:** June 2, 2026  
**Project Type:** Full-Stack E-Commerce Platform  
**Status:** Deployed (Production Ready)

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Frontend Structure](#frontend-structure)
7. [Core Features](#core-features)
8. [User Roles & Permissions](#user-roles--permissions)
9. [Installation & Setup](#installation--setup)
10. [Deployment Information](#deployment-information)
11. [Environment Variables](#environment-variables)
12. [Key Business Logic](#key-business-logic)

---

## Project Overview

**Olia Fragrance** is a modern e-commerce platform specializing in fragrance sales (perfumes). The platform serves as a complete solution for offline fragrance retail business moving to digital commerce.

### Purpose
- Facilitate online fragrance browsing and purchasing
- Provide administrative tools for inventory and order management
- Enable customer reviews and ratings for products
- Support promotional events and marketing campaigns
- Manage user authentication with email verification and OTP

### Key Markets
- Tunisia (domain: olia-fragrance.tn)
- International (via Vercel deployment)

### Business Domain
- **Product Category:** Fragrances (Homme, Femme, Unisex, Enfant)
- **Order Management:** Multi-step order fulfillment (Pending → Confirmed → Processing → Shipped → Delivered)
- **Payment Methods:** Cash on Delivery, Card, PayPal
- **Revenue Streams:** Product sales, promotional events

---

## Technology Stack

### Backend
- **Runtime:** Node.js (v22.0.0+)
- **Framework:** Express.js 4.18.2
- **Database:** MongoDB 7.4.0 (MongoDB Atlas Cloud)
- **Authentication:** JWT (JSON Web Tokens) with 7-day expiry
- **Password Hashing:** bcryptjs 2.4.3
- **File Upload:** Multer 1.4.5 + Cloudinary integration
- **Email:** Nodemailer 8.0.7 (SMTP)
- **SMS OTP:** Twilio integration (optional)
- **Environment:** dotenv 16.0.3

### Frontend
- **Framework:** React 18.2.0 with React Router DOM 6.16.0
- **Build Tool:** Vite 4.4.9
- **Styling:** Tailwind CSS 3.3.3
- **HTTP Client:** Axios 1.5.0
- **UI Feedback:** React Hot Toast 2.4.1
- **Icons:** React Icons 4.11.0
- **Charts:** Recharts 2.8.0 (Admin Dashboard)
- **Analytics:** Vercel Speed Insights 2.0.0

### Development Tools
- **Backend Dev Server:** Nodemon 3.0.1
- **Code Quality:** Express Validator 7.0.1
- **Frontend CSS:** PostCSS 8.4.30, Autoprefixer 10.4.16

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React + Vite)                │
│                   http://localhost:5173                     │
└─────────────────────────────────────────────────────────────┘
                              ↓
                         (Axios HTTP)
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   Backend (Express.js)                       │
│                   http://localhost:5000                     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  CORS Middleware (Whitelisted Domains)               │  │
│  │  - olia-fragrance.vercel.app                         │  │
│  │  - olia-fragrance.tn                                 │  │
│  │  - localhost:5173, 3000                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                              ↓                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  API Routes (Protected & Public)                     │  │
│  │  - /api/auth (Authentication)                        │  │
│  │  - /api/products (Browse Catalog)                    │  │
│  │  - /api/orders (Order Management)                    │  │
│  │  - /api/reviews (Product Reviews)                    │  │
│  │  - /api/events (Promotions)                          │  │
│  │  - /api/admin (Admin Operations)                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                              ↓                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Controllers & Business Logic                        │  │
│  │  (Product, Order, User, Review, Event Management)    │  │
│  └──────────────────────────────────────────────────────┘  │
│                              ↓                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Middleware (Auth, File Upload)                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                              ↓                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  MongoDB Data Layer                                  │  │
│  │  (User, Product, Order, Review, Event Collections)  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
            ┌─────────────────┴──────────────────┐
            ↓                                    ↓
    ┌──────────────────┐           ┌──────────────────────┐
    │   Cloudinary     │           │   External Services  │
    │  (Image Storage) │           │ - Twilio (SMS OTP)   │
    └──────────────────┘           │ - Nodemailer (Email) │
                                    │ - Firebase (OAuth)   │
                                    └──────────────────────┘
```

### Request Flow Example (User Login)
```
1. User submits credentials via Login form (Frontend)
2. Axios sends POST request to /api/auth/login
3. Express receives request, validates input via express-validator
4. Controller queries User collection in MongoDB
5. bcryptjs compares hashed password
6. JWT token generated and returned to frontend
7. Token stored in browser context (AuthContext)
8. Token added to Authorization header for protected routes
```

---

## Database Schema

### Collections Overview

#### 1. **User Collection**
```javascript
{
  _id: ObjectId,
  name: String (required, trimmed),
  email: String (required, unique, lowercase),
  password: String (hashed with bcryptjs, required),
  avatar: String (Cloudinary URL, default: ''),
  role: Enum ['client', 'admin'] (default: 'client'),
  isVerified: Boolean (email verification status, default: false),
  emailOtp: String (OTP for email verification),
  emailOtpExpire: Date (OTP expiration time),
  resetOtp: String (OTP for password reset),
  resetOtpExpire: Date (OTP expiration time),
  wishlist: [ObjectId] (Array of Product references),
  phone: String (default: ''),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Indexes:**
- `email` (unique)
- Primary key: `_id`

---

#### 2. **Product Collection**
```javascript
{
  _id: ObjectId,
  name: String (required, trimmed),
  description: String (required),
  category: Enum ['homme', 'femme', 'unisex', 'enfant'] (required),
  brand: String (required),
  
  // Legacy single-variant support (backward compatibility)
  price: Number (default: 0),
  oldPrice: Number (original price for discount display),
  volume: String (e.g., "30ml", "50ml", "100ml"),
  stock: Number (default: 0),
  
  // Modern multi-variant system
  variants: [
    {
      volume: String (required),
      price: Number (required, min: 0),
      oldPrice: Number (optional),
      stock: Number (default: 0, min: 0)
    }
  ],
  
  images: [String] (Array of Cloudinary URLs),
  isActive: Boolean (default: true, soft-delete support),
  isFeatured: Boolean (displayed on homepage, default: false),
  likes: [ObjectId] (User IDs who liked the product),
  dislikes: [ObjectId] (User IDs who disliked the product),
  avgRating: Number (calculated from reviews, default: 0),
  reviewCount: Number (total reviews count, default: 0),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Methods:**
- `updateRating()`: Aggregates review data and updates avgRating & reviewCount

**Indexes:**
- `category`, `brand`, `isFeatured`

---

#### 3. **Order Collection**
```javascript
{
  _id: ObjectId,
  user: ObjectId (reference to User, required),
  items: [
    {
      product: ObjectId (reference to Product),
      name: String (product name snapshot),
      image: String (product image URL snapshot),
      price: Number (price at order time),
      volume: String (selected volume),
      quantity: Number (required, min: 1)
    }
  ],
  shippingAddress: {
    fullName: String,
    address: String,
    city: String,
    postalCode: String,
    country: String,
    phone: String
  },
  paymentMethod: Enum ['cash', 'card', 'paypal'] (default: 'cash'),
  paymentStatus: Enum ['pending', 'paid', 'failed'] (default: 'pending'),
  status: Enum [
    'pending',      // Initial state
    'confirmed',    // Admin confirmed order
    'processing',   // Being prepared
    'shipped',      // In transit
    'delivered',    // Received by customer
    'cancelled'     // Cancelled by admin/customer
  ] (default: 'pending'),
  totalPrice: Number (required),
  shippingPrice: Number (default: 0),
  notes: String (admin notes),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Model Notes:**
- Order items store snapshots of product data at purchase time (denormalization for data integrity)
- Reference maintains link to actual Product for inventory tracking

---

#### 4. **Review Collection**
```javascript
{
  _id: ObjectId,
  product: ObjectId (reference to Product, required),
  user: ObjectId (reference to User, required),
  rating: Number (required, min: 1, max: 5),
  comment: String (required, trimmed),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Constraints:**
- Unique index on (product, user) - one review per user per product
- Auto-triggers `Product.updateRating()` on save/delete

---

#### 5. **Event Collection**
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (default: ''),
  image: String (Cloudinary URL, default: ''),
  link: String (promotional link, default: ''),
  isActive: Boolean (default: true),
  order: Number (display order, default: 0),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Use Cases:**
- Seasonal sales announcements
- Flash deals
- Brand partnerships
- Holiday promotions

---

### Data Relationships

```
User
├── wishlist → [Product]
├── orders → [Order]
└── reviews → [Review]

Product
├── variants → [Variant]
├── images → [String] (Cloudinary)
├── likes/dislikes → [User]
└── reviews → [Review]

Order
├── user → User
└── items → [OrderItem with Product reference]

Review
├── product → Product
└── user → User

Event
└── (Independent - used for display)
```

---

## API Endpoints

### Authentication Routes (`/api/auth`)

```
POST /api/auth/register
├── Input: { name, email, password }
├── Validation: Email format, password length ≥ 6
├── Returns: User object with JWT token
└── Response: { user, token }

POST /api/auth/login
├── Input: { email, password }
├── Returns: Authenticated user with JWT
└── Response: { user, token }

POST /api/auth/verify-email
├── Input: { email, otp }
├── Action: Sets isVerified = true
└── Response: { message, user }

POST /api/auth/resend-otp
├── Input: { email }
├── Action: Generates new OTP
└── Response: { message }

POST /api/auth/forgot-password
├── Input: { email }
├── Action: Sends OTP via Nodemailer
└── Response: { message }

POST /api/auth/reset-password
├── Input: { email, otp, newPassword }
├── Action: Updates password if OTP valid
└── Response: { message }

GET /api/auth/me
├── Auth: Required (JWT)
├── Returns: Current logged-in user
└── Response: { user }

PUT /api/auth/me
├── Auth: Required (JWT)
├── Input: { name, email, avatar, phone }
├── Action: Updates user profile
└── Response: { user }

GET /api/auth/profile
├── Auth: Required (JWT)
├── Action: Fetches detailed user profile
└── Response: { user }

PUT /api/auth/profile
├── Auth: Required (JWT)
├── Input: { phone, address, city, country }
├── Action: Updates user shipping info
└── Response: { user }
```

---

### Products Routes (`/api/products`)

```
GET /api/products
├── Query Params: ?category=homme&sort=price&page=1&limit=20
├── Public: Yes
├── Returns: Paginated products
└── Response: { products, total, pages }

GET /api/products/:id
├── Auth: Optional
├── Returns: Detailed product with reviews
└── Response: { product, reviews }

POST /api/products/:id/like
├── Auth: Required (JWT)
├── Input: { userId: from token }
├── Action: Adds user to likes array
└── Response: { liked: boolean, likes: count }

POST /api/products/:id/dislike
├── Auth: Required (JWT)
├── Input: { userId: from token }
├── Action: Adds user to dislikes array
└── Response: { disliked: boolean, dislikes: count }
```

---

### Orders Routes (`/api/orders`)

```
POST /api/orders
├── Auth: Required (JWT)
├── Input: {
│     items: [{ productId, quantity, volume }],
│     shippingAddress: { fullName, address, city, postalCode, country, phone },
│     paymentMethod: 'cash'|'card'|'paypal'
│   }
├── Validation: Stock checking, address completion
├── Action: Creates order with status 'pending'
└── Response: { order }

GET /api/orders/my
├── Auth: Required (JWT)
├── Query: ?status=pending&sort=-createdAt&limit=10
├── Returns: User's orders
└── Response: { orders }

GET /api/orders/:id
├── Auth: Required (JWT)
├── Returns: Specific order (verify ownership)
└── Response: { order }
```

---

### Reviews Routes (`/api/reviews`)

```
POST /api/reviews
├── Auth: Required (JWT)
├── Input: { productId, rating: 1-5, comment }
├── Validation: User has purchased product (future improvement)
├── Action: Creates/updates review, updates product rating
└── Response: { review }

GET /api/reviews?productId=:id
├── Public: Yes
├── Returns: All reviews for product
└── Response: { reviews, avgRating, reviewCount }

DELETE /api/reviews/:id
├── Auth: Required (JWT)
├── Action: Removes review, recalculates product rating
└── Response: { message }
```

---

### Events Routes (`/api/events`)

```
GET /api/events
├── Public: Yes
├── Returns: Active promotional events
└── Response: { events }

GET /api/events/:id
├── Public: Yes
├── Returns: Event details
└── Response: { event }
```

---

### Admin Routes (`/api/admin`) - Protected (Admin Role Only)

```
GET /api/admin/stats
├── Auth: Required (Admin)
├── Returns: Dashboard statistics
└── Response: {
     totalRevenue,
     totalOrders,
     totalUsers,
     totalProducts,
     pendingOrders,
     recentOrders,
     topProducts
   }

PRODUCT MANAGEMENT
─────────────────
GET /api/admin/products
├── Returns: All products (including inactive)
└── Response: { products }

POST /api/admin/products
├── Input: FormData with images and product data
├── Upload: Max 5 images to Cloudinary
├── Returns: Created product
└── Response: { product }

PUT /api/admin/products/:id
├── Input: Updated product data
├── Action: Updates product including variants
└── Response: { product }

DELETE /api/admin/products/:id
├── soft-delete (isActive = false)
└── Response: { message }

ORDER MANAGEMENT
────────────────
GET /api/admin/orders
├── Returns: All orders with status filter
└── Response: { orders }

PUT /api/admin/orders/:id/status
├── Input: { status: 'confirmed'|'processing'|'shipped'|'delivered'|'cancelled' }
├── Action: Updates order status, may trigger email notification
└── Response: { order }

USER MANAGEMENT
───────────────
GET /api/admin/users
├── Returns: All users with stats
└── Response: { users }

PUT /api/admin/users/:id/role
├── Input: { role: 'admin'|'client' }
├── Action: Promotes/demotes user role
└── Response: { user }

REVIEW MANAGEMENT
─────────────────
GET /api/admin/reviews
├── Returns: All reviews with moderation status
└── Response: { reviews }

DELETE /api/admin/reviews/:id
├── Action: Removes inappropriate review
└── Response: { message }

EVENT MANAGEMENT
────────────────
GET /api/admin/events
├── Returns: All events
└── Response: { events }

POST /api/admin/events
├── Input: Event data with image
├── Upload: Max 1 image
└── Response: { event }

PUT /api/admin/events/:id
├── Action: Updates event
└── Response: { event }

DELETE /api/admin/events/:id
├── Action: Deletes event
└── Response: { message }
```

---

## Frontend Structure

### Page Components

#### Public Pages
- **Home Page** - Landing page with featured products, events, hero section
- **Products Listing** - Browsable catalog with filters (category, brand, price)
- **Product Detail** - Full product view with variants, reviews, recommendations
- **Login** - User authentication form with email/password
- **Register** - New user signup with validation

#### Protected Pages (User Logged In)
- **Cart** - Shopping cart management, quantity adjustments
- **Checkout** - Order confirmation, shipping/payment details
- **Dashboard** - User personalized dashboard
- **My Orders** - Order history with status tracking
- **Profile** - User profile editing, wishlist management

#### Admin Pages (Admin Role Only)
- **Admin Dashboard** - Analytics, revenue, order statistics
- **Admin Products** - Product inventory management (CRUD)
- **Admin Orders** - Order fulfillment workflow management
- **Admin Reviews** - Review moderation interface
- **Admin Users** - User role management
- **Admin Events** - Promotional events management

### Global Components
- **Navbar** - Navigation, search, cart icon, user menu
- **Footer** - Links, contact info, social media
- **ProductCard** - Reusable product display component
- **StarRating** - Review rating display/input

### Context Providers
1. **AuthContext** - Global authentication state
   - `user` - Current logged-in user
   - `loading` - Auth check in progress
   - `login()` - Authenticate user
   - `logout()` - Clear session
   - `register()` - Create new account

2. **CartContext** - Shopping cart state
   - `cart` - Array of cart items
   - `addToCart()` - Add product to cart
   - `removeFromCart()` - Remove item
   - `updateQuantity()` - Change quantity
   - `clearCart()` - Empty cart

### API Integration
- **axios.js** - Configured HTTP client
  - Base URL: `http://localhost:5000/api` (development)
  - Interceptors for JWT token attachment
  - Error handling & response transformation

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Custom index.css** - Global styles, theme variables
- **Gold color theme** - Brand colors (perfume luxury aesthetic)

---

## Core Features

### 1. **Product Catalog**
- Browse by category (Homme, Femme, Unisex, Enfant)
- Search functionality
- Filter by brand, price range
- Multiple product variants (different volumes/prices)
- Product images (multiple photos per product)
- Detailed descriptions
- Rating system (1-5 stars)
- Like/Dislike functionality (user engagement)
- Featured products on homepage

### 2. **Shopping & Orders**
- Add items to cart
- Adjust quantities & variants
- Calculate totals (with shipping)
- Checkout workflow
- Shipping address collection
- Payment method selection (Cash, Card, PayPal)
- Order confirmation email
- Order status tracking (6 states)

### 3. **User Accounts**
- Registration with email verification
- JWT-based authentication (7-day tokens)
- Password reset via OTP email
- User profile management
- Wishlist functionality
- Order history viewing
- Shipping address management

### 4. **Reviews & Ratings**
- 5-star rating system
- Text reviews with comments
- One review per user per product
- Auto-calculated product ratings
- Moderation by admin

### 5. **Admin Dashboard**
- Real-time analytics
- Revenue tracking
- Order management workflow
- Product inventory management
- User role administration
- Review moderation
- Promotional events management
- Stock levels monitoring

### 6. **Promotional System**
- Discounted prices (oldPrice vs current price)
- Promotional events/banners
- Featured products display
- Flash sale management
- Event scheduling

### 7. **Email & Notifications**
- Account verification emails
- Order confirmation emails
- Password reset OTP
- Order status updates
- SMS OTP (optional via Twilio)

---

## User Roles & Permissions

### 1. **Client (Regular User)**
**Permissions:**
- ✅ Browse products
- ✅ View product details & reviews
- ✅ Register & login
- ✅ Create shopping cart
- ✅ Place orders
- ✅ View own orders
- ✅ Write product reviews
- ✅ Like/dislike products
- ✅ Manage wishlist
- ✅ Update profile
- ✅ View order history

**Restrictions:**
- ❌ Cannot access admin dashboard
- ❌ Cannot modify products
- ❌ Cannot manage other users
- ❌ Cannot access financial reports

---

### 2. **Admin**
**Permissions:**
- ✅ All client permissions
- ✅ View dashboard with analytics
- ✅ Create/Edit/Delete products
- ✅ Upload product images
- ✅ Manage product inventory
- ✅ View all orders
- ✅ Update order status
- ✅ Manage promotional events
- ✅ Moderate reviews
- ✅ View all users
- ✅ Assign/revoke admin role
- ✅ Access financial reports

**Middleware Protection:**
```
All admin routes require:
1. Valid JWT token
2. User role === 'admin'
3. Middleware: protect + adminOnly
```

---

## Installation & Setup

### Prerequisites
- Node.js 18+ (tested with v22.0.0)
- npm 10.5+
- MongoDB connection (MongoDB Atlas or local)
- Git

### Quick Start

#### 1. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

#### 2. Configure Environment Variables

**Backend (.env)**
```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/parfumshop
JWT_SECRET=your_very_secret_key_here
JWT_EXPIRE=7d

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional: Twilio (SMS OTP)
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE=+1234567890

# Optional: Firebase (Social Auth)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_key
FIREBASE_CLIENT_EMAIL=your_email

# Frontend URL
CLIENT_URL=http://localhost:5173
```

#### 3. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

#### 4. Seed Database (Optional - Initial Data)
```bash
cd backend
npm run seed
```

### Using Install Script (Windows)
```bash
# From project root
.\install.bat
```

---

## Deployment Information

### Production URLs
- **Frontend:** https://olia-fragrance.vercel.app
- **Domain:** https://www.olia-fragrance.tn
- **API Endpoint:** https://olia-fragrance.onrender.com (or similar backend hosting)

### Deployment Stack
- **Frontend Hosting:** Vercel (Next.js/React optimized)
- **Backend Hosting:** Render / Railway / Heroku (Node.js)
- **Database:** MongoDB Atlas (cloud)
- **CDN/Storage:** Cloudinary (images)
- **Email:** Nodemailer (SMTP service)

### CORS Whitelist
```javascript
Allowed Origins:
- https://olia-fragrance.vercel.app
- https://www.olia-fragrance.tn
- https://olia-fragrance.tn
- http://localhost:5173 (dev)
- http://localhost:3000 (dev)
```

### Build & Deployment Commands

**Frontend:**
```bash
npm run build    # Creates optimized build
npm run preview  # Test production build locally
# Deploy to Vercel via git push to connected repo
```

**Backend:**
```bash
npm start        # Runs node server.js
# Deploy to hosting platform (git push or CLI)
```

---

## Environment Variables

### Backend Variables

| Variable | Purpose | Example | Required |
|----------|---------|---------|----------|
| `PORT` | Server port | `5000` | ✅ |
| `MONGO_URI` | Database connection | `mongodb+srv://...` | ✅ |
| `JWT_SECRET` | Token signing key | `secret123!@#` | ✅ |
| `JWT_EXPIRE` | Token expiration | `7d` | ✅ |
| `CLOUDINARY_CLOUD_NAME` | Image storage | `xyz123` | ✅ |
| `CLOUDINARY_API_KEY` | Image upload key | `key123` | ✅ |
| `CLOUDINARY_API_SECRET` | Image upload secret | `secret456` | ✅ |
| `CLIENT_URL` | Frontend URL | `http://localhost:5173` | ❌ |
| `TWILIO_ACCOUNT_SID` | SMS provider | `AC123...` | ❌ |
| `TWILIO_AUTH_TOKEN` | SMS auth | `token123` | ❌ |
| `TWILIO_PHONE` | SMS sender number | `+1234567890` | ❌ |
| `FIREBASE_PROJECT_ID` | OAuth provider | `project-id` | ❌ |

### Frontend Variables
- Frontend uses `.env.local` for API endpoints
- Build-time variables only (accessible via `import.meta.env`)
- No sensitive data stored in frontend

---

## Key Business Logic

### 1. **Authentication Flow**
```
User Registration:
1. User submits name, email, password
2. express-validator checks email format & password strength
3. bcryptjs hashes password (salt rounds: 12)
4. User created in MongoDB
5. Verification OTP sent to email
6. User must verify email before full access

User Login:
1. Credentials validated via express-validator
2. User queried from DB by email
3. bcryptjs compares entered password with hash
4. JWT token generated (algorithm: HS256, expires: 7 days)
5. Token returned to frontend & stored in context
6. Token attached to future API requests in Authorization header
```

### 2. **Product Rating System**
```
Review Created:
1. User submits rating (1-5) and comment
2. Review indexed uniquely on (product, user)
3. Post-save hook triggers Product.updateRating()
4. Aggregation calculates average rating
5. reviewCount incremented
6. Product avgRating updated

Effects:
- Highest-rated products bubble up in search
- Review count builds social proof
- Users can make informed decisions
```

### 3. **Order Workflow**
```
Status Progression:
pending → confirmed → processing → shipped → delivered
              ↓
        (Optional) cancelled

States:
- pending: Order received, awaiting admin confirmation
- confirmed: Admin approves order, payment verified
- processing: Items picked/packed for shipment
- shipped: Handed to courier, tracking available
- delivered: Customer received package
- cancelled: Order cancelled (refund initiated)

Stock Management:
- Stock checked at checkout
- Stock decremented when order placed
- Stock restored if order cancelled
```

### 4. **File Upload Process**
```
Product Creation with Images:
1. Admin submits form with file input (max 5 images)
2. Multer middleware intercepts files
3. Express-validator checks:
   - File type (must be image)
   - File size (max 10MB)
4. Cloudinary transforms images:
   - Resize to standard dimensions
   - Optimize for web
   - Generate CDN URL
5. Cloudinary URLs stored in Product.images array
6. Original files never stored on server
```

### 5. **Permission Check Pattern**
```javascript
// Middleware chain for protected admin routes
app.put('/api/admin/products/:id',
  protect,              // Verify JWT token & attach user
  adminOnly,            // Check user.role === 'admin'
  uploadMiddleware,     // Handle file uploads
  ctrl.updateProduct    // Business logic
);

// Inside controller:
if (req.user.role !== 'admin') {
  return res.status(403).json({ message: 'Forbidden' });
}
```

### 6. **Cart to Order Conversion**
```
Checkout Flow:
1. User clicks checkout with cart items
2. Frontend validates shipping address
3. POST /api/orders with cart data
4. Backend fetches current product prices
5. Validates stock availability
6. Creates Order with status: pending
7. Clears redux/context cart
8. Sends confirmation email with order details
9. Redirects to order tracking page
```

---

## Scalability Considerations

### Current Limitations
- Single backend instance (horizontal scaling needed)
- Monolithic backend structure
- No caching layer (Redis would improve performance)
- Synchronous file uploads (should be async tasks)

### Recommendations for Growth
1. **Database:** Add indexes on frequently queried fields
2. **Caching:** Implement Redis for product catalog & sessions
3. **Load Balancing:** Use Nginx/HAProxy for multiple backend instances
4. **Async Tasks:** Implement Bull queue for emails, image processing
5. **Microservices:** Separate payments, inventory, notifications into services
6. **CDN:** Cloudfront or Fastly for faster image delivery

---

## Performance Optimization

### Frontend
- ✅ Vite for fast HMR during development
- ✅ Code splitting via React.lazy (route-based)
- ✅ Axios request caching in AuthContext
- 🔄 TODO: Add service worker for offline support
- 🔄 TODO: Implement virtual scrolling for product lists

### Backend
- ✅ JWT stateless authentication (no DB lookup per request)
- ✅ Cloudinary for image CDN delivery
- 🔄 TODO: Add response caching headers
- 🔄 TODO: Implement pagination on all list endpoints
- 🔄 TODO: Add database query optimization with projections

---

## Security Measures

### Implemented
- ✅ JWT token-based authentication
- ✅ Password hashing with bcryptjs
- ✅ CORS policy restricting origins
- ✅ Email verification for new accounts
- ✅ OTP-based password reset
- ✅ Admin role-based access control
- ✅ Input validation via express-validator
- ✅ Error messages don't leak sensitive info

### Recommended Enhancements
- 🔒 Add rate limiting on login attempts
- 🔒 Enable HTTPS only (production configured)
- 🔒 Implement CSRF protection for state-changing operations
- 🔒 Add helmet.js for HTTP security headers
- 🔒 Sanitize user input to prevent NoSQL injection
- 🔒 Add audit logging for admin actions

---

## Testing Recommendations

### Unit Tests
- Utility functions (generateToken, mailer)
- Model methods (Product.updateRating)
- Middleware functions (protect, adminOnly)

### Integration Tests
- Auth flow: register → verify → login
- Product CRUD: create → read → update → delete
- Order workflow: create → update status → completion
- Review system: create → moderation → delete

### E2E Tests
- Complete user journey: register → browse → purchase → track
- Admin workflow: login → manage inventory → fulfill orders
- Payment mock: test with dummy payment provider

---

## Known Issues & Future Improvements

### Current Issues
- Email templates are plain text (should use HTML templates)
- No order cancellation by customers
- No partial refunds support
- Wishlist stored in User doc (consider separate collection)

### Feature Roadmap
1. **Phase 1:** Multi-language support (FR, AR, EN)
2. **Phase 2:** Advanced search (Elasticsearch)
3. **Phase 3:** Recommendation engine (ML-based)
4. **Phase 4:** Mobile app (React Native)
5. **Phase 5:** Loyalty program (points system)
6. **Phase 6:** Live chat support
7. **Phase 7:** Wishlist sharing
8. **Phase 8:** Subscription boxes

---

## Support & Maintenance

### Key Contacts
- **Project Owner:** [To be specified]
- **Backend Maintainer:** [To be specified]
- **Frontend Maintainer:** [To be specified]

### Regular Maintenance Tasks
- Monitor MongoDB database growth
- Review Cloudinary storage usage
- Check server logs for errors
- Update dependencies monthly
- Review security advisories
- Backup database regularly
- Monitor performance metrics

### Common Troubleshooting
| Issue | Solution |
|-------|----------|
| MongoDB connection fails | Check MONGO_URI format, network access, credentials |
| Images not uploading | Verify Cloudinary credentials, check file size limits |
| Email not sending | Check SMTP settings, verify sender email authentication |
| JWT token expired | Frontend interceptor should refresh automatically |
| Admin routes showing 403 | Verify admin role in user document |

---

## Conclusion

Olia Fragrance is a production-ready e-commerce platform with:
- ✅ Modern tech stack (React + Node + MongoDB)
- ✅ Scalable architecture
- ✅ Role-based access control
- ✅ User-friendly interface
- ✅ Admin management tools
- ✅ Secure authentication
- ✅ Cloud-based infrastructure

The platform supports the business from day-1 operations through scaling and accommodates future feature additions.

---

**Document Maintained By:** [Team Name]  
**Last Updated:** June 2, 2026  
**Next Review Date:** September 2, 2026

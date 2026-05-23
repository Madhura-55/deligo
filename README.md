<p align="center">
  <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop" alt="Deligo Logo" width="120" height="120" style="border-radius: 20px"/>
</p>

<h1 align="center">🛒 Deligo - Modern E-Commerce Platform</h1>

<p align="center">
  <strong>A full-stack, AI-powered e-commerce platform built with Next.js 15, MongoDB, XGBoost ML, and TypeScript</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-api-reference">API Reference</a> •
  <a href="#-deployment">Deployment</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.5.2-black?style=for-the-badge&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/MongoDB-8-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS"/>
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Schema](#-database-schema)
- [API Reference](#-api-reference)
- [Architecture](#-architecture)
- [User Roles](#-user-roles)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Deligo** is a comprehensive, multi-vendor e-commerce platform designed to connect customers, sellers, and delivery partners in a seamless shopping experience. Built with modern web technologies, it provides a robust foundation for online retail operations with features like real-time order tracking, secure payments, and intelligent delivery management.

### 🎯 Key Highlights

- **Multi-Vendor Marketplace**: Support for multiple sellers with individual storefronts
- **AI Demand Prediction**: XGBoost ML model forecasts per-product demand with stock shortage alerts
- **Real-Time Tracking**: Live order and delivery tracking with OTP verification
- **Secure Payments**: Integrated Razorpay payment gateway with webhook support
- **Role-Based Access**: Five distinct user roles with granular permissions
- **Mobile-First Design**: Fully responsive design optimized for all devices
- **Analytics Dashboard**: Comprehensive insights for admins and sellers with AI-powered forecasting
- **Rate Limiting**: Built-in protection against abuse with Upstash Redis

---

## ✨ Features

### 🛍️ Customer Features
| Feature | Description |
|---------|-------------|
| **Product Browsing** | Browse products with advanced filtering, sorting, and search |
| **Shopping Cart** | Add, update, remove items with real-time stock validation |
| **Secure Checkout** | Multi-step checkout with address management |
| **Payment Integration** | Razorpay integration supporting UPI, cards, and net banking |
| **Order Tracking** | Real-time order status with delivery OTP verification |
| **Reviews & Ratings** | Leave reviews after verified purchases |
| **Address Management** | Save multiple delivery addresses |
| **Order History** | View complete order history with details |

### 👨‍💼 Seller Features
| Feature | Description |
|---------|-------------|
| **Seller Dashboard** | Comprehensive analytics with revenue, orders, and views |
| **Product Management** | Full CRUD operations with image upload via Cloudinary |
| **Inventory Control** | Stock management with low-stock alerts |
| **AI Demand Forecasting** | XGBoost ML-powered 14-day demand predictions per product with interactive charts |
| **AI Inventory Alerts** | Automatic stock shortage warnings when predicted demand exceeds current inventory |
| **Order Management** | View and update order statuses |
| **Storefront Customization** | Logo, banner, and bio customization |
| **Sales Analytics** | Daily, weekly, monthly, and yearly reports with trend visualization |
| **PDF Invoices** | Generate downloadable invoices |
| **CSV/Excel Export** | Export sales data for external analysis |
| **KYC Management** | Submit business documents for verification |

### 🚚 Delivery Partner Features
| Feature | Description |
|---------|-------------|
| **Driver Dashboard** | View pending, active, and completed deliveries |
| **Assignment Management** | Accept or reject delivery assignments |
| **Route Optimization** | View pickup and delivery locations |
| **OTP Verification** | Verify delivery with customer OTP |
| **Earnings Tracking** | Track daily, weekly, and total earnings |
| **Profile Management** | Update availability and vehicle information |
| **Delivery History** | Complete history of all deliveries |

### 🛡️ Admin Features
| Feature | Description |
|---------|-------------|
| **Admin Dashboard** | Platform-wide statistics and quick actions |
| **User Management** | View, activate, deactivate, and delete users |
| **Seller Approval** | Review and approve/reject seller applications |
| **Delivery Partner Approval** | Verify and approve delivery partners |
| **Category Management** | Create and manage product categories |
| **Order Monitoring** | View all platform orders and handle disputes |
| **Hero Section Editor** | Manage homepage hero content |
| **Statistics & Analytics** | Revenue charts, user distribution, order analytics |
| **Role Simulator** | Test different user roles without logging out |
| **Audit Logs** | Track all administrative actions |

### 🔐 Authentication & Security
| Feature | Description |
|---------|-------------|
| **Email/Password Auth** | Traditional authentication with bcrypt hashing |
| **Social Login** | Google and Facebook OAuth integration |
| **Email Verification** | Token-based email verification system |
| **JWT Sessions** | Secure session management with NextAuth.js |
| **Rate Limiting** | Upstash Redis-based rate limiting |
| **Role-Based Access Control** | Middleware-enforced RBAC |
| **Protected Routes** | Server and client-side route protection |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.5.2 | React framework with App Router |
| **React** | 19.1.0 | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.x | Utility-first CSS |
| **GSAP** | 3.13.0 | Smooth animations |
| **Recharts** | 3.2.1 | Data visualization |
| **Lucide React** | 0.543.0 | Icon library |
| **React Hot Toast** | 2.6.0 | Toast notifications |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js API Routes** | 15.5.2 | Backend API endpoints |
| **MongoDB** | 6.20.0 | NoSQL database |
| **Mongoose** | 8.18.0 | MongoDB ODM |
| **NextAuth.js** | 4.24.11 | Authentication |
| **Razorpay** | 2.9.6 | Payment gateway |
| **Nodemailer** | 6.10.1 | Email service |
| **Cloudinary** | 2.8.0 | Image management |

### AI/ML Microservices
| Technology | Version | Purpose |
|------------|---------|---------|
| **FastAPI** | 0.100+ | ML prediction API server |
| **XGBoost** | 2.0+ | Per-product demand regression model |
| **Meta Prophet** | Latest | Global seasonality baseline model |
| **Pandas** | 2.0+ | Data pipeline & feature engineering |
| **scikit-learn** | Latest | Model evaluation metrics |

### DevOps & Utilities
| Technology | Version | Purpose |
|------------|---------|---------|
| **Upstash Redis** | 1.35.3 | Rate limiting & caching |
| **Zod** | 4.1.5 | Schema validation |
| **jsPDF** | 3.0.3 | PDF generation |
| **XLSX** | 0.18.5 | Excel file handling |
| **PapaParse** | 5.5.3 | CSV parsing |
| **Vercel Analytics** | 1.5.0 | Web analytics |

---

## 📁 Project Structure

```
deligo/
├── 📂 public/                    # Static assets
│   └── site.webmanifest         # PWA manifest
│
├── 📂 src/
│   ├── 📂 app/                   # Next.js App Router
│   │   ├── 📂 (customer)/        # Customer-facing pages
│   │   │   ├── page.tsx          # Homepage
│   │   │   ├── layout.tsx        # Customer layout
│   │   │   ├── 📂 cart/          # Shopping cart
│   │   │   ├── 📂 checkout/      # Checkout flow
│   │   │   ├── 📂 products/      # Product listing & details
│   │   │   ├── 📂 search/        # Search results
│   │   │   ├── 📂 delivery/      # Delivery tracking
│   │   │   └── 📂 sellerapplication/ # Become a seller
│   │   │
│   │   ├── 📂 admin/             # Admin dashboard
│   │   │   ├── page.tsx          # Dashboard overview
│   │   │   ├── layout.tsx        # Admin layout
│   │   │   ├── 📂 users/         # User management
│   │   │   ├── 📂 sellers/       # Seller approval
│   │   │   ├── 📂 delivery/      # Delivery partner management
│   │   │   ├── 📂 categories/    # Category management
│   │   │   ├── 📂 orders/        # Order monitoring
│   │   │   ├── 📂 statistics/    # Analytics
│   │   │   ├── 📂 hero/          # Hero section editor
│   │   │   └── 📂 settings/      # Admin settings
│   │   │
│   │   ├── 📂 seller/            # Seller dashboard
│   │   │   ├── page.tsx          # Seller overview
│   │   │   ├── layout.tsx        # Seller layout
│   │   │   ├── 📂 products/      # Product management
│   │   │   ├── 📂 orders/        # Order management
│   │   │   ├── 📂 inventory/     # Stock management
│   │   │   ├── 📂 analytics/     # Sales analytics
│   │   │   ├── 📂 reviews/       # Customer reviews
│   │   │   └── 📂 settings/      # Store settings
│   │   │
│   │   ├── 📂 driver/            # Delivery partner dashboard
│   │   │   ├── page.tsx          # Driver overview
│   │   │   ├── layout.tsx        # Driver layout
│   │   │   ├── 📂 assignments/   # Delivery assignments
│   │   │   ├── 📂 available/     # Available deliveries
│   │   │   ├── 📂 delivery/      # Active deliveries
│   │   │   ├── 📂 earnings/      # Earnings tracking
│   │   │   └── 📂 profile/       # Driver profile
│   │   │
│   │   ├── 📂 auth/              # Authentication pages
│   │   │   ├── signin/           # Sign in page
│   │   │   ├── signup/           # Sign up page
│   │   │   ├── verify-email/     # Email verification
│   │   │   └── complete-profile/ # Profile completion
│   │   │
│   │   ├── 📂 api/               # API routes
│   │   │   ├── 📂 admin/         # Admin APIs
│   │   │   ├── 📂 auth/          # Auth APIs
│   │   │   ├── 📂 cart/          # Cart APIs
│   │   │   ├── 📂 category/      # Category APIs
│   │   │   ├── 📂 checkout/      # Checkout APIs
│   │   │   ├── 📂 delivery/      # Delivery APIs
│   │   │   ├── 📂 notifications/ # Notification APIs
│   │   │   ├── 📂 orders/        # Order APIs
│   │   │   ├── 📂 payment/       # Payment APIs
│   │   │   ├── 📂 products/      # Product APIs
│   │   │   ├── 📂 reviews/       # Review APIs
│   │   │   ├── 📂 search/        # Search APIs
│   │   │   ├── 📂 seller/        # Seller APIs
│   │   │   └── 📂 user/          # User APIs
│   │   │
│   │   ├── globals.css           # Global styles
│   │   └── layout.tsx            # Root layout
│   │
│   ├── 📂 components/            # React components
│   │   ├── 📂 admin/             # Admin components
│   │   │   ├── AdminSidebar.tsx  # Navigation sidebar
│   │   │   ├── AdminHeader.tsx   # Header with user info
│   │   │   ├── StatsCard.tsx     # Statistics cards
│   │   │   ├── UserTable.tsx     # User management table
│   │   │   ├── SellerTable.tsx   # Seller table
│   │   │   ├── DeliveryTable.tsx # Delivery partner table
│   │   │   └── HeroForm.tsx      # Hero section form
│   │   │
│   │   ├── 📂 ui/                # UI components
│   │   │   ├── Navbar.tsx        # Main navigation
│   │   │   └── ProductCard.tsx   # Product display card
│   │   │
│   │   ├── ErrorBoundary.tsx     # Error handling
│   │   ├── Providers.tsx         # Context providers
│   │   ├── Search.tsx            # Search component
│   │   ├── SignIn.tsx            # Sign in form
│   │   ├── Signup.tsx            # Sign up form
│   │   ├── Footer.tsx            # Site footer
│   │   └── ProductReviews.tsx    # Reviews component
│   │
│   ├── 📂 models/                # MongoDB models (23 models)
│   │   ├── User.models.ts        # User accounts
│   │   ├── UserProfiles.models.ts # Customer profiles
│   │   ├── SellerProfiles.models.ts # Seller profiles
│   │   ├── DeliveryProfiles.models.ts # Driver profiles
│   │   ├── Products.models.ts    # Product catalog
│   │   ├── Category.models.ts    # Categories
│   │   ├── Cart.models.ts        # Shopping carts
│   │   ├── Orders.models.ts      # Orders
│   │   ├── Payments.models.ts    # Payment records
│   │   ├── Shipments.models.ts   # Delivery tracking
│   │   ├── Reviews.models.ts     # Product reviews
│   │   ├── Notifications.models.ts # User notifications
│   │   ├── Coupons.models.ts     # Discount coupons
│   │   ├── InventoryLogs.models.ts # Stock changes
│   │   ├── AuditLogs.models.ts   # Admin actions
│   │   └── ...                   # And more
│   │
│   ├── 📂 lib/                   # Utility libraries
│   │   ├── db.ts                 # Database connection
│   │   ├── Session.ts            # Session management
│   │   ├── mailer.ts             # Email service
│   │   ├── cloudinary.ts         # Image uploads
│   │   ├── analytics.ts          # Analytics functions
│   │   ├── pdf-generator.ts      # PDF creation
│   │   ├── csv-excel-utils.ts    # Data export
│   │   ├── delivery-utils.ts     # Delivery helpers
│   │   └── emailToken.ts         # Token generation
│   │
│   ├── 📂 schema/                # Zod validation schemas
│   │   ├── signInSchema.ts       # Login validation
│   │   ├── signUpSchema.ts       # Registration validation
│   │   ├── profileSchema.ts      # Profile validation
│   │   ├── sellerApplicationSchema.ts # Seller KYC
│   │   └── deliveryApplicationSchema.ts # Driver KYC
│   │
│   ├── 📂 types/                 # TypeScript definitions
│   │   ├── next-auth.d.ts        # NextAuth types
│   │   └── mongoose.d.ts         # Mongoose types
│   │
│   ├── middleware.ts             # Route middleware
│   └── type.d.ts                 # Global types
│
├── 📂 demand-server/             # AI Demand Prediction Microservice
│   ├── main.py                   # FastAPI server (port 8004)
│   ├── train.py                  # XGBoost + Prophet training pipeline
│   ├── data_pipeline.py          # MongoDB → daily demand DataFrame
│   ├── feature_engineering.py    # Lag, rolling, calendar features
│   ├── requirements.txt          # Python dependencies
│   ├── models/                   # Trained model artifacts
│   └── README.md                 # Detailed ML documentation
│
├── 📂 recommendation-server/     # Product recommendation engine
├── 📂 search-server/             # Meilisearch integration
│
├── 📂 notes/                     # Documentation
│   ├── ADMIN_DASHBOARD_README.md
│   ├── COMPLETE_FEATURES_SUMMARY.md
│   ├── api.md
│   └── ...
│
├── start-dev.sh                  # Unified dev server launcher
├── next.config.ts                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS config
├── tsconfig.json                 # TypeScript config
├── package.json                  # Dependencies
└── README.md                     # This file
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **npm** 9.x or **yarn** 1.22.x or **pnpm** 8.x
- **MongoDB** 6.x (local or MongoDB Atlas)
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/deligo.git
   cd deligo
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration (see [Environment Variables](#-environment-variables))

4. **Create an admin user**
   ```bash
   npm run create-admin
   ```
   Follow the prompts to set admin email and password.

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start **all servers** (Next.js + Recommendation + Search + Demand Forecast) |
| `npm run dev:next` | Start only the Next.js frontend (port 3000) |
| `npm run dev:demand` | Start only the AI Demand Prediction server (port 8004) |
| `npm run dev:recommendation` | Start only the Recommendation server (port 8000) |
| `npm run dev:search` | Start only the Search server (port 8002) |
| `npm run setup:all` | Set up Python virtual environments for all microservices |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run create-admin` | Create admin user interactively |

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# ===========================================
# DATABASE
# ===========================================
MONGODB_URI=mongodb://localhost:27017/deligo
# For MongoDB Atlas: mongodb+srv://<username>:<password>@cluster.mongodb.net/deligo

# ===========================================
# AUTHENTICATION (NextAuth.js)
# ===========================================
NEXTAUTH_SECRET=your-super-secret-key-min-32-characters
NEXTAUTH_URL=http://localhost:3000

# ===========================================
# OAUTH PROVIDERS
# ===========================================
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret

# ===========================================
# EMAIL SERVICE
# ===========================================
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# ===========================================
# CLOUDINARY (Image Uploads)
# ===========================================
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# ===========================================
# RAZORPAY (Payments)
# ===========================================
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id

# ===========================================
# UPSTASH REDIS (Rate Limiting)
# ===========================================
UPSTASH_REDIS_REST_URL=your-upstash-redis-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-token

# ===========================================
# APPLICATION
# ===========================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Environment Variable Details

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `NEXTAUTH_SECRET` | ✅ | Random string for JWT encryption (min 32 chars) |
| `NEXTAUTH_URL` | ✅ | Your application URL |
| `GOOGLE_CLIENT_ID` | ❌ | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | ❌ | Google OAuth client secret |
| `EMAIL_USER` | ✅ | SMTP email address |
| `EMAIL_PASS` | ✅ | SMTP password or app-specific password |
| `RAZORPAY_KEY_ID` | ✅ | Razorpay API key ID |
| `RAZORPAY_KEY_SECRET` | ✅ | Razorpay API secret |
| `UPSTASH_REDIS_REST_URL` | ✅ | Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | ✅ | Upstash Redis REST token |

---

## 📊 Database Schema

Deligo uses MongoDB with Mongoose ODM. Below is an overview of the main collections:

### Entity Relationship Diagram

```
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│      USERS       │       │   USER_PROFILES  │       │ SELLER_PROFILES  │
├──────────────────┤       ├──────────────────┤       ├──────────────────┤
│ _id              │──┐    │ _id              │       │ _id              │
│ email            │  │    │ userId      FK   │───────│ userId      FK   │
│ passwordHash     │  │    │ fullName         │       │ businessName     │
│ role             │  │    │ phone            │       │ gstNumber        │
│ isVerified       │  └────│ addresses[]      │       │ bankDetails{}    │
│ hasProfile       │       │ preferences{}    │       │ kycStatus        │
│ createdAt        │       └──────────────────┘       │ rating           │
│ updatedAt        │                                  │ storefront{}     │
└──────────────────┘                                  └──────────────────┘
         │
         │
         ▼
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│ DELIVERY_PROFILES│       │     PRODUCTS     │       │   CATEGORIES     │
├──────────────────┤       ├──────────────────┤       ├──────────────────┤
│ _id              │       │ _id              │       │ _id              │
│ userId      FK   │       │ sellerId    FK   │───────│ name             │
│ vehicleType      │       │ categoryId  FK   │───────│ description      │
│ licenseNumber    │       │ name             │       │ parentId    FK   │
│ region           │       │ price            │       │ slug             │
│ isOnline         │       │ stock            │       │ image            │
│ earnings{}       │       │ images[]         │       │ status           │
│ kycStatus        │       │ variants[]       │       └──────────────────┘
│ lastLocation{}   │       │ status           │
└──────────────────┘       └──────────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         │                          │                          │
         ▼                          ▼                          ▼
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│      CARTS       │       │      ORDERS      │       │     REVIEWS      │
├──────────────────┤       ├──────────────────┤       ├──────────────────┤
│ _id              │       │ _id              │       │ _id              │
│ userId      FK   │       │ userId      FK   │       │ userId      FK   │
│ items[]          │       │ sellerId    FK   │       │ productId   FK   │
│   productId FK   │       │ items[]          │       │ rating           │
│   quantity       │       │ paymentId   FK   │       │ comment          │
│ updatedAt        │       │ shipmentId  FK   │       │ images[]         │
└──────────────────┘       │ status           │       │ sellerReply{}    │
                           │ totalAmount      │       │ reported         │
                           │ shippingAddress{}│       └──────────────────┘
                           └──────────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         │                          │                          │
         ▼                          ▼                          ▼
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│    PAYMENTS      │       │    SHIPMENTS     │       │  NOTIFICATIONS   │
├──────────────────┤       ├──────────────────┤       ├──────────────────┤
│ _id              │       │ _id              │       │ _id              │
│ userId      FK   │       │ orderId     FK   │       │ userId      FK   │
│ orderId     FK   │       │ deliveryPersonId │       │ message          │
│ paymentMethod    │       │ trackingNumber   │       │ type             │
│ transactionId    │       │ status           │       │ isRead           │
│ razorpayOrderId  │       │ otpCode          │       │ createdAt        │
│ status           │       │ currentLocation{}│       └──────────────────┘
│ amount           │       │ events[]         │
└──────────────────┘       │ proof{}          │
                           └──────────────────┘
```

### Collections Overview

| Collection | Description | Key Fields |
|------------|-------------|------------|
| `users` | User accounts | email, role, isVerified |
| `userprofiles` | Customer profiles | fullName, phone, addresses |
| `sellerprofiles` | Seller business info | businessName, kycStatus, bankDetails |
| `deliveryprofiles` | Driver profiles | vehicleType, region, earnings |
| `products` | Product catalog | name, price, stock, sellerId |
| `categories` | Product categories | name, slug, parentId |
| `carts` | Shopping carts | userId, items[] |
| `orders` | Customer orders | items, status, totalAmount |
| `payments` | Payment records | transactionId, status |
| `shipments` | Delivery tracking | trackingNumber, otpCode, status |
| `reviews` | Product reviews | rating, comment |
| `notifications` | User notifications | message, type, isRead |
| `coupons` | Discount codes | code, discountValue, validTo |
| `inventorylogs` | Stock changes | productId, change, reason |
| `auditlogs` | Admin actions | action, adminId, timestamp |

---

## 📡 API Reference

### Authentication APIs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Register new user | Public |
| `POST` | `/api/auth/login` | User login | Public |
| `POST` | `/api/auth/refresh-token` | Refresh JWT | Auth |
| `GET` | `/api/users/me` | Get current user | Auth |
| `PUT` | `/api/users/me` | Update profile | Auth |

### Product APIs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/products/public` | List all products | Public |
| `GET` | `/api/products/:id` | Get product details | Public |
| `GET` | `/api/search` | Search products | Public |
| `POST` | `/api/seller/products` | Create product | Seller |
| `PUT` | `/api/seller/products/:id` | Update product | Seller |
| `DELETE` | `/api/seller/products/:id` | Delete product | Seller |

### Cart APIs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/cart` | Get user cart | Customer |
| `POST` | `/api/cart` | Add to cart | Customer |
| `PATCH` | `/api/cart` | Update quantity | Customer |
| `DELETE` | `/api/cart` | Remove/clear cart | Customer |

### Order APIs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/orders` | Get user orders | Customer |
| `POST` | `/api/orders` | Create order | Customer |
| `GET` | `/api/orders/:id` | Get order details | Customer |
| `PATCH` | `/api/orders/:id` | Update/cancel order | Customer |

### Payment APIs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/payment/create-order` | Create Razorpay order | Customer |
| `POST` | `/api/payment/verify` | Verify payment | Customer |
| `POST` | `/api/payment/webhook` | Razorpay webhook | Razorpay |

### Admin APIs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/admin/users` | List all users | Admin |
| `PUT` | `/api/admin/users/:id` | Update user | Admin |
| `DELETE` | `/api/admin/users/:id` | Delete user | Admin |
| `GET` | `/api/admin/sellers` | List sellers | Admin |
| `PUT` | `/api/admin/sellers/:id/status` | Approve/reject seller | Admin |
| `GET` | `/api/admin/delivery` | List delivery partners | Admin |
| `GET` | `/api/admin/statistics` | Platform statistics | Admin |
| `GET/PUT` | `/api/admin/hero` | Manage hero section | Admin |

### Delivery APIs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `PUT` | `/api/delivery/status` | Update availability | Driver |
| `GET` | `/api/delivery/assignments` | Get assignments | Driver |
| `POST` | `/api/delivery/assignments/:id/accept` | Accept assignment | Driver |
| `POST` | `/api/delivery/assignments/:id/deliver` | Confirm delivery | Driver |

### AI Demand Prediction APIs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/seller/demand?action=forecast&productId=X&days=7` | Get demand forecast for a product | Seller |
| `GET` | `/api/seller/demand?action=all-forecasts&days=14&limit=20` | Get forecasts for top seller products (parallel) | Seller |
| `GET` | `/api/seller/demand?action=alerts&days=7` | Get AI stock shortage alerts | Seller |

> **Note:** These Next.js API routes proxy to the Python ML microservice on port 8004. See [`demand-server/README.md`](./demand-server/README.md) for the raw ML API documentation.

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                                   │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │   Customer   │  │    Seller    │  │    Driver    │  │    Admin     ││
│  │   Web App    │  │  Dashboard   │  │  Dashboard   │  │  Dashboard   ││
│  │  (Next.js)   │  │  (Next.js)   │  │  (Next.js)   │  │  (Next.js)   ││
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘│
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         MIDDLEWARE LAYER                                 │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │   NextAuth   │  │    RBAC      │  │ Rate Limiter │  │   Session    ││
│  │ Middleware   │  │  Middleware  │  │  (Upstash)   │  │  Management  ││
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘│
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           API LAYER                                      │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                    Next.js API Routes                              │ │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │ │
│  │  │  Auth   │ │Products │ │ Orders  │ │Payments │ │ Admin   │      │ │
│  │  │  APIs   │ │  APIs   │ │  APIs   │ │  APIs   │ │  APIs   │      │ │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘      │ │
│  └────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         SERVICE LAYER                                    │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │   Database   │  │    Email     │  │   Storage    │  │   Payment    ││
│  │   Service    │  │   Service    │  │   Service    │  │   Service    ││
│  │  (MongoDB)   │  │ (Nodemailer) │  │ (Cloudinary) │  │  (Razorpay)  ││
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘│
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                        │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐ │
│  │                    │  │                    │  │                    │ │
│  │   MongoDB Atlas    │  │   Upstash Redis    │  │     Cloudinary     │ │
│  │   (Primary DB)     │  │   (Rate Limiting)  │  │   (Image CDN)      │ │
│  │                    │  │                    │  │                    │ │
│  └────────────────────┘  └────────────────────┘  └────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

### Request Flow

```
Client Request
      │
      ▼
┌─────────────────────┐
│   Next.js Server    │
│   (middleware.ts)   │
└─────────────────────┘
      │
      ├─── Rate Limiting Check (Upstash Redis)
      │         │
      │         ├── ❌ 429 Too Many Requests
      │         │
      │         └── ✅ Continue
      │
      ├─── Authentication Check (NextAuth)
      │         │
      │         ├── ❌ 401 Unauthorized
      │         │
      │         └── ✅ Continue
      │
      ├─── Authorization Check (RBAC)
      │         │
      │         ├── ❌ 403 Forbidden
      │         │
      │         └── ✅ Continue
      │
      ▼
┌─────────────────────┐
│    API Handler      │
│   (route.ts)        │
└─────────────────────┘
      │
      ├─── Validate Input (Zod)
      │
      ├─── Database Operations (Mongoose)
      │
      ├─── External Services (Razorpay, Cloudinary, etc.)
      │
      ▼
┌─────────────────────┐
│    JSON Response    │
└─────────────────────┘
```

---

## 👥 User Roles

Deligo implements a comprehensive Role-Based Access Control (RBAC) system:

### Role Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                          ADMIN                                   │
│  • Full platform access                                          │
│  • User management                                               │
│  • Seller/Driver approvals                                       │
│  • Statistics & analytics                                        │
│  • Category management                                           │
│  • Role simulation                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│    SELLER     │     │   DELIVERY    │     │   SUPPORT     │
│               │     │               │     │               │
│ • Products    │     │ • Assignments │     │ • Tickets     │
│ • Orders      │     │ • Deliveries  │     │ • Messages    │
│ • Inventory   │     │ • Earnings    │     │ • Escalations │
│ • Analytics   │     │ • Profile     │     │ • Reports     │
└───────────────┘     └───────────────┘     └───────────────┘
                              │
                              ▼
                      ┌───────────────┐
                      │   CUSTOMER    │
                      │               │
                      │ • Browse      │
                      │ • Cart        │
                      │ • Orders      │
                      │ • Reviews     │
                      │ • Profile     │
                      └───────────────┘
```

### Role Permissions Matrix

| Feature | Customer | Seller | Delivery | Support | Admin |
|---------|:--------:|:------:|:--------:|:-------:|:-----:|
| Browse Products | ✅ | ✅ | ✅ | ✅ | ✅ |
| Add to Cart | ✅ | ❌ | ❌ | ❌ | ❌ |
| Place Orders | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage Products | ❌ | ✅ | ❌ | ❌ | ✅ |
| View Seller Orders | ❌ | ✅ | ❌ | ❌ | ✅ |
| Accept Deliveries | ❌ | ❌ | ✅ | ❌ | ❌ |
| Handle Tickets | ❌ | ❌ | ❌ | ✅ | ✅ |
| Manage Users | ❌ | ❌ | ❌ | ❌ | ✅ |
| Approve Sellers | ❌ | ❌ | ❌ | ❌ | ✅ |
| View Statistics | ❌ | 📊 | 📊 | ❌ | ✅ |

---

## 🚢 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository

3. **Configure Environment Variables**
   - Add all variables from `.env.local`
   - Ensure `NEXTAUTH_URL` matches your Vercel domain

4. **Deploy**
   - Vercel will automatically build and deploy

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm run start
   ```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

```bash
# Build and run
docker build -t deligo .
docker run -p 3000:3000 deligo
```

---

## 🧪 Testing

### Running Tests

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

### Testing Strategy

| Layer | Tools | Coverage |
|-------|-------|----------|
| Unit Tests | Jest, React Testing Library | Components, Utilities |
| Integration Tests | Jest, Supertest | API Routes, Database |
| E2E Tests | Playwright, Cypress | User Flows |

---

## 📈 Performance Optimization

### Built-in Optimizations

- **Turbopack**: 10x faster development builds
- **Image Optimization**: Next.js Image component with Cloudinary
- **Code Splitting**: Automatic route-based splitting
- **SSR/SSG**: Server-side rendering where needed
- **Rate Limiting**: Prevents API abuse
- **Database Indexing**: Optimized MongoDB queries
- **Connection Pooling**: Mongoose connection pooling
- **ML In-Memory Caching**: Demand prediction server caches 80K+ rows in memory with 5-minute TTL
- **Parallel Forecast Fetching**: `Promise.all()` for concurrent product forecasts instead of sequential

### Recommended Improvements

- [ ] Implement Redis caching for product listings
- [ ] Add service worker for offline support
- [ ] Implement infinite scroll pagination
- [ ] Add CDN for static assets
- [ ] Database query optimization with aggregation pipelines
- [ ] Pre-calculate demand forecasts in nightly batch jobs

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org) - The React Framework
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- [MongoDB](https://mongodb.com) - NoSQL Database
- [Razorpay](https://razorpay.com) - Payment Gateway
- [Cloudinary](https://cloudinary.com) - Media Management
- [Vercel](https://vercel.com) - Deployment Platform
- [Upstash](https://upstash.com) - Serverless Redis

---

## 📞 Support

- **Documentation**: [/notes](./notes/)
- **Issues**: [GitHub Issues](https://github.com/yourusername/deligo/issues)
- **Email**: support@deligo.com

---

<p align="center">
  Made with ❤️ by the Deligo Team
</p>

<p align="center">
  <a href="#-deligo---modern-e-commerce-platform">Back to Top ↑</a>
</p>

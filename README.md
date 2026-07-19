<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=40&pause=1000&color=6366F1&center=true&vCenter=true&width=600&lines=🏪+RentalFlow;Rental+Management+Platform;Built+for+Hackathon+2024" alt="RentalFlow" />

<br/>

[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-Build-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)

<br/>

> **🏆 Hackathon Project — 24-Hour Build Challenge**
> A fully-featured, production-ready rental management platform with dual portals (Admin & Customer), complete rental lifecycle management, late fee tracking, payment processing, and rich analytics.

<br/>

[🚀 Quick Start](#-quick-start) • [✨ Features](#-features) • [🏗️ Architecture](#-architecture) • [📊 Database](#-database-schema) • [🔌 API Reference](#-api-reference)

</div>

---

## 📖 Table of Contents

- [🌟 Overview](#-overview)
- [✨ Features](#-features)
- [🏗️ Architecture](#-architecture)
- [🗂️ Project Structure](#-project-structure)
- [📊 Database Schema](#-database-schema)
- [🔌 API Reference](#-api-reference)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Environment Variables](#-environment-variables)
- [🛡️ Security](#-security)
- [📦 Tech Stack](#-tech-stack)
- [🗺️ Roadmap](#-roadmap)

---

## 🌟 Overview

**RentalFlow** is a comprehensive end-to-end rental management system designed to streamline the entire lifecycle of product rentals — from browsing and booking to returns, late fees, and analytics.

Built during a **24-hour hackathon**, the platform supports:

| Portal | Target User | Key Capability |
|--------|-------------|----------------|
| 🛡️ **Admin Portal** | Rental Business Owners | Full control over inventory, rentals, pricing, reports |
| 👤 **Customer Portal** | End Customers | Browse, book, track, and manage their rentals |

---

## ✨ Features

### 🛡️ Admin Panel Features

| Icon | Feature | Description |
|------|---------|-------------|
| 📊 | **Dashboard Analytics** | Real-time stats: revenue, active rentals, overdue items, customer count |
| 📦 | **Product Management** | Add/edit/delete products with images, variants, conditions, and late fee config |
| 🏷️ | **Category Management** | Organize inventory into categories with pricelist rule support |
| 📋 | **Rental Order Management** | Full rental lifecycle: PENDING → BOOKED → ACTIVE → COMPLETED/OVERDUE |
| 💳 | **Payment Tracking** | Track payments with statuses: PENDING, COMPLETED, FAILED, REFUNDED |
| 🏦 | **Security Deposits** | Manage deposit collection and refunds per rental |
| 🔄 | **Return Inspections** | Record damage reports, missing accessories on return |
| ⏰ | **Late Fee System** | Automatic late fee calculation with configurable rates and grace periods |
| 💰 | **Pricelist Engine** | Flexible pricing rules: fixed/range, hourly/daily/weekly/monthly |
| 📄 | **Quotation Templates** | Create reusable quotation templates with custom headers/footers |
| 📈 | **Reports & Analytics** | Revenue trends, rental frequency, customer activity with Recharts graphs |
| 🔔 | **Notifications** | Pickup reminders, return alerts, late return notifications |
| 👥 | **Customer Management** | KYC verification, account management, rental history per customer |
| ⚙️ | **Global Settings** | Configure late fee rates, grace periods, and fee caps system-wide |

### 👤 Customer Portal Features

| Icon | Feature | Description |
|------|---------|-------------|
| 🛒 | **Smart Cart** | Add products, set rental dates, apply coupons, checkout |
| 🔍 | **Product Discovery** | Browse by category, view details, images, availability |
| 📅 | **My Rentals** | Track all active, upcoming, and past rentals |
| 💰 | **Payment History** | View all payment records and invoice details |
| 📍 | **Address Management** | Multiple shipping addresses with default selection |
| 👤 | **Profile & KYC** | Update profile, upload KYC documents for verification |
| 🔔 | **Notifications** | Real-time alerts for pickups, returns, and reminders |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        RentalFlow Platform                          │
├──────────────────────────┬──────────────────────────────────────────┤
│      FRONTEND (Client)   │           BACKEND (Server)               │
│      React 19 + Vite 8   │           Express 5 + Node.js            │
│                          │                                          │
│  ┌─────────────────────┐ │  ┌─────────────────────────────────────┐ │
│  │   Admin Portal      │ │  │         REST API v1                 │ │
│  │  ┌───────────────┐  │ │  │  ┌─────────────────────────────┐   │ │
│  │  │  Dashboard    │  │ │  │  │  Routes → Controllers       │   │ │
│  │  │  Products     │◄─┼─┼──┼─►│  → Services → Repositories │   │ │
│  │  │  Rentals      │  │ │  │  │  → Prisma ORM              │   │ │
│  │  │  Payments     │  │ │  │  └─────────────────────────────┘   │ │
│  │  │  Analytics    │  │ │  │                                     │ │
│  │  │  Reports      │  │ │  │  ┌─────────────────────────────┐   │ │
│  │  └───────────────┘  │ │  │  │     Middleware Stack        │   │ │
│  └─────────────────────┘ │  │  │  Helmet (Security Headers) │   │ │
│                          │  │  │  CORS (Origin Whitelist)   │   │ │
│  ┌─────────────────────┐ │  │  │  Rate Limiter (100/15min)  │   │ │
│  │  Customer Portal    │ │  │  │  JWT Auth                  │   │ │
│  │  ┌───────────────┐  │ │  │  │  Error Handler             │   │ │
│  │  │  Browse Shop  │  │ │  │  └─────────────────────────────┘   │ │
│  │  │  Cart         │◄─┼─┼──┤                                     │ │
│  │  │  My Rentals   │  │ │  │  ┌─────────────────────────────┐   │ │
│  │  │  Payments     │  │ │  │  │   SQLite (Dev) / Postgres   │   │ │
│  │  │  Profile      │  │ │  │  │   via Prisma ORM + Adapters │   │ │
│  │  └───────────────┘  │ │  │  └─────────────────────────────┘   │ │
│  └─────────────────────┘ │  └─────────────────────────────────────┘ │
└──────────────────────────┴──────────────────────────────────────────┘
```

### 🔄 Request Flow

```
  Customer/Admin Browser
          │
          ▼
    React (Vite Dev Server :5173)
          │  Axios / Fetch API
          ▼
    Express Server (:5000)
          │
          ├── Helmet (Security Headers)
          ├── CORS Middleware
          ├── Rate Limiter (100 req/15min)
          ├── JWT Auth Middleware
          │
          ▼
    Route Handler
          │
          ▼
    Controller (Validates with Zod)
          │
          ▼
    Service Layer (Business Logic)
          │
          ▼
    Repository Layer (Data Access)
          │
          ▼
    Prisma ORM
          │
          ▼
    SQLite / PostgreSQL
```

### 🔐 Authentication Flow

```
    User Login Request
          │
          ▼
    POST /api/v1/auth/login
          │  bcrypt.compare(password, hash)
          ▼
    JWT Access Token Generated
          │  (stored client-side)
          ▼
    All Protected Route Requests
          │  Authorization: Bearer <token>
          ▼
    JWT Middleware validates token
          │  Checks TokenBlacklist (logout support)
          ▼
    Role-based Access Control
          │
          ├── ADMIN  → Full access
          └── CUSTOMER → Own data only
```

---

## 🗂️ Project Structure

```
odoofinal/
├── 📁 client/                          # React Frontend (Vite)
│   └── 📁 src/
│       ├── 📁 components/
│       │   ├── 📁 admin/               # Admin-specific UI components
│       │   │   ├── dashboard/          # StatCard, Charts, Widgets
│       │   │   ├── rentals/            # Rental tables, modals
│       │   │   └── products/           # Product forms, image upload
│       │   ├── 📁 customer/            # Customer-facing components
│       │   └── 📁 common/              # Navbar, Sidebar, Modals
│       ├── 📁 pages/
│       │   ├── 📁 Admin/               # 15 Admin pages
│       │   │   ├── DashboardPage.jsx
│       │   │   ├── ProductsPage.jsx
│       │   │   ├── RentalsPage.jsx
│       │   │   ├── PaymentsPage.jsx
│       │   │   ├── DepositsPage.jsx
│       │   │   ├── ReturnsPage.jsx
│       │   │   ├── AnalyticsPage.jsx
│       │   │   ├── ReportsPage.jsx
│       │   │   ├── CustomersPage.jsx
│       │   │   ├── CategoriesPage.jsx
│       │   │   ├── PricelistPage.jsx
│       │   │   ├── QuotationTemplatesPage.jsx
│       │   │   ├── InventoryPage.jsx
│       │   │   ├── NotificationsPage.jsx
│       │   │   └── SettingsPage.jsx
│       │   ├── 📁 Customer/            # 11 Customer pages
│       │   │   ├── CustomerDashboardPage.jsx
│       │   │   ├── ProductsPage.jsx
│       │   │   ├── ProductDetailPage.jsx
│       │   │   ├── CartPage.jsx
│       │   │   ├── MyRentalsPage.jsx
│       │   │   ├── RentalDetailPage.jsx
│       │   │   ├── PaymentsPage.jsx
│       │   │   ├── AddressesPage.jsx
│       │   │   ├── ProfilePage.jsx
│       │   │   ├── CategoryPage.jsx
│       │   │   └── NotificationsPage.jsx
│       │   ├── 📁 Auth/                # Login / Register
│       │   └── 📁 Landing/             # Public landing page
│       ├── 📁 context/                 # React Context (Auth, Cart)
│       ├── 📁 hooks/                   # Custom React hooks
│       ├── 📁 services/                # API service functions
│       ├── 📁 lib/                     # Utilities (cn, formatters)
│       └── 📁 data/                    # Static/mock data
│
├── 📁 server/                          # Express Backend
│   ├── 📁 src/
│   │   ├── 📁 controllers/             # 14 Route controllers
│   │   ├── 📁 routes/                  # Express route definitions
│   │   ├── 📁 services/                # Business logic layer
│   │   ├── 📁 repositories/            # Data access layer
│   │   ├── 📁 middlewares/             # Auth, error handler
│   │   ├── 📁 validators/              # Zod validation schemas
│   │   ├── 📁 config/                  # Environment config
│   │   └── 📁 utils/                   # Logger (Winston), helpers
│   ├── 📁 prisma/
│   │   ├── schema.prisma               # Full database schema
│   │   ├── seed.js                     # Default seed data
│   │   └── mock_seed.js                # Rich demo data
│   └── .env
│
├── package.json                        # Root scripts
└── README.md
```

---

## 📊 Database Schema

```mermaid
erDiagram
    User {
        String id PK
        String firstName
        String lastName
        String email
        String password
        String roleId FK
        KYCStatus kycStatus
        Boolean isActive
    }
    Role {
        String id PK
        String name
    }
    Product {
        String id PK
        String name
        String categoryId FK
        Float rentalPricePerDay
        Float depositAmount
        Int stockQuantity
        Boolean lateFeeEnabled
        Float lateFeeRate
    }
    Category {
        String id PK
        String name
        Boolean isActive
    }
    RentalOrder {
        String id PK
        String userId FK
        RentalStatus status
        DateTime pickupDate
        DateTime returnDate
        Float totalCost
        Float finalCost
    }
    Payment {
        String id PK
        String rentalOrderId FK
        Float amount
        PaymentStatus status
    }
    SecurityDeposit {
        String id PK
        String rentalOrderId FK
        Float amount
        Boolean isRefunded
    }
    ReturnInspection {
        String id PK
        String rentalOrderId FK
        Boolean isDamaged
        String damageReport
    }
    LateFee {
        String id PK
        String returnInspectionId FK
        Int daysLate
        Float penaltyAmount
        Boolean isPaid
    }
    Notification {
        String id PK
        String userId FK
        String type
        Boolean isRead
    }
    Cart {
        String id PK
        String userId FK
    }
    Coupon {
        String id PK
        String code
        Float discountPct
    }
    User ||--o{ RentalOrder : "places"
    User ||--o| Cart : "has"
    User }|--|| Role : "assigned"
    User ||--o{ Notification : "receives"
    Product }|--|| Category : "belongs to"
    RentalOrder ||--o| Payment : "has"
    RentalOrder ||--o| SecurityDeposit : "has"
    RentalOrder ||--o| ReturnInspection : "triggers"
    ReturnInspection ||--o| LateFee : "generates"
    RentalOrder }o--o| Coupon : "uses"
```

---

## 🔌 API Reference

Base URL: `http://localhost:5000/api/v1`

### 🔐 Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `POST` | `/auth/register` | Register new user | ❌ |
| `POST` | `/auth/login` | Login and get JWT token | ❌ |
| `POST` | `/auth/logout` | Invalidate JWT token | ✅ |
| `GET` | `/auth/me` | Get current user profile | ✅ |

### 📦 Products

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `GET` | `/products` | List all products | ❌ |
| `GET` | `/products/:id` | Get product details | ❌ |
| `POST` | `/products` | Create product | ✅ Admin |
| `PUT` | `/products/:id` | Update product | ✅ Admin |
| `DELETE` | `/products/:id` | Soft delete product | ✅ Admin |

### 📋 Rentals

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `GET` | `/rentals` | List all rentals | ✅ Admin |
| `GET` | `/rentals/:id` | Get rental detail | ✅ |
| `POST` | `/rentals` | Create rental order | ✅ |
| `PATCH` | `/rentals/:id/status` | Update rental status | ✅ Admin |

### 💳 Payments

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `GET` | `/payments` | List all payments | ✅ Admin |
| `POST` | `/payments` | Record payment | ✅ |
| `PATCH` | `/payments/:id` | Update payment status | ✅ Admin |

### 🏦 Deposits

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `GET` | `/deposits` | List deposits | ✅ Admin |
| `POST` | `/deposits` | Create deposit record | ✅ |
| `PATCH` | `/deposits/:id/refund` | Process refund | ✅ Admin |

### 🔄 Returns & Late Fees

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `POST` | `/returns` | Process return + inspection | ✅ Admin |
| `GET` | `/late-fees` | List all late fees | ✅ Admin |
| `PATCH` | `/late-fees/:id/pay` | Mark late fee as paid | ✅ |

### 📊 Dashboard & Reports

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `GET` | `/dashboard` | Get dashboard KPIs | ✅ Admin |
| `GET` | `/reports` | Generate business reports | ✅ Admin |

### 🔔 Notifications

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `GET` | `/notifications` | Get user notifications | ✅ |
| `PATCH` | `/notifications/:id/read` | Mark notification as read | ✅ |

### 💰 Pricelists

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `GET` | `/pricelists` | List pricelists | ✅ Admin |
| `POST` | `/pricelists` | Create pricelist | ✅ Admin |
| `POST` | `/pricelists/:id/rules` | Add pricing rule | ✅ Admin |

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Node.js | v18+ | [nodejs.org](https://nodejs.org) |
| npm | v9+ | Comes with Node.js |
| Git | Latest | [git-scm.com](https://git-scm.com) |

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/piyushgoyal016/RentalFlow.git
cd RentalFlow
```

### 2️⃣ Install Root Dependencies

```bash
npm install
```

### 3️⃣ Setup the Backend

```bash
cd server
npm install

# Copy and configure environment file
cp .env.example .env
# Edit .env with your values

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed with demo data
npx prisma db seed
```

### 4️⃣ Setup the Frontend

```bash
cd ../client
npm install
```

### 5️⃣ Run the Application

**Terminal 1 — Start Backend:**
```bash
cd server
npm run dev
# ✅ Server starts at http://localhost:5000
```

**Terminal 2 — Start Frontend:**
```bash
cd client
npm run dev
# ✅ App opens at http://localhost:5173
```

### 6️⃣ Default Login Credentials

After seeding the database:

```
🛡️  Admin Login:
    Email:    admin@rentalflow.com
    Password: admin123

👤  Customer Login:
    Email:    customer@example.com
    Password: customer123
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the `server/` directory:

```env
# ─── Server ────────────────────────────────────────────────
NODE_ENV=development
PORT=5000

# ─── Database ──────────────────────────────────────────────
# SQLite (Development - default)
DATABASE_URL="file:./dev.db"

# PostgreSQL (Production)
# DATABASE_URL="postgresql://user:password@localhost:5432/rentalflow"

# ─── JWT Authentication ─────────────────────────────────────
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRES_IN=7d

# ─── CORS ───────────────────────────────────────────────────
CORS_ORIGIN=http://localhost:5173

# ─── Logging ────────────────────────────────────────────────
LOG_LEVEL=info
```

---

## 🛡️ Security

RentalFlow implements multiple layers of security:

| Feature | Implementation | Details |
|---------|---------------|---------|
| 🔒 **Password Hashing** | `bcrypt` | Salt rounds: 12 |
| 🪙 **Authentication** | `jsonwebtoken` | JWT with expiry + blacklist |
| 🛡️ **HTTP Headers** | `helmet` | XSS, CSRF, clickjacking protection |
| 🚦 **Rate Limiting** | `express-rate-limit` | 100 requests / 15 minutes per IP |
| ✅ **Input Validation** | `zod` | Schema validation on all inputs |
| 🌐 **CORS** | Custom whitelist | Only approved origins allowed |
| 🗑️ **Soft Deletes** | `deletedAt` field | Data never permanently removed |
| 📋 **Audit Logs** | `AuditLog` model | Every action tracked with user + entity |
| 🔑 **Token Blacklist** | `TokenBlacklist` model | Logout invalidates tokens permanently |

---

## 📦 Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| ⚛️ React | 19.x | UI Framework |
| ⚡ Vite | 8.x | Build Tool & Dev Server |
| 🎨 TailwindCSS | 4.x | Utility-first CSS Framework |
| 🚦 React Router | 7.x | Client-side routing |
| 📊 Recharts | 3.x | Charts & Data Visualization |
| 🎞️ Framer Motion | 12.x | Smooth Animations |
| 🔲 Lucide React | 1.x | Icon Library |
| 📝 React Hook Form | 7.x | Performant form management |
| ✅ Zod | 4.x | TypeScript-first schema validation |
| 🔀 clsx + tailwind-merge | Latest | Class name utilities |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| 🟩 Node.js | 18+ | JavaScript Runtime |
| 🚂 Express | 5.x | Web Framework |
| 🔷 Prisma | 7.x | ORM & Database Toolkit |
| 🗄️ SQLite (libSQL) | - | Development Database |
| 🐘 PostgreSQL (pg) | - | Production Database |
| 🔐 bcrypt | 6.x | Password Hashing |
| 🪙 jsonwebtoken | 9.x | JWT Authentication |
| 🛡️ helmet | 8.x | HTTP Security Headers |
| 🚦 express-rate-limit | 8.x | API Rate Limiting |
| ✅ zod | 4.x | Input Validation |
| 📝 winston | 3.x | Structured Production Logging |
| 🔄 nodemon | 3.x | Hot Reload in Development |

---

## 🗺️ Roadmap

### ✅ Completed (Hackathon Build)

- [x] 🔐 JWT Authentication with role-based access control
- [x] 📦 Full product catalog management (CRUD + images)
- [x] 📋 Complete rental lifecycle (PENDING → COMPLETED)
- [x] 💳 Payment tracking and status management
- [x] 🏦 Security deposit management with refund support
- [x] 🔄 Return inspection with damage reporting
- [x] ⏰ Automatic late fee calculation with configurable rates
- [x] 💰 Flexible pricelist engine (fixed/range, multi-period)
- [x] 📊 Admin dashboard with real-time KPIs
- [x] 📈 Revenue and activity reports with interactive charts
- [x] 🔔 In-app notification system
- [x] 🛒 Full shopping cart for customers
- [x] 📄 Quotation template management
- [x] 🏪 Multi-store location support
- [x] 👥 Customer KYC verification workflow
- [x] 📋 Audit log tracking

### 🚧 Planned

- [ ] 📧 Email notifications (SendGrid / Nodemailer)
- [ ] 📱 Full mobile-responsive optimization
- [ ] 💳 Payment gateway integration (Razorpay / Stripe)
- [ ] 📦 Barcode/QR scanner for inventory tracking
- [ ] 🗺️ Google Maps for store location picker
- [ ] 📄 Automated PDF invoice generation
- [ ] 📱 React Native mobile app
- [ ] 🤖 AI-powered demand forecasting

---

## 👥 Team

> Built with ❤️ and ☕ in **24 hours** during the Odoo Hackathon

| Role | Contribution |
|------|-------------|
| 🎨 Frontend Developer | React UI, Admin Portal, Customer Portal, Animations |
| ⚙️ Backend Developer | Express API, Prisma ORM, Business Logic Layer |
| 🗄️ Database Architect | Schema Design, Migrations, Seed Data |
| 🔐 Security Engineer | Auth system, JWT, Middleware, Zod Validation |

---

## 📄 License

This project is licensed under the **ISC License** — feel free to use, modify, and distribute.

---

<div align="center">

**⭐ Star this repo if RentalFlow helped you!**

Made with 🔥 during a 24-hour Hackathon Sprint

[![GitHub stars](https://img.shields.io/github/stars/piyushgoyal016/RentalFlow?style=social)](https://github.com/piyushgoyal016/RentalFlow)

</div>

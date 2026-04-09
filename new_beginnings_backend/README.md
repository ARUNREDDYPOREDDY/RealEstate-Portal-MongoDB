# 🏠 New Beginnings — Real Estate Portal
### Full Stack: Node.js + Express + MySQL

---

## 📁 Project Structure

```
new-beginnings-backend/
├── config/
│   ├── db.js              ← MySQL connection pool (mysql2/promise)
│   ├── schema.sql         ← Full MySQL schema (reference)
│   └── seed.js            ← Seeds all tables with demo data
│
├── controllers/
│   ├── authController.js       ← Register, Login, Profile, Password
│   ├── propertyController.js   ← CRUD, filter, featured, recommended
│   ├── favoriteController.js   ← Save / unsave properties
│   ├── enquiryController.js    ← Send & manage enquiries
│   ├── reviewController.js     ← Property reviews + testimonials
│   ├── visitController.js      ← Schedule & manage site visits
│   └── adminController.js      ← Stats, user management, approvals
│
├── middleware/
│   ├── auth.js            ← JWT protect, optionalAuth, adminOnly
│   ├── upload.js          ← Multer image upload (PNG/JPG/WebP, 10MB)
│   └── errorHandler.js    ← Global 404 + error middleware
│
├── routes/
│   ├── authRoutes.js
│   ├── propertyRoutes.js
│   ├── favoriteRoutes.js
│   ├── enquiryRoutes.js
│   ├── reviewRoutes.js
│   ├── visitRoutes.js
│   └── adminRoutes.js
│
├── public/                ← Frontend (index.html, app.js, style.css)
├── uploads/               ← Uploaded property images (auto-created)
├── .env                   ← Environment variables
├── .gitignore
├── package.json
└── server.js              ← Express entry point
```

---

## 🗄️ MySQL Database Tables

| Table              | Description                                       |
|--------------------|---------------------------------------------------|
| `users`            | Registered users with bcrypt passwords & roles   |
| `properties`       | Full property listings with status/badge/coords  |
| `amenities`        | Many-to-one amenities per property               |
| `property_images`  | Multiple images per property                     |
| `favorites`        | User saved / bookmarked properties               |
| `enquiries`        | Buyer contact enquiries                          |
| `reviews`          | Property reviews + homepage testimonials         |
| `visits`           | Scheduled site visits                            |

---

## 🚀 Setup & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Edit `.env` with your MySQL credentials:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=new_beginnings_db
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
```

### 3. Create MySQL Database
```sql
CREATE DATABASE new_beginnings_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
Or run:
```bash
mysql -u root -p -e "CREATE DATABASE new_beginnings_db;"
```

### 4. Seed Tables & Demo Data
```bash
npm run seed
```
This will:
- Create all 8 tables automatically
- Insert 2 demo users
- Insert 12 sample properties with amenities
- Insert 3 homepage testimonials

**Demo Accounts:**
| Role  | Email             | Password   |
|-------|-------------------|------------|
| User  | user@demo.com     | demo123    |
| Admin | admin@demo.com    | admin123   |

### 5. Start the Server
```bash
npm start          # production
npm run dev        # development (nodemon hot-reload)
```

Server starts at: **http://localhost:5000**

---

## 📡 API Reference

### Auth
| Method | Endpoint                    | Auth     | Description            |
|--------|-----------------------------|----------|------------------------|
| POST   | `/api/auth/register`        | Public   | Register new user      |
| POST   | `/api/auth/login`           | Public   | Login & get JWT token  |
| GET    | `/api/auth/me`              | 🔒 User  | Get current user       |
| PUT    | `/api/auth/me`              | 🔒 User  | Update profile         |
| PUT    | `/api/auth/change-password` | 🔒 User  | Change password        |

### Properties
| Method | Endpoint                          | Auth       | Description                  |
|--------|-----------------------------------|------------|------------------------------|
| GET    | `/api/properties`                 | Public     | List with filters & pagination |
| GET    | `/api/properties/featured`        | Public     | Featured properties          |
| GET    | `/api/properties/recommended`     | Public     | Top-rated properties         |
| GET    | `/api/properties/:id`             | Public     | Property detail + reviews    |
| POST   | `/api/properties`                 | 🔒 User    | Create property listing      |
| PUT    | `/api/properties/:id`             | 🔒 Owner   | Update property              |
| PATCH  | `/api/properties/:id/status`      | 🔑 Admin   | Change status                |
| DELETE | `/api/properties/:id`             | 🔑 Admin   | Delete property              |

**Query Parameters for GET /api/properties:**
```
search, type, city, min_price, max_price, beds, area_min, area_max,
badge, status, sort (newest|price-asc|price-desc|area|rating),
page, per_page
```

### Favorites
| Method | Endpoint                       | Auth    | Description             |
|--------|--------------------------------|---------|-------------------------|
| GET    | `/api/favorites`               | 🔒 User | Get saved properties    |
| GET    | `/api/favorites/ids`           | 🔒 User | Get saved property IDs  |
| POST   | `/api/favorites/:property_id`  | 🔒 User | Save a property         |
| DELETE | `/api/favorites/:property_id`  | 🔒 User | Unsave a property       |

### Enquiries
| Method | Endpoint                      | Auth       | Description              |
|--------|-------------------------------|------------|--------------------------|
| POST   | `/api/enquiries`              | Optional   | Submit enquiry           |
| GET    | `/api/enquiries`              | 🔒 User    | My enquiries (admin=all) |
| PATCH  | `/api/enquiries/:id/status`   | 🔑 Admin   | Update status            |

### Reviews
| Method | Endpoint                          | Auth    | Description              |
|--------|-----------------------------------|---------|--------------------------|
| GET    | `/api/reviews/testimonials`       | Public  | Homepage testimonials    |
| GET    | `/api/reviews/:property_id`       | Public  | Property reviews         |
| POST   | `/api/reviews/:property_id`       | 🔒 User | Submit review            |

### Visits
| Method | Endpoint                | Auth     | Description         |
|--------|-------------------------|----------|---------------------|
| POST   | `/api/visits`           | Optional | Schedule a visit    |
| GET    | `/api/visits`           | 🔒 User  | My visits           |
| PATCH  | `/api/visits/:id/status`| 🔑 Admin | Confirm/cancel      |

### Admin
| Method | Endpoint                         | Auth     | Description              |
|--------|----------------------------------|----------|--------------------------|
| GET    | `/api/admin/stats`               | 🔑 Admin | Dashboard statistics     |
| GET    | `/api/admin/users`               | 🔑 Admin | All users (with search)  |
| PATCH  | `/api/admin/users/:id/toggle`    | 🔑 Admin | Activate/deactivate user |
| DELETE | `/api/admin/users/:id`           | 🔑 Admin | Delete user              |
| GET    | `/api/admin/pending-properties`  | 🔑 Admin | Pending approvals        |

---

## 🔐 Authentication

All protected routes require a JWT in the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📸 Image Upload

Property images are uploaded as `multipart/form-data`:
```
POST /api/properties
Content-Type: multipart/form-data

Field name: "images" (multiple files supported)
Max size: 10MB per file
Formats: JPEG, PNG, WebP
```

Uploaded files are saved to `/uploads/` and served at `/uploads/filename.jpg`.

---

## 🌐 Frontend

The frontend (`public/index.html`, `public/app.js`, `public/style.css`) is served
automatically by Express. Just open **http://localhost:5000** in your browser.

The `app.js` connects to all API endpoints using `fetch()` with JWT auth.

---

## ⚙️ Tech Stack

| Layer       | Technology                    |
|-------------|-------------------------------|
| Runtime     | Node.js v18+                  |
| Framework   | Express.js 4                  |
| Database    | MySQL 8 + mysql2/promise      |
| Auth        | JWT (jsonwebtoken) + bcryptjs |
| File Upload | Multer                        |
| CORS        | cors                          |
| Dev         | nodemon                       |

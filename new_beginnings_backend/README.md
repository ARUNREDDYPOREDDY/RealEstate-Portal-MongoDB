# 🏠 New Beginnings — Real Estate Portal

### Full Stack: Node.js + Express + MongoDB

---

## 🌐 Live Deployment

🚀 **Backend API (Render):**
https://new-beginnings-portal-gbj6.onrender.com

📡 Example API:

```
https://new-beginnings-portal-gbj6.onrender.com/api/properties
```

> ⚠️ The app is hosted on Render's free tier — first load may take ~30–60 seconds while the server spins up.

---

## 📁 Project Structure

```
relestate total pgsql/
│
├── new_beginnings_backend/           ← Express.js REST API
│   ├── config/
│   │   ├── db.js                     ← MongoDB connection (mongoose)
│   │   └── seed.js                   ← Seeds all collections with sample data (no demo users by default)
│   │
│   ├── controllers/
│   │   ├── authController.js         ← Register, Login, Profile, Password
│   │   ├── propertyController.js     ← CRUD, filter, featured, recommended
│   │   ├── favoriteController.js     ← Save / unsave properties
│   │   ├── enquiryController.js      ← Send & manage enquiries
│   │   ├── reviewController.js       ← Reviews + testimonials
│   │   ├── visitController.js        ← Schedule & manage site visits
│   │   └── adminController.js        ← Stats, users, approvals
│   │
│   ├── middleware/
│   │   ├── auth.js                   ← JWT protect, optionalAuth, adminOnly
│   │   ├── upload.js                 ← Multer image upload (PNG/JPG/WebP, 10MB)
│   │   └── errorHandler.js           ← Global 404 + error middleware
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── propertyRoutes.js
│   │   ├── favoriteRoutes.js
│   │   ├── enquiryRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── visitRoutes.js
│   │   └── adminRoutes.js
│   │
│   ├── uploads/                      ← Uploaded property images (auto-created)
│   ├── .env                          ← Environment variables (not committed)
│   ├── package.json
│   └── server.js                     ← Express entry point
│
├── new_beginnings_frontend/          ← Vanilla HTML/CSS/JS Frontend
│   ├── index.html
│   ├── app.js
│   └── style.css
│
├── new_beginnings_database/          ← PostgreSQL schema & seed files
│   └── new_beginnings_database/
│       ├── 01_create_tables.sql
│       ├── 02_seed_users.sql
│       ├── 03_seed_properties.sql
│       ├── 04_seed_activity.sql
│       ├── 05_useful_queries.sql
│       ├── database_compatible.sql   ← For local setup
│       └── database_render.sql       ← For Render deployment
│
└── .gitignore
```

---

## 🗄️ MongoDB Collections

| Collection         | Description                    |
|--------------------|--------------------------------|
| `users`            | Users with roles & JWT auth    |
| `properties`       | Property listings (incl. embedded amenities/images) |
| `favorites`        | Saved property references      |
| `enquiries`        | Buyer enquiries                |
| `reviews`          | Reviews + testimonials         |
| `visits`           | Visit scheduling               |

---

## ⚙️ Environment Variables

```env
PORT=5001
NODE_ENV=development

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=nb_super_secret_jwt_key_2026_do_not_share_ever
JWT_EXPIRES_IN=7d

MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

CLIENT_URL=http://localhost:3000
```

---

## 🚀 Setup & Installation

### 1. Install Dependencies

```bash
npm install
```

---

### 2. Configure MongoDB

Provide a running MongoDB instance (local or MongoDB Atlas) and specify its connection URI in the `.env` file as `MONGODB_URI`.

---

### 3. Run Seed Script

```bash
npm run seed
```

✔ Creates all collections
✔ Inserts sample properties + embedded amenities + reviews

Note: The seed script no longer auto-creates demo user accounts. To create users for development, edit `config/seed.js` or add users manually and then run `npm run seed`.

---

### 4. Start Server

```bash
npm run dev
```

Server runs at:

```
http://localhost:5001
```

---

## 🔑 Demo Credentials

Demo credentials are no longer provided by default. Create admin and user accounts manually or via a controlled seed when needed.
---

## 📡 API Reference

### 🔐 Auth

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
PUT    /api/auth/me
PUT    /api/auth/change-password
```

---

### 🏡 Properties

```
GET    /api/properties
GET    /api/properties/featured
GET    /api/properties/recommended
GET    /api/properties/:id
POST   /api/properties
PUT    /api/properties/:id
PATCH  /api/properties/:id/status
DELETE /api/properties/:id
```

---

### ❤️ Favorites

```
GET    /api/favorites
GET    /api/favorites/ids
POST   /api/favorites/:property_id
DELETE /api/favorites/:property_id
```

---

### 📩 Enquiries

```
POST   /api/enquiries
GET    /api/enquiries
PATCH  /api/enquiries/:id/status
```

---

### ⭐ Reviews

```
GET    /api/reviews/testimonials
GET    /api/reviews/:property_id
POST   /api/reviews/:property_id
```

---

### 📅 Visits

```
POST   /api/visits
GET    /api/visits
PATCH  /api/visits/:id/status
```

---

### 🛠️ Admin

```
GET    /api/admin/stats
GET    /api/admin/users
PATCH  /api/admin/users/:id/toggle
DELETE /api/admin/users/:id
GET    /api/admin/pending-properties
```

---

### 🩺 Health Check

```
GET /api/health
```

---

## 🔐 Authentication

```
Authorization: Bearer <JWT_TOKEN>
```

---

## 📸 Image Upload

- Field name: `images`
- Type: `multipart/form-data`
- Max size: 10MB
- Formats: JPG, PNG, WebP

Stored in:

```
/uploads/
```

---

## ⚠️ Common Errors & Fixes

### ❌ Port already in use

✔ Change PORT in `.env` or kill the running process

---

### ❌ MongoDB Connection Error

✔ Ensure your local MongoDB daemon `mongod` is running, or verify your `MONGODB_URI` connection string.

---

## 🚀 Deployment (Render)

### Steps:

1. Push code to GitHub
2. Go to Render → Create Web Service
3. Connect your repository
4. Add environment variables (ensure `MONGODB_URI` points to a MongoDB Atlas cluster)

---

### Build Command

```
npm install
```

### Start Command

```
npm start
```

---

## 🎉 Status

✅ Backend Completed  
✅ MongoDB Integrated  
✅ Errors Fixed  
✅ Deployed on Render  

---

## 👨‍💻 Author

**Arun Reddy**  
🔗 Live: [https://new-beginnings-portal-gbj6.onrender.com](https://new-beginnings-portal-gbj6.onrender.com)

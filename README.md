# Course_management
A modern, responsive Course Management System built with React, Vite, Node.js, Express, and MongoDB Atlas. Features full CRUD operations, image upload &amp; preview, clean 4/2/1 responsive card layout, and 1-click Vercel deployment

## ✨ Features

- **Full Course Lifecycle (CRUD)**:
  - ➕ **Create Course**: Modal form with real-time validation and image preview.
  - 🔄 **Update Course**: Inline card edit triggers pre-filled modal for swift updates.
  - ❌ **Delete Course**: Safe deletion with custom confirmation dialog.
- **Smart Image Handling**:
  - Upload local image files with automatic client-side Base64 encoding.
  - Or provide a direct external image URL.
- **Adaptive Responsive Grid**:
  - **Desktop (>= 1200px)**: Exactly 4 cards per row.
  - **Tablet (768px - 1199px)**: Exactly 2 cards per row.
  - **Mobile (< 768px)**: Exactly 1 card per row.
  - Zero horizontal overflow and smooth layout reflow.
- **Production-Ready Serverless Architecture**:
  - Express REST API configured for Vercel serverless functions.
  - MongoDB connection pooling and caching across warm lambda invocations.
- **Interactive UI/UX**:
  - Smooth glassmorphism accents, hover states, rating badges, and action buttons.
  - Toast notifications for real-time action feedback.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** – Dynamic component-driven interface
- **Vite** – Ultra-fast build tool and dev server
- **Vanilla CSS3** – Custom responsive styling, transitions, and layout variables
- **Lucide Icons** – Clean SVG UI iconography

### Backend
- **Node.js & Express.js** – RESTful API endpoints and middleware
- **Mongoose** – Object Data Modeling (ODM) for MongoDB
- **CORS & Dotenv** – Cross-Origin Resource Sharing & environment management

### Database & Deployment
- **MongoDB Atlas** – Cloud NoSQL database with persistence
- **Vercel** – Frontend hosting & serverless function deployment

---

## 📁 Project Structure

```text
Course_management/
├── api/                       # Vercel serverless entry point
│   └── index.js
├── client/                    # React + Vite frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── CourseCard.jsx
│   │   │   ├── CourseModal.jsx
│   │   │   ├── DeleteConfirmModal.jsx
│   │   │   └── Navbar.jsx
│   │   ├── services/          # API client (courseService.js)
│   │   ├── App.jsx            # State management & main view
│   │   ├── index.css          # Design system & responsive styles
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
├── server/                    # Express backend
│   ├── config/                # Database connection (db.js)
│   ├── models/                # Mongoose Course model
│   ├── routes/                # Course REST API routes
│   ├── .env.example           # Template for environment variables
│   └── server.js              # Local Express server entry point
├── vercel.json                # Single-repo Vercel routing configuration
├── package.json               # Root scripts
└── README.md
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/courses` | Fetch all courses |
| `POST` | `/api/courses` | Create a new course |
| `PUT` | `/api/courses/:id` | Update an existing course by ID |
| `DELETE` | `/api/courses/:id` | Delete a course by ID |

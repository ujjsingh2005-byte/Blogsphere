# 🌟 BlogSphere — World-Class Full-Stack Blog Platform with Comments & Admin Suite

BlogSphere is an enterprise-grade, high-performance, full-stack blogging platform and digital magazine built with **React 18, Vite, Tailwind CSS, Node.js, Express, and MongoDB Atlas**.

---

## 🌐 Live Deployments & Repository Links

- 🚀 **Live Web Application (Vercel)**: [https://blogsphere-rust-sigma.vercel.app/](https://blogsphere-rust-sigma.vercel.app/)
- ⚡ **Live Backend REST API (Render)**: [https://blogsphere-ppxu.onrender.com](https://blogsphere-ppxu.onrender.com)
- 🐙 **GitHub Repository**: [https://github.com/ujjsingh2005-byte/Blogsphere.git](https://github.com/ujjsingh2005-byte/Blogsphere.git)
- 🏥 **API Health Check**: [https://blogsphere-ppxu.onrender.com/api/health](https://blogsphere-ppxu.onrender.com/api/health)

---

## 👤 User vs 👑 Admin Role Architecture

| Feature | 👤 User (Normal) | 👑 Admin (Platform Overseer) |
| :--- | :---: | :---: |
| **Register & Login** | ✅ | ✅ (Pre-seeded & managed) |
| **View & Search Stories** | ✅ | ✅ |
| **Create & Publish Article** | ✅ | ✅ |
| **Edit / Delete Own Article** | ✅ | ✅ |
| **Edit / Delete Another User's Article** | ❌ *(Protected)* | ✅ *(Administrative Override)* |
| **Post / Edit / Delete Own Comments** | ✅ | ✅ |
| **Delete Inappropriate Comments by Others** | ❌ *(Protected)* | ✅ *(Administrative Override)* |
| **Report Abuse / Spam** | ✅ *(Submits to Queue)* | ✅ *(Resolves & Dismisses)* |
| **Admin Command Center (`/admin`)** | ❌ *(403 Forbidden)* | ✅ *(Full Access)* |
| **User Directory & Account Suspension** | ❌ | ✅ *(Search, Block/Unblock, Role Change, Delete)* |
| **Dynamic Category Management** | ❌ | ✅ *(Create, Edit, Delete, Live Post Counts)* |
| **Platform Analytics & Health Metrics** | ❌ | ✅ *(Total Users, Posts, Comments, Reports)* |

---

## 🎨 Design Philosophy & Multi-Color System

BlogSphere combines the sleek aesthetic of a **Premium SaaS**, the visual storytelling of an **Editorial Magazine**, and the engagement of a **Creative Developer Community**.

- **Primary Colors**: Electric Indigo (`#6366F1`), Deep Purple (`#7C3AED`), Royal Violet (`#8B5CF6`)
- **Secondary & Accent**: Cyber Blue (`#3B82F6`), Sky Blue (`#0EA5E9`), Aqua (`#06B6D4`)
- **Energy & Pop**: Hot Pink (`#EC4899`), Magenta (`#D946EF`), Coral (`#F97316`)
- **Nature & Sun**: Emerald (`#10B981`), Green (`#22C55E`), Amber (`#F59E0B`)
- **Dark Mode Palette**: Deep Navy (`#0F172A`), Slate Canvas (`#0B1120`), Surface (`#172033`), soft ambient glowing mesh blobs.

---

## 🚀 Key Features

### 1. 👑 Admin Command Center (`/admin`)
- **Platform Analytics**: Comprehensive KPIs tracking total users, active vs. suspended counts, total articles, total comments, and unresolved abuse reports.
- **User Management**: Instant search, status suspension toggle (block/unblock), role switcher (User ↔ Admin), and user deletion.
- **Content Moderation**: Global article table and comment stream with direct moderation actions.
- **Dynamic Categories**: Live category creation, color theme assignment, and automatic post reassignment upon deletion.
- **Abuse Reports Queue**: Community-driven reporting system with reason tags, resolution workflow, and admin notes.

### 2. 🌙 Seamless Dark & Light Mode System
- One-click instant theme toggle (`Sun` / `Moon` animated icons) with system preference detection and `localStorage` persistence.
- Complete dark-theme styling across all cards, modals, tables, navbar, and article typography.

### 3. 🌌 Extraordinary Hero Section
- Animated deep mesh gradient blobs with floating community highlight badges (*100% Open Access*, *Active Creators*, *Zero Paywalls*).
- Dynamic headline with multi-color gradient typography: *"Share Your Ideas With The World."*

### 4. 🛡️ Enterprise Authentication & Role Guards
- **JWT (JSON Web Token)** authentication with 7-day expiration.
- Password hashing with **`bcryptjs`** (salt rounds: 10, excluded from query results via `select: false`).
- **Role-Based Guards**: Protected routes for both general creators (`ProtectedRoute.jsx`) and administrators (`AdminRoute.jsx`).
- **Account Suspension Enforcement**: Suspended users are immediately blocked from logging in and accessing APIs.
- **1-Click Instant Demo Accounts** on the Sign In page for rapid reviewer testing.

### 5. 📝 Editorial Publishing & Blog Discovery
- **Full Article CRUD**: Create, Read, Update, and Delete articles with live cover preview and curated presets.
- **Server-Side Search**: Search across titles, content, authors, and category tags.
- **Category Filter Pills Ribbon**: Technology, Programming, AI, Web Development, Lifestyle, Career, and more.
- **Reading Time Estimation**: Dynamic calculation based on word count (200 wpm).
- **Server-Side Pagination**: Clean page numbering with next/previous controls.
- **Reading Progress Bar**: Interactive top progress bar tracking article scroll depth.
- **Interactive Share & Like Reactions**: Share to X/Twitter, LinkedIn, Copy Link, and heart likes.

### 6. 💬 Interactive Comment Engine
- Post comments on any article with character counter.
- Inline edit and delete capabilities for comment owners.
- Flag / Report button allowing users to report inappropriate comments to the moderation queue.
- Administrative removal capabilities for any inappropriate comment.

### 7. 📊 Author Analytics & Dashboard
- **SaaS Metric Cards**: Total Articles, Comments Received, Reading Minutes Generated, Comments Written.
- **Publication Management Table**: Direct View, Edit, and Delete action buttons.
- **Recent Audience Feedback**: Live feedback stream on user's stories.

---

## 🛠️ Tech Stack Specification

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Axios, React Router v6
- **Backend**: Node.js, Express.js, JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `cors`, `dotenv`
- **Database**: MongoDB Atlas & Mongoose ODM (with compound, full-text indexes and virtual populate)

---

## 📦 Directory Structure

```
Big platform with comments/
├── PRD.md                         # Product Requirements Document (with RBAC specs)
├── TRD.md                         # Technical Requirements Document
├── TDR.md                         # Technical Design Requirements Document
├── README.md                      # Comprehensive Setup & API Reference
├── package.json                   # Root orchestrator & convenience scripts
│
├── server/                        # Backend REST API
│   ├── config/db.js               # MongoDB Mongoose connection manager
│   ├── models/                    # User (role, isBlocked), Post, Comment, Category, Report
│   ├── controllers/               # Auth, Post, Comment, User, Stats, Admin, and Report controllers
│   ├── routes/                    # Auth, Post, Comment, User, Stats, Admin, and Report routes
│   ├── middleware/                # JWT Auth, adminOnly guard, Centralized Error Handling
│   └── utils/seeder.js            # Realistic database seeder (with Admin & Category seeds)
│
└── client/                        # React 18 SPA (Vite)
    ├── src/
    │   ├── context/               # AuthContext, ThemeContext, ToastContext
    │   ├── services/              # api.js, authService, postService, commentService, adminService, reportService
    │   ├── components/common/     # Navbar, Footer, ThemeToggle, AdminRoute, ProtectedRoute, ReportModal, ConfirmModal
    │   ├── components/blog/       # BlogCard, CategoryBadge, FeaturedPost, SearchFilterBar
    │   ├── components/comments/   # CommentSection, CommentItem, CommentForm
    │   └── pages/
    │       ├── admin/             # AdminLayout, AdminDashboard, AdminUsers, AdminPosts, AdminComments, AdminCategories, AdminReports
    │       └── ...                # Home, BlogDetails, CreatePost, EditPost, Dashboard, MyPosts, Profile, Login, Register, NotFound
    └── vite.config.js             # Vite configuration with API proxy
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas connection URI configured in `server/.env`

### 2. Seed Database
```bash
npm run seed
```

### 3. Run Application
```bash
npm run dev
```
* Backend API: `http://localhost:5000`
* Frontend App: `http://localhost:5173`

---

## 🔑 Pre-Seeded Demo Accounts

| Role | Name | Email | Password | Permissions |
| :--- | :--- | :--- | :--- | :--- |
| 👑 **Administrator** | Chief Administrator | `admin@blogsphere.com` | `password123` | Full Platform & Content Control |
| 👤 **User (Author)** | Alex Rivera | `alex@blogsphere.com` | `password123` | Create, Edit, Comment, Report |
| 👤 **User (Author)** | Elena Rostova | `elena@blogsphere.com` | `password123` | Create, Edit, Comment, Report |
| 👤 **User (Author)** | Marcus Chen | `marcus@blogsphere.com` | `password123` | Create, Edit, Comment, Report |
| 👤 **User (Author)** | Sarah Jenkins | `sarah@blogsphere.com` | `password123` | Create, Edit, Comment, Report |

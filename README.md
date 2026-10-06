# 🌟 BlogSphere — World-Class Full-Stack Blog Platform with Comments

BlogSphere is an enterprise-grade, high-performance, full-stack blogging platform and digital magazine built with **React 18, Vite, Tailwind CSS, Node.js, Express, and MongoDB**.

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

### 1. 🌙 Seamless Dark & Light Mode System
- One-click instant theme toggle (`Sun` / `Moon` animated icons) with system preference detection and `localStorage` persistence.
- Complete dark-theme styling across all cards, modals, tables, navbar, and article typography.

### 2. 🌌 Extraordinary Hero Section
- Animated deep mesh gradient blobs with floating community highlight badges (*100% Open Access*, *Active Creators*, *Zero Paywalls*).
- Dynamic headline with multi-color gradient typography: *"Share Your Ideas With The World."*

### 3. 🛡️ Enterprise Authentication & Ownership Authorization
- **JWT (JSON Web Token)** authentication with 7-day expiration.
- Password hashing with **`bcryptjs`** (salt rounds: 10, excluded from query results via `select: false`).
- Automatic token injection via **Axios Request Interceptors**.
- Strict resource ownership authorization: users can **only** edit/delete their own articles and comments (returns HTTP 403 otherwise).
- **1-Click Instant Demo Accounts** on the Sign In page for rapid reviewer testing.

### 4. 📝 Editorial Publishing & Blog Discovery
- **Full Article CRUD**: Create, Read, Update, and Delete articles with live cover preview and curated presets.
- **Server-Side Search**: Search across titles, content, authors, and category tags.
- **Category Filter Pills Ribbon**: Technology, Programming, AI, Web Development, Education, Career, Lifestyle, and Other.
- **Reading Time Estimation**: Dynamic calculation based on word count.
- **Server-Side Pagination**: Clean page numbering with next/previous controls.
- **Reading Progress Bar**: Interactive top progress bar tracking article scroll depth.
- **Interactive Share & Like Reactions**: Share to X/Twitter, LinkedIn, Copy Link, and heart likes.

### 5. 💬 Interactive Comment Engine
- Post comments on any article with character counter.
- Inline edit and delete capabilities for comment owners.
- Custom styled confirmation modals preventing accidental deletions.
- Guest user prompts encouraging sign-in to join the conversation.

### 6. 📊 Author Analytics & Dashboard
- **SaaS Metric Cards**: Total Articles, Comments Received, Reading Minutes Generated, Comments Written.
- **Publication Management Table**: Direct View, Edit, and Delete action buttons.
- **Recent Audience Feedback**: Live feedback stream on user's stories.

---

## 🛠️ Tech Stack Specification

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Axios, React Router v6
- **Backend**: Node.js, Express.js, JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `cors`, `dotenv`
- **Database**: MongoDB & Mongoose ODM (with compound, full-text indexes and virtual populate)

---

## 📦 Directory Structure

```
Big platform with comments/
├── PRD.md                         # Product Requirements Document
├── TRD.md                         # Technical Requirements Document
├── TDR.md                         # Technical Design Requirements Document
├── README.md                      # Comprehensive Setup & API Reference
├── package.json                   # Root orchestrator & convenience scripts
│
├── server/                        # Backend REST API
│   ├── config/db.js               # MongoDB Mongoose connection manager
│   ├── models/                    # User, Post, Comment Mongoose schemas
│   ├── controllers/               # Auth, Post, Comment, User, and Stats controllers
│   ├── routes/                    # Express REST route definitions
│   ├── middleware/                # JWT Auth, Input Validation, Centralized Error Handling
│   └── utils/seeder.js            # Realistic database seeder
│
└── client/                        # React 18 SPA (Vite)
    ├── src/
    │   ├── context/               # AuthContext, ThemeContext, ToastContext
    │   ├── hooks/                 # useAuth custom hook
    │   ├── services/              # api.js, authService, postService, commentService, userService
    │   ├── components/common/     # Navbar, Footer, ThemeToggle, ReadingProgressBar, BackToTop, Modal, SkeletonLoader
    │   ├── components/blog/       # BlogCard, CategoryBadge, FeaturedPost, SearchFilterBar
    │   ├── components/comments/   # CommentSection, CommentItem, CommentForm
    │   └── pages/                 # Home, BlogDetails, CreatePost, EditPost, Dashboard, MyPosts, Profile, Login, Register, NotFound
    └── vite.config.js             # Vite configuration with API proxy
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Running on `mongodb://127.0.0.1:27017` or configured via `.env`)

### 2. Seed Database
```bash
npm run seed
```

### 3. Start Backend Server (Port 5000)
```bash
npm run server:dev
```

### 4. Start Frontend Client (Port 5173)
```bash
npm run client
```

---

## 🔑 Pre-Seeded Demo Accounts

| Name | Role | Email | Password |
| :--- | :--- | :--- | :--- |
| **Alex Rivera** | Lead Architect | `alex@blogsphere.com` | `password123` |
| **Elena Rostova** | AI Researcher | `elena@blogsphere.com` | `password123` |
| **Marcus Chen** | Senior Frontend | `marcus@blogsphere.com` | `password123` |
| **Sarah Jenkins** | Career Coach | `sarah@blogsphere.com` | `password123` |

# Technical Requirements Document (TRD)

# BlogSphere — Modern Full-Stack Blog Platform with Comments

---

## 1. System Overview & Architecture Goals

**BlogSphere** is an enterprise-grade, full-stack web application designed for content publication and community discussion. The platform implements a modular, three-tier architecture separating presentation, business logic, and data persistence layers.

### 1.1 Architectural Objectives
- **Security & Integrity**: Zero-trust credential handling, hashed passwords with `bcryptjs`, tamper-proof JSON Web Tokens (JWT), and strict resource ownership checks.
- **Scalability**: Indexed database operations, server-side search, category filtering, and server-side cursor/page-based pagination.
- **Maintainability**: Clear separation of concerns utilizing a service layer on the frontend, centralized Express controllers and middleware on the backend, and schema-enforced Mongoose models.
- **Responsiveness & UX**: Responsive layout supporting Mobile, Tablet, and Desktop breakpoints, optimistic UI updates, skeleton loaders, and non-blocking toast notifications.

---

## 2. Technology Stack Specification

```
┌─────────────────────────────────────────────────────────────┐
│                       CLIENT TIER                           │
│  React 18  •  Vite  •  Tailwind CSS  •  React Router DOM    │
│  Lucide Icons  •  Axios Interceptors  •  React Context API  │
└──────────────────────────────┬──────────────────────────────┘
                               │  HTTPS / JSON REST
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                       SERVER TIER                           │
│  Node.js  •  Express.js  •  JWT Auth  •  bcryptjs           │
│  CORS  •  Async Handler  •  Central Error Handler           │
└──────────────────────────────┬──────────────────────────────┘
                               │  Mongoose ODM / TCP
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE TIER                          │
│  MongoDB / MongoDB Atlas (Replica Set / Standalone)         │
│  Indexed Collections: users, posts, comments                │
└─────────────────────────────────────────────────────────────┘
```

### 2.1 Technology Specifications Matrix

| Layer | Technology | Version / Specification | Role / Justification |
| :--- | :--- | :--- | :--- |
| **Frontend Core** | React | `^18.3.1` | Component-driven UI rendering with declarative state management. |
| **Build Tooling** | Vite | `^6.1.0` | Ultra-fast HMR and optimized production bundling. |
| **Routing** | React Router DOM | `^6.28.2` | Client-side routing, protected route wrappers, and navigation guards. |
| **Styling** | Tailwind CSS | `^3.4.17` | Utility-first CSS engine with custom design system extensions. |
| **Icons** | Lucide React | `^0.475.0` | Lightweight, consistent iconography. |
| **HTTP Client** | Axios | `^1.7.9` | Request/response interceptors for automatic JWT injection and unified error normalization. |
| **Backend Runtime**| Node.js | `>=18.0.0` | Event-driven, non-blocking I/O execution environment. |
| **Web Framework** | Express.js | `^4.21.2` | RESTful routing, middleware composition, and controller binding. |
| **Security** | `jsonwebtoken` & `bcryptjs` | `^9.0.2` / `^2.4.3` | Cryptographic password hashing and stateless token-based authorization. |
| **Database & ODM**| MongoDB & Mongoose | `^8.9.5` | Document-oriented persistence with schema validation, virtual populate, and indexing. |

---

## 3. High-Level Architecture & Communication Flows

### 3.1 Three-Layer Architectural Diagram

```
[ Client: Browser / Single Page App ]
                  │
          Axios HTTP Client
                  │  (Bearer <JWT> / JSON Payload)
                  ▼
[ Server: Express API Gateway ]
   ├── CORS / Body Parsing Middleware
   ├── Route Handlers (/api/auth, /api/posts, /api/comments, /api/users)
   ├── Auth Middleware (JWT Verification & User Hydration)
   ├── Ownership Verification Logic (post.author === req.user._id)
   └── Controllers & Async Handlers
                  │
            Mongoose ODM
                  │
                  ▼
[ Database: MongoDB Engine ]
   ├── users (indexed on email)
   ├── posts (indexed on category, createdAt, author, text)
   └── comments (indexed on post, createdAt)
```

### 3.2 Authentication & Authorization Flow

```
[ User Action: Login / Register ]
               │
               ▼
[ Client: POST /api/auth/login ]
               │
               ▼
[ Server: authController.loginUser ]
   ├── 1. Check User in MongoDB by Email (select: '+password')
   ├── 2. Verify Password: bcrypt.compare(input, user.password)
   ├── 3. Generate Signed JWT: jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' })
   └── 4. Return { success: true, data: { user, token } }
               │
               ▼
[ Client: AuthContext ]
   ├── 1. Persist token to localStorage ('blogsphere_token')
   ├── 2. Hydrate global user state
   └── 3. Axios Interceptor automatically attaches:
          'Authorization: Bearer <token>' to all subsequent requests
               │
               ▼
[ Protected Request: PUT/DELETE /api/posts/:id ]
   ├── 1. authMiddleware.protect parses Bearer Token
   ├── 2. jwt.verify validates cryptographic signature
   ├── 3. Attach req.user (sanitized) to Express Request
   ├── 4. Controller verifies ownership:
   │      if (post.author.toString() !== req.user._id.toString()) => 403 Forbidden
   └── 5. Execute DB write & return normalized response
```

---

## 4. Complete Project Directory Structure

```
Big platform with comments/
├── PRD.md                         # Product Requirements Document
├── TRD.md                         # Technical Requirements Document
├── README.md                      # Comprehensive Setup & API Reference
├── package.json                   # Root orchestrator & convenience scripts
├── .gitignore                     # Git exclusion rules
│
├── server/                        # Backend REST API Service
│   ├── package.json               # Server dependencies & scripts
│   ├── server.js                  # Application entry point & middleware wiring
│   ├── .env                       # Local environment variables (ignored by Git)
│   ├── .env.example               # Environment variables template
│   ├── config/
│   │   └── db.js                  # MongoDB Mongoose connection manager
│   ├── models/
│   │   ├── User.js                # User Mongoose model & password hashing hooks
│   │   ├── Post.js                # Blog post model with search indexes & virtuals
│   │   └── Comment.js             # Comment model with post/user relations
│   ├── controllers/
│   │   ├── authController.js      # Registration, login, current user profile
│   │   ├── postController.js      # Blog post CRUD, search, filter, pagination
│   │   ├── commentController.js   # Comment CRUD & ownership enforcement
│   │   └── statsController.js     # Author analytics & dashboard metrics
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth routes
│   │   ├── postRoutes.js          # /api/posts routes
│   │   ├── commentRoutes.js       # /api/comments routes
│   │   └── statsRoutes.js         # /api/stats routes
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification & req.user attachment
│   │   └── errorMiddleware.js     # Centralized error formatter (400/401/403/404/500)
│   └── utils/
│       ├── generateToken.js       # JWT signing utility
│       └── seeder.js              # Database seed script for rapid development
│
└── client/                        # Frontend Single Page Application (SPA)
    ├── package.json               # Client dependencies & scripts
    ├── vite.config.js             # Vite configuration with /api backend proxy
    ├── tailwind.config.js         # Custom Tailwind theme extensions & animations
    ├── postcss.config.js          # PostCSS processor config
    ├── index.html                 # HTML entry point with Google Fonts
    └── src/
        ├── main.jsx               # React DOM bootstrap with providers
        ├── App.jsx                # Layout frame & React Router routes
        ├── index.css              # Custom base styles, typography & glassmorphism
        ├── context/
        │   ├── AuthContext.jsx    # Auth state, login, register, logout, session persistence
        │   └── ToastContext.jsx   # Global non-blocking alert notification provider
        ├── services/
        │   └── api.js             # Configured Axios instance with JWT interceptors
        ├── utils/
        │   ├── constants.js       # Categories, colors, cover presets, demo accounts
        │   └── dateUtils.js       # Relative time and calendar formatting helpers
        ├── components/
        │   ├── common/
        │   │   ├── Navbar.jsx     # Glassmorphism header, search, user dropdown & mobile drawer
        │   │   ├── Footer.jsx     # Comprehensive footer with links and newsletter
        │   │   ├── ConfirmModal.jsx# Reusable destructive action confirmation modal
        │   │   ├── SkeletonLoader.jsx# Shimmer skeleton cards & post detail loaders
        │   │   ├── Pagination.jsx # Page numbering, truncation & prev/next controls
        │   │   └── ProtectedRoute.jsx# Auth guard component redirecting to /login
        │   ├── blog/
        │   │   ├── BlogCard.jsx   # Interactive blog card with category badge & metrics
        │   │   ├── CategoryBadge.jsx# Dynamic category pill component
        │   │   ├── FeaturedPost.jsx# Hero editorial highlight card
        │   │   └── SearchFilterBar.jsx# Category pills ribbon, live search & sort selector
        │   └── comments/
        │       ├── CommentSection.jsx# Live comments container with guest CTA
        │       ├── CommentItem.jsx# Individual comment with inline edit & delete
        │       └── CommentForm.jsx# Interactive comment input with character limits
        └── pages/
            ├── HomePage.jsx       # Hero, featured editorial, search/filter bar & grid
            ├── BlogDetailPage.jsx # Full article reader, author box & comments engine
            ├── CreatePostPage.jsx # Blog post editor with cover preview & presets
            ├── EditPostPage.jsx   # Blog post update editor with ownership guard
            ├── DashboardPage.jsx  # Author statistics cards, post table & feedback stream
            ├── ProfilePage.jsx    # User profile manager, bio, avatar generator & password reset
            ├── LoginPage.jsx      # Login page with 1-click demo account selector
            ├── RegisterPage.jsx   # Registration form with real-time matching indicator
            └── NotFoundPage.jsx   # 404 error page
```

---

## 5. Database Architecture & Schemas

### 5.1 ER Diagram

```
┌─────────────────────────┐            1:N             ┌─────────────────────────┐
│          USER           │ ────────────────────────── │          POST           │
├─────────────────────────┤                            ├─────────────────────────┤
│ _id: ObjectId           │                            │ _id: ObjectId           │
│ name: String            │                            │ title: String           │
│ email: String (Unique)  │                            │ content: String         │
│ password: String        │                            │ category: String        │
│ profileImage: String    │                            │ coverImage: String      │
│ bio: String             │ ──┐                        │ author: ObjectId (User) │
│ createdAt: Date         │   │                        │ authorName: String      │
│ updatedAt: Date         │   │                        │ readTime: Number        │
└─────────────────────────┘   │                        │ createdAt: Date         │
                              │                        │ updatedAt: Date         │
                              │ 1:N                    └────────────┬────────────┘
                              │                                     │
                              │                                     │ 1:N
                              │        ┌─────────────────────────┐  │
                              └──────> │         COMMENT         │ <┘
                                       ├─────────────────────────┤
                                       │ _id: ObjectId           │
                                       │ content: String         │
                                       │ postId: ObjectId (Post) │
                                       │ author: ObjectId (User) │
                                       │ createdAt: Date         │
                                       │ updatedAt: Date         │
                                       └─────────────────────────┘
```

### 5.2 Mongoose Schema Definitions

#### 1. User Schema (`server/models/User.js`)
- `name`: `{ type: String, required: true, trim: true, minlength: 2, maxlength: 50 }`
- `email`: `{ type: String, required: true, unique: true, trim: true, lowercase: true }`
- `password`: `{ type: String, required: true, minlength: 6, select: false }`
- `profileImage`: `{ type: String, default: '' }`
- `bio`: `{ type: String, maxlength: 250, default: '' }`
- `timestamps`: `true`
- **Indexes**: `{ email: 1 }` (unique index).

#### 2. Post Schema (`server/models/Post.js`)
- `title`: `{ type: String, required: true, trim: true, minlength: 5, maxlength: 150 }`
- `content`: `{ type: String, required: true, minlength: 20 }`
- `category`: `{ type: String, required: true, enum: ['Technology', 'Programming', 'AI', 'Web Development', 'Education', 'Career', 'Lifestyle', 'Other'], default: 'Technology' }`
- `coverImage`: `{ type: String, default: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80' }`
- `author`: `{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }`
- `authorName`: `{ type: String, required: true }`
- `readTime`: `{ type: Number, default: 3 }`
- `timestamps`: `true`
- **Virtuals**: `commentsCount` (virtual count referencing `Comment.postId`).
- **Indexes**:
  - `{ title: 'text', content: 'text', category: 'text' }` (Full-text index)
  - `{ category: 1, createdAt: -1 }` (Category feed optimization)
  - `{ author: 1, createdAt: -1 }` (Author dashboard optimization)

#### 3. Comment Schema (`server/models/Comment.js`)
- `content`: `{ type: String, required: true, trim: true, minlength: 1, maxlength: 1000 }`
- `postId`: `{ type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true, index: true }`
- `author`: `{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }`
- `timestamps`: `true`
- **Indexes**: `{ postId: 1, createdAt: -1 }`, `{ author: 1 }`.

---

## 6. REST API Architecture & Protocol

### 6.1 Standard JSON Response Envelopes

#### Success Envelope (HTTP 200 / 201)
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

#### Error Envelope (HTTP 400 / 401 / 403 / 404 / 500)
```json
{
  "success": false,
  "message": "User-friendly description of the error",
  "stack": null
}
```

### 6.2 Complete REST API Contract

| HTTP Method | Route | Access | Request Body | Response Description |
| :--- | :--- | :---: | :--- | :--- |
| **GET** | `/api/health` | Public | None | Server health and timestamp |
| **POST** | `/api/auth/register` | Public | `{ name, email, password, profileImage, bio }` | Created user profile and JWT |
| **POST** | `/api/auth/login` | Public | `{ email, password }` | Authenticated user profile and JWT |
| **GET** | `/api/auth/me` | Protected | None | Authenticated user profile |
| **PUT** | `/api/auth/profile` | Protected | `{ name, bio, profileImage, password? }` | Updated profile data |
| **GET** | `/api/posts` | Public | Query: `?page=1&limit=9&category=Tech&search=react&sort=newest` | Paginated post array + meta |
| **GET** | `/api/posts/:id` | Public | None | Single post object with populated author |
| **POST** | `/api/posts` | Protected | `{ title, content, category, coverImage }` | Created post object |
| **PUT** | `/api/posts/:id` | Protected | `{ title?, content?, category?, coverImage? }` | Updated post object (Owner only) |
| **DELETE**| `/api/posts/:id` | Protected | None | Deletes post & associated comments |
| **GET** | `/api/posts/user/me` | Protected | None | Array of all posts created by authenticated user |
| **GET** | `/api/posts/:postId/comments` | Public | None | Array of comments for post with populated author |
| **POST** | `/api/posts/:postId/comments` | Protected | `{ content }` | Created comment with author |
| **PUT** | `/api/comments/:id` | Protected | `{ content }` | Updated comment object (Owner only) |
| **DELETE**| `/api/comments/:id` | Protected | None | Deletes comment (Owner only) |
| **GET** | `/api/stats/user` | Protected | None | Total posts, comments received, reading time |

---

## 7. Security, Authorization & Error Handling

### 7.1 Security Implementation Matrix

1. **Password Security**:
   - `pre('save')` hook hashes raw passwords with `bcryptjs` using a minimum salt factor of 10.
   - `password` schema field marked with `select: false` to ensure password hashes are omitted by default in all Mongoose queries.
2. **Stateless JWT Authorization**:
   - Tokens signed using `HMAC SHA256` with `process.env.JWT_SECRET`.
   - Client sends token as HTTP header `Authorization: Bearer <token>`.
   - `authMiddleware.protect` extracts token, verifies signature, and populates `req.user`.
3. **Resource Ownership Authorization Enforcement**:
   ```javascript
   // Post Ownership Validation
   if (post.author.toString() !== req.user._id.toString()) {
     return res.status(403).json({
       success: false,
       message: 'Unauthorized: You are not allowed to modify another author’s post'
     });
   }
   ```
4. **Environment Isolation**:
   - Server configurations (`PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRE`) reside exclusively in server-side `.env`.
   - Secrets are excluded from version control via `.gitignore`. A sanitized `.env.example` is maintained.

### 7.2 Centralized Error Handling Hierarchy

The Express error pipeline captures and transforms all system exceptions:
- **`CastError` (Invalid ObjectId)**: Maps to `404 Not Found` with a message that the resource identifier is malformed.
- **`11000` (Mongoose Duplicate Key)**: Maps to `400 Bad Request` informing that an account with that email already exists.
- **`ValidationError` (Mongoose Schema)**: Maps to `400 Bad Request` aggregating individual field validation messages.
- **`JsonWebTokenError` / `TokenExpiredError`**: Maps to `401 Unauthorized`.
- **General Exceptions**: Maps to `500 Internal Server Error`, hiding internal stack traces in production environments.

---

## 8. Frontend Engineering & State Architecture

### 8.1 State Architecture (Context Layer)

- **`AuthContext` (`client/src/context/AuthContext.jsx`)**:
  - Global properties: `user`, `token`, `loading`, `isAuthenticated`.
  - Global methods: `login(email, password)`, `register(userData)`, `logout()`, `updateProfile(data)`.
  - Synchronizes with `localStorage` for session persistence across page refreshes.
- **`ToastContext` (`client/src/context/ToastContext.jsx`)**:
  - Global methods: `toastSuccess(msg)`, `toastError(msg)`, `toastInfo(msg)`.
  - Self-dismissing toast notifications rendered fixed in the viewport bottom-right corner.

### 8.2 Route Structure & Route Guards

```
/ (HomePage)                   [Public]
├── /posts/:id (BlogDetailPage) [Public]
├── /login (LoginPage)         [Public - Guest only]
├── /register (RegisterPage)   [Public - Guest only]
│
├── ProtectedRoute Guard:
│   ├── /dashboard (DashboardPage)
│   ├── /create-post (CreatePostPage)
│   ├── /edit-post/:id (EditPostPage)
│   └── /profile (ProfilePage)
│
└── * (NotFoundPage 404)       [Public]
```

### 8.3 Axios Configuration & Global Interceptor (`client/src/services/api.js`)

```javascript
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

// Automatic Bearer Token Injection
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('blogsphere_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

---

## 9. Performance & Query Optimization

1. **Server-Side Pagination**:
   - `limit` (default 9 posts per page) and `page` parameters calculate `skip = (page - 1) * limit`.
   - Prevents memory exhaustion when database scales to thousands of articles.
2. **Selective Field Projection & Population**:
   - Post feeds populate only necessary author metadata (`name`, `email`, `profileImage`, `bio`).
3. **Compound & Full-Text Search Indexes**:
   - MongoDB text index `{ title: 'text', content: 'text', category: 'text' }` ensures search queries resolve within milliseconds.
4. **Asset Optimization**:
   - Remote Unsplash and DiceBear images loaded lazily.
   - Production Vite bundle minified and chunked with tree shaking.

---

## 10. Technical Acceptance & Verification Checklist

| Area | Criteria | Verified |
| :--- | :--- | :---: |
| **Database** | MongoDB connects successfully and creates `users`, `posts`, `comments` collections | ✅ |
| **Auth** | Password hashing with `bcryptjs` (salt 10) & JWT creation | ✅ |
| **Auth** | Protected route guard redirects unauthenticated users to `/login` | ✅ |
| **Blog CRUD** | Create, Read, Update, and Delete blog posts functional | ✅ |
| **Comment CRUD**| Create, Read, Inline Update, and Delete comments functional | ✅ |
| **Authorization** | Strict check: Users cannot edit or delete posts/comments owned by others | ✅ |
| **Search & Filter**| Real-time keyword search, category pills, and sort orders active | ✅ |
| **Dashboard** | Accurate author stats (total posts, comments received, reading time) | ✅ |
| **Responsive UI** | Mobile navigation drawer, responsive grids (1 / 2 / 3 cols), accessible inputs | ✅ |
| **Build & Deploy** | `vite build` generates production bundle with 0 errors | ✅ |

---

## 11. Maintenance & Extension Guidelines

- **Image Upload Integration**:
  - The `coverImage` and `profileImage` fields currently accept image URLs (and pre-configured presets). To introduce direct file upload, install `multer` and `cloudinary` / `aws-sdk`, add an upload route `POST /api/upload`, and pass the returned CDN URL to existing post and profile endpoints.
- **Likes & Bookmarks Feature**:
  - Extend `Post` schema with `likes: [{ type: ObjectId, ref: 'User' }]` and add endpoint `PUT /api/posts/:id/like`.
- **Rich Text / Markdown Extension**:
  - The frontend currently parses markdown/structured text cleanly. A markdown renderer like `react-markdown` or `@tiptap/react` can be plugged in without database schema changes.

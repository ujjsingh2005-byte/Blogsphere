# Product Requirements Document (PRD)

# BlogSphere — Modern Full-Stack Blog Platform with Comments

---

## 1. Executive Summary & Vision

**BlogSphere** is a modern, responsive, full-stack blogging and publishing platform engineered for content creators, readers, and tech enthusiasts. It bridges the gap between clean editorial publishing and engaging community discussions by offering rich post creation, category filtering, search, and a nested/interactive commenting engine.

The platform is designed with a **colorful, professional, accessible, and responsive UI** backed by a robust, secure **Node.js/Express REST API** and **MongoDB (Mongoose)** database.

### 🌐 Live Production Deployments & Links
- **Production Web Application (Vercel)**: [https://blogsphere-rust-sigma.vercel.app/](https://blogsphere-rust-sigma.vercel.app/)
- **Production REST API (Render)**: [https://blogsphere-ppxu.onrender.com](https://blogsphere-ppxu.onrender.com)
- **Source Code (GitHub)**: [https://github.com/ujjsingh2005-byte/Blogsphere.git](https://github.com/ujjsingh2005-byte/Blogsphere.git)

---

## 2. Core User Roles & Role-Based Access Control (RBAC)

### 2.1 User Roles Breakdown

1. **Guest (Unauthenticated User)**
   - View Homepage, Hero Banner, Featured Posts, Latest Posts.
   - Browse and filter posts by Category.
   - Search posts by title, content, author, and tags.
   - Read full blog post content and comments.
   - *Restrictions*: Cannot create, edit, or delete posts; cannot post comments; prompted to sign in for interactive actions.

2. **👤 Authenticated User (Writer, Reader & Commenter)**
   - Inherits all Guest capabilities.
   - **Post Management**: Create new blog posts, edit own posts, delete own posts.
   - **Comment Management**: Post comments on any story, edit own comments, delete own comments.
   - **Community Moderation**: Submit content/user reports (Spam, Harassment, Hate Speech, etc.).
   - **Personal Dashboard**: View personal publishing statistics, total comments received, total read time.
   - **Profile Management**: Update profile image/avatar, full name, bio, and credentials.
   - *Restrictions*: Cannot edit/delete content created by other users; cannot access Admin Command Center.

3. **👑 Administrator (Platform Overseer & Content Moderator)**
   - Inherits all Authenticated User capabilities.
   - **Admin Command Center (`/admin`)**: Real-time platform KPI metrics (Total Users, Active vs Suspended, Posts, Comments, Reports).
   - **User Management**: Search user directory, toggle suspension/block status, promote/demote user roles, delete accounts.
   - **Post Moderation**: Override edit or delete any blog post across the platform to enforce guidelines.
   - **Comment Moderation**: Review all platform comments and remove inappropriate or offending discussions.
   - **Dynamic Category Management**: Create, edit, and delete platform categories with live post distribution counts.
   - **Reports & Safety Queue**: Process user-submitted violation reports, mark status (Resolved/Dismissed), and record admin notes.

### 2.2 Permissions Matrix: 👤 User vs 👑 Admin

| Feature / Action | 🌐 Guest | 👤 User (Normal) | 👑 Admin (Platform Overseer) |
| :--- | :---: | :---: | :---: |
| **Register & Login** | ✅ | ✅ | ✅ |
| **Browse & Search Posts** | ✅ | ✅ | ✅ |
| **Read Full Articles & Comments** | ✅ | ✅ | ✅ |
| **Create Blog Post** | ❌ | ✅ | ✅ |
| **Edit Own Blog Post** | ❌ | ✅ | ✅ |
| **Delete Own Blog Post** | ❌ | ✅ | ✅ |
| **Edit Another User's Blog** | ❌ | ❌ | ✅ *(Admin Override)* |
| **Delete Another User's Blog** | ❌ | ❌ | ✅ *(Admin Override)* |
| **Post Comment** | ❌ | ✅ | ✅ |
| **Edit Own Comment** | ❌ | ✅ | ✅ |
| **Delete Own Comment** | ❌ | ✅ | ✅ |
| **Delete Another User's Comment** | ❌ | ❌ | ✅ *(Admin Override)* |
| **Submit Content Report** | ❌ | ✅ | ✅ |
| **Access Admin Command Center (`/admin`)** | ❌ | ❌ | ✅ |
| **View Platform Analytics & Metrics** | ❌ | ❌ | ✅ |
| **Suspend / Block / Unblock Users** | ❌ | ❌ | ✅ |
| **Manage User Roles (User ↔ Admin)** | ❌ | ❌ | ✅ |
| **Manage Categories (Create/Edit/Delete)** | ❌ | ❌ | ✅ |
| **Resolve / Dismiss Abuse Reports** | ❌ | ❌ | ✅ |

---

## 3. Technology Stack & Architecture

### 3.1 Architecture Overview

```
[ Client: React + Vite / Tailwind CSS ]
                  │
          HTTPS / JSON (REST API)
                  │
                  ▼
[ Backend: Node.js + Express.js ]
   ├── JWT Auth Middleware
   ├── Input Validation & Sanitization
   ├── Error Handling Middleware
   └── Controllers & Business Logic
                  │
             Mongoose ODM
                  │
                  ▼
         [ MongoDB Database ]
   ├── Users Collection
   ├── Posts Collection
   └── Comments Collection
```

### 3.2 Stack Details

- **Frontend**:
  - **Framework**: React 18 (Vite SPA)
  - **Styling**: Tailwind CSS, Lucide React (Icons), Canvas Confetti / Transitions
  - **State & Routing**: React Router v6, React Context API (AuthContext, Theme/ToastContext)
  - **HTTP Client**: Axios (with global interceptors for Bearer Token injection and auto 401 handling)
  - **Notifications**: Custom Rich Toast System / React Hot Toast

- **Backend**:
  - **Runtime**: Node.js (ES Modules / CommonJS)
  - **Framework**: Express.js
  - **Authentication**: JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
  - **Security**: `cors`, `helmet`, input sanitization, express rate limiting
  - **Validation**: Schema-based validation (Mongoose + custom controller validation)

- **Database**:
  - **Database**: MongoDB (Local or Atlas)
  - **ODM**: Mongoose with index optimization and virtual populate

---

## 4. Database Schema & Data Models

### 4.1 User Schema (`User.js`)

```javascript
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false // Excluded by default in queries for security
    },
    profileImage: {
      type: String,
      default: '' // Fallback to UI generated avatar if empty
    },
    bio: {
      type: String,
      maxlength: [250, 'Bio cannot exceed 250 characters'],
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Indexes
userSchema.index({ email: 1 });
```

### 4.2 Blog Post Schema (`Post.js`)

```javascript
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog post title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters long'],
      maxlength: [150, 'Title cannot exceed 150 characters']
    },
    content: {
      type: String,
      required: [true, 'Blog post content is required'],
      minlength: [20, 'Content must be at least 20 characters long']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Technology',
        'Programming',
        'AI',
        'Web Development',
        'Education',
        'Career',
        'Lifestyle',
        'Other'
      ],
      default: 'Technology'
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80'
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    authorName: {
      type: String,
      required: true
    },
    readTime: {
      type: Number,
      default: 3 // Estimated minutes
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for Comments count
postSchema.virtual('commentsCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'postId',
  count: true
});

// Compound Index for Search & Fast Sorting
postSchema.index({ title: 'text', content: 'text', category: 'text' });
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ author: 1, createdAt: -1 });
```

### 4.3 Comment Schema (`Comment.js`)

```javascript
const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Comment text cannot be empty'],
      trim: true,
      minlength: [1, 'Comment must contain at least 1 character'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
      index: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes
commentSchema.index({ postId: 1, createdAt: -1 });
commentSchema.index({ author: 1 });
```

---

## 5. Authentication & Authorization

### 5.1 Registration & Login Flow
- **Registration**:
  - Validation: Full Name (required), Email (valid & unique), Password (min 6 chars), Confirm Password (matches password).
  - Password hashed using `bcryptjs` (salt rounds: 10).
  - Returns JWT token and sanitized user profile upon successful registration.
- **Login**:
  - Validates email format and existence.
  - Compares submitted password against hashed password with `bcrypt.compare`.
  - On success, issues a signed JWT containing `{ id: user._id }` with a 7-day expiration.
- **Session Persistence**:
  - JWT and user object stored in `localStorage`.
  - Frontend auto-hydrates `AuthContext` on reload and attaches `Authorization: Bearer <token>` header to all Axios requests.
- **Logout**:
  - Clears `localStorage` and resets client-side auth state.

### 5.2 Middleware Architecture

1. **`protect` Middleware**:
   - Extracts Bearer token from `req.headers.authorization`.
   - Verifies token signature using `process.env.JWT_SECRET`.
   - Attaches `req.user` (excluding password) to request.
   - Responds with `401 Unauthorized` if token is invalid or missing.

2. **Resource Ownership Verification**:
   - **Posts**: Edit/Delete checks `post.author.toString() === req.user._id.toString()`.
   - **Comments**: Edit/Delete checks `comment.author.toString() === req.user._id.toString()`.
   - Responds with `403 Forbidden` if user is not the owner.

---

## 6. REST API Specification

All responses adhere to a consistent JSON envelope:

**Standard Success Response:**
```json
{
  "success": true,
  "message": "Action completed successfully",
  "data": {}
}
```

**Standard Error Response:**
```json
{
  "success": false,
  "message": "Detailed error message",
  "errors": []
}
```

### 6.1 Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/auth/register` | Public | Register new user (Name, Email, Password) |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Protected | Fetch current authenticated user's profile |
| `PUT` | `/api/auth/profile` | Protected | Update profile (Name, Bio, Profile Image) |

### 6.2 Blog Posts Endpoints (`/api/posts`)

| Method | Endpoint | Access | Query Parameters / Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/posts` | Public | `page`, `limit`, `category`, `search`, `sort` (`newest`, `oldest`) |
| `GET` | `/api/posts/:id` | Public | Get single blog post by ID with populated author |
| `POST` | `/api/posts` | Protected | Create a new blog post (Title, Content, Category, Cover Image) |
| `PUT` | `/api/posts/:id` | Protected | Update blog post (Owner only) |
| `DELETE` | `/api/posts/:id` | Protected | Delete blog post and its associated comments (Owner only) |
| `GET` | `/api/posts/user/me` | Protected | Get all posts created by the authenticated user |

### 6.3 Comments Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/posts/:postId/comments` | Public | Fetch all comments for a post (with populated author) |
| `POST` | `/api/posts/:postId/comments` | Protected | Add a new comment to a post |
| `PUT` | `/api/comments/:id` | Protected | Update comment content (Owner only) |
| `DELETE` | `/api/comments/:id` | Protected | Delete comment (Owner only) |

### 6.4 Dashboard & Stats Endpoints (`/api/stats`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/stats/user` | Protected | Aggregated stats: total posts by user, total comments received, recent activity |

---

## 7. Frontend User Interface & UX Design

### 7.1 Design Philosophy & Visual Palette

- **Vibe**: Clean, modern, editorial yet vibrant and interactive.
- **Color Palette**:
  - **Primary**: Indigo/Violet Gradient (`#6366F1` to `#8B5CF6`)
  - **Secondary / Accent**: Emerald (`#10B981`), Amber/Orange (`#F59E0B`), Rose (`#F43F5E`)
  - **Background**: Soft slate canvas (`#F8FAFC` for light, `#0F172A` for dark)
  - **Card Surfaces**: Clean pure white `#FFFFFF` with soft ambient drop shadows (`shadow-sm`, `hover:shadow-xl` transition)
  - **Category Color Badges**:
    - *Technology*: Sky Blue (`bg-sky-100 text-sky-700`)
    - *Programming*: Indigo (`bg-indigo-100 text-indigo-700`)
    - *AI*: Purple (`bg-purple-100 text-purple-700`)
    - *Web Development*: Emerald (`bg-emerald-100 text-emerald-700`)
    - *Education*: Amber (`bg-amber-100 text-amber-700`)
    - *Career*: Blue (`bg-blue-100 text-blue-700`)
    - *Lifestyle*: Rose (`bg-rose-100 text-rose-700`)
    - *Other*: Slate (`bg-slate-100 text-slate-700`)

### 7.2 Core Pages & Views

1. **Navigation Bar**:
   - Dynamic sticky glassmorphism header (`backdrop-blur-md bg-white/90`).
   - Logo with glowing gradient badge ("BlogSphere").
   - Search quick-trigger, Category dropdown, and Nav links (Home, Explore, Dashboard).
   - Authenticated state: "Write" button (`+ New Post`), User avatar dropdown (Dashboard, Profile, Logout).
   - Unauthenticated state: "Log In" (clean ghost button) and "Sign Up" (gradient CTA).
   - Mobile responsive drawer with hamburger toggle.

2. **Homepage**:
   - **Hero Section**:
     - Headline: *"Share Your Ideas With The World"*
     - Subtitle: *"Write. Share. Connect."*
     - CTAs: `Start Writing` (opens post editor if logged in, otherwise auth modal) & `Explore Blogs` (smooth scrolls to feed).
     - Live floating stats badge (e.g., active authors, published stories).
   - **Category Pills Ribbon**: Horizontally scrollable filter pills with active indicator.
   - **Search & Sort Bar**: Real-time debounce search input + sort dropdown (Newest First, Oldest First).
   - **Featured Post Hero Card**: Large visual highlight of the top/newest blog.
   - **Blog Grid**: 3-column responsive grid of interactive cards featuring cover image, category tag, title, 2-line snippet, author avatar, date, and read time.
   - **Pagination Controls**: `Previous | 1 | 2 | 3 ... | Next` with animated page switching.
   - **Footer**: Newsletter subscription box, site map links, copyright, tech stack credits.

3. **Blog Details Page**:
   - Large hero cover image with subtle overlay.
   - Category badge, formatted title, publication date, read time estimation.
   - Author info card with avatar, bio, and post count.
   - Post action buttons (Edit, Delete) visible **only** if current user is author.
   - Rich rendered blog body with styled typography (headings, blockquotes, code blocks, lists).
   - **Interactive Comment Section**:
     - Comment count header.
     - Comment submission box (for authenticated users) with avatar and character counter.
     - Login prompt card for guest users.
     - Comment list with user avatar, name, relative timestamp ("2 hours ago"), content.
     - Inline edit and delete modal for comment owners.

4. **User Dashboard (`/dashboard`)**:
   - Welcome banner with personalized greeting and quick stats.
   - **Stats Cards**:
     - Total Posts Created (with percentage / progress visual).
     - Total Comments Received.
     - Estimated Total Reading Time generated.
   - **Action Bar**: `Create New Post` primary button, filter own posts.
   - **My Posts Table / Card Grid**:
     - View, Edit, and Delete action buttons for each post.
     - Quick status tags.
   - **Recent Activity Feed**: Summary of latest comments posted on user's blogs.

5. **Post Editor (`/create-post` & `/edit-post/:id`)**:
   - Clean distraction-free editor interface.
   - Live Cover Image preview & instant Unsplash randomizer/custom URL input.
   - Category picker with colorful badges.
   - Rich Markdown / formatted content area with real-time word counter and estimated reading time.
   - Submit buttons with spinner loading states.

6. **User Profile (`/profile`)**:
   - Avatar preview & URL updater / preset avatar picker.
   - Full Name and Bio input fields.
   - Account overview (email, member since date).
   - Password update section.

7. **Auth Modals / Pages (`/login` & `/register`)**:
   - Modern split-layout or centered card with gradient accents.
   - Form fields with real-time client validation and inline error hints.
   - Toggle password visibility button (eye icon).
   - One-click demo credentials fill button (for instant recruiter/reviewer testing).

### 7.3 UX Micro-interactions & States

- **Loading States**: Shimmer skeleton cards for blog list and detail views; animated spin icons on submit buttons.
- **Empty States**: Illustrated empty graphics with helpful call-to-action (e.g. "No blogs found matching your search. Try another query or create your own!").
- **Destructive Action Confirmation**: Custom styled modal before deleting any post or comment ("Are you sure you want to delete this post? This action cannot be undone.").
- **Toast Notifications**: Toast alerts for login success, post published, post updated, comment posted, and error alerts.

---

## 8. Security & Error Handling Guidelines

1. **Authentication Security**:
   - Passwords never returned in queries (`select: false`).
   - Passwords hashed with `bcryptjs` (cost factor 10).
   - Tokens signed with cryptographically secure secret (`JWT_SECRET`).

2. **Authorization Enforcement**:
   - Database lookup verification in update/delete controllers to ensure ownership matches `req.user._id`.

3. **Input Validation & Sanitization**:
   - Email format checking with regex.
   - String trimming and HTML tag escaping on comment and title fields.
   - Mongoose validation error parser converting internal errors into friendly user messages.

4. **Environment Variables**:
   - Managed via `.env` with a supplied `.env.example` template:
     ```env
     PORT=5000
     NODE_ENV=development
     MONGODB_URI=mongodb://localhost:27017/blogsphere
     JWT_SECRET=your_super_secret_jwt_key_here_blogsphere_2026
     JWT_EXPIRE=7d
     CLIENT_URL=http://localhost:5173
     ```

---

## 9. Complete Project File Structure

```
Big platform with comments/
├── PRD.md
├── .env.example
├── .gitignore
├── README.md
│
├── server/
│   ├── package.json
│   ├── .env.example
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Comment.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── postController.js
│   │   ├── commentController.js
│   │   └── statsController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── postRoutes.js
│   │   ├── commentRoutes.js
│   │   └── statsRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   └── utils/
│       ├── generateToken.js
│       └── seeder.js
│
└── client/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── context/
        │   ├── AuthContext.jsx
        │   └── ToastContext.jsx
        ├── services/
        │   └── api.js
        ├── components/
        │   ├── common/
        │   │   ├── Navbar.jsx
        │   │   ├── Footer.jsx
        │   │   ├── Modal.jsx
        │   │   ├── ConfirmDialog.jsx
        │   │   ├── Toast.jsx
        │   │   ├── SkeletonCard.jsx
        │   │   ├── Pagination.jsx
        │   │   └── ProtectedRoute.jsx
        │   ├── blog/
        │   │   ├── BlogCard.jsx
        │   │   ├── BlogGrid.jsx
        │   │   ├── CategoryBadge.jsx
        │   │   ├── SearchFilterBar.jsx
        │   │   └── FeaturedPost.jsx
        │   └── comments/
        │       ├── CommentSection.jsx
        │       ├── CommentItem.jsx
        │       └── CommentForm.jsx
        ├── pages/
        │   ├── HomePage.jsx
        │   ├── BlogDetailPage.jsx
        │   ├── CreatePostPage.jsx
        │   ├── EditPostPage.jsx
        │   ├── DashboardPage.jsx
        │   ├── ProfilePage.jsx
        │   ├── LoginPage.jsx
        │   ├── RegisterPage.jsx
        │   └── NotFoundPage.jsx
        └── utils/
            ├── dateUtils.js
            └── helpers.js
```

---

## 10. Quality & Verification Checklist

- [x] Complete PRD specifications documented
- [ ] Backend Server & MongoDB connection configured
- [ ] User, Post, and Comment Mongoose models with indexes created
- [ ] JWT Authentication & bcrypt password hashing implemented
- [ ] Protected routes & resource ownership authorization implemented
- [ ] REST API CRUD endpoints for Posts, Comments, and User profiles built
- [ ] React frontend with Vite & Tailwind CSS initialized
- [ ] AuthContext & global Axios interceptors configured
- [ ] Home page with Search, Categories, Featured Post, and Pagination built
- [ ] Blog Details page with full content and live Commenting engine built
- [ ] Create & Edit Post forms with live cover preview built
- [ ] User Dashboard with stats and my-posts management built
- [ ] User Profile settings built
- [ ] Confirmation modals for delete operations created
- [ ] Toast notification system & loading skeletons implemented
- [ ] End-to-end integration verified

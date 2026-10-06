# Technical Design Requirements (TDR)

# BlogSphere — Modern Full-Stack Blog Platform with Comments

---

## 1. System Design & Architectural Overview

**BlogSphere** is built upon a strict **Layered (N-Tier) Full-Stack Architecture** where every boundary—Presentation, Gateway Routing, Validation, Business Logic / Services, Data Access (ODM), and Persistence—is modular and decoupled.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           PRESENTATION TIER                             │
│     React 18 SPA (Vite)  •  Tailwind CSS  •  Lucide Icons  •  Contexts   │
│     Pages (Home, Details, Create, Edit, Dashboard, Profile, Auth)       │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                               Axios Service Layer
                          (BaseURL / JWT Interceptor)
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           APPLICATION GATEWAY                           │
│     Express REST Router  •  CORS  •  JSON Parser  •  Route Mapping       │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                        Validation & Auth Middleware
                        (JWT Verify / Payload Check)
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           CONTROLLER LAYER                              │
│     authController  •  postController  •  commentController             │
│     userController  •  statsController                                 │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                             Service Layer
                      (Business Logic & Ownership)
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           DATA ACCESS LAYER                             │
│     Mongoose Models (User, Post, Comment)  •  Validation Hooks         │
│     Compound / Full-Text Indexes  •  Virtual Population                 │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                              TCP / TLS Wire
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           PERSISTENCE TIER                              │
│     MongoDB / MongoDB Atlas (Replica Set)                              │
│     Collections: users, posts, comments                                 │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Complete Application Structure

```
Big platform with comments/
├── PRD.md                         # Product Requirements Document
├── TRD.md                         # Technical Requirements Document
├── TDR.md                         # Technical Design Requirements Document
├── README.md                      # Comprehensive Setup & API Reference
├── package.json                   # Root orchestrator & convenience scripts
├── .gitignore                     # Git exclusion rules
│
├── server/                        # Backend REST API Service
│   ├── package.json               # Server dependencies & scripts
│   ├── server.js                  # Application bootstrap & middleware mounting
│   ├── .env                       # Local environment variables
│   ├── .env.example               # Environment variables template
│   ├── config/
│   │   └── db.js                  # MongoDB Mongoose connection manager
│   ├── models/
│   │   ├── User.js                # User Mongoose schema, validation & hooks
│   │   ├── Post.js                # Blog post schema with text index & virtuals
│   │   └── Comment.js             # Comment schema with post/user relations
│   ├── controllers/
│   │   ├── authController.js      # Auth request handlers (register, login, me)
│   │   ├── postController.js      # Post CRUD, search, filter, pagination
│   │   ├── commentController.js   # Comment CRUD & ownership enforcement
│   │   ├── userController.js      # Profile update and retrieval
│   │   └── statsController.js     # Author analytics & dashboard metrics
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth
│   │   ├── postRoutes.js          # /api/posts
│   │   ├── commentRoutes.js       # /api/comments
│   │   ├── userRoutes.js          # /api/users
│   │   └── statsRoutes.js         # /api/stats
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT extraction, verification & req.user hydration
│   │   ├── validationMiddleware.js# Input validation rules for requests
│   │   └── errorMiddleware.js     # Centralized error formatter (400/401/403/404/500)
│   └── utils/
│       ├── generateToken.js       # JWT signing helper
│       ├── asyncHandler.js        # Async exception wrapper
│       └── seeder.js              # Database seeder with realistic demo data
│
└── client/                        # Frontend Single Page Application (SPA)
    ├── package.json               # Client dependencies & scripts
    ├── vite.config.js             # Vite configuration with /api backend proxy
    ├── tailwind.config.js         # Custom Tailwind theme extensions & animations
    ├── postcss.config.js          # PostCSS processor config
    ├── index.html                 # HTML entry point with Google Fonts
    └── src/
        ├── main.jsx               # React DOM bootstrap with providers
        ├── App.jsx                # Layout frame & React Router routing table
        ├── index.css              # Custom base styles, typography & glassmorphism
        ├── context/
        │   ├── AuthContext.jsx    # Auth state, login, register, logout, session persistence
        │   └── ToastContext.jsx   # Global non-blocking alert notification provider
        ├── hooks/
        │   └── useAuth.js         # Reusable authentication custom hook
        ├── services/
        │   ├── api.js             # Configured Axios instance with JWT interceptors
        │   ├── authService.js     # Auth API service methods
        │   ├── postService.js     # Post API service methods
        │   ├── commentService.js  # Comment API service methods
        │   └── userService.js     # User profile API service methods
        ├── utils/
        │   ├── constants.js       # Categories, colors, cover presets, demo accounts
        │   ├── dateUtils.js       # Relative time and calendar formatting helpers
        │   ├── validation.js      # Client-side input validation helpers
        │   └── helpers.js         # Reading time calculation, string truncation
        ├── components/
        │   ├── common/
        │   │   ├── Navbar.jsx     # Glassmorphism header, search, user dropdown & mobile drawer
        │   │   ├── Footer.jsx     # Comprehensive footer with links and newsletter
        │   │   ├── ConfirmModal.jsx# Reusable destructive action confirmation modal
        │   │   ├── Modal.jsx      # Generic modal container
        │   │   ├── Loading.jsx    # Standard spinner component
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
        │       ├── CommentCard.jsx# Re-export / alias for CommentItem
        │       └── CommentForm.jsx# Interactive comment input with character limits
        └── pages/
            ├── HomePage.jsx       # Hero, featured editorial, search/filter bar & grid
            ├── BlogDetailPage.jsx # Full article reader, author box & comments engine
            ├── CreatePostPage.jsx # Blog post editor with cover preview & presets
            ├── EditPostPage.jsx   # Blog post update editor with ownership guard
            ├── DashboardPage.jsx  # Author statistics cards, post table & feedback stream
            ├── MyPosts.jsx        # Dedicated my published articles management view
            ├── ProfilePage.jsx    # User profile manager, bio, avatar generator & password reset
            ├── LoginPage.jsx      # Login page with 1-click demo account selector
            ├── RegisterPage.jsx   # Registration form with real-time matching indicator
            └── NotFoundPage.jsx   # 404 error page
```

---

## 3. Database Design & Relational Models

### 3.1 Mongoose Schemas & Schema Rules

#### 1. User Model (`User.js`)
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
      required: [true, 'Please provide an email address'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false // Never exposed in queries by default
    },
    profileImage: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      maxlength: [250, 'Bio cannot exceed 250 characters'],
      default: ''
    }
  },
  { timestamps: true }
);

// Indexes
userSchema.index({ email: 1 });
```

#### 2. Post Model (`Post.js`)
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
      enum: ['Technology', 'Programming', 'AI', 'Web Development', 'Education', 'Career', 'Lifestyle', 'Other'],
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
      default: 3
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual Relationship for Comments
postSchema.virtual('commentsCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'postId',
  count: true
});

// Indexes for Search & Filter
postSchema.index({ title: 'text', content: 'text', category: 'text' });
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ author: 1, createdAt: -1 });
```

#### 3. Comment Model (`Comment.js`)
```javascript
const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Comment content cannot be empty'],
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
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

commentSchema.index({ postId: 1, createdAt: -1 });
commentSchema.index({ author: 1 });
```

### 3.2 Controlled Cascade Cleanup

When an article is deleted (`DELETE /api/posts/:id`), the controller executes a controlled deletion of all child comments:

```javascript
// Delete associated comments
await Comment.deleteMany({ postId: post._id });

// Delete post document
await post.deleteOne();
```

---

## 4. Authentication, JWT & Authorization Design

### 4.1 Authentication Sequence

```
User -> Form Submit -> authService.login(email, password)
  -> POST /api/auth/login
  -> User.findOne({ email }).select('+password')
  -> bcrypt.compare(enteredPassword, user.password)
  -> jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' })
  -> Response: { success: true, message, data: { user, token } }
  -> Client saves token in localStorage ('blogsphere_token')
```

### 4.2 Auth Middleware (`authMiddleware.js`)

1. Reads header `Authorization: Bearer <token>`.
2. Verifies cryptographic signature with `process.env.JWT_SECRET`.
3. Hydrates `req.user = await User.findById(decoded.id).select('-password')`.
4. If token is invalid or missing, immediately halts with HTTP 401:
   ```json
   {
     "success": false,
     "message": "Not authorized, invalid or expired session token"
   }
   ```

### 4.3 Authorization Logic Matrix

| Entity | Action | Rule | Forbidden Response (403) |
| :--- | :--- | :--- | :--- |
| **Post** | `PUT /api/posts/:id` | `post.author.toString() === req.user._id.toString()` | "Unauthorized: You are not allowed to edit another author's post" |
| **Post** | `DELETE /api/posts/:id` | `post.author.toString() === req.user._id.toString()` | "Unauthorized: You are not allowed to delete another author's post" |
| **Comment** | `PUT /api/comments/:id` | `comment.author.toString() === req.user._id.toString()` | "Unauthorized: You can only edit your own comments" |
| **Comment** | `DELETE /api/comments/:id` | `comment.author.toString() === req.user._id.toString()` | "Unauthorized: You can only delete your own comments" |

---

## 5. REST API Specifications & Contracts

### 5.1 Standard Response Envelopes

#### Success Envelope
```json
{
  "success": true,
  "message": "Resource retrieved successfully",
  "data": {}
}
```

#### Error Envelope
```json
{
  "success": false,
  "message": "Resource not found",
  "stack": null
}
```

### 5.2 API Catalogue

```
POST   /api/auth/register          -> Register user & return JWT
POST   /api/auth/login             -> Login user & return JWT
GET    /api/auth/me                -> Get current authenticated user profile
GET    /api/users/profile          -> Get user profile
PUT    /api/users/profile          -> Update user profile, bio, avatar, password

GET    /api/posts                  -> List posts (?page, ?limit, ?search, ?category, ?sort)
GET    /api/posts/:id              -> Get single post with populated author & comments count
POST   /api/posts                  -> Create post (Title, Content, Category, CoverImage)
PUT    /api/posts/:id              -> Update post (Owner only)
DELETE /api/posts/:id              -> Delete post & associated comments (Owner only)
GET    /api/posts/user/me          -> Get all posts created by authenticated user

GET    /api/posts/:postId/comments -> List all comments for post with populated author
POST   /api/posts/:postId/comments -> Add comment to post
PUT    /api/comments/:id           -> Update comment content (Owner only)
DELETE /api/comments/:id           -> Delete comment (Owner only)

GET    /api/stats/user             -> Get aggregated metrics (total posts, comments, read time)
GET    /api/health                 -> System health check endpoint
```

---

## 6. Frontend Architecture & Routing Design

### 6.1 Routing Architecture

```
Routes
├── Public Routes
│   ├── /                 -> HomePage (Hero, Search/Filter, Featured Post, Blog Grid)
│   ├── /blogs/:id        -> BlogDetailPage (Full Article, Author Bio, Comments)
│   ├── /posts/:id        -> BlogDetailPage (Alias route)
│   ├── /login            -> LoginPage (1-Click Demo Accounts & Form)
│   └── /register         -> RegisterPage (Client Validation & Matching Check)
│
├── Protected Routes (Wrapped by ProtectedRoute)
│   ├── /dashboard        -> DashboardPage (Author Metrics, Posts Table, Feedback)
│   ├── /my-posts         -> MyPosts (Dedicated Article Management View)
│   ├── /create-post      -> CreatePostPage (Live Cover Preview & Editor)
│   ├── /edit-post/:id    -> EditPostPage (Prefilled Editor & Guard)
│   └── /profile          -> ProfilePage (Avatar Generator, Bio, Credentials)
│
└── Error Route
    ├── /404              -> NotFoundPage
    └── *                 -> NotFoundPage
```

### 6.2 Service Layer Architecture

Frontend components delegate all network calls to dedicated service modules:
- `authService.js`: `login()`, `register()`, `getMe()`, `updateProfile()`
- `postService.js`: `getAllPosts()`, `getPostById()`, `createPost()`, `updatePost()`, `deletePost()`, `getMyPosts()`
- `commentService.js`: `getCommentsByPost()`, `addComment()`, `updateComment()`, `deleteComment()`
- `userService.js`: `getProfile()`, `updateProfile()`, `getUserStats()`

---

## 7. UI/UX Design System & Breakpoints

### 7.1 Responsive Breakpoint Specifications

| Breakpoint | Width | Behavior |
| :--- | :--- | :--- |
| **Mobile** | `320px - 767px` | 1-column blog card grid, slide-out drawer menu, stacked hero CTAs, full-width inputs. |
| **Tablet** | `768px - 1023px` | 2-column blog card grid, tablet navbar with icon shortcuts, split dashboard metrics. |
| **Desktop** | `1024px - 1439px`| 3-column blog card grid, sticky glassmorphic header, horizontal stats row. |
| **Wide Desktop** | `1440px+` | Max container width `max-w-7xl` centered with generous whitespace. |

### 7.2 Micro-Interactions & Loading System
- **Skeleton Shimmers**: `BlogCardSkeleton`, `BlogDetailSkeleton`, and `TableRowSkeleton` render while asynchronous operations execute.
- **Button Loaders**: Submit buttons render an animated spinner and become disabled (`disabled:opacity-50`) during in-flight network requests.
- **Toast Alerts**: Instant non-blocking notifications for login success, article publication, comment updates, and errors.
- **Confirmation Modals**: `ConfirmModal` triggers before executing destructive actions (post deletion, comment deletion).

---

## 8. Security & Environment Configuration

### 8.1 Configuration Variables (`.env.example`)

#### Server `.env.example`
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/blogsphere
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

#### Client `.env.example`
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 9. 23-Phase Implementation & Verification Matrix

```
[Phase 1] Project structure initialization           -> COMPLETE ✅
[Phase 2] Backend architecture setup                 -> COMPLETE ✅
[Phase 3] MongoDB connection manager                 -> COMPLETE ✅
[Phase 4] Database models (User, Post, Comment)      -> COMPLETE ✅
[Phase 5] Authentication & password hashing          -> COMPLETE ✅
[Phase 6] Authorization & JWT middleware             -> COMPLETE ✅
[Phase 7] Post services and REST APIs                -> COMPLETE ✅
[Phase 8] Comment services and REST APIs             -> COMPLETE ✅
[Phase 9] User & profile REST APIs                   -> COMPLETE ✅
[Phase 10] Frontend routing & guards                 -> COMPLETE ✅
[Phase 11] Authentication UI & Demo accounts         -> COMPLETE ✅
[Phase 12] Home page, Hero & Featured Post           -> COMPLETE ✅
[Phase 13] Blog details & reader page                -> COMPLETE ✅
[Phase 14] Interactive comment engine                -> COMPLETE ✅
[Phase 15] Author dashboard & metrics                -> COMPLETE ✅
[Phase 16] Profile settings & avatar generator       -> COMPLETE ✅
[Phase 17] Search, category filter & pagination      -> COMPLETE ✅
[Phase 18] Error handlers, skeletons & toasts        -> COMPLETE ✅
[Phase 19] Responsive layout & mobile drawer         -> COMPLETE ✅
[Phase 20] Security & ownership verification checks  -> COMPLETE ✅
[Phase 21] Full integration testing                  -> COMPLETE ✅
[Phase 22] Production build check (`vite build`)     -> COMPLETE ✅
[Phase 23] Technical documentation (PRD/TRD/TDR)     -> COMPLETE ✅
```

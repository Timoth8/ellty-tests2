# Project Structure Visualization

## 📂 Complete Directory Structure

```
ellty-tests2/
│
├── 📄 README.md                    # Complete setup guide
├── 📄 BACKEND_REQUIREMENTS.md      # Backend analysis document
├── 📄 SCRIPTS.md                   # Quick command reference
├── 📄 package.json                 # Backend dependencies
├── 📄 .env                         # Environment variables (MongoDB URI, PORT)
├── 📄 .gitignore                   # Git ignore rules
├── 📄 setup.ps1                    # Automated setup script for Windows
│
├── 📁 server/                      # Backend (Express.js + MongoDB)
│   │
│   ├── 📄 index.js                 # Main Express server
│   │   ├── Express configuration
│   │   ├── MongoDB connection
│   │   ├── CORS middleware
│   │   └── Route registration
│   │
│   ├── 📄 seed.js                  # Database seeding script
│   │   ├── Creates 5 users (Alex, George, Masha, Syed, Julia)
│   │   └── Creates nested comments matching screenshot
│   │
│   ├── 📁 models/                  # Mongoose schemas
│   │   ├── 📄 User.js              # User schema (name, avatar, createdAt)
│   │   └── 📄 Comment.js           # Comment schema (userId, content, parentId)
│   │
│   └── 📁 routes/                  # API endpoints
│       ├── 📄 comments.js          # Comment CRUD operations
│       │   ├── GET /api/comments   (fetch all with nesting)
│       │   ├── POST /api/comments  (create new comment/reply)
│       │   └── DELETE /api/comments/:id
│       │
│       └── 📄 users.js             # User operations
│           ├── GET /api/users      (fetch all users)
│           └── POST /api/users     (create new user)
│
└── 📁 client/                      # Frontend (React + Tailwind CSS)
    │
    ├── 📄 package.json             # Frontend dependencies
    ├── 📄 tailwind.config.js       # Tailwind configuration
    ├── 📄 postcss.config.js        # PostCSS configuration
    │
    ├── 📁 public/
    │   └── 📄 index.html           # HTML template
    │
    └── 📁 src/
        │
        ├── 📄 index.js             # React entry point
        ├── 📄 index.css            # Global styles + Tailwind imports
        ├── 📄 App.js               # Main application component
        │   ├── Fetches comments and users
        │   ├── Manages global state
        │   └── Renders main layout
        │
        └── 📁 components/
            │
            ├── 📄 CommentList.js   # Container for all comments
            │   └── Maps through root comments
            │
            ├── 📄 CommentItem.js   # Individual comment component
            │   ├── Displays user avatar
            │   ├── Shows timestamp
            │   ├── Renders content
            │   ├── Reply button
            │   ├── Reply form toggle
            │   └── Recursively renders nested replies
            │
            └── 📄 CommentForm.js   # Form for new comments/replies
                ├── User selection dropdown
                ├── Text area for content
                ├── Submit/Cancel buttons
                └── Form validation
```

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│                     (React + Tailwind)                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐      ┌──────────────┐                    │
│  │   App.js    │──────│ CommentList  │                    │
│  │             │      │              │                    │
│  │ - State     │      └──────────────┘                    │
│  │ - API calls │            │                             │
│  └─────────────┘            │                             │
│        │                    ▼                             │
│        │            ┌──────────────┐                      │
│        │            │ CommentItem  │                      │
│        │            │              │                      │
│        │            │ - Avatar     │                      │
│        │            │ - Timestamp  │                      │
│        │            │ - Content    │                      │
│        │            │ - Reply btn  │                      │
│        │            │ - Nested     │                      │
│        │            └──────────────┘                      │
│        │                    │                             │
│        └────────────────────┼─────────────┐              │
│                             ▼             │              │
│                     ┌──────────────┐      │              │
│                     │ CommentForm  │◄─────┘              │
│                     │              │                     │
│                     │ - User select│                     │
│                     │ - Text input │                     │
│                     └──────────────┘                     │
│                                                           │
└───────────────────────────┬───────────────────────────────┘
                            │ HTTP Requests (Axios)
                            │ - GET /api/comments
                            │ - POST /api/comments
                            │ - GET /api/users
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND                             │
│                    (Express.js + MongoDB)                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐                                           │
│  │  index.js   │  Express Server (Port 5000)               │
│  │             │                                            │
│  │ - CORS      │                                            │
│  │ - Routes    │                                            │
│  │ - MongoDB   │                                            │
│  └─────────────┘                                            │
│        │                                                    │
│        ├─────────────┬──────────────┐                      │
│        ▼             ▼              ▼                      │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐                 │
│  │ Routes  │  │  Models  │  │   Seed   │                 │
│  │         │  │          │  │          │                 │
│  │comments │  │  User    │  │seed.js   │                 │
│  │users    │  │  Comment │  └──────────┘                 │
│  └─────────┘  └──────────┘                                │
│        │            │                                      │
│        └────────────┴──────────────┐                      │
│                                    ▼                      │
└────────────────────────────────────┼──────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────┐
│                         DATABASE                            │
│                         (MongoDB)                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐         ┌──────────────────┐        │
│  │  Users Collection│         │Comments Collection│        │
│  │                  │         │                   │        │
│  │ - _id            │         │ - _id             │        │
│  │ - name           │         │ - userId (ref)    │        │
│  │ - avatar         │         │ - content         │        │
│  │ - createdAt      │         │ - parentId (ref)  │        │
│  │                  │         │ - createdAt       │        │
│  └──────────────────┘         └──────────────────┘        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Startup Sequence

```
1. User runs: npm run dev
        │
        ├─── Backend starts (server/index.js)
        │    │
        │    ├─ Connects to MongoDB
        │    ├─ Loads environment variables
        │    ├─ Registers routes
        │    └─ Listens on port 5000
        │
        └─── Frontend starts (client)
             │
             ├─ Webpack compiles React
             ├─ Tailwind processes CSS
             └─ Opens browser on port 3000

2. Browser loads http://localhost:3000
        │
        ├─── App.js componentDidMount
        │    │
        │    ├─ GET /api/comments
        │    └─ GET /api/users
        │
        └─── Components render with data
```

---

## 💾 Database Relationships

```
User Document                    Comment Document
┌──────────────┐                ┌──────────────────┐
│ _id: user1   │◄───────────────│ userId: user1    │
│ name: "Alex" │                │ content: "..."   │
│ avatar: "..."│                │ parentId: null   │
└──────────────┘                │ _id: comment1    │
                                └──────────────────┘
                                        │
                                        │ parentId reference
                                        ▼
                                ┌──────────────────┐
                                │ userId: user2    │
                                │ content: "..."   │
                                │ parentId: comment1│
                                │ _id: comment2    │
                                └──────────────────┘
```

---

## 📊 Component Hierarchy

```
App
 ├─ Header Section (Title)
 │
 ├─ CommentForm (Add new comment)
 │   ├─ User Select Dropdown
 │   ├─ Textarea
 │   └─ Submit Button
 │
 └─ CommentList
     │
     ├─ CommentItem (Root level)
     │   ├─ Avatar
     │   ├─ User Name
     │   ├─ Timestamp
     │   ├─ Content
     │   ├─ Reply Button
     │   │   └─ CommentForm (inline reply)
     │   │
     │   └─ Replies Array
     │       │
     │       ├─ CommentItem (Nested level 1)
     │       │   ├─ ... (same structure)
     │       │   │
     │       │   └─ Replies Array
     │       │       │
     │       │       └─ CommentItem (Nested level 2)
     │       │           └─ ... (recursive nesting)
     │       │
     │       └─ CommentItem (Nested level 1)
     │
     └─ CommentItem (Root level)
```

---

## 🎨 Styling Structure

```
Tailwind CSS
 ├─ Global styles (index.css)
 │   └─ @tailwind directives
 │
 ├─ Custom colors (tailwind.config.js)
 │   └─ purple-link: #8b5cf6
 │
 └─ Component classes
     ├─ Borders: border, rounded-lg
     ├─ Spacing: p-4, mb-4, gap-4
     ├─ Colors: text-gray-700, bg-white
     ├─ Typography: font-semibold, text-sm
     └─ Layout: flex, grid, space-y-4
```

---

## 🔐 Environment Configuration

```
.env
 ├─ PORT=5000                    # Backend server port
 └─ MONGODB_URI=mongodb://...    # Database connection string
```

---

This structure provides:
✅ Clear separation of concerns
✅ Reusable components
✅ Scalable architecture
✅ Easy to maintain
✅ Professional organization

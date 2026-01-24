# Application Structure & Pages Guide

Complete overview of The Kaash Journal application structure, pages, and components.

## 📁 Project Structure

```
blog_project/
├── client/                          # Frontend application
│   ├── public/                      # Static assets
│   │   └── images/                  # Images and logos
│   ├── src/
│   │   ├── components/              # Shared components
│   │   │   ├── blog/                # Blog-specific components
│   │   │   ├── layout/              # Layout components (Header, Footer, Sidebar)
│   │   │   └── ui/                  # UI components (shadcn/ui)
│   │   ├── modules/                 # Feature modules
│   │   │   └── admin/               # Admin module (authentication, dashboard)
│   │   ├── pages/                   # Page components
│   │   ├── lib/                     # Utilities and helpers
│   │   ├── contexts/                # React contexts
│   │   └── hooks/                   # Custom React hooks
│   └── index.html                   # HTML template
├── api/                             # Serverless API functions (Vercel)
│   └── analytics/                   # Analytics API endpoints
├── documentation/                   # Documentation files
└── package.json                     # Dependencies and scripts
```

---

## 🏠 Pages Overview

### 1. Home Page (`/`)

**File**: `client/src/pages/Home.tsx`

**Features:**
- Hero section with tagline
- Featured posts section
- Recent posts grid
- Newsletter subscription CTA

**Components Used:**
- `Header`
- `Footer`
- `PostCard`
- `NewsletterForm`

---

### 2. Blog Listing (`/blog`)

**File**: `client/src/pages/Blog.tsx`

**Features:**
- Search functionality
- Category filtering
- Pagination (9 posts per page)
- Sidebar with recent posts and categories

**Components Used:**
- `Header`
- `Footer`
- `Sidebar`
- `PostCard`

**Functionality:**
- Real-time search
- Category filter dropdown
- Page navigation

---

### 3. Blog Post (`/blog/:slug`)

**File**: `client/src/pages/Post.tsx`

**Features:**
- Full blog post content
- Markdown rendering with syntax highlighting
- Reading progress indicator
- Social sharing buttons
- Related posts
- Sidebar

**Components Used:**
- `Header`
- `Footer`
- `Sidebar`
- `PostMeta`
- `RelatedPosts`
- `ReadingProgress`
- `SocialShare`
- `ReactMarkdown`

**Content:**
- Rendered from markdown in `lib/posts.ts`
- Supports headings, lists, code blocks, tables, images

---

### 4. Category Page (`/category/:slug`)

**File**: `client/src/pages/Category.tsx`

**Features:**
- Posts filtered by category
- Pagination
- Category description
- Sidebar

**Categories:**
- AI Tools & Updates
- Debt Management
- Real-Time Finance
- Fintech Trends
- How-To Guides
- Case Studies

---

### 5. Tag Page (`/tag/:tag`)

**File**: `client/src/pages/Tag.tsx`

**Features:**
- Posts filtered by tag
- Pagination
- Tag name display
- Sidebar

**Tags:**
- Dynamically generated from post tags
- Clickable from `PostCard` component

---

### 6. About Page (`/about`)

**File**: `client/src/pages/About.tsx`

**Sections:**
- Our Mission
- What We Cover
- Why Trust Us
- Get In Touch (with social links)

**Note:** Research & Data Insights section is commented out but code preserved.

---

### 7. Admin Login (`/admin/login`)

**File**: `client/src/modules/admin/pages/Login.tsx`

**Features:**
- Password-based authentication
- Session management
- Redirect to dashboard on success

**Security:**
- Password from `VITE_ADMIN_PASSWORD` env variable
- Session expires after 8 hours

---

### 8. Admin Dashboard (`/admin`)

**File**: `client/src/modules/admin/pages/Dashboard.tsx`

**Features:**
- Protected route (requires authentication)
- Real-time analytics dashboard
- Overview statistics (visitors, subscribers, clicks, revenue)
- Interactive charts (visitors, clicks, revenue, traffic sources)
- Top performing posts table
- Auto-refresh every 5 minutes
- Manual refresh button
- Logout functionality

**Data Sources:**
- Google Analytics 4
- Google Tag Manager
- Mailchimp (subscribers)
- Custom API endpoints

---

### 9. 404 Page (`/404` or any invalid route)

**File**: `client/src/pages/NotFound.tsx`

**Features:**
- Error message
- Links to Home and Blog
- Matches design system (Oswald font, sharp edges)

---

## 🧩 Key Components

### Layout Components

**Header** (`components/layout/Header.tsx`)
- Logo (centered)
- Navigation menu (Home, Blog, About)
- Search functionality (modal dialog)
- Mobile menu (burger icon)

**Footer** (`components/layout/Footer.tsx`)
- Logo
- Navigation links
- Category links
- Social media links
- Copyright

**Sidebar** (`components/layout/Sidebar.tsx`)
- Recent posts
- Categories list
- Newsletter subscription form

### Blog Components

**PostCard** (`components/blog/PostCard.tsx`)
- Post preview card
- Image, title, excerpt
- Category badge
- Meta information (author, date, reading time)
- Tags
- Read more link

**PostMeta** (`components/blog/PostMeta.tsx`)
- Author, date, reading time
- Category badge
- Tags

**RelatedPosts** (`components/blog/RelatedPosts.tsx`)
- Shows related posts based on category/tags
- Uses `getRelatedPosts()` utility

### Utility Components

**SEO** (`components/SEO.tsx`)
- Dynamic meta tags
- Open Graph tags
- Twitter cards
- Article metadata

**GTM** (`components/GTM.tsx`)
- Google Tag Manager integration
- DataLayer helper functions

**NewsletterForm** (`components/NewsletterForm.tsx`)
- Mailchimp integration
- Form validation
- Toast notifications
- GTM event tracking

**ReadingProgress** (`components/ReadingProgress.tsx`)
- Reading progress bar
- Shows at top of blog posts

**SocialShare** (`components/SocialShare.tsx`)
- Share buttons (Twitter, LinkedIn, Facebook)
- Copy link functionality

**Image** (`components/ui/image.tsx`)
- Lazy loading
- Error handling
- Fallback images

---

## 🔐 Admin Module

**Location**: `client/src/modules/admin/`

**Structure:**
```
modules/admin/
├── auth/                    # Authentication
│   ├── index.ts            # Auth utilities
│   └── LoginForm.tsx       # Login form
├── components/              # Admin components
│   └── ProtectedRoute.tsx  # Route protection
├── lib/                    # Admin utilities
│   └── analytics.ts        # Analytics API client
├── pages/                   # Admin pages
│   ├── Dashboard.tsx       # Main dashboard
│   └── Login.tsx           # Login page
├── types/                   # TypeScript types
│   └── index.ts
└── index.ts                # Module exports
```

**Features:**
- Self-contained module
- Authentication system
- Protected routes
- Analytics dashboard
- Real-time data fetching

---

## 📚 Libraries & Utilities

### Blog Utilities (`lib/blog-utils.ts`)

Functions:
- `getPostBySlug()` - Get post by slug
- `getPostsByCategory()` - Filter by category
- `getFeaturedPosts()` - Get featured posts
- `getRecentPosts()` - Get recent posts
- `getRelatedPosts()` - Get related posts
- `searchPosts()` - Search posts
- `getPostsByTag()` - Filter by tag
- `formatDate()` - Format date string
- `getCategoryColor()` - Get category color

### Posts Data (`lib/posts.ts`)

- `blogPosts` - Array of all blog posts
- `categories` - Array of categories
- Post structure includes: title, slug, excerpt, content, author, date, category, tags, readingTime, featured, image, seo

### Types (`lib/types.ts`)

- `BlogPost` - Blog post interface
- `Category` - Category interface

---

## 🎨 Styling

### Design System

**Colors:**
- Primary: Black (#000000)
- Accent: Blue (#0066FF)
- Background: White (#FFFFFF)
- Muted: Gray (#666666)

**Typography:**
- Headings: Oswald (bold, uppercase)
- Body: Inter
- Monospace: Courier New (code)

**Spacing:**
- Base unit: 16px
- Border radius: Minimal (0-4px)
- Sharp edges (rounded-none)

### Tailwind CSS

- Custom configuration in `index.css`
- Responsive breakpoints
- Dark mode support (not fully implemented)

---

## 🔄 Routing

**Router**: Wouter (lightweight React router)

**Routes:**
- `/` - Home
- `/blog` - Blog listing
- `/blog/:slug` - Individual post
- `/category/:slug` - Category page
- `/tag/:tag` - Tag page
- `/about` - About page
- `/admin/login` - Admin login
- `/admin` - Admin dashboard
- `/404` - Not found

---

## 📦 Dependencies

**Core:**
- React 19
- TypeScript
- Vite
- Wouter (routing)

**UI:**
- Tailwind CSS 4
- shadcn/ui components
- Lucide React (icons)
- Recharts (charts)

**Content:**
- react-markdown (markdown rendering)
- react-syntax-highlighter (code highlighting)
- remark-gfm (GitHub Flavored Markdown)

**Analytics:**
- react-helmet-async (SEO)
- Google Tag Manager

**Forms:**
- react-hook-form
- sonner (toast notifications)

---

## 🚀 Build & Deployment

**Build Command:**
```bash
cd client && pnpm build
```

**Output:**
- `client/dist/` - Production build

**Deployment:**
- Vercel (recommended)
- GitHub Pages
- Any static hosting

**Environment Variables:**
- `VITE_GTM_ID` - Google Tag Manager ID
- `VITE_MAILCHIMP_API_KEY` - Mailchimp API key
- `VITE_MAILCHIMP_LIST_ID` - Mailchimp list ID
- `VITE_MAILCHIMP_SERVER_PREFIX` - Mailchimp server prefix
- `VITE_ADMIN_PASSWORD` - Admin dashboard password
- `VITE_API_URL` - API base URL (defaults to `/api`)

---

## 📝 Content Management

### Adding New Posts

Edit `client/src/lib/posts.ts`:

```typescript
{
  id: "unique-id",
  title: "Post Title",
  slug: "post-slug",
  excerpt: "Short description",
  content: `# Markdown content here`,
  author: "The Kaash Journal",
  date: "2025-01-20",
  category: "AI Tools & Updates",
  tags: ["AI", "Finance"],
  readingTime: 8,
  featured: false,
  image: "/images/image.jpg",
  seo: {
    metaDescription: "SEO description",
    keywords: ["keyword1", "keyword2"]
  }
}
```

### Adding New Categories

Edit `client/src/lib/posts.ts`:

```typescript
{
  id: "unique-id",
  name: "Category Name",
  slug: "category-slug",
  description: "Category description",
  color: "#0066FF"
}
```

---

## 🔍 SEO Features

- Dynamic meta tags per page/post
- Open Graph tags
- Twitter cards
- Canonical URLs
- Structured data (article schema)
- Sitemap-ready structure

---

## ✅ Checklist for New Features

When adding new features:

1. [ ] Create component in appropriate folder
2. [ ] Add TypeScript types if needed
3. [ ] Update routing if new page
4. [ ] Add SEO meta tags
5. [ ] Test responsive design
6. [ ] Add accessibility features (ARIA labels)
7. [ ] Update documentation

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Wouter Router](https://github.com/molefrog/wouter)
- [shadcn/ui](https://ui.shadcn.com)

# Technical Setup & Deployment Guide

Complete technical documentation for setting up, deploying, and managing The Kaash Journal blog application.

---

## 📋 Table of Contents

1. [Project Structure](#project-structure)
2. [Environment Setup](#environment-setup)
3. [Supabase Database Setup](#supabase-database-setup)
4. [Admin Authentication](#admin-authentication)
5. [Deployment](#deployment)
6. [Application Structure](#application-structure)
7. [Troubleshooting](#troubleshooting)

---

## 📁 Project Structure

```
blog_project/
├── client/                          # Frontend application
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/              # Shared components
│   │   ├── modules/                 # Feature modules (admin)
│   │   ├── pages/                   # Page components
│   │   ├── lib/                     # Utilities and helpers
│   │   ├── hooks/                   # Custom React hooks
│   │   └── contexts/                # React contexts
│   └── index.html
├── api/                             # Serverless API functions (Vercel)
│   ├── auth/                        # Authentication endpoints
│   ├── tracking/                    # Tracking endpoints
│   └── analytics/                   # Analytics endpoints
├── documentation/                   # Documentation files
├── server.js                        # Local API server (dev)
└── package.json
```

---

## 🔧 Environment Setup

### Required Environment Variables

Create a `.env` file in the project root:

```bash
# Google Tag Manager
VITE_GTM_ID=GTM-P33W36DQ

# Brevo Newsletter
VITE_BREVO_API_KEY=your_brevo_api_key
VITE_BREVO_LIST_ID=your_brevo_list_id

# Supabase
VITE_SUPABASE_URL=https://zvlwzxsrpychzaijksvb.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Important**: Never commit `.env` file to git!

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Run API server (for local dev)
npm run dev:api

# Run both (frontend + API)
npm run dev:all

# Build for production
pnpm build
```

---

## 🗄️ Supabase Database Setup

### Quick Setup (3 Steps)

1. **Add Environment Variables** (see above)

2. **Install Package**
   ```bash
   pnpm add @supabase/supabase-js
   ```

3. **Run SQL in Supabase**
   - Go to Supabase Dashboard → SQL Editor
   - Copy and paste entire SQL from `documentation/supabase_tables.sql`
   - Click Run

### Database Tables

After running SQL, you'll have:

- `analytics_daily` - Daily aggregated analytics
- `page_views` - Every page visit with tracking
- `events` - All custom events and GTM events
- `conversions` - Newsletter signups, purchases, etc.
- `redirections` - Link clicks and outbound links
- `newsletter_subscribers` - Newsletter subscribers
- `admin_users` - Admin authentication
- `blog_posts` - Dynamic blog posts (optional)

### Get Supabase Credentials

1. Go to Supabase Dashboard → Settings → API
2. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (keep secret! for API routes only)

### Automatic Tracking

The app automatically tracks:
- ✅ Page views on every route change
- ✅ Time on page (updated every 10 seconds)
- ✅ Link clicks (all `<a>` tags)
- ✅ GTM events (sent to backend)
- ✅ Conversions (newsletter signups)

---

## 🔐 Admin Authentication

### What Changed

- ❌ **Removed**: Environment variable password (`VITE_ADMIN_PASSWORD`)
- ✅ **Added**: Database table `admin_users` with username and hashed passwords
- ✅ **Added**: Login API endpoint `/api/auth/login`
- ✅ **Added**: Create admin endpoint `/api/auth/create-admin`

### Creating Your First Admin User

**Method 1: Using API Endpoint (Recommended)**

After deploying, call:
```bash
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your-secure-password",
    "email": "admin@example.com",
    "full_name": "Admin User"
  }'
```

**Method 2: Direct SQL**

Hash password first using bcrypt (10 rounds), then:
```sql
INSERT INTO admin_users (username, password_hash, email, full_name, is_active)
VALUES (
  'admin',
  '$2a$10$YourHashedPasswordHere',
  'admin@example.com',
  'Admin User',
  true
);
```

### Login

Visit `/admin/login` and use your username and password.

### Security Notes

- Use strong passwords
- After creating admin, consider protecting `/api/auth/create-admin` endpoint
- Multiple admin users supported
- Set `is_active = false` to disable users without deleting

---

## 🚀 Deployment

### Prerequisites

- ✅ Supabase database tables created
- ✅ Admin user created
- ✅ Brevo account and credentials
- ✅ All environment variables ready

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: `client`
     - **Build Command**: `pnpm build`
     - **Output Directory**: `dist`
   - Add ALL environment variables in Settings → Environment Variables
   - Click "Deploy"

3. **Connect Custom Domain** (Optional)
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

### Deploy to GitHub Pages

1. **Set GitHub Secrets**
   - Go to repo → Settings → Secrets and variables → Actions
   - Add all environment variables

2. **Enable GitHub Pages**
   - Go to Settings → Pages
   - Source: GitHub Actions
   - Workflow auto-deploys on push

3. **Connect Domain** (Optional)
   - Add custom domain in Pages settings
   - Update DNS records

### Post-Deployment Checklist

- [ ] Test homepage loads
- [ ] Test newsletter form
- [ ] Test admin login (`/admin/login`)
- [ ] Verify dashboard shows data
- [ ] Check GTM loads (browser console)
- [ ] Verify tracking works (check Supabase tables)

---

## 🏗️ Application Structure

### Pages

- `/` - Home page
- `/blog` - Blog listing with search and filters
- `/blog/:slug` - Individual blog post
- `/category/:slug` - Category page
- `/tag/:tag` - Tag page
- `/about` - About page
- `/admin/login` - Admin login
- `/admin` - Admin dashboard (protected)
- `/404` - Not found page

### Key Components

**Layout:**
- `Header` - Navigation and search
- `Footer` - Links and social media
- `Sidebar` - Recent posts, categories, newsletter

**Blog:**
- `PostCard` - Post preview card
- `PostMeta` - Author, date, category, tags
- `RelatedPosts` - Related posts section

**Admin:**
- `ProtectedRoute` - Route protection wrapper
- `Dashboard` - Analytics dashboard with charts

**Utilities:**
- `SEO` - Dynamic meta tags
- `GTM` - Google Tag Manager integration
- `NewsletterForm` - Newsletter subscription form

### Admin Module

Location: `client/src/modules/admin/`

```
modules/admin/
├── auth/                    # Authentication
├── components/              # Admin components
├── lib/                     # Admin utilities
├── pages/                   # Admin pages
└── types/                   # TypeScript types
```

### Environment Variables Reference

- `VITE_GTM_ID` - Google Tag Manager ID
- `VITE_BREVO_API_KEY` - Brevo API key
- `VITE_BREVO_LIST_ID` - Brevo list ID
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (API routes)
- `VITE_API_URL` - API base URL (defaults to `/api`)

---

## 🆘 Troubleshooting

### Build Fails

- Check all environment variables are set
- Verify Node.js version (18+)
- Run `pnpm build` locally to test

### Newsletter Not Working

- Verify Brevo API key is correct
- Check List ID matches your Brevo list
- Check browser console for errors
- Verify Supabase `newsletter_subscribers` table exists

### Admin Login Fails

- Verify admin user exists in Supabase `admin_users` table
- Check `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Verify API route is accessible
- Check Vercel function logs

### Dashboard Shows No Data

- Verify Supabase tables are created
- Check data exists in tables
- Verify `VITE_SUPABASE_ANON_KEY` is correct
- Check browser console for errors

### GTM Not Loading

- Verify `VITE_GTM_ID` is set correctly
- Check GTM container is published
- Use GTM Preview mode to debug

### Supabase Connection Issues

- Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Verify project is not paused (free tier pauses after inactivity)
- Check RLS policies allow operations
- Restart dev server after adding env variables

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

---

## ✅ Quick Start Checklist

- [ ] Install dependencies (`pnpm install`)
- [ ] Create `.env` file with all variables
- [ ] Run Supabase SQL to create tables
- [ ] Create admin user
- [ ] Test locally (`pnpm dev`)
- [ ] Deploy to Vercel
- [ ] Add environment variables in Vercel
- [ ] Test deployed site
- [ ] Connect custom domain (optional)

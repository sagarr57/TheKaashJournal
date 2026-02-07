-- ============================================
-- Supabase Database Setup for The Kaash Journal
-- Copy and paste this entire file into Supabase SQL Editor
-- ============================================

-- Table 1: Analytics Daily Data
-- Stores daily analytics metrics (visitors, clicks, revenue, subscribers)
CREATE TABLE IF NOT EXISTS analytics_daily (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  visitors INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  revenue DECIMAL(10, 2) DEFAULT 0,
  subscribers INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on date for faster queries
CREATE INDEX IF NOT EXISTS idx_analytics_daily_date ON analytics_daily(date);

-- Enable Row Level Security (RLS)
ALTER TABLE analytics_daily ENABLE ROW LEVEL SECURITY;

-- Create policy: Allow public read access (for dashboard)
CREATE POLICY "Allow public read access" ON analytics_daily
  FOR SELECT USING (true);

-- Create policy: Allow insert/update
CREATE POLICY "Allow insert/update" ON analytics_daily
  FOR ALL USING (true);

-- ============================================

-- Table 2: Newsletter Subscribers
-- Tracks newsletter subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source TEXT, -- e.g., 'homepage', 'sidebar', 'blog_post'
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);

-- Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow public insert (for newsletter signup)
CREATE POLICY "Allow public insert" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Allow read access
CREATE POLICY "Allow read access" ON newsletter_subscribers
  FOR SELECT USING (true);

-- ============================================

-- Table 3: Page Views
-- Tracks every page view with time spent, referrer, etc.
CREATE TABLE IF NOT EXISTS page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  user_agent TEXT,
  view_time_seconds INTEGER DEFAULT 0, -- Time spent on page in seconds
  is_bounce BOOLEAN DEFAULT false, -- True if user left without interaction
  device_type TEXT, -- 'desktop', 'mobile', 'tablet'
  browser TEXT,
  country TEXT,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_page_path ON page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);

-- Enable RLS
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Allow public insert (for tracking)
CREATE POLICY "Allow public insert" ON page_views
  FOR INSERT WITH CHECK (true);

-- Allow read access
CREATE POLICY "Allow read access" ON page_views
  FOR SELECT USING (true);

-- ============================================

-- Table 4: Events
-- Tracks all custom events (GTM events, conversions, clicks, etc.)
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'conversion', 'click', 'scroll', 'download', etc.
  event_name TEXT NOT NULL, -- e.g., 'newsletter_signup', 'button_click', 'purchase'
  page_path TEXT,
  element_id TEXT, -- ID of clicked element
  element_text TEXT, -- Text content of clicked element
  element_type TEXT, -- 'button', 'link', 'image', etc.
  gclid TEXT, -- Google Click ID for Google Ads tracking
  value DECIMAL(10, 2), -- Monetary value if applicable
  currency TEXT DEFAULT 'USD',
  metadata JSONB, -- Additional event data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_events_session_id ON events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_event_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_event_name ON events(event_name);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_gclid ON events(gclid);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Allow public insert
CREATE POLICY "Allow public insert" ON events
  FOR INSERT WITH CHECK (true);

-- Allow read access
CREATE POLICY "Allow read access" ON events
  FOR SELECT USING (true);

-- ============================================

-- Table 5: Conversions
-- Tracks Google Ads conversions and other conversion events
CREATE TABLE IF NOT EXISTS conversions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  conversion_type TEXT NOT NULL, -- 'purchase', 'signup', 'download', 'newsletter', etc.
  conversion_name TEXT NOT NULL,
  gclid TEXT, -- Google Click ID
  value DECIMAL(10, 2),
  currency TEXT DEFAULT 'USD',
  page_path TEXT,
  referrer TEXT,
  user_agent TEXT,
  metadata JSONB, -- Additional conversion data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_conversions_session_id ON conversions(session_id);
CREATE INDEX IF NOT EXISTS idx_conversions_conversion_type ON conversions(conversion_type);
CREATE INDEX IF NOT EXISTS idx_conversions_gclid ON conversions(gclid);
CREATE INDEX IF NOT EXISTS idx_conversions_created_at ON conversions(created_at DESC);

-- Enable RLS
ALTER TABLE conversions ENABLE ROW LEVEL SECURITY;

-- Allow public insert
CREATE POLICY "Allow public insert" ON conversions
  FOR INSERT WITH CHECK (true);

-- Allow read access
CREATE POLICY "Allow read access" ON conversions
  FOR SELECT USING (true);

-- ============================================

-- Table 6: Redirections
-- Tracks link clicks and redirections (outbound links, affiliate links, etc.)
CREATE TABLE IF NOT EXISTS redirections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  source_url TEXT NOT NULL, -- Page where link was clicked
  destination_url TEXT NOT NULL,
  link_text TEXT, -- Text of the clicked link
  link_type TEXT, -- 'outbound', 'affiliate', 'internal', 'download', etc.
  is_external BOOLEAN DEFAULT true,
  gclid TEXT, -- For tracking Google Ads clicks
  metadata JSONB, -- Additional data (e.g., affiliate ID, campaign ID)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_redirections_session_id ON redirections(session_id);
CREATE INDEX IF NOT EXISTS idx_redirections_destination_url ON redirections(destination_url);
CREATE INDEX IF NOT EXISTS idx_redirections_link_type ON redirections(link_type);
CREATE INDEX IF NOT EXISTS idx_redirections_created_at ON redirections(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_redirections_gclid ON redirections(gclid);

-- Enable RLS
ALTER TABLE redirections ENABLE ROW LEVEL SECURITY;

-- Allow public insert
CREATE POLICY "Allow public insert" ON redirections
  FOR INSERT WITH CHECK (true);

-- Allow read access
CREATE POLICY "Allow read access" ON redirections
  FOR SELECT USING (true);

-- ============================================
-- Optional: Blog Posts Table (for future dynamic blog management)
-- Uncomment if you want to store blog posts in Supabase
-- ============================================

-- CREATE TABLE IF NOT EXISTS blog_posts (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--   title TEXT NOT NULL,
--   slug TEXT NOT NULL UNIQUE,
--   excerpt TEXT NOT NULL,
--   content TEXT NOT NULL,
--   author TEXT NOT NULL,
--   date DATE NOT NULL,
--   updated DATE,
--   category TEXT NOT NULL,
--   tags TEXT[] DEFAULT '{}',
--   reading_time INTEGER DEFAULT 5,
--   featured BOOLEAN DEFAULT false,
--   image TEXT NOT NULL,
--   meta_description TEXT,
--   keywords TEXT[] DEFAULT '{}',
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
-- CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
-- CREATE INDEX IF NOT EXISTS idx_blog_posts_date ON blog_posts(date DESC);
-- CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured);

-- ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Allow public read access" ON blog_posts
--   FOR SELECT USING (true);

-- CREATE POLICY "Allow all operations" ON blog_posts
--   FOR ALL USING (true);

-- ============================================

-- Table 7: Admin Users
-- Stores admin user credentials for dashboard access
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL, -- bcrypt hashed password
  email TEXT,
  full_name TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON admin_users(is_active);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Only allow authenticated users to read (we'll use service role for auth)
-- For now, allow all operations (restrict in production)
CREATE POLICY "Allow all operations" ON admin_users
  FOR ALL USING (true);

-- ============================================
-- Initial Admin User Setup
-- After creating the table, you'll need to insert a user via API
-- Use the /api/auth/create-admin endpoint to create your first admin user
-- ============================================

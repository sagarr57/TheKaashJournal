# Analytics & Tracking Guide

Complete guide for setting up analytics, tracking, and newsletter integration for The Kaash Journal.

---

## 📊 Table of Contents

1. [Google Tag Manager (GTM) Setup](#google-tag-manager-gtm-setup)
2. [Google Analytics 4 (GA4) Integration](#google-analytics-4-ga4-integration)
3. [Newsletter Integration (Brevo)](#newsletter-integration-brevo)
4. [Event Tracking](#event-tracking)
5. [Admin Dashboard Analytics](#admin-dashboard-analytics)
6. [Troubleshooting](#troubleshooting)

---

## 🏷️ Google Tag Manager (GTM) Setup

### Step 1: Create GTM Account

1. Go to [Google Tag Manager](https://tagmanager.google.com)
2. Click "Create Account"
3. Fill in:
   - **Account Name**: The Kaash Journal
   - **Country**: Your country
   - **Container Name**: Website
   - **Target Platform**: Web
4. Click "Create"

### Step 2: Get Your GTM ID

After creating the container, you'll see your GTM ID in the format: `GTM-XXXXXXX`

**Your GTM ID**: `GTM-P33W36DQ` (already configured)

### Step 3: Add GTM ID to Environment

Add to your `.env` file:
```bash
VITE_GTM_ID=GTM-P33W36DQ
```

### Step 4: Verify Installation

1. The GTM script is automatically injected via `GTM.tsx` component
2. Visit your site and check browser console
3. Use GTM Preview mode to verify tags are firing

### Step 5: Configure Tags in GTM

#### Page View Tracking
- **Tag Type**: Google Analytics: GA4 Configuration
- **Measurement ID**: Your GA4 Measurement ID
- **Trigger**: All Pages

#### Click Tracking
- **Tag Type**: Google Analytics: GA4 Event
- **Event Name**: `click`
- **Trigger**: Click - All Elements (or specific elements)

#### Newsletter Subscription
- **Tag Type**: Google Analytics: GA4 Event
- **Event Name**: `newsletter_subscribe`
- **Trigger**: Custom Event - `newsletter_subscribe`

---

## 📈 Google Analytics 4 (GA4) Integration

### Step 1: Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com)
2. Click "Admin" (gear icon)
3. Click "Create Property"
4. Fill in property details
5. Set up data stream for Web
6. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

### Step 2: Link GA4 to GTM

1. In GTM, create a new tag
2. Tag Type: **Google Analytics: GA4 Configuration**
3. Enter your Measurement ID
4. Set trigger to "All Pages"
5. Save and publish

### Step 3: Set Up Conversion Events

In GA4 Admin:
1. Go to **Events**
2. Mark these as conversions:
   - `newsletter_subscribe`
   - `purchase` (if tracking revenue)
   - `click` (for important clicks)

### Step 4: Connect to Admin Dashboard (Optional)

For real-time data in admin dashboard:

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create new project
   - Enable "Google Analytics Data API"

2. **Create Service Account**
   - Go to IAM & Admin > Service Accounts
   - Create new service account
   - Grant "Viewer" role for Analytics
   - Create JSON key and download

3. **Add to Environment Variables**
   ```bash
   GA_PROPERTY_ID=your_property_id
   GA_CREDENTIALS={"type":"service_account",...}
   ```

---

## 📧 Newsletter Integration (Brevo)

### Why Brevo?

**Free Tier Benefits:**
- ✅ **300 emails per day** (9,000/month)
- ✅ **Unlimited contacts**
- ✅ **No credit card required**
- ✅ **Full API access**
- ✅ **Email templates**
- ✅ **Automation workflows**

### Step 1: Create Brevo Account

1. Go to [Brevo (Sendinblue)](https://www.brevo.com)
2. Click **"Sign up free"**
3. Fill in your details and verify email
4. **No credit card required!**

### Step 2: Create a Contact List

1. In Brevo dashboard, go to **Contacts** > **Lists**
2. Click **"Create a list"**
3. Fill in list name and description
4. Click **"Create"**
5. **Find the List ID**:
   - Look at the URL: `https://app.brevo.com/lists/2/contacts`
   - The number after `/lists/` is your List ID (e.g., `2`, `5`, `10`)

### Step 3: Get Your API Key

1. In Brevo dashboard, go to **Settings** > **API Keys**
2. Click **"Generate a new API key"**
3. Give it a name: "Website Newsletter Form"
4. Click **"Generate"**
5. **Copy the API key immediately** (you won't see it again!)
   - Format: `xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxx`

### Step 4: Add to Environment Variables

Add to your `.env` file:
```bash
VITE_BREVO_API_KEY=your_api_key_here
VITE_BREVO_LIST_ID=your_list_id_here
```

### How Newsletter Integration Works

1. User enters email in newsletter form
2. Form submits to `subscribeToNewsletter()` function
3. Function calls Brevo API
4. Subscriber is added to Brevo list
5. Subscriber is also saved to Supabase `newsletter_subscribers` table
6. Success/error message displayed to user

### Newsletter Forms

Newsletter forms are integrated in:
- **Home Page** - "Never Miss an Update" section
- **Sidebar** - "Stay Updated" card (on blog pages)

### Subscription Options

**Single Opt-In (Current Default)**
- Subscribers immediately added to list
- Brevo sends welcome email if configured

**Double Opt-In (Recommended)**
1. In Brevo dashboard, go to **Contacts** > **Lists**
2. Select your list
3. Go to **Settings** > **Double opt-in**
4. Enable **"Require double opt-in"**
5. Customize confirmation email

---

## 🎪 Event Tracking

### Using GTM DataLayer

The app includes a helper function to push events to GTM:

```typescript
import { pushToDataLayer } from "@/components/GTM";

// Track newsletter subscription
pushToDataLayer("newsletter_subscribe", {
  email: "user@example.com",
});

// Track purchase/revenue
pushToDataLayer("purchase", {
  value: 29.99,
  currency: "USD",
  transaction_id: "12345",
});

// Track custom events
pushToDataLayer("button_click", {
  button_name: "Subscribe",
  location: "Homepage",
});
```

### Pre-configured Events

The app automatically tracks:
- **Page views** - Via GTM and Supabase
- **Newsletter subscriptions** - Via `NewsletterForm` component
- **Link clicks** - All `<a>` tags automatically tracked
- **Time on page** - Updated every 10 seconds

### Newsletter Subscription Tracking

Newsletter subscriptions automatically:
1. **GTM Event**: `newsletter_subscribe` event pushed to dataLayer
2. **Supabase Conversion**: Tracked in `conversions` table
3. **Supabase Subscriber**: Saved to `newsletter_subscribers` table

```typescript
// Automatic tracking in NewsletterForm component
pushToDataLayer("newsletter_subscribe", {
  email: email.trim(),
});

trackConversion("newsletter", "newsletter_signup", {
  metadata: {
    email: email.trim(),
    source: "newsletter_form",
  },
});
```

---

## 📊 Admin Dashboard Analytics

### Data Sources

1. **Supabase Database** - All tracking data (page views, events, conversions, redirections)
2. **Google Analytics 4** - Optional integration for advanced analytics
3. **Google Tag Manager** - Click tracking, custom events, conversions
4. **Brevo** - Newsletter subscribers (via API)

### Dashboard Features

✅ **Real-time Overview Stats**
- Total Visitors (with % change from previous period)
- Newsletter Subscribers (with % change)
- Total Clicks (with % change)
- Total Revenue (with % change)

✅ **Interactive Charts**
- Monthly Visitors (Line Chart)
- Monthly Clicks (Bar Chart)
- Monthly Revenue (Line Chart)
- Traffic Sources (Pie Chart)

✅ **Data Tables**
- Top Performing Posts
- Newsletter Subscribers List

**Note**: The dashboard fetches all data from Supabase. If no data exists, it will show empty states.

### API Endpoints

The dashboard fetches data from Supabase directly (client-side):
- Analytics overview from `analytics_daily` table
- Visitors data from `page_views` table
- Clicks data from `events` table
- Revenue data from `conversions` table
- Top posts from `page_views` table
- Subscribers from `newsletter_subscribers` table

---

## 🔧 Troubleshooting

### GTM Not Loading

- Verify `VITE_GTM_ID` is set correctly
- Check browser console for errors
- Use GTM Preview mode to debug
- Verify GTM container is published

### Events Not Tracking

- Check DataLayer in browser console
- Verify GTM tags are configured correctly
- Ensure triggers are set up properly
- Check GA4 Real-time reports
- Verify Supabase tables exist and RLS policies allow inserts

### Newsletter Not Working

- Verify Brevo API key is correct
- Check List ID matches your Brevo list
- Check browser console for API errors
- Verify Supabase `newsletter_subscribers` table exists
- Check if subscriber appears in Brevo dashboard

### Admin Dashboard Shows No Data

- Verify Supabase tables are created
- Check data exists in tables
- Verify `VITE_SUPABASE_ANON_KEY` is correct
- Check browser console for errors
- Verify RLS policies allow reads

### GA4 Not Connected

- Verify GA4 Measurement ID is correct
- Check GTM tag is firing
- Verify GA4 property is set up correctly
- Check GA4 Real-time reports

---

## 📚 Resources

- [Google Tag Manager Documentation](https://support.google.com/tagmanager)
- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [Brevo API Documentation](https://developers.brevo.com/)
- [GTM DataLayer Guide](https://developers.google.com/tag-manager/devguide)

---

## ✅ Checklist

- [ ] GTM account created and container set up
- [ ] GTM ID added to `.env` file
- [ ] GTM script loading on website
- [ ] GA4 property created (optional)
- [ ] GA4 linked to GTM (optional)
- [ ] Conversion events configured
- [ ] Brevo account created
- [ ] Brevo contact list created
- [ ] Brevo API key generated
- [ ] Brevo List ID copied
- [ ] Newsletter forms tested
- [ ] GTM event tracking verified
- [ ] Supabase conversion tracking verified
- [ ] Admin dashboard shows data

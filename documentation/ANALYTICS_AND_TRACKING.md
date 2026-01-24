# Analytics & Tracking Setup Guide

Complete guide for setting up Google Tag Manager (GTM), Google Analytics, and Google Ads tracking for The Kaash Journal.

## 📊 Table of Contents

1. [Google Tag Manager (GTM) Setup](#google-tag-manager-gtm-setup)
2. [Google Analytics 4 (GA4) Integration](#google-analytics-4-ga4-integration)
3. [Google Ads Integration](#google-ads-integration)
4. [Admin Dashboard Analytics](#admin-dashboard-analytics)
5. [Event Tracking](#event-tracking)

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

**Note**: Your GTM ID is already set in `.env.example`. Just copy it to `.env` when ready.

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
   GA_CREDENTIALS={"type":"service_account",...} # Paste full JSON
   ```

4. **Update API Functions**
   - Edit `/api/analytics/overview.ts`
   - Install: `pnpm add @google-analytics/data`
   - Implement GA4 Data API calls

---

## 🎯 Google Ads Integration

### Step 1: Create Google Ads Account

1. Go to [Google Ads](https://ads.google.com)
2. Create account and set up billing
3. Get your **Conversion ID** (format: `AW-XXXXXXXXX`)

### Step 2: Set Up Conversion Tracking

1. In Google Ads, go to **Tools & Settings** > **Conversions**
2. Click "+" to create new conversion
3. Choose conversion type (e.g., Website, App, etc.)
4. Set up conversion action
5. Copy the **Conversion ID** and **Conversion Label**

### Step 3: Add Conversion Tag in GTM

1. In GTM, create new tag
2. Tag Type: **Google Ads: Conversion Tracking**
3. Enter:
   - **Conversion ID**: `AW-XXXXXXXXX`
   - **Conversion Label**: Your label
4. Set trigger (e.g., newsletter subscription, purchase, etc.)
5. Save and publish

### Step 4: GCLID Tracking (Automatic)

**GCLID (Google Click Identifier) tracking is automatically implemented!**

The application automatically:
- ✅ Captures `gclid` parameter from URL when users click Google Ads
- ✅ Stores GCLID in localStorage for 30 days (Google's attribution window)
- ✅ Tracks conversions with GCLID for proper Google Ads attribution
- ✅ Sends conversion events to GTM dataLayer with GCLID

**How it works:**

1. When a user clicks a Google Ad, the URL contains `?gclid=...`
2. The app automatically captures and stores this GCLID
3. When a conversion happens (newsletter signup, click, etc.), the GCLID is included
4. Google Ads can then attribute the conversion to the correct ad click

**Implementation details:**

- GCLID tracking is initialized in `App.tsx` on app load
- Conversion tracking happens automatically in `NewsletterForm.tsx`
- You can manually track conversions using:

```typescript
import { trackConversion } from "@/lib/google-ads";

// Track newsletter signup
trackConversion("newsletter_signup");

// Track click with value
trackConversion("click", 10.50, "USD");

// Track custom conversion
trackConversion("custom", 0, "USD");
```

### Step 5: Track Revenue (Optional)

For e-commerce/revenue tracking:

1. Create conversion action in Google Ads
2. Set value tracking
3. In GTM, add conversion value variable
4. Use `pushToDataLayer()` to send revenue data:

```typescript
import { pushToDataLayer } from "@/components/GTM";
import { trackConversion } from "@/lib/google-ads";

// Method 1: Using GTM directly
pushToDataLayer("purchase", {
  value: 29.99,
  currency: "USD",
  transaction_id: "12345"
});

// Method 2: Using conversion tracker (includes GCLID automatically)
trackConversion("custom", 29.99, "USD");
```

---

## 📊 Admin Dashboard Analytics

The admin dashboard displays **real-time analytics** from Google Analytics 4. All data is fetched dynamically - no hardcoded values!

### Data Sources

1. **Google Analytics 4** - Visitors, page views, traffic sources, revenue
2. **Google Tag Manager** - Click tracking, custom events, conversions
3. **Brevo** - Newsletter subscribers (via API)
4. **Google Ads** - Conversion tracking with GCLID attribution

### Dynamic Data Features

✅ **Real-time Overview Stats**
- Total Visitors (with % change from previous period)
- Newsletter Subscribers (with % change)
- Total Clicks (with % change)
- Total Revenue (with % change)

✅ **Interactive Charts**
- Monthly Visitors (Bar Chart)
- Monthly Clicks (Line Chart)
- Monthly Revenue (Line Chart)
- Traffic Sources (Pie Chart)

✅ **Top Performing Posts Table**
- Post Title
- Views
- Clicks
- Revenue

**Note**: If GA4 is not configured, the dashboard will show empty states instead of mock data. This ensures you always know when real data is available.
4. **Google Ads** - Conversions, revenue (if configured)

### API Endpoints

The dashboard fetches data from:
- `/api/analytics/overview` - Overview statistics
- `/api/analytics/visitors` - Visitors chart data
- `/api/analytics/clicks` - Clicks chart data
- `/api/analytics/revenue` - Revenue chart data
- `/api/analytics/top-posts` - Top performing posts
- `/api/analytics/traffic-sources` - Traffic sources

### Connecting Real Data

1. Set up GA4 Data API (see GA4 Integration section)
2. Update API functions in `/api/analytics/` folder
3. Implement data fetching from GA4 API
4. Dashboard will automatically display real-time data

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
  items: [
    {
      item_name: "Product Name",
      price: 29.99,
      quantity: 1,
    },
  ],
});

// Track custom events
pushToDataLayer("button_click", {
  button_name: "Subscribe",
  location: "Homepage",
});
```

### Pre-configured Events

The app automatically tracks:
- **Page views** - Via GTM
- **Newsletter subscriptions** - Via `NewsletterForm` component
- **Social shares** - Via `SocialShare` component

### Custom Event Setup in GTM

1. In GTM, create new tag
2. Tag Type: **Google Analytics: GA4 Event**
3. Event Name: Your custom event name
4. Set trigger based on DataLayer event
5. Save and publish

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

### Admin Dashboard Shows No Data

- Verify API endpoints are accessible
- Check environment variables are set
- Review API function logs (Vercel dashboard)
- Ensure GA4 Data API is configured

### Google Ads Conversions Not Recording

- Verify conversion tag is firing in GTM Preview
- Check conversion ID and label are correct
- Ensure conversion action is active in Google Ads
- Wait 24-48 hours for data to appear

---

## 📚 Resources

- [Google Tag Manager Documentation](https://support.google.com/tagmanager)
- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [Google Ads Conversion Tracking](https://support.google.com/google-ads/answer/1722054)
- [GTM DataLayer Guide](https://developers.google.com/tag-manager/devguide)

---

## ✅ Checklist

- [ ] GTM account created and container set up
- [ ] GTM ID added to `.env` file
- [ ] GTM script loading on website
- [ ] GA4 property created
- [ ] GA4 linked to GTM
- [ ] Conversion events configured
- [ ] Google Ads account created
- [ ] Conversion tracking set up in Google Ads
- [ ] Conversion tag added to GTM
- [ ] Admin dashboard API endpoints configured
- [ ] Real-time data flowing to dashboard

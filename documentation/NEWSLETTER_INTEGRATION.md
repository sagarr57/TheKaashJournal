# Newsletter Integration Guide

Complete guide for integrating newsletter subscription functionality with Mailchimp.

## 📧 Mailchimp Setup

### Step 1: Create Mailchimp Account

1. Go to [Mailchimp](https://mailchimp.com)
2. Sign up for a free account (up to 500 contacts)
3. Verify your email address

### Step 2: Create an Audience/List

1. In Mailchimp dashboard, go to **Audience** > **All contacts**
2. Click **Create Audience**
3. Fill in:
   - **Audience name**: The Kaash Journal Subscribers
   - **Default from email**: your@email.com
   - **Default from name**: The Kaash Journal
4. Click **Save**

### Step 3: Get Your API Key

1. Go to **Account** > **Extras** > **API keys**
2. Click **Create A Key**
3. Copy your API key (format: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us1`)

### Step 4: Get Your List ID

1. Go to **Audience** > **All contacts**
2. Click **Settings** > **Audience name and defaults**
3. Scroll down to find **Audience ID** (format: `xxxxxxxxxx`)
4. Copy the Audience ID

### Step 5: Get Server Prefix

The server prefix is in your API key URL:
- If your API key ends with `-us1`, prefix is `us1`
- If it ends with `-us2`, prefix is `us2`
- Common prefixes: `us1`, `us2`, `us3`, `us6`, `us7`, `us8`, `us9`, `us10`, `us11`, `us12`, `us13`, `us14`, `us15`, `us16`, `us17`, `us18`, `us19`, `us20`, `us21`

### Step 6: Add to Environment Variables

Add to your `.env` file:
```bash
VITE_MAILCHIMP_API_KEY=your_api_key_here
VITE_MAILCHIMP_LIST_ID=your_list_id_here
VITE_MAILCHIMP_SERVER_PREFIX=us1
```

---

## 🔧 Integration Details

### How It Works

The newsletter integration uses Mailchimp's API v3 to add subscribers:

1. User enters email in newsletter form
2. Form submits to `subscribeToNewsletter()` function
3. Function calls Mailchimp API
4. Subscriber is added to your audience
5. Success/error message displayed to user

### Newsletter Forms

Newsletter forms are integrated in:
- **Home Page** - "Never Miss an Update" section
- **Sidebar** - "Stay Updated" card (on blog pages)

### Component: NewsletterForm

The `NewsletterForm` component handles:
- Email validation
- API calls to Mailchimp
- Loading states
- Success/error notifications
- GTM event tracking

**Usage:**
```typescript
import { NewsletterForm } from "@/components/NewsletterForm";

<NewsletterForm
  placeholder="Enter your email"
  buttonText="Subscribe"
  className="max-w-md mx-auto"
/>
```

---

## 📝 Subscription Options

### Single Opt-In (Current Default)

Subscribers are immediately added to your list:
```typescript
status: "subscribed"
```

### Double Opt-In (Recommended)

Requires email confirmation before adding to list:
```typescript
status: "pending"
```

To enable double opt-in, edit `client/src/lib/newsletter.ts`:
```typescript
body: JSON.stringify({
  email_address: email,
  status: "pending", // Changed from "subscribed"
}),
```

---

## 🎯 Tracking Newsletter Subscriptions

### GTM Event Tracking

Newsletter subscriptions automatically trigger GTM events:
```typescript
pushToDataLayer("newsletter_subscribe", {
  email: email.trim(),
});
```

### Google Analytics

Set up conversion tracking in GA4:
1. Go to GA4 > Admin > Events
2. Mark `newsletter_subscribe` as conversion
3. Track conversions in Google Ads (if applicable)

---

## 🔍 Testing

### Test Subscription

1. Use a test email address
2. Submit newsletter form
3. Check Mailchimp dashboard for new subscriber
4. Verify email received (if double opt-in enabled)

### Check API Response

Monitor browser console for:
- Success: Subscriber added
- Error: Already subscribed, invalid email, etc.

---

## 🚨 Error Handling

### Common Errors

**"Member Exists"**
- Email is already in your list
- User sees friendly message

**"Invalid Email"**
- Email format is incorrect
- Form validation prevents submission

**"API Key Invalid"**
- Check `VITE_MAILCHIMP_API_KEY` is correct
- Verify API key hasn't expired

**"List ID Invalid"**
- Check `VITE_MAILCHIMP_LIST_ID` is correct
- Verify list exists in Mailchimp

**"Server Prefix Invalid"**
- Check `VITE_MAILCHIMP_SERVER_PREFIX` matches API key
- Common values: us1, us2, us3, etc.

---

## 📊 Subscriber Management

### View Subscribers

1. Go to Mailchimp dashboard
2. **Audience** > **All contacts**
3. View subscriber list, segments, tags

### Export Subscribers

1. Go to **Audience** > **All contacts**
2. Click **Export** > **Export as CSV**
3. Download subscriber list

### Unsubscribe Handling

Mailchimp automatically handles:
- Unsubscribe links in emails
- GDPR compliance
- List hygiene

---

## 🔐 Security Best Practices

1. **Never commit API keys** to git
2. **Use environment variables** for all credentials
3. **Enable HTTPS** in production
4. **Validate email addresses** client-side and server-side
5. **Rate limit** subscription requests (prevent abuse)

---

## 🔄 Alternative: Mailchimp Embedded Form

If you prefer not to use API integration:

1. In Mailchimp, go to **Audience** > **Signup forms** > **Embedded forms**
2. Copy the form HTML code
3. Replace newsletter forms with embedded form
4. No API keys needed

**Pros:**
- Simpler setup
- No API configuration
- Built-in Mailchimp styling

**Cons:**
- Less customization
- No direct control over submission
- Harder to track events

---

## 📚 Resources

- [Mailchimp API Documentation](https://mailchimp.com/developer/)
- [Mailchimp API v3 Reference](https://mailchimp.com/developer/api/marketing/)
- [Mailchimp Audience API](https://mailchimp.com/developer/api/marketing/audiences/)

---

## ✅ Checklist

- [ ] Mailchimp account created
- [ ] Audience/list created
- [ ] API key generated
- [ ] List ID copied
- [ ] Server prefix identified
- [ ] Environment variables set
- [ ] Newsletter forms tested
- [ ] GTM event tracking verified
- [ ] Double opt-in configured (optional)
- [ ] Error handling tested

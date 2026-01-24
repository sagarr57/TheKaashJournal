# Newsletter Integration Guide

Complete guide for integrating newsletter subscription functionality with **Brevo** (formerly Sendinblue).

## 🎁 Why Brevo?

**Free Tier Benefits:**
- ✅ **300 emails per day** (9,000/month)
- ✅ **Unlimited contacts**
- ✅ **No credit card required**
- ✅ **Full API access**
- ✅ **Email templates**
- ✅ **Automation workflows**

Perfect for getting started! Upgrade only when you need more than 300 emails/day.

---

## 📧 Brevo Setup

### Step 1: Create Brevo Account

1. Go to [Brevo (Sendinblue)](https://www.brevo.com)
2. Click **"Sign up free"**
3. Fill in your details:
   - **Email**: Your email address
   - **Password**: Create a password
   - **Company name**: The Kaash Journal
4. Verify your email address
5. **No credit card required!**

### Step 2: Create a Contact List

1. In Brevo dashboard, go to **Contacts** > **Lists**
2. Click **"Create a list"**
3. Fill in:
   - **List name**: Newsletter Subscribers
   - **Description**: Subscribers from The Kaash Journal website
4. Click **"Create"**
5. **Copy the List ID** (you'll see it in the URL or list settings)

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

**Example:**
```bash
VITE_BREVO_API_KEY=xkeysib-abc123def456...
VITE_BREVO_LIST_ID=2
```

---

## 🔧 Integration Details

### How It Works

The newsletter integration uses Brevo's API v3 to add subscribers:

1. User enters email in newsletter form
2. Form submits to `subscribeToNewsletter()` function
3. Function calls Brevo API
4. Subscriber is added to your list
5. Success/error message displayed to user

### Newsletter Forms

Newsletter forms are integrated in:
- **Home Page** - "Never Miss an Update" section
- **Sidebar** - "Stay Updated" card (on blog pages)

### Component: NewsletterForm

The `NewsletterForm` component handles:
- Email validation
- API calls to Brevo
- Loading states
- Success/error notifications
- GTM event tracking
- Google Ads conversion tracking (GCLID)

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

Subscribers are immediately added to your list. Brevo will send a welcome email if configured.

### Double Opt-In (Recommended)

To enable double opt-in:

1. In Brevo dashboard, go to **Contacts** > **Lists**
2. Select your list
3. Go to **Settings** > **Double opt-in**
4. Enable **"Require double opt-in"**
5. Customize confirmation email

When enabled, subscribers will receive a confirmation email before being added.

---

## 🎯 Tracking Newsletter Subscriptions

### GTM Event Tracking

Newsletter subscriptions automatically trigger GTM events:
```typescript
pushToDataLayer("newsletter_subscribe", {
  email: email.trim(),
});
```

### Google Ads Conversion Tracking

Subscriptions also track conversions with GCLID:
```typescript
trackConversion("newsletter_signup");
```

This ensures Google Ads can attribute conversions to ad clicks.

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
3. Check Brevo dashboard for new contact
4. Verify email received (if double opt-in enabled)

### Check API Response

Monitor browser console for:
- Success: Contact added
- Error: Already subscribed, invalid email, etc.

---

## 🚨 Error Handling

### Common Errors

**"Contact already exists"**
- Email is already in your list
- User sees friendly message: "You're already subscribed!"

**"Invalid email"**
- Email format is incorrect
- Form validation prevents submission

**"API Key Invalid"**
- Check `VITE_BREVO_API_KEY` is correct
- Verify API key hasn't been revoked
- Make sure you copied the full key

**"List ID Invalid"**
- Check `VITE_BREVO_LIST_ID` is correct
- Verify list exists in Brevo
- List ID should be a number (e.g., `2`, `5`, `10`)

**"Rate limit exceeded"**
- Free tier: 300 emails/day limit
- Wait 24 hours or upgrade plan
- This shouldn't happen with normal usage

---

## 📊 Subscriber Management

### View Subscribers

1. Go to Brevo dashboard
2. **Contacts** > **All contacts**
3. View subscriber list, segments, tags

### Export Subscribers

1. Go to **Contacts** > **All contacts**
2. Click **"Export"**
3. Choose format (CSV, Excel)
4. Download subscriber list

### Send Campaigns

1. Go to **Campaigns** > **Email campaigns**
2. Click **"Create an email campaign"**
3. Choose template or create custom
4. Select your list
5. Send to all subscribers

---

## 🔐 Security Best Practices

1. **Never commit API keys** to git
2. **Use environment variables** for all credentials
3. **Enable HTTPS** in production
4. **Validate email addresses** client-side and server-side
5. **Rate limit** subscription requests (prevent abuse)

---

## 💰 Pricing & Limits

### Free Plan (Current)

- ✅ 300 emails per day
- ✅ Unlimited contacts
- ✅ Email campaigns
- ✅ Automation workflows
- ✅ API access
- ✅ Email support

### When to Upgrade

Upgrade to **Lite Plan** ($25/month) when you need:
- More than 300 emails/day
- Advanced features
- Priority support

---

## 🔄 Alternative: Brevo Embedded Form

If you prefer not to use API integration:

1. In Brevo, go to **Contacts** > **Forms**
2. Create a new form
3. Copy the form embed code
4. Replace newsletter forms with embedded form
5. No API keys needed

**Pros:**
- Simpler setup
- No API configuration
- Built-in Brevo styling

**Cons:**
- Less customization
- No direct control over submission
- Harder to track events

---

## 📚 Resources

- [Brevo API Documentation](https://developers.brevo.com/)
- [Brevo API Reference](https://developers.brevo.com/reference)
- [Brevo Contacts API](https://developers.brevo.com/reference/createcontact)
- [Brevo Free Plan Details](https://www.brevo.com/pricing/)

---

## ✅ Checklist

- [ ] Brevo account created
- [ ] Contact list created
- [ ] API key generated
- [ ] List ID copied
- [ ] Environment variables set (`VITE_BREVO_API_KEY`, `VITE_BREVO_LIST_ID`)
- [ ] Newsletter forms tested
- [ ] GTM event tracking verified
- [ ] Google Ads conversion tracking verified
- [ ] Double opt-in configured (optional)
- [ ] Error handling tested
- [ ] Welcome email configured (optional)

---

## 🆚 Comparison: Brevo vs Mailchimp

| Feature | Brevo (Free) | Mailchimp (Free) |
|---------|--------------|------------------|
| **Emails/day** | 300 | Unlimited* |
| **Contacts** | Unlimited | 500 |
| **API Access** | ✅ Full | ✅ Full |
| **Email Templates** | ✅ | ✅ |
| **Automation** | ✅ | ✅ Limited |
| **Support** | Email | Email |

*Mailchimp free tier has unlimited emails but limited to 500 contacts

**Why Brevo is better for growth:**
- Unlimited contacts means you can grow your list without hitting limits
- 300 emails/day is plenty for newsletters (you send to all subscribers at once)
- Better free tier for serious email marketing
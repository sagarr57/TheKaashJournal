# Deployment Guide

This guide covers deploying The Kaash Journal blog to free hosting platforms.

## Prerequisites

1. **Domain Name** - Purchase a domain from Namecheap, GoDaddy, or similar
2. **GitHub Account** - For GitHub Pages deployment
3. **Vercel Account** - For Vercel deployment (optional)
4. **Mailchimp Account** - For newsletter subscriptions
5. **Google Tag Manager Account** - For analytics and tracking

## Setup Steps

### 1. Google Tag Manager (GTM)

1. Go to [Google Tag Manager](https://tagmanager.google.com)
2. Create a new account and container
3. Copy your GTM ID (format: `GTM-XXXXXXX`)
4. Add it to your `.env` file:
   ```
   VITE_GTM_ID=GTM-XXXXXXX
   ```

### 2. Mailchimp Newsletter

1. Sign up at [Mailchimp](https://mailchimp.com) (free tier available)
2. Create an audience/list
3. Get your API key:
   - Go to Account > Extras > API keys
   - Create a new API key
4. Get your List ID:
   - Go to Audience > All contacts
   - Settings > Audience name and defaults
   - Copy the Audience ID
5. Get your Server Prefix:
   - Found in your API key URL (e.g., `us1.api.mailchimp.com` = `us1`)
6. Add to `.env`:
   ```
   VITE_MAILCHIMP_API_KEY=your_api_key_here
   VITE_MAILCHIMP_LIST_ID=your_list_id_here
   VITE_MAILCHIMP_SERVER_PREFIX=us1
   ```

### 3. Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```bash
cp .env.example .env
```

Fill in your actual values.

## Deployment Options

### Option A: Vercel (Recommended - Easiest)

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy via Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: `client`
     - **Build Command**: `pnpm build`
     - **Output Directory**: `dist`
   - Add environment variables in Settings > Environment Variables
   - Deploy!

3. **Connect Domain**:
   - Go to Project Settings > Domains
   - Add your custom domain
   - Update DNS records as instructed

### Option B: GitHub Pages

1. **Update GitHub Secrets**:
   - Go to your repo > Settings > Secrets and variables > Actions
   - Add all environment variables:
     - `VITE_GTM_ID`
     - `VITE_MAILCHIMP_API_KEY`
     - `VITE_MAILCHIMP_LIST_ID`
     - `VITE_MAILCHIMP_SERVER_PREFIX`

2. **Configure GitHub Pages**:
   - Go to Settings > Pages
   - Source: GitHub Actions
   - The workflow will automatically deploy on push to `main`

3. **Connect Domain**:
   - In Pages settings, add your custom domain
   - Update DNS records:
     - Type: `A` records pointing to GitHub Pages IPs:
       - `185.199.108.153`
       - `185.199.109.153`
       - `185.199.110.153`
       - `185.199.111.153`
     - Or Type: `CNAME` record pointing to `yourusername.github.io`

## Post-Deployment

### 1. Verify GTM

1. Open your site
2. Check browser console for GTM initialization
3. Use GTM Preview mode to verify tags are firing

### 2. Test Newsletter

1. Try subscribing with a test email
2. Check Mailchimp dashboard for new subscribers
3. Verify email confirmation (if double opt-in enabled)

### 3. Access Admin Dashboard

Visit: `https://yourdomain.com/admin`

**Note**: In production, you should add authentication to protect the admin dashboard.

## Troubleshooting

### Newsletter Not Working

- Check Mailchimp API key is correct
- Verify List ID matches your audience
- Check server prefix (us1, us2, etc.)
- Check browser console for errors

### GTM Not Loading

- Verify GTM ID format: `GTM-XXXXXXX`
- Check environment variable is set correctly
- Use GTM Preview mode to debug

### Build Errors

- Ensure all environment variables are set
- Check `pnpm install` completes successfully
- Verify Node.js version (18+)

## Security Notes

1. **Never commit `.env` file** - It's in `.gitignore`
2. **Use environment variables** in hosting platform
3. **Protect admin dashboard** - Add authentication in production
4. **Use HTTPS** - All modern hosting platforms provide this

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Mailchimp API Docs](https://mailchimp.com/developer/)
- [Google Tag Manager Guide](https://support.google.com/tagmanager)

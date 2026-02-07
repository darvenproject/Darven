# Cloudflare Pages Deployment Guide

This guide will help you deploy your Darven frontend to Cloudflare Pages and connect it with your backend.

## Prerequisites

- Cloudflare account
- GitHub/GitLab repository connected to Cloudflare Pages
- Backend deployed and accessible (e.g., at `https://api.shopdarven.pk`)

## Step 1: Connect Repository to Cloudflare Pages

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** > **Pages**
3. Click **Create a project**
4. Connect your Git provider (GitHub/GitLab)
5. Select your repository

## Step 2: Configure Build Settings

In the Cloudflare Pages build configuration, use the following settings:

### Framework preset
- **Framework preset**: Next.js

### Build settings
- **Build command**: `cd client && npm install && npm run build`
- **Build output directory**: `client/.next`
- **Root directory**: `/` (leave as repository root)

### Environment Variables

Add the following environment variables in Cloudflare Pages dashboard:

#### Production Environment
- `NEXT_PUBLIC_API_URL` = `https://api.shopdarven.pk`
- `NODE_VERSION` = `18` (or your preferred Node.js version)

#### Preview Environment (Optional)
- `NEXT_PUBLIC_API_URL` = `https://api-staging.shopdarven.pk` (if you have a staging backend)

## Step 3: Deploy

1. Click **Save and Deploy**
2. Cloudflare will automatically build and deploy your application
3. Your site will be available at `https://<project-name>.pages.dev`

## Step 4: Custom Domain Setup

### Option A: Using Cloudflare DNS (Recommended)

1. In your Cloudflare Pages project, go to **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain (e.g., `shopdarven.pk` or `www.shopdarven.pk`)
4. Cloudflare will automatically configure DNS if your domain is on Cloudflare

### Option B: External DNS

1. Add a CNAME record pointing to `<project-name>.pages.dev`
2. Wait for DNS propagation

## Step 5: Backend Configuration

Your backend has already been updated to allow requests from Cloudflare Pages domains:

- `https://shopdarven.pages.dev` (default Cloudflare Pages domain)
- `https://shopdarven.pk` (your custom domain)

### Update Backend Environment Variables

If you need to add more allowed origins, update the `ALLOWED_ORIGINS` environment variable in your backend:

```bash
ALLOWED_ORIGINS=http://localhost:3000,https://shopdarven.pages.dev,https://shopdarven.pk,https://www.shopdarven.pk
```

## Step 6: Verify Deployment

1. Visit your deployed site: `https://<project-name>.pages.dev`
2. Test the following:
   - Homepage loads correctly
   - Images from backend are displayed
   - API calls work (check browser console for errors)
   - Admin login functionality
   - Cart and checkout flow

## Automatic Deployments

Cloudflare Pages will automatically deploy:
- **Production**: Every push to your main/master branch
- **Preview**: Every push to other branches and pull requests

## Environment-Specific Configuration

### Development
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Production (Cloudflare Pages)
```bash
NEXT_PUBLIC_API_URL=https://api.shopdarven.pk
```

## Troubleshooting

### Issue: CORS Errors

**Solution**: Ensure your backend's `ALLOWED_ORIGINS` includes your Cloudflare Pages domain.

In `server/main.py`:
```python
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS", 
    "http://localhost:3000,https://shopdarven.pages.dev,https://shopdarven.pk"
)
```

### Issue: Images Not Loading

**Solution**: Check that your `next.config.js` includes the correct image domains:
- `api.shopdarven.pk` (for backend uploads)
- `shopdarven.pk` (for frontend assets)

### Issue: API Calls Failing

**Solution**: 
1. Check browser console for errors
2. Verify `NEXT_PUBLIC_API_URL` is set correctly in Cloudflare Pages environment variables
3. Test API endpoint directly: `https://api.shopdarven.pk/health`

### Issue: Build Failures

**Solution**: 
1. Check build logs in Cloudflare Pages dashboard
2. Ensure Node.js version is compatible (set `NODE_VERSION` environment variable)
3. Verify all dependencies are in `package.json`

## Performance Optimization

Cloudflare Pages provides:
- Global CDN
- Automatic SSL/TLS
- HTTP/2 and HTTP/3 support
- Unlimited bandwidth
- Unlimited requests

## Rollback

If you need to rollback to a previous deployment:

1. Go to your Cloudflare Pages project
2. Navigate to **Deployments**
3. Find the previous successful deployment
4. Click **Rollback to this deployment**

## Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Custom Domains](https://developers.cloudflare.com/pages/platform/custom-domains/)

## Migration Checklist

- [x] Remove Netlify configuration (`netlify.toml`)
- [x] Remove `@netlify/plugin-nextjs` dependency
- [x] Create Cloudflare Pages configuration
- [x] Update Next.js config for Cloudflare compatibility
- [x] Update backend CORS to allow Cloudflare domains
- [ ] Run `npm install` in client directory to update dependencies
- [ ] Push changes to Git repository
- [ ] Connect repository to Cloudflare Pages
- [ ] Configure build settings
- [ ] Set environment variables
- [ ] Deploy and test
- [ ] Set up custom domain
- [ ] Verify all functionality works

## Next Steps

1. Run `npm install` in the `client` directory to remove the Netlify dependency
2. Commit and push your changes to Git
3. Follow the deployment steps above
4. Update your DNS if using a custom domain

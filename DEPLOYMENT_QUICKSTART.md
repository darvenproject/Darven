# 🚀 Cloudflare Pages - Quick Deployment Card

## Copy These Exact Settings! 📋

When setting up Cloudflare Pages, use these **exact values**:

```
┌─────────────────────────────────────────────────┐
│  CLOUDFLARE PAGES BUILD CONFIGURATION           │
├─────────────────────────────────────────────────┤
│                                                 │
│  Framework preset:        Next.js               │
│                                                 │
│  Root directory:          client                │
│                           ^^^^^^                │
│                           IMPORTANT!            │
│                                                 │
│  Build command:           npm install &&        │
│                           npm run build         │
│                                                 │
│  Build output directory:  .next                 │
│                                                 │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  ENVIRONMENT VARIABLES                          │
├─────────────────────────────────────────────────┤
│                                                 │
│  NEXT_PUBLIC_API_URL                            │
│    Value: https://api.shopdarven.pk             │
│    Environment: Production                      │
│                                                 │
│  NODE_VERSION                                   │
│    Value: 18                                    │
│    Environment: Production                      │
│                                                 │
└─────────────────────────────────────────────────┘
```

## ⚠️ Common Mistakes

| ❌ WRONG | ✅ CORRECT |
|----------|-----------|
| Root directory: `/` | Root directory: `client` |
| Root directory: (blank) | Root directory: `client` |
| Build output: `client/.next` | Build output: `.next` |
| Build command: `cd client && npm...` | Build command: `npm install && npm run build` |

## 🎯 Quick Steps

1. **Push to Git**
   ```bash
   git add .
   git commit -m "Deploy to Cloudflare Pages"
   git push origin main
   ```

2. **Cloudflare Dashboard**
   - Go to: https://dash.cloudflare.com/
   - Workers & Pages → Create → Pages → Connect to Git
   - Select your repository

3. **Copy Settings Above**
   - Framework: `Next.js`
   - Root directory: `client`
   - Build command: `npm install && npm run build`
   - Build output: `.next`

4. **Add Environment Variables**
   - `NEXT_PUBLIC_API_URL` = `https://api.shopdarven.pk`
   - `NODE_VERSION` = `18`

5. **Deploy**
   - Click "Save and Deploy"
   - Wait 3-5 minutes
   - Done! 🎉

## 🔗 Live URL

Your site will be available at:
```
https://<project-name>.pages.dev
```

## 📚 Need Help?

- **Deployment fails?** → See [CLOUDFLARE_FIX.md](CLOUDFLARE_FIX.md)
- **Detailed guide?** → See [CLOUDFLARE_DEPLOYMENT.md](CLOUDFLARE_DEPLOYMENT.md)
- **General setup?** → See [START_HERE.md](START_HERE.md)

---

**Just copy the settings from the boxes above and you're good to go!** 🚀

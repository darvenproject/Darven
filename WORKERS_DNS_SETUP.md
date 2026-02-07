# 🔧 DNS Setup for Cloudflare Workers

## Your Cloudflare Workers URL

```
https://shopdarven.shopdarven.workers.dev
```

---

## 🎯 CNAME Records for Custom Domain

To point your custom domain (`shopdarven.pk`) to your Cloudflare Workers deployment:

### DNS Records You Need:

```
Type    Name              Target                               Proxy
CNAME   shopdarven.pk     shopdarven.shopdarven.workers.dev    Proxied (🟠)
CNAME   www               shopdarven.shopdarven.workers.dev    Proxied (🟠)
```

---

## ✅ Step-by-Step DNS Update

### Step 1: Update Root Domain (shopdarven.pk)

1. **Go to Cloudflare Dashboard**
   - https://dash.cloudflare.com/
   - Select your domain
   - Go to **DNS** → **Records**

2. **Delete the old A record**
   - Find: `A` record for `shopdarven.pk` pointing to `75.2.60.5`
   - Click **Edit** → **Delete**

3. **Add new CNAME record**
   - Click **Add record**
   - Type: `CNAME`
   - Name: `@` (this represents shopdarven.pk)
   - Target: `shopdarven.shopdarven.workers.dev`
   - Proxy status: **Proxied** (orange cloud 🟠)
   - TTL: Auto
   - Click **Save**

### Step 2: Update WWW Subdomain

1. **Edit existing www CNAME**
   - Find: `CNAME` record for `www` pointing to `shopdarven.netlify.app`
   - Click **Edit**

2. **Update the target**
   - Name: `www` (keep as is)
   - Target: `shopdarven.shopdarven.workers.dev` (change this)
   - Proxy status: **Proxied** (orange cloud 🟠)
   - Click **Save**

### Step 3: Keep API Record (Don't Touch!)

```
A       api       5.223.61.239       DNS only
```

**Leave this unchanged** - it's for your backend API!

---

## 📋 Final DNS Configuration

After updates, your DNS should look like:

```
Type    Name              Target                               Proxy Status
A       api               5.223.61.239                         DNS only ⚪
CNAME   shopdarven.pk     shopdarven.shopdarven.workers.dev    Proxied 🟠
CNAME   www               shopdarven.shopdarven.workers.dev    Proxied 🟠
```

---

## ⚠️ Important Note About Workers Custom Domains

After updating DNS, you also need to **add the custom domain in Workers settings**:

### Add Custom Domain to Worker:

1. **Go to Workers & Pages**
   - https://dash.cloudflare.com/
   - Workers & Pages
   - Click on your worker (`shopdarven`)

2. **Add Custom Domain**
   - Go to **Settings** → **Triggers** or **Domains & Routes**
   - Click **Add Custom Domain**
   - Enter: `shopdarven.pk`
   - Click **Add Custom Domain**

3. **Add www subdomain**
   - Click **Add Custom Domain** again
   - Enter: `www.shopdarven.pk`
   - Click **Add Custom Domain**

4. **Cloudflare will verify DNS**
   - If DNS is correct, it will activate immediately
   - SSL certificate will be provisioned automatically

---

## 🔍 CNAME Explanation

### What is CNAME?

**CNAME (Canonical Name)** = An alias that points one domain to another

### Your CNAME Setup:

```
shopdarven.pk  →  shopdarven.shopdarven.workers.dev
     ↑                           ↑
  Your domain              Workers URL
```

When someone visits `shopdarven.pk`, DNS says:
- "This is an alias for `shopdarven.shopdarven.workers.dev`"
- Browser then loads content from Workers
- URL bar still shows `shopdarven.pk`

---

## 🎯 Quick CNAME Setup Summary

### For Root Domain (shopdarven.pk):

```
Type:   CNAME
Name:   @
Target: shopdarven.shopdarven.workers.dev
Proxy:  Proxied (orange cloud)
```

### For WWW Subdomain:

```
Type:   CNAME
Name:   www
Target: shopdarven.shopdarven.workers.dev
Proxy:  Proxied (orange cloud)
```

---

## ⚡ Alternative: Use Cloudflare Pages Instead

**Question:** Are you deploying a Next.js app?

**If YES**, you should use **Cloudflare Pages**, not Workers!

### Why Cloudflare Pages for Next.js?

- ✅ Built for static sites and SSR frameworks
- ✅ Next.js is officially supported
- ✅ Easier deployment
- ✅ Better for your use case
- ✅ Free SSL and custom domains

### How to Switch to Pages:

1. Go to **Workers & Pages** → **Create application** → **Pages**
2. Connect to Git
3. Deploy your Next.js app
4. You'll get a `.pages.dev` URL instead
5. Then use that for CNAME

**Do you want to switch to Cloudflare Pages?** (Recommended for Next.js)

---

## 🚨 Current Situation Analysis

### You Currently Have:
- ❓ Cloudflare Workers deployment (`.workers.dev`)
- ❓ Next.js application

### You Should Have:
- ✅ Cloudflare Pages deployment (`.pages.dev`)
- ✅ Next.js application

**Workers is for serverless functions, Pages is for websites/apps!**

---

## 🎯 Recommended Next Steps

### Option 1: Use Workers (Current Setup)

**CNAME Setup:**
```
CNAME   shopdarven.pk     shopdarven.shopdarven.workers.dev
CNAME   www               shopdarven.shopdarven.workers.dev
```

Then add custom domains in Workers settings.

### Option 2: Switch to Pages (Recommended for Next.js)

1. Deploy to Cloudflare Pages instead
2. Get a `.pages.dev` URL
3. Use that for CNAME
4. Easier management and better for Next.js

---

## 📖 CNAME vs A Record

### A Record:
- Points to an IP address (e.g., `75.2.60.5`)
- Example: `shopdarven.pk → 75.2.60.5`

### CNAME Record:
- Points to another domain name
- Example: `shopdarven.pk → shopdarven.shopdarven.workers.dev`
- Better for cloud services (Workers, Pages, etc.)

**For Workers/Pages, use CNAME!**

---

## ✅ Verification

After setting up CNAME:

1. **Check DNS:**
   ```powershell
   nslookup shopdarven.pk
   ```
   Should show CNAME to `.workers.dev`

2. **Visit your domain:**
   ```
   https://shopdarven.pk
   ```
   Should load your Workers/app

3. **Check SSL:**
   - Look for 🔒 padlock
   - Certificate should be from Cloudflare

---

## ⏱️ Timeline

- DNS update: Immediate
- Custom domain in Workers: 1-2 minutes
- SSL certificate: 5-15 minutes
- Fully working: 5-30 minutes

---

## 🤔 Still Confused?

**Let me know:**
1. Are you deploying a Next.js app or a Worker script?
2. Do you want to switch to Cloudflare Pages?
3. Do you want to continue with Workers?

I'll give you the exact CNAME records you need!

# 🌐 Move Domain from Netlify to Cloudflare Pages

## Your Situation

✅ **DNS already on Cloudflare** - This makes it super easy!  
🔄 **Need to switch from Netlify to Cloudflare Pages**

---

## 🚀 Quick Migration Steps

### Step 1: Connect Your Domain to Cloudflare Pages

1. **Go to your Cloudflare Pages project**
   - Navigate to your project (e.g., `darven-frontend`)
   - Click **Custom domains** tab

2. **Add your custom domain**
   - Click **Set up a custom domain**
   - Enter your domain: `shopdarven.pk`
   - Click **Continue**

3. **Cloudflare automatically configures DNS**
   - Since your DNS is on Cloudflare, it will auto-configure!
   - You'll see: "DNS records added automatically"
   - Click **Activate domain**

### Step 2: Remove Domain from Netlify

1. **Go to Netlify dashboard**
   - Open your Netlify site settings
   - Navigate to **Domain management** → **Domains**

2. **Remove custom domain**
   - Find `shopdarven.pk`
   - Click **Options** → **Remove domain**
   - Confirm removal

3. **You can now delete the Netlify site** (optional)
   - If you don't need it anymore
   - Settings → **General** → **Delete site**

---

## 📋 Detailed Steps with Screenshots Guide

### Part 1: Cloudflare Pages - Add Domain

#### 1. Access Your Cloudflare Pages Project

```
https://dash.cloudflare.com/
→ Workers & Pages
→ Your project (e.g., darven-frontend)
→ Custom domains tab
```

#### 2. Add Custom Domain

Click **Set up a custom domain** button

**Enter domain:**
```
shopdarven.pk
```

**OR if you want www subdomain:**
```
www.shopdarven.pk
```

**Recommended:** Add both!
- Add `shopdarven.pk` (apex domain)
- Add `www.shopdarven.pk` (www subdomain)
- Set up redirect from one to the other

#### 3. DNS Configuration (Auto-Configured)

Cloudflare will show you:
```
✅ DNS records added automatically

Type: CNAME
Name: shopdarven.pk
Value: darven-frontend.pages.dev
Proxied: Yes
```

Click **Activate domain**

---

### Part 2: Netlify - Remove Domain

#### 1. Go to Netlify Site Settings

```
https://app.netlify.com/
→ Your site
→ Domain management
→ Domains
```

#### 2. Remove Custom Domain

Find: `shopdarven.pk`

Click: **Options** → **Remove domain**

Confirm: Yes, remove domain

---

## 🎯 DNS Records to Check/Update

Since your DNS is on Cloudflare, you might need to update these records:

### Before (Netlify):
```
Type: CNAME
Name: shopdarven.pk (or www)
Value: your-site.netlify.app
```

### After (Cloudflare Pages):
```
Type: CNAME
Name: shopdarven.pk
Value: darven-frontend.pages.dev
Proxied: Yes (orange cloud)
```

**Note:** If you add the domain through Cloudflare Pages UI, this happens automatically!

---

## 🔍 How to Check DNS Records

### In Cloudflare Dashboard:

1. Go to **DNS** → **Records**
2. Look for your domain records
3. You should see:

```
Type    Name              Value                        Proxy
CNAME   shopdarven.pk     darven-frontend.pages.dev    Proxied
CNAME   www               darven-frontend.pages.dev    Proxied
```

---

## ⚡ Quick Method (Recommended)

Since your DNS is already on Cloudflare:

1. **In Cloudflare Pages:**
   - Go to your project
   - Custom domains → Set up a custom domain
   - Enter `shopdarven.pk`
   - Cloudflare handles everything automatically! ✨

2. **In Netlify:**
   - Remove the domain
   - Done!

**Total time: 2-3 minutes**

---

## 🎭 WWW vs Non-WWW

### Option 1: Use Non-WWW (Recommended)
```
Primary: shopdarven.pk
Redirect: www.shopdarven.pk → shopdarven.pk
```

### Option 2: Use WWW
```
Primary: www.shopdarven.pk
Redirect: shopdarven.pk → www.shopdarven.pk
```

### How to Set Up Redirects in Cloudflare Pages:

1. Add both domains in Custom domains
2. Cloudflare Pages automatically handles www redirects
3. Choose your preferred domain in the UI

---

## 🔒 SSL/TLS Certificate

### Good News:
✅ **Cloudflare automatically provides SSL certificates**
- Free SSL/TLS included
- Auto-renewal
- Universal SSL (covers www and non-www)

### Wait Time:
- Certificate issued: ~2 minutes
- Fully propagated: ~15 minutes
- Sometimes up to 24 hours (rare)

### Check SSL Status:

1. In Cloudflare Dashboard:
   - SSL/TLS → Edge Certificates
   - Look for Universal SSL Certificate: Active ✅

---

## 📊 Migration Timeline

| Step | Time | Status |
|------|------|--------|
| Add domain in Cloudflare Pages | 1 min | Immediate |
| DNS updates (auto) | 1 min | Immediate |
| SSL certificate issued | 2-5 min | Auto |
| Domain fully active | 5-15 min | Wait |
| Remove from Netlify | 1 min | After CF active |

**Total Migration Time: 10-20 minutes**

---

## ✅ Verification Steps

### 1. Check Domain is Connected

Visit: `https://shopdarven.pk`

You should see your Cloudflare Pages site!

### 2. Check SSL Certificate

In browser:
- Look for padlock 🔒 in address bar
- Click it → Certificate should show "Cloudflare"

### 3. Check DNS

```bash
# On Windows PowerShell
nslookup shopdarven.pk

# On Mac/Linux
dig shopdarven.pk
```

Should point to Cloudflare IPs (104.x.x.x or 172.x.x.x range)

---

## 🚨 Common Issues & Solutions

### Issue 1: "Domain already in use"

**Problem:** Domain still registered to Netlify  
**Solution:** Remove domain from Netlify first, wait 5 minutes, then add to Cloudflare

### Issue 2: SSL Certificate Pending

**Problem:** "SSL Certificate Pending" message  
**Solution:** 
- Wait 15-30 minutes
- Check SSL/TLS mode is set to "Full" or "Flexible"
- If still pending after 24h, contact Cloudflare support

### Issue 3: Site Shows Old Netlify Content

**Problem:** Browser cache  
**Solution:**
- Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache
- Try incognito/private mode
- Wait for DNS propagation (up to 24h)

### Issue 4: DNS Not Updating

**Problem:** DNS still points to Netlify  
**Solution:**
- Check Cloudflare DNS records manually
- Update CNAME record manually if needed:
  - Type: CNAME
  - Name: @ (for shopdarven.pk) or www
  - Target: your-project.pages.dev
  - Proxy: On (orange cloud)

---

## 🎯 Step-by-Step Checklist

### Before Migration:
- [ ] Your site is deployed on Cloudflare Pages
- [ ] Deployment is successful
- [ ] Site works at `https://your-project.pages.dev`

### Migration Steps:
- [ ] Go to Cloudflare Pages → Custom domains
- [ ] Add `shopdarven.pk`
- [ ] Add `www.shopdarven.pk` (optional but recommended)
- [ ] Wait for DNS to auto-configure (1-2 minutes)
- [ ] Verify domain is active in Cloudflare
- [ ] Test: visit `https://shopdarven.pk`
- [ ] Go to Netlify → Remove domain
- [ ] Optionally delete Netlify site

### After Migration:
- [ ] Test all pages work
- [ ] Check SSL certificate is active
- [ ] Test on mobile
- [ ] Update any external links if needed
- [ ] Monitor for 24-48 hours

---

## 📝 Quick Commands Reference

### Check DNS:
```bash
# Windows
nslookup shopdarven.pk
nslookup www.shopdarven.pk

# Mac/Linux
dig shopdarven.pk
dig www.shopdarven.pk
```

### Check SSL:
```bash
# Check SSL certificate
curl -I https://shopdarven.pk

# Should return HTTP/2 200 with Cloudflare headers
```

---

## 🎉 After Migration Success

Once your domain is live on Cloudflare Pages:

✅ **Faster global performance** - Cloudflare's edge network  
✅ **Better DDoS protection** - Cloudflare security  
✅ **Free SSL** - Auto-renewing certificates  
✅ **Unlimited bandwidth** - No limits on Cloudflare Pages  
✅ **Better caching** - Cloudflare CDN  

---

## 📞 Need Help?

### Cloudflare Support:
- Community: https://community.cloudflare.com/
- Docs: https://developers.cloudflare.com/pages/

### Check Status:
- Cloudflare Status: https://www.cloudflarestatus.com/
- Your domain's Cloudflare dashboard

---

## 🚀 Quick Start (TL;DR)

**If you're in a hurry:**

1. Cloudflare Pages → Custom domains → Add `shopdarven.pk`
2. Wait 5 minutes
3. Netlify → Remove domain
4. Done! ✅

**Your DNS is already on Cloudflare, so it's automatic!**

---

## 📊 Expected Results

### Immediately After Adding Domain:
```
✅ DNS records auto-configured
✅ Domain shows in Cloudflare Pages
⏳ SSL certificate provisioning
```

### After 5-15 minutes:
```
✅ SSL certificate active
✅ Domain fully accessible
✅ HTTPS working
```

### After 24 hours:
```
✅ DNS fully propagated globally
✅ All visitors see new site
✅ Old Netlify site completely replaced
```

---

**Since your DNS is already on Cloudflare, this migration should take less than 5 minutes!** 🎉

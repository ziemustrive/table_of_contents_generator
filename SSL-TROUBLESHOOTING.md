# SSL Certificate Troubleshooting Guide

## Issue: `net::ERR_CERT_AUTHORITY_INVALID` on Vercel

This error occurs when your browser cannot verify the SSL certificate for your Vercel deployment.

## Quick Fixes

### 1. Clear Browser Cache
```bash
# Chrome/Edge: Clear browsing data
# Settings > Privacy and security > Clear browsing data
# Select "Cached images and files" and "Cookies and other site data"
```

### 2. Try Incognito Mode
- Open your site in incognito/private browsing mode
- This bypasses cached SSL certificates

### 3. Browser-Specific Solutions

#### Chrome/Edge:
1. Go to `chrome://settings/certificate`
2. Check if any certificates are blocked
3. Restart browser completely

#### Safari:
1. Go to Safari > Preferences > Privacy
2. Click "Manage Website Data"
3. Remove vercel.app entries
4. Restart Safari

#### Firefox:
1. Go to `about:config`
2. Search for `security.tls.insecure_fallback_hosts`
3. Add `tocgenerator.vercel.app` if needed

### 4. Network Solutions
- Try different WiFi network
- Use mobile data as alternative
- Disable VPN temporarily
- Flush DNS: `ipconfig /flushdns` (Windows)

## Applied Fixes in This Project

### Security Headers (vercel.json)
- HSTS (Strict Transport Security)
- Content Security Policy
- HTTPS redirects
- XSS protection

### HTML Optimizations
- SSL upgrade meta tags
- Browser compatibility headers
- Asset loading optimizations

### React Optimizations
- Proper asset path handling
- Error fallbacks for images
- HTTPS-first approach

## If Issues Persist

### 1. Vercel Dashboard
1. Go to Vercel dashboard
2. Check deployment logs
3. Verify custom domain settings
4. Check SSL certificate status

### 2. Temporary Solutions
- Use alternative domain: `https://tocgenerator-[project-hash].vercel.app`
- Deploy to Netlify as backup
- Use GitHub Pages for testing

### 3. Contact Support
If the issue persists for more than 24 hours:
- Vercel support: support@vercel.com
- Include deployment URL and error screenshots
- Mention applied security headers

## Prevention

### Regular Maintenance
- Keep dependencies updated
- Monitor SSL certificate expiry
- Test deployments regularly
- Use automated SSL monitoring

### Best Practices
- Always use HTTPS URLs
- Implement proper security headers
- Test across multiple browsers
- Monitor deployment health

## Deployment Commands

```bash
# Deploy with SSL fixes
npm run build
npx vercel --prod

# Or use the deployment script
chmod +x deploy.sh
./deploy.sh
```

## Expected Timeline

- **Immediate**: Security headers take effect
- **5-10 minutes**: SSL certificate propagation
- **30 minutes**: Full DNS propagation
- **24 hours**: Complete SSL stabilization

If issues persist beyond 24 hours, contact Vercel support with your deployment details.

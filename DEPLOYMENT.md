# Deployment Guide

## Quick Deploy Options

### Option 1: GitHub Pages (Recommended)

1. **Enable GitHub Pages:**
   - Go to your repository settings
   - Navigate to "Pages" section
   - Select "main" branch as source
   - Click "Save"

2. **Access your dashboard:**
   - URL: `https://jasonshengh.github.io/training-data/`
   - Updates automatically when you push changes

### Option 2: Netlify

1. **Deploy via Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - No build settings needed (static site)
   - Click "Deploy"

2. **Your dashboard will be live at:**
   - `https://your-site-name.netlify.app`

### Option 3: Vercel

1. **Deploy via Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - No configuration needed
   - Click "Deploy"

2. **Access at:**
   - `https://your-project.vercel.app`

### Option 4: Local Network Access

1. **Start the server:**
   ```bash
   python -m http.server 8000
   ```

2. **Find your local IP:**
   ```bash
   ipconfig  # On Windows
   ifconfig  # On Mac/Linux
   ```

3. **Access from other devices:**
   - `http://YOUR_LOCAL_IP:8000/index.html`
   - Example: `http://192.168.1.100:8000/index.html`

## File Requirements

All files must be in the same directory:
- index.html
- app.js
- charts.js
- utils.js
- styles.css

The dashboard fetches data from GitHub URLs, so no additional data files are needed for deployment.

## CORS Considerations

The dashboard fetches data from:
- `https://raw.githubusercontent.com/JasonShenGH/training-data/main/latest.json`
- `https://raw.githubusercontent.com/JasonShenGH/training-data/main/history.json`

These URLs support CORS, so the dashboard works from any domain.

## Custom Domain Setup

### GitHub Pages with Custom Domain

1. Add a `CNAME` file with your domain:
   ```
   training.yourdomain.com
   ```

2. Configure DNS:
   - Add CNAME record pointing to `jasonshengh.github.io`

3. Enable HTTPS in GitHub Pages settings

### Netlify/Vercel Custom Domain

1. Go to domain settings in your deployment platform
2. Add your custom domain
3. Follow DNS configuration instructions
4. SSL is automatically provisioned

## Environment-Specific Configuration

### Production URLs
The dashboard is pre-configured with production GitHub URLs:
```javascript
const LATEST_URL = 'https://raw.githubusercontent.com/JasonShenGH/training-data/main/latest.json';
const HISTORY_URL = 'https://raw.githubusercontent.com/JasonShenGH/training-data/main/history.json';
```

### Development/Testing
To test with local files, modify `app.js`:
```javascript
const LATEST_URL = '/latest.json';
const HISTORY_URL = '/history.json';
```

## Performance Tips

1. **CDN Caching**: All libraries (Tailwind, Chart.js) are loaded from CDN
2. **Data Caching**: Data is cached for 5 minutes in sessionStorage
3. **Lazy Loading**: Charts only render after data is loaded
4. **Compression**: Enable gzip compression on your server for faster loading

## Security Considerations

- No authentication required (public data)
- No sensitive data stored
- All data fetched from public GitHub URLs
- No backend server needed
- No API keys or secrets

## Monitoring

### Check Dashboard Health
- Open browser console (F12)
- Look for any error messages
- Verify data fetching succeeds
- Check chart rendering

### Server Logs
If self-hosting, monitor server logs for:
- 200 status codes (success)
- 404 errors (missing files)
- 500 errors (server issues)

## Updating the Dashboard

1. **Code changes:**
   - Edit the files locally
   - Test with local server
   - Commit and push to GitHub

2. **Data updates:**
   - Data automatically fetches from GitHub
   - No dashboard changes needed
   - Auto-refresh every 5 minutes

## Backup

Recommended backup strategy:
- Keep all files in version control (Git)
- Tag releases for major updates
- Document any custom modifications

## Support

For issues or questions:
1. Check browser console for errors
2. Review USAGE.md for common problems
3. Verify data URLs are accessible
4. Test in different browser

---

**Current Status**: Dashboard is deployed locally and ready for production deployment!

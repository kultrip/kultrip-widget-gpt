# Kultrip Widget Deployment

## 🎉 Deployment Status: SUCCESS

The Kultrip Widget has been successfully deployed to Firebase hosting!

### 🌐 URLs
- **Firebase URL**: https://kultrip-widget.web.app
- **Custom Domain**: https://widget.kultrip.com (DNS already configured)

### 📋 Widget Files
- **JavaScript Bundle**: `kultrip-widget.umd.js` (3.9MB, 862KB gzipped)
- **CSS Styles**: `kultrip-widget.css` (124KB, 20KB gzipped)

### 🔧 How to Embed the Widget

#### Option 1: Using Custom Domain (Recommended)
```html
<script src="https://widget.kultrip.com/kultrip-widget.umd.js"></script>
<link rel="stylesheet" href="https://widget.kultrip.com/kultrip-widget.css">
```

#### Option 2: Using Firebase URL
```html
<script src="https://kultrip-widget.web.app/kultrip-widget.umd.js"></script>
<link rel="stylesheet" href="https://kultrip-widget.web.app/kultrip-widget.css">
```

### 🚀 Deployment Process

The widget is deployed using the `deploy.sh` script which:
1. Builds the widget with `npm run build:widget`
2. Authenticates with Firebase using service account credentials
3. Deploys to the `kultrip-widget` site in the `kultrip-1c90c` project

#### To deploy updates:
```bash
./deploy.sh
```

### ⚙️ Configuration

- **Firebase Project**: `kultrip-1c90c`
- **Firebase Site**: `kultrip-widget`
- **Authentication**: Service account key (`kultrip-key.json`)
- **Build Config**: `vite.widget.config.ts`

### 🔒 Security Features

- CORS headers configured for cross-origin embedding
- Cache control headers for optimal performance
- Secure authentication using service account

### 📞 Next Steps

1. **Custom Domain Setup**: The DNS is already configured, but you may need to verify the domain in Firebase Console:
   - Go to: https://console.firebase.google.com/project/kultrip-1c90c/hosting/main
   - Add custom domain: `widget.kultrip.com`

2. **Testing**: Verify the widget works by embedding it in a test HTML page

3. **Monitoring**: Monitor usage and performance through Firebase Console

### 🛠️ Troubleshooting

If deployment fails:
- Ensure `kultrip-key.json` exists in the project root
- Verify Firebase CLI is installed: `npm install -g firebase-tools`
- Check that the build completes successfully: `npm run build:widget`

### 📋 Widget Features

The deployed widget includes:
- ✅ Chat interface matching story-trip-ai functionality
- ✅ Preference cards for user input
- ✅ Story suggestions and journey preview
- ✅ OpenAI integration for AI responses
- ✅ Supabase integration for lead saving
- ✅ Internationalization support
- ✅ Responsive design with Tailwind CSS
- ✅ Cross-origin embedding support
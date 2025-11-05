# 🌍 Kultrip Widget Integration Suite

A comprehensive collection of integration solutions for embedding the **Kultrip AI-powered travel widget** into different platforms and frameworks.

## 🚀 Live Widget

**Widget URL**: https://widget.kultrip.com  
**Language Support**: Spanish & English (auto-detection + manual override)

## 📦 Integration Methods

This repository provides **three complete integration solutions**:

### 1. **WordPress Plugin** 📦
**Location:** [`wordpress-plugin/kultrip-widget/`](./wordpress-plugin/kultrip-widget/)

Complete WordPress plugin with shortcode and Gutenberg block support.

**Features:**
- ✅ Shortcode: `[kultrip_widget]`
- ✅ Gutenberg visual block editor
- ✅ Admin settings page
- ✅ Multi-language support
- ✅ Performance optimized

**Installation:**
```bash
# Download and install
cp -r wordpress-plugin/kultrip-widget /path/to/wp-content/plugins/
# Activate in WordPress admin → Settings → Kultrip Widget
```

**Usage:**
```php
[kultrip_widget user_id="YOUR_AGENCY_ID" language="es" height="600px"]
```

### 2. **React Component** ⚛️  
**Location:** [`react-demo/`](./react-demo/)

TypeScript React component with dynamic loading and error handling.

**Features:**
- ✅ TypeScript with full type safety
- ✅ Dynamic script loading
- ✅ Error handling & loading states
- ✅ Multiple widget support
- ✅ React hooks integration

**Installation:**
```bash
cd react-demo
npm install
npm run dev  # Opens at http://localhost:3000
```

**Usage:**
```tsx
import KultripWidget from './KultripWidget';

function TravelPage() {
  return (
    <KultripWidget 
      userId="YOUR_AGENCY_ID"
      language="es"
      height={600}
      onLoad={() => console.log('Widget loaded!')}
    />
  );
}
```

### 3. **Local HTML Test** 🌐
**Location:** [`local-test.html`](./local-test.html)

Interactive test page for local development and testing.

**Features:**
- ✅ Real-time configuration
- ✅ Browser language detection
- ✅ Live embed code generation
- ✅ Enhanced UI with modern design

**Usage:**
```bash
# Build widget first
npm run build:widget

# Open in browser
open local-test.html
```

## 🔧 Quick Integration

### HTML (Universal)
```html
<!-- Load widget assets -->
<link rel="stylesheet" href="https://widget.kultrip.com/kultrip-widget.css">
<script src="https://widget.kultrip.com/kultrip-widget.umd.js"></script>

<!-- Widget container -->
<div id="kultrip-widget" style="width:100%;height:600px;"></div>

<!-- Initialize -->
<script>
document.addEventListener('DOMContentLoaded', function() {
  if (window.KultripWidget) {
    window.KultripWidget.init('kultrip-widget', {
      userId: 'YOUR_AGENCY_ID',
      language: 'es' // 'en', 'es', or omit for auto-detect
    });
  }
});
</script>
```

### React/Next.js
```tsx
import { useEffect, useRef } from 'react';

export default function KultripWidget({ userId = "YOUR_AGENCY_ID" }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://widget.kultrip.com/kultrip-widget.css';
    document.head.appendChild(link);

    // Load JS and initialize
    const script = document.createElement('script');
    script.src = 'https://widget.kultrip.com/kultrip-widget.umd.js';
    script.onload = () => {
      if (window.KultripWidget && containerRef.current) {
        window.KultripWidget.init('kultrip-widget-container', { userId });
      }
    };
    document.head.appendChild(script);
  }, [userId]);

  return <div id="kultrip-widget-container" ref={containerRef} style={{width:'100%',height:'600px'}} />;
}
```

### WordPress
```php
// Shortcode method
[kultrip_widget user_id="YOUR_AGENCY_ID"]

// PHP template method  
<?php echo do_shortcode('[kultrip_widget]'); ?>

// Custom implementation
<div id="kultrip-widget"></div>
<?php wp_enqueue_style('kultrip-css', 'https://widget.kultrip.com/kultrip-widget.css'); ?>
<?php wp_enqueue_script('kultrip-js', 'https://widget.kultrip.com/kultrip-widget.umd.js'); ?>
<script>
jQuery(document).ready(function() {
  if (window.KultripWidget) {
    window.KultripWidget.init('kultrip-widget', {
      userId: '<?php echo esc_js(get_option("kultrip_agency_id")); ?>'
    });
  }
});
</script>
```

## 🌐 Language Support

The widget supports **automatic language detection** plus manual override:

```javascript
// Auto-detect from browser language
window.KultripWidget.init('container', { userId: 'AGENCY_ID' });

// Force Spanish
window.KultripWidget.init('container', { 
  userId: 'AGENCY_ID', 
  language: 'es' 
});

// Force English  
window.KultripWidget.init('container', { 
  userId: 'AGENCY_ID', 
  language: 'en' 
});
```

**Detection Logic:**
- Browser language starts with `es` → Spanish widget
- All others → English widget
- Manual `language` parameter overrides detection

## 📁 Repository Structure

```
kultrip-widget-gpt/
├── 📦 wordpress-plugin/
│   └── kultrip-widget/
│       ├── kultrip-widget.php      # Main plugin file
│       ├── block.js               # Gutenberg block
│       └── README.md              # WordPress documentation
├── ⚛️ react-demo/
│   ├── src/
│   │   ├── KultripWidget.tsx      # React component
│   │   ├── App.tsx               # Demo application
│   │   └── App.css               # Styling
│   ├── package.json              # Dependencies
│   └── README.md                 # React documentation
├── 🌐 local-test.html             # Interactive test page
├── 🔧 simple-test.html            # Basic test page
├── 🔧 widget-production-test.html # Production test
└── 📖 README.md                  # This file
```

## 🛠️ Development

### For Widget Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build widget for production
npm run build:widget

# Test locally
open local-test.html
```

### For React Demo
```bash
cd react-demo
npm install
npm run dev  # http://localhost:3000
```

### For WordPress Plugin
```bash
# Copy to WordPress installation
cp -r wordpress-plugin/kultrip-widget /path/to/wp-content/plugins/
# Activate in WordPress admin
```

## 🔍 Testing & Debugging

### Browser Console Logs
The widget provides console logging for debugging:

```javascript
// Enable debug logs
localStorage.setItem('kultrip-debug', 'true');

// Check widget status
console.log('KultripWidget available:', !!window.KultripWidget);
console.log('Browser language:', navigator.language);
```

### Common Issues

**Widget doesn't appear:**
- ✅ Check browser console for errors
- ✅ Verify agency ID is correct
- ✅ Ensure site allows loading from `widget.kultrip.com`

**Language not working:**
- ✅ Check `navigator.language` in console
- ✅ Use `language: 'es'` or `language: 'en'` to force
- ✅ Verify CDN files are loading

**React component issues:**
- ✅ Check that container ID is unique
- ✅ Ensure scripts load before initialization
- ✅ Use `useEffect` with proper dependencies

## 📞 Support

- **Widget Issues**: Check browser console and verify agency ID
- **WordPress Issues**: Ensure WordPress 5.0+ and modern PHP
- **React Issues**: Check console logs and component lifecycle
- **Agency Questions**: Contact Kultrip support

## 📄 License

This integration suite is provided as examples and utilities. The Kultrip widget itself is subject to Kultrip's terms of service.

---

🚀 **Ready to integrate?** Choose your platform above and follow the integration guide!
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/907415cd-e4f2-4db3-8573-69d9bb26505c) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

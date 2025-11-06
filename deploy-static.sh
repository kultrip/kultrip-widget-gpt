#!/bin/bash

echo "🚀 Kultrip Widget Deployment"
echo "Building widget files..."

# Build the widget
npm run build:widget

echo "✅ Widget built successfully"
echo "📁 Files in dist:"
ls -la dist/

echo ""
echo "🌐 Deployment options:"
echo "1. Manual: Upload the 'dist' folder to any static hosting service"
echo "2. Netlify: Drag and drop the 'dist' folder to netlify.com/drop"
echo "3. Vercel: Run 'npx vercel --prod dist'"
echo "4. GitHub Pages: Push to gh-pages branch"
echo ""
echo "📋 Files to serve:"
echo "   - kultrip-widget.umd.js (JavaScript)"
echo "   - kultrip-widget.css (Styles)"
echo "   - index.html (Server status page)"
echo ""
echo "🔗 After deployment, update your integration URLs to match the deployed domain"
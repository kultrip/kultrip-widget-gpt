#!/bin/bash

# Kultrip Widget Deployment Script
# Builds and deploys the widget to Firebase hosting with custom domain widget.kultrip.com

set -e  # Exit on any error

echo "🚀 Starting Kultrip Widget deployment..."

# Check if service account key exists
if [ ! -f "kultrip-key.json" ]; then
    echo "❌ Service account key file (kultrip-key.json) not found"
    exit 1
fi

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed. Please install it with: npm install -g firebase-tools"
    exit 1
fi

echo "📦 Building the widget..."
npm run build:widget

# Verify build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

if [ ! -f "dist/kultrip-widget.umd.js" ]; then
    echo "❌ Build failed - widget bundle not found"
    exit 1
fi

echo "✅ Build completed successfully"
echo "   - kultrip-widget.umd.js: $(du -h dist/kultrip-widget.umd.js | cut -f1)"
echo "   - kultrip-widget.css: $(du -h dist/kultrip-widget.css | cut -f1)"

echo "🌐 Deploying to Firebase hosting..."
export GOOGLE_APPLICATION_CREDENTIALS=kultrip-key.json
firebase deploy --only hosting --project kultrip-1c90c

echo "🎉 Deployment completed successfully!"
echo "🔗 Widget is now available at: https://widget.kultrip.com"
echo "📋 To embed the widget, use:"
echo '   <script src="https://widget.kultrip.com/kultrip-widget.umd.js"></script>'
echo '   <link rel="stylesheet" href="https://widget.kultrip.com/kultrip-widget.css">'
#!/bin/bash

echo "🚀 Kultrip Widget & Demo Deployment"
echo "==================================="

# Construir widget
echo "📦 Construyendo widget..."
npm run build:widget

# Crear directorio para demo
echo "📱 Preparando demo..."
mkdir -p demo-build
npm run build
cp -r dist/* demo-build/
rm -rf dist/*
npm run build:widget

# Mostrar archivos
echo "✅ Archivos listos:"
echo ""
echo "📁 Widget Files (dist/):"
ls -la dist/
echo ""
echo "📁 Demo Files (demo-build/):"  
ls -la demo-build/
echo ""
echo "🌐 Opciones de Deploy:"
echo "1. Netlify Drop: Arrastrar carpetas a netlify.com/drop"
echo "2. Vercel: npx vercel --prod dist (para widget)"
echo "3. GitHub Pages: Subir a repositorio gh-pages"
echo "4. Firebase: Resolver problemas de autenticación primero"
echo ""
echo "🔗 URLs sugeridas:"
echo "   Widget: https://widget.kultrip.com"  
echo "   Demo: https://demo.kultrip.com"
echo ""
echo "📋 Después del deploy, actualiza las URLs en tu proyecto ACME"
#!/bin/bash

echo "🚀 Kultrip Widget Deploy - Alternativo"
echo "====================================="

# Construir widget
echo "📦 Construyendo widget..."
npm run build:widget

echo "✅ Widget construido exitosamente"
echo ""
echo "📁 Archivos en dist/:"
ls -la dist/

echo ""
echo "🌐 Opciones de Deploy Rápido:"
echo ""
echo "1️⃣  VERCEL (Recomendado):"
echo "   cd dist"
echo "   npx vercel --prod"
echo "   ✅ Te dará una URL como: https://abc123.vercel.app"
echo ""
echo "2️⃣  NETLIFY DROP:"
echo "   ✅ Ir a: netlify.com/drop"
echo "   ✅ Arrastrar la carpeta 'dist'"
echo ""
echo "3️⃣  GITHUB PAGES:"
echo "   ✅ Crear repo público"
echo "   ✅ Subir contenido de 'dist' a rama main"
echo "   ✅ Activar Pages en Settings"
echo ""
echo "4️⃣  SURGE.SH:"
echo "   npm install -g surge"
echo "   cd dist && surge"
echo ""
echo "📋 Después del deploy:"
echo "   1. Copiar la URL que te den"
echo "   2. Actualizar HeroWithWidget.tsx:"
echo "      - https://TU-URL/kultrip-widget.css"
echo "      - https://TU-URL/kultrip-widget.umd.js"
echo ""
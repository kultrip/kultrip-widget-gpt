#!/bin/bash

# ACME Travel Widget Integration Script
# Run this from the kultrip-acme directory

echo "🚀 Starting ACME Travel Widget Integration..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the kultrip-acme directory"
    exit 1
fi

# Step 1: Copy the widget component
echo "📁 Copying KultripWidget component..."
cp ../kultrip-widget-gpt/KultripWidget-for-ACME.tsx src/components/KultripWidget.tsx

if [ $? -eq 0 ]; then
    echo "✅ Widget component copied successfully"
else
    echo "❌ Failed to copy widget component"
    exit 1
fi

# Step 2: Backup the original App.tsx
echo "💾 Creating backup of App.tsx..."
cp src/App.tsx src/App.tsx.backup

echo "✅ Backup created: src/App.tsx.backup"

echo ""
echo "🎯 Next Steps:"
echo "1. Edit src/App.tsx to add the widget hero section"
echo "2. Use the code from acme-integration-guide.md"
echo "3. Run 'npm run dev' to test"
echo ""
echo "📖 Complete integration guide: ../kultrip-widget-gpt/acme-integration-guide.md"
echo ""
echo "🎉 Ready for integration!"
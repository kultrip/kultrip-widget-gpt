#!/bin/bash

# Build the widget
echo "Building Kultrip Widget..."
npm run build:widget

# Rename CSS file to expected name
if [ -f "dist/vite_react_shadcn_ts.css" ]; then
    mv dist/vite_react_shadcn_ts.css dist/kultrip-widget.css
    echo "Renamed CSS file to kultrip-widget.css"
fi

# Show build results
echo "Build complete! Files created:"
ls -la dist/

echo ""
echo "Widget files ready for deployment:"
echo "- dist/kultrip-widget.umd.js ($(du -h dist/kultrip-widget.umd.js | cut -f1))"
echo "- dist/kultrip-widget.css ($(du -h dist/kultrip-widget.css | cut -f1))"
echo ""
echo "Upload these files to your server and use widget-example.html as a reference for integration."
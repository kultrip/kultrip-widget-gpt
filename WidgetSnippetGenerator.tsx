import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface WidgetSnippetGeneratorProps {
  agencyId: string;
}

const WidgetSnippetGenerator: React.FC<WidgetSnippetGeneratorProps> = ({ agencyId }) => {
  const [copied, setCopied] = useState(false);
  
  const generateSnippet = (agencyId: string) => {
    return `<!-- Kultrip Travel Widget -->
<script src="https://widget.kultrip.com/kultrip-widget.umd.js"></script>
<link rel="stylesheet" href="https://widget.kultrip.com/kultrip-widget.css">

<script>
  // Initialize Kultrip Widget
  document.addEventListener('DOMContentLoaded', function() {
    if (window.KultripWidget) {
      window.KultripWidget.init('kultrip-widget-container', {
        userId: '${agencyId}' // Your Agency ID - leads will appear in your dashboard
      });
    }
  });
</script>

<!-- Widget Container - Add this where you want the widget to appear -->
<div id="kultrip-widget-container" style="width: 100%; height: 600px;"></div>`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateSnippet(agencyId));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Widget Installation Code</h3>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy Code
            </>
          )}
        </button>
      </div>
      
      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <pre className="text-sm whitespace-pre-wrap">
          <code>{generateSnippet(agencyId)}</code>
        </pre>
      </div>
      
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Installation Instructions:</h4>
        <ol className="text-blue-800 text-sm space-y-1">
          <li>1. Copy the code above</li>
          <li>2. Paste it into your website's HTML where you want the widget to appear</li>
          <li>3. The widget will automatically load and connect to your agency dashboard</li>
          <li>4. All leads generated will be sent to your email and saved in your dashboard</li>
        </ol>
      </div>
    </div>
  );
};

export default WidgetSnippetGenerator;
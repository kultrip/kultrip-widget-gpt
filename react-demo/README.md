# Kultrip Widget React Demo

A complete React application demonstrating how to integrate the Kultrip travel widget.

## Features

- 🚀 **Dynamic Loading**: Loads widget CSS/JS from CDN only when needed
- 🎯 **TypeScript**: Full type safety and IntelliSense support  
- 🌍 **Multi-language**: Auto-detect or force Spanish/English
- 📱 **Responsive**: Configurable width and height
- 🔄 **Error Handling**: Loading states and error messages
- 🎛️ **Interactive Demo**: Live controls to test different configurations
- 🧹 **Clean Unmounting**: Proper component lifecycle management

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The demo will open at http://localhost:3000

## Component Usage

### Basic Integration

```tsx
import KultripWidget from './KultripWidget';

function MyPage() {
  return (
    <KultripWidget 
      userId="YOUR_AGENCY_ID"
    />
  );
}
```

### Advanced Configuration

```tsx
<KultripWidget
  userId="MADRID_TRAVEL_001"
  language="es"              // 'en', 'es', or 'auto'
  height={500}               // pixels or CSS string
  width="80%"                // pixels or CSS string
  onLoad={() => console.log('Widget loaded!')}
  onError={(error) => console.error('Error:', error)}
/>
```

### Multiple Widgets

```tsx
function TravelPage() {
  return (
    <div>
      <h2>European Adventures</h2>
      <KultripWidget userId="EUROPE_AGENCY" language="en" />
      
      <h2>Aventuras Latinoamericanas</h2>
      <KultripWidget userId="LATIN_AGENCY" language="es" />
    </div>
  );
}
```

## Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `userId` | `string` | `"DEMO_AGENCY"` | Your Kultrip agency ID for lead tracking |
| `language` | `'en' \| 'es' \| 'auto'` | `undefined` | Force specific language or auto-detect |
| `height` | `number \| string` | `600` | Widget height in pixels or CSS value |
| `width` | `number \| string` | `"100%"` | Widget width in pixels or CSS value |
| `onLoad` | `() => void` | `undefined` | Callback when widget loads successfully |
| `onError` | `(error: Error) => void` | `undefined` | Callback when widget fails to load |

## How It Works

1. **Dynamic Script Loading**: The component dynamically loads CSS and JS from the Kultrip CDN
2. **Unique Container IDs**: Each widget instance gets a unique container ID to avoid conflicts
3. **Loading States**: Shows loading spinner while initializing and error messages if something fails
4. **Cleanup**: Properly handles component unmounting (cleanup can be extended if widget API provides destroy method)

## Browser Support

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ Internet Explorer 11+ (with polyfills)

## Troubleshooting

### Widget doesn't appear
- Check browser console for errors
- Verify agency ID is correct
- Ensure your site allows loading from `widget.kultrip.com`

### Multiple widgets conflict
- Each widget automatically gets a unique ID
- Make sure different widgets use different `userId` props if needed

### Language not working
- `language="auto"` uses browser language detection
- Use `language="es"` or `language="en"` to force specific language
- Check console logs for language detection messages

### Performance concerns
- Scripts are loaded once and cached
- Multiple widgets share the same CSS/JS files
- Consider lazy loading the component if it's not immediately visible

## Project Structure

```
react-demo/
├── src/
│   ├── KultripWidget.tsx    # Main widget component
│   ├── App.tsx             # Demo application
│   ├── App.css             # Styling
│   └── main.tsx            # Entry point
├── package.json            # Dependencies
├── vite.config.ts          # Vite configuration
└── README.md              # This file
```

## Development

### Adding to existing React project

1. Copy `KultripWidget.tsx` to your project
2. Import and use the component
3. Install TypeScript if using TS (optional but recommended)

### Customization

The component is designed to be easily customizable:

- Modify loading/error UI in the overlay section
- Add additional props for widget configuration
- Extend the TypeScript interface for new options
- Add callbacks for widget events if the API exposes them

### Testing

```bash
# Run in development mode
npm run dev

# Test different configurations using the demo controls
# Check browser console for loading logs
# Test with different browser languages for auto-detection
```

## Integration Examples

### Next.js Integration

```tsx
import dynamic from 'next/dynamic';

// Disable SSR for the widget component
const KultripWidget = dynamic(() => import('./KultripWidget'), {
  ssr: false,
  loading: () => <div>Loading travel widget...</div>
});

export default function TravelPage() {
  return (
    <div>
      <h1>Plan Your Adventure</h1>
      <KultripWidget userId="YOUR_AGENCY_ID" />
    </div>
  );
}
```

### Gatsby Integration

```tsx
import { useEffect, useState } from 'react';
import KultripWidget from './KultripWidget';

export default function TravelPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>
      <h1>Plan Your Adventure</h1>
      {isClient && <KultripWidget userId="YOUR_AGENCY_ID" />}
    </div>
  );
}
```

## License

This demo is provided as an example. The Kultrip widget itself is subject to Kultrip's terms of service.
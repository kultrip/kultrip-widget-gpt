# Kultrip Widget

A standalone travel planning widget that can be embedded in any website.

## ✨ Features

- **Beautiful Landing Screen**: Purple-orange gradient with centered input box
- **Story-inspired Travel Planning**: AI-powered recommendations based on books, movies, and TV shows
- **Clickable Preferences**: Interactive buttons for selecting travel preferences
- **Email Guide Delivery**: Capture user details and send personalized travel guides via email
- **Responsive Design**: Works seamlessly on mobile and desktop
- **Self-contained**: No external dependencies needed on the host page

## Building the Widget

```bash
npm run build:widget
```

This creates two files in the `dist/` folder:
- `kultrip-widget.umd.js` - The main widget JavaScript file
- `kultrip-widget.css` - The widget styles

## Embedding the Widget

### 1. Upload Files to Your Server

Upload both `kultrip-widget.umd.js` and `kultrip-widget.css` to your web server.

### 2. Basic Integration

Add this to your HTML page:

```html
<!DOCTYPE html>
<html>
<head>
    <!-- Include widget CSS -->
    <link rel="stylesheet" href="https://your-server.com/kultrip-widget.css">
</head>
<body>
    <!-- Container for the widget -->
    <div id="kultrip-widget" style="width: 100%; height: 600px;"></div>
    
    <!-- Include widget JavaScript -->
    <script src="https://your-server.com/kultrip-widget.umd.js"></script>
    
    <!-- Initialize the widget -->
    <script>
        window.addEventListener('load', function() {
            if (window.KultripWidget) {
                window.KultripWidget.init('kultrip-widget');
            }
        });
    </script>
</body>
</html>
```

### 3. Advanced Integration with Options

```html
<script>
    window.addEventListener('load', function() {
        if (window.KultripWidget) {
            const widget = window.KultripWidget.init('kultrip-widget', {
                userId: 'your-agency-id'  // Required for email functionality
            });
            
            // Widget instance methods
            // widget.destroy() - to remove the widget
        }
    });
</script>
```

### 4. Required Configuration

**userId Parameter**: This is required for the email functionality to work properly. Replace `'your-agency-id'` with your actual agency identifier from Kultrip.

## Widget Container Requirements

- The container div must have an ID
- Recommended minimum height: 600px
- The widget will adapt to the container's width
- Position should be relative or absolute for proper layout

## API Integration

The widget automatically integrates with the Kultrip API to send travel guides via email.

### API Endpoint Used

- **URL**: `https://kultrip-api-vzkhjko4aa-no.a.run.app/api/send-travel-guide`
- **Method**: POST
- **Content-Type**: application/json

### Data Sent to API

When a user requests an email guide, the widget sends:

```json
{
  "userId": "your-agency-id",
  "destination": "Paris",
  "inspiration": "Emily in Paris",
  "travelers": "couple",
  "duration": 5,
  "interests": ["Museums and History", "Food and Restaurants"],
  "language": "en",
  "email": "user@example.com"
}
```

### Parameter Details

- **userId**: Agency ID passed during widget initialization
- **destination**: Extracted from user conversation
- **inspiration**: Story/book/movie mentioned by user
- **travelers**: Type of travelers (solo, couple, friends, family)
- **duration**: Number of days for the trip
- **interests**: Selected preferences from the clickable buttons
- **language**: Auto-detected from browser (defaults to 'en')
- **email**: User's email address from the form

## Environment Variables

The widget requires an OpenAI API key to function. Set the following environment variable when building:

```bash
VITE_OPENAI_API_KEY=your_api_key_here
```

## Example Files

- `widget-example.html` - A complete example of how to embed the widget
- Test locally by opening this file in a browser after building

## File Sizes

- JavaScript: ~2.5MB (gzipped: ~745KB)
- CSS: ~107KB (gzipped: ~17KB)

The widget is fully self-contained and includes all necessary dependencies.

## Browser Support

- Modern browsers with ES6+ support
- React 18 compatible
- Responsive design works on mobile and desktop

## Security Notes

- The widget makes API calls directly to OpenAI from the browser
- In production, consider proxying API calls through your backend for better security
- The API key is exposed in the client-side code when using direct calls
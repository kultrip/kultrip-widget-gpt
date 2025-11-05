# Kultrip Widget WordPress Plugin

A WordPress plugin to easily embed the Kultrip AI-powered travel widget on your WordPress site.

## Features

- ✅ **Shortcode support**: Use `[kultrip_widget]` anywhere
- ✅ **Gutenberg block**: Visual block editor integration
- ✅ **Admin settings**: Configure agency ID and default language
- ✅ **Auto language detection**: Supports Spanish and English
- ✅ **Performance optimized**: Only loads scripts when widget is used
- ✅ **Multiple widgets**: Support multiple widgets on same page

## Installation

1. Download the `kultrip-widget` folder
2. Upload to your WordPress `/wp-content/plugins/` directory
3. Activate the plugin through the 'Plugins' menu in WordPress
4. Go to Settings → Kultrip Widget to configure your agency ID

## Configuration

### Admin Settings

Navigate to **Settings → Kultrip Widget** to configure:

- **Agency ID**: Your Kultrip agency identifier (leads will be associated with this ID)
- **Default Language**: 
  - Auto-detect (uses visitor's browser language)
  - English (force English)
  - Spanish (force Spanish)

## Usage

### 1. Shortcode (Classic Editor & anywhere)

Basic usage:
```
[kultrip_widget]
```

With options:
```
[kultrip_widget height="500px" user_id="AGENCY_123" language="es"]
```

**Shortcode Parameters:**
- `user_id` - Override agency ID for this widget
- `height` - Widget height (default: 600px)
- `width` - Widget width (default: 100%)  
- `language` - Force language: "en", "es", or "auto" (default: auto)

### 2. Gutenberg Block (Block Editor)

1. Add a new block
2. Search for "Kultrip Widget"
3. Configure settings in the sidebar
4. Publish your page

### 3. PHP Template (Theme files)

```php
<?php echo do_shortcode('[kultrip_widget]'); ?>
```

Or with parameters:
```php
<?php echo do_shortcode('[kultrip_widget height="400px" language="es"]'); ?>
```

## Examples

**Travel agency page with Spanish widget:**
```
[kultrip_widget user_id="MADRID_TRAVEL_001" language="es" height="700px"]
```

**Blog post with auto-detect:**
```
[kultrip_widget height="500px"]
```

**Multiple widgets on same page:**
```
[kultrip_widget user_id="AGENCY_A" language="en"]

Some content here...

[kultrip_widget user_id="AGENCY_B" language="es"]
```

## Troubleshooting

### Widget doesn't appear
- Check that your agency ID is set in Settings → Kultrip Widget
- Ensure your site allows loading external scripts from `widget.kultrip.com`
- Check browser console for JavaScript errors

### Multiple widgets conflict
- Each widget gets a unique ID automatically
- Make sure each has a different `user_id` if needed

### Language not working
- "Auto" uses `navigator.language` - Spanish browsers get Spanish, others get English
- Use `language="es"` or `language="en"` to force a specific language
- Check browser console for language detection logs

### Performance concerns
- Scripts only load on pages that use the widget
- CSS and JS are cached by WordPress and browsers
- Consider using a caching plugin for best performance

## Plugin Structure

```
kultrip-widget/
├── kultrip-widget.php    # Main plugin file
├── block.js             # Gutenberg block definition
└── README.md           # This file
```

## Support

- Widget issues: Check browser console and verify agency ID
- WordPress issues: Ensure WordPress 5.0+ and modern PHP version
- Agency ID questions: Contact Kultrip support

## Changelog

### 1.0.0
- Initial release
- Shortcode support
- Gutenberg block
- Admin settings page
- Multi-language support
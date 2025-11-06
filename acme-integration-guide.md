# ACME Travel Widget Integration - Complete Guide

## Step 1: Copy Widget Component

```bash
# Run from kultrip-acme directory
cp ../kultrip-widget-gpt/react-demo/src/KultripWidget.tsx src/components/
```

## Step 2: Complete App.tsx Integration

Replace the existing hero section in your App.tsx with this enhanced version that includes the widget hero section.

### Find this section in App.tsx (around line 166):

```tsx
{/* Hero Section */}
<section id="home" className="min-h-screen relative overflow-hidden">
```

### Replace the entire hero section with this enhanced version:

```tsx
{/* Hero Section */}
<section id="home" className="min-h-screen relative overflow-hidden">
  <div 
    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
    style={{
      backgroundImage: `url(${heroImage})`,
      transform: `translateY(${scrollY * 0.5}px)`
    }}
  />
  <div className="absolute inset-0 bg-black bg-opacity-60" />
  
  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex items-center">
    <div className="max-w-3xl">
      <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
        {t('hero.title1')}
        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block">{t('hero.title2')}</span>
      </h1>
      <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
        {t('hero.subtitle')}
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={() => document.getElementById('plan-trip')?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
        >
          {t('hero.cta')}
          <ArrowRight className="ml-2 h-5 w-5" />
        </button>
      </div>
    </div>
  </div>

  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
    <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
      <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
    </div>
  </div>
</section>

{/* NEW: Kultrip Widget Hero Section */}
<section id="plan-trip" className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
        Plan Your Dream Vacation
      </h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
        Let our AI-powered travel assistant help you discover amazing destinations, create personalized itineraries, and find the best deals for your perfect trip.
      </p>
    </div>
    
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
        <KultripWidget 
          userId="ACME_TRAVEL_2024"
          language={currentLanguage === 'es' ? 'es' : currentLanguage === 'en' ? 'en' : 'auto'}
          height={600}
          width="100%"
          onLoad={() => console.log('🎉 ACME Travel planning widget loaded!')}
          onError={(error) => console.error('❌ Widget loading failed:', error)}
        />
      </div>
    </div>
    
    <div className="text-center mt-8">
      <p className="text-sm text-gray-500">
        Powered by Kultrip AI Technology
      </p>
    </div>
  </div>
</section>
```

## Step 3: Update Navigation

Find your navigation section and add this link after the existing nav items:

```tsx
<a href="#plan-trip" className={`px-3 py-2 text-sm font-medium transition-colors ${
  scrollY > 50 ? 'text-gray-900 hover:text-blue-600' : 'text-white hover:text-blue-200'
}`}>
  Plan Trip
</a>
```

## Step 4: Update Mobile Navigation

In your mobile navigation menu, add:

```tsx
<a href="#plan-trip" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-blue-600 transition-colors">
  Plan Trip
</a>
```

## Complete Commands to Run:

```bash
# 1. Navigate to ACME directory
cd /path/to/kultrip-acme

# 2. Copy the widget component
cp ../kultrip-widget-gpt/react-demo/src/KultripWidget.tsx src/components/

# 3. Edit src/App.tsx with the code above (manual step)

# 4. Test the integration
npm run dev

# 5. Open http://localhost:5173 to see the result
```

## Expected Result:

1. **Hero Section** - ACME Travel branding with scroll-to-widget button
2. **Widget Hero Section** - Beautiful planning widget interface  
3. **Destinations Section** - Your existing travel packages
4. **Rest of site** - Testimonials, stats, etc.

The main CTA button now scrolls smoothly to the widget section!
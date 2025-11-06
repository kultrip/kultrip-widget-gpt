import React, { useEffect, useRef } from 'react';

export default function HeroWithWidget() {
  const widgetRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // Only load once
    if (scriptLoadedRef.current) return;
    
    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://widget.kultrip.com/kultrip-widget.css';
    document.head.appendChild(link);

    // Load JavaScript
    const script = document.createElement('script');
    script.src = 'https://widget.kultrip.com/kultrip-widget.umd.js';
    script.onload = () => {
      if (window.KultripWidget && widgetRef.current) {
        // Detect system language
        const systemLanguage = navigator.language || navigator.languages?.[0] || 'en';
        const languageCode = systemLanguage.startsWith('es') ? 'es' : 'en';
        
        window.KultripWidget.init('kultrip-hero-widget', {
          userId: '79b92368-3652-458a-895d-a1323257a2a5',
          language: languageCode
        });
      }
    };
    document.head.appendChild(script);
    
    scriptLoadedRef.current = true;

    // Cleanup
    return () => {
      document.head.removeChild(link);
      document.head.removeChild(script);
    };
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-teal-500 py-16">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Text */}
        <div className="text-center text-white mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your Next Adventure
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Starts Here
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Discover amazing destinations and let AI plan your perfect trip
          </p>
        </div>

        {/* Landscape Widget Container - Wider than tall */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 lg:p-8 max-w-6xl mx-auto">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Plan Your Trip with AI
            </h2>
            <p className="text-gray-600">
              Tell us what you're looking for and we'll create the perfect itinerary
            </p>
          </div>
          
          {/* Kultrip Widget Container - Landscape orientation */}
          <div 
            id="kultrip-hero-widget"
            ref={widgetRef}
            className="w-full h-96 min-h-[400px] max-h-[500px]"
            style={{ 
              aspectRatio: '16/9', // Landscape aspect ratio
              minWidth: '100%'
            }}
          >
            {/* Loading state */}
            <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>

        {/* Call-to-action buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors">
            Start Planning
          </button>
          <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors">
            View Destinations
          </button>
        </div>

      </div>
    </section>
  );
}

// TypeScript declaration for the widget
declare global {
  interface Window {
    KultripWidget: {
      init: (containerId: string, config: { userId: string; language?: string }) => void;
    };
  }
}
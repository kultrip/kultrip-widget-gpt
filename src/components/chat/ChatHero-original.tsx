import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, MapPin, RefreshCw, X } from "lucide-react";
import { useI18n } from "@/i18n";

interface ChatHeroProps {
  onSubmit: (message: string) => void;
}

const ChatHero = ({ onSubmit }: ChatHeroProps) => {
  const { t, language } = useI18n();
  const [heroInput, setHeroInput] = useState("");
  const [detectedLocation, setDetectedLocation] = useState("");
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Example prompts for cycling placeholder
  const examplePrompts = language === 'es' ? [
    "Planifica un viaje de Harry Potter a Londres...",
    "Encuentra locaciones de El Señor de los Anillos en Nueva Zelanda...",
    "Recrea la aventura de Emily in Paris en Francia...",
    "Explora las locaciones de Game of Thrones en Irlanda...",
    "Vive la magia de Studio Ghibli en Japón...",
    "Sigue los pasos de James Bond por Europa..."
  ] : [
    "Plan a Harry Potter trip to London...",
    "Find Lord of the Rings locations in New Zealand...",
    "Recreate Emily in Paris adventure in France...",
    "Explore Game of Thrones locations in Ireland...",
    "Experience Studio Ghibli magic in Japan...",
    "Follow James Bond's footsteps across Europe..."
  ];

  // Auto-detect location on component mount
  useEffect(() => {
    detectLocation();
  }, [language]);

  // Cycle through example prompts
  useEffect(() => {
    if (heroInput === "") {  // Only cycle when input is empty
      const interval = setInterval(() => {
        setPlaceholderIndex((prev) => (prev + 1) % examplePrompts.length);
      }, 3000); // Change every 3 seconds

      return () => clearInterval(interval);
    }
  }, [heroInput, examplePrompts.length]);

  const detectLocation = async () => {
    setIsDetectingLocation(true);
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              // Use reverse geocoding to get location name
              const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=${language}`
              );
              const data = await response.json();
              const locationName = data.city && data.countryName 
                ? `${data.city}, ${data.countryName}` 
                : data.countryName || `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
              
              setDetectedLocation(locationName);
            } catch (error) {
              console.error('Error getting location name:', error);
              const locationName = `${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}`;
              setDetectedLocation(locationName);
            } finally {
              setIsDetectingLocation(false);
            }
          },
          (error) => {
            console.error('Error getting location:', error);
            setIsDetectingLocation(false);
          }
        );
      }
    } catch (error) {
      console.error('Location detection error:', error);
      setIsDetectingLocation(false);
    }
  };

  const handleLocationDiscard = () => {
    setDetectedLocation("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroInput.trim()) return;
    onSubmit(heroInput);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-blue-300 px-4 animate-fade-in">
      <div className="w-full max-w-2xl space-y-8 text-center">
        <header className="space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            {t('chat.title')}
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-xl mx-auto">
            {t('chat.subtitle')}
          </p>
          {/* Trust Message */}
          <p className="text-white/70 text-sm italic max-w-2xl mx-auto">
            ✨ {t('chat.trustMessage')}
          </p>
        </header>

        {/* Location Display */}
        <div className="space-y-4">
          {detectedLocation ? (
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <MapPin className="h-4 w-4 mr-2" />
                {t('chat.yourLocationIs')}: {detectedLocation}
              </Badge>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSubmit(`Find cool places to visit in ${detectedLocation}`)}
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20"
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  {t('chat.findTripHere')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLocationDiscard}
                  className="text-white/80 hover:text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4 mr-1" />
                  {t('chat.discardLocation')}
                </Button>
              </div>
            </div>
          ) : isDetectingLocation ? (
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin text-white" />
              <span className="text-white/80">{t('chat.detectingLocation')}</span>
            </div>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="relative group">
          <div className="relative">
            <Input
              value={heroInput}
              onChange={(e) => setHeroInput(e.target.value)}
              placeholder={heroInput === "" ? examplePrompts[placeholderIndex] : t('chat.placeholder')}
              aria-label="Enter your travel story inspiration"
              className="w-full h-14 pl-6 pr-14 text-base bg-white/95 backdrop-blur-sm border-0 rounded-full shadow-elegant focus-visible:ring-4 focus-visible:ring-white/30 transition-all duration-300 group-hover:shadow-glow placeholder:transition-opacity placeholder:duration-500"
            />
            <Button
              type="submit"
              size="icon"
              aria-label="Send message"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-gradient-primary hover:scale-110 transition-transform duration-200"
            >
              <Send className="h-5 w-5 text-white" />
            </Button>
          </div>
        </form>

        <section className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white/90 text-sm" aria-label="Features">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden="true"></div>
            <span>AI-Generated Guides</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden="true"></div>
            <span>Real Activities & Maps</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden="true"></div>
            <span>Cultural Insights</span>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ChatHero;

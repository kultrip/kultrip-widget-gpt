import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, MapPin, Sparkles, Download, Share2, Mail, RefreshCw } from "lucide-react";
import QuickOption from "@/components/chat/QuickOption";
import StoryCard from "@/components/chat/StoryCard";
import ActivityCard from "@/components/chat/ActivityCard";
import ItineraryDay from "@/components/chat/ItineraryDay";
import MapComponent from "@/components/chat/MapComponent";
import { PreferenceCards } from "@/components/chat/PreferenceCards";
import ChatHero from "@/components/chat/ChatHero";
import PageTransition from "@/components/PageTransition";
import { getChatResponse, type StoryLocation } from "@/services/openai";
import { saveLead, type LeadData } from "@/services/supabase";

const API_URL = "https://kultrip-api-vzkhjko4aa-no.a.run.app/api";

// Agency ID for KULTRIP (representing Kultrip itself as the agency)
const KULTRIP_AGENCY_ID = 'cc42368b-b2fb-43eb-a106-d54af47b84e6';

interface ChatWidgetProps {
  userId?: string;
}

type Message = {
  role: "assistant" | "user";
  content: string;
  quickOptions?: string[];
  storyOptions?: Array<{ title: string; type: "book" | "film" | "tv"; destination: string }>;
};

type ConversationState = {
  destination?: string;
  story?: string;
  duration?: number;
  travelerType?: 'solo' | 'couple' | 'friends' | 'family';
  preferences?: string[];
};

const ChatWidget = ({ userId }: ChatWidgetProps) => {
  const [showHero, setShowHero] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [conversationState, setConversationState] = useState<ConversationState>({});
  const [showPreview, setShowPreview] = useState(false);
  const [locations, setLocations] = useState<StoryLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreferenceCards, setShowPreferenceCards] = useState(false);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailData, setEmailData] = useState({ name: "", email: "" });
  const [emailSent, setEmailSent] = useState(false);
  const [isCreatingItinerary, setIsCreatingItinerary] = useState(false);
  const [showFullPage, setShowFullPage] = useState(false);

  // Rotating placeholder texts
  const placeholders = [
    "Find cafes like in Emily in Paris 🗼",
    "Harry Potter locations in London 🏰",
    "Game of Thrones filming spots 🐉", 
    "Where to eat pasta in Rome 🍝",
    "Best sunset spots here 🌅",
    "Hidden local gems nearby 💎",
    "Instagram-worthy places 📸"
  ];

  // Location detection
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Simulate reverse geocoding - in real app, use proper geocoding API
          setUserLocation("Current Location");
          setLocationDetected(true);
        },
        (error) => {
          console.log("Location access denied");
        }
      );
    }
  }, []);

  // Rotate placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const locationPrefix = locationDetected ? `${userLocation}: ` : "";
    const userMessage: Message = {
      role: "user",
      content: locationPrefix + input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setShowInitial(false);
    setIsLoading(true);
    setInput("");

    // Simulate AI response with summary + refinement
    setTimeout(() => {
      const summaryResponse: Message = {
        role: "assistant",
        content: "🎯 **Perfect!** Here's your personalized trip:\n\n• 3 magical locations from your story\n• Local cafes & hidden spots\n• Photo opportunities\n• Cultural experiences\n\n✨ *Full details shown on the right →*"
      };
      
      setMessages(prev => [...prev, summaryResponse]);
      setIsLoading(false);
      
      // Transition to full page view after first response
      setTimeout(() => {
        setShowFullPage(true);
      }, 800);

      // Show refinement question
      setTimeout(() => {
        const refinementMessage: Message = {
          role: "assistant", 
          content: "Want me to add luxury dining at the Plaza Athénée? 🥂 Or send this as PDF to your inbox? 📧"
        };
        setMessages(prev => [...prev, refinementMessage]);
      }, 2000);
    }, 1500);
  };

  const quickOptions = [
    "Harry Potter spots nearby 🏰",
    "Emily's Paris cafes 🗼", 
    "Game of Thrones locations 🐉",
    "I'm here now! 📍"
  ];

  const handleQuickOption = (option: string) => {
    setInput(option);
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
    setTimeout(() => handleSend(fakeEvent), 100);
  };

  const handleLocationAction = () => {
    if (locationDetected) {
      setInput("I'm here now - show me what's around!");
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      setTimeout(() => handleSend(fakeEvent), 100);
    }
  };

  const handleDisregardLocation = () => {
    setLocationDetected(false);
    setUserLocation("");
  };

  // Full page view after first interaction
  if (showFullPage) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex">
        {/* Left side - Chat */}
        <div className="w-1/2 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b bg-purple-600 text-white">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              <h3 className="font-semibold">Your Story Trip</h3>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowFullPage(false)}
              className="text-white hover:bg-purple-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>

        {/* Right side - Trip details */}
        <div className="w-1/2 bg-gray-50 p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">Your Story Adventure</h2>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">📍 Magical Locations</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Platform 9¾ at King's Cross</li>
                <li>• The Leaky Cauldron filming location</li>
                <li>• Diagon Alley inspiration spots</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">🍽️ Story-themed Dining</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Traditional British pub experiences</li>
                <li>• Afternoon tea like wizards</li>
                <li>• Local market discoveries</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">📸 Photo Opportunities</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Iconic movie scenes recreation</li>
                <li>• Hidden magical doorways</li>
                <li>• London's secret passages</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showInitial) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-72 p-4 bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
        {/* Location Detection */}
        {locationDetected && (
          <div className="w-full max-w-md mb-4 p-2 bg-white rounded-lg border border-purple-200 flex items-center justify-between">
            <div className="flex items-center text-sm">
              <Navigation className="h-4 w-4 text-purple-600 mr-2" />
              <span className="text-gray-700">Your location: {userLocation}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDisregardLocation}
              className="text-xs text-gray-500"
            >
              Change
            </Button>
          </div>
        )}

        <div className="text-center mb-4 max-w-md">
          <div className="flex items-center justify-center mb-2">
            <Sparkles className="h-6 w-6 text-purple-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">Story Travel</h2>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Find places from your favorite stories!
          </p>
        </div>

        <form onSubmit={handleSend} className="w-full max-w-md mb-3">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholders[placeholderIndex]}
              className="flex-1 border-2 border-purple-200 focus:border-purple-400 text-sm"
            />
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700" size="sm">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>

        {locationDetected && (
          <Button 
            onClick={handleLocationAction}
            className="w-full max-w-md mb-3 bg-green-600 hover:bg-green-700 text-sm"
            size="sm"
          >
            <Navigation className="h-4 w-4 mr-2" />
            Find my trip here!
          </Button>
        )}

        <div className="flex flex-wrap gap-1 justify-center max-w-md">
          {quickOptions.slice(0, 3).map((option, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              onClick={() => handleQuickOption(option)}
              className="text-xs border-purple-200 hover:bg-purple-50 px-2 py-1"
            >
              {option}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border rounded-lg overflow-hidden" style={{ height: '288px' }}>
      {/* Header - 40px */}
      <div className="flex items-center p-2 border-b bg-gradient-to-r from-purple-600 to-blue-600 text-white" style={{ height: '40px' }}>
        <MapPin className="h-4 w-4 mr-2" />
        <h3 className="font-semibold text-sm">Your Story Adventure</h3>
      </div>

      {/* Messages - Exactly 200px to leave room for input */}
      <div className="overflow-y-auto p-2 space-y-2" style={{ height: '200px' }}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-2 rounded-lg text-sm ${
              msg.role === 'user' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 p-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input - Exactly 48px at bottom */}
      <form onSubmit={handleSend} className="p-2 border-t flex items-center bg-white" style={{ height: '48px' }}>
        <div className="flex gap-2 w-full">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Continue the conversation..."
            className="flex-1 text-sm h-8"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()} size="sm" className="h-8">
            <Send className="h-3 w-3" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatWidget;
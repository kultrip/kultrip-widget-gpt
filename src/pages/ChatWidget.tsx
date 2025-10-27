import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, MapPin, Sparkles, Download, Share2, Mail, RefreshCw } from "lucide-react";
import ActivityCard from "@/components/chat/ActivityCard";
import MapComponent from "@/components/chat/MapComponent";
import { PaymentModal } from "@/components/chat/PaymentModal";
import PageTransition from "@/components/PageTransition";
import { getChatResponse, type StoryLocation, type TravelParameters } from "@/services/openai";

type Message = {
  role: "assistant" | "user";
  content: string;
  locations?: StoryLocation[];
  showPreferences?: boolean;
};

const PREFERENCE_OPTIONS = [
  "Museums and History",
  "Food and Restaurants", 
  "Arts and Culture",
  "Nature and Outdoors",
  "Photography Spots",
  "Nightlife",
  "Shopping",
  "Wine Tastings",
  "Budget-friendly",
  "Luxury Experiences",
  "Family-friendly",
  "Romantic Experiences"
];

const ChatWidget = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentParams, setCurrentParams] = useState<TravelParameters>({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

  const handleFirstSubmit = async (message: string) => {
    setShowLanding(false);
    setIsLoading(true);

    // Add user message to chat
    const newMessages = [{ role: "user" as const, content: message }];
    setMessages(newMessages);

    try {
      const response = await getChatResponse(newMessages, currentParams);
      
      // Check if we need to show preferences
      const shouldShowPreferences = response.parameters.destination && 
                                   response.parameters.story && 
                                   !response.parameters.preferences;
      
      // Add assistant response
      const assistantMessage: Message = {
        role: "assistant",
        content: response.message,
        locations: response.locations,
        showPreferences: shouldShowPreferences
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Update parameters
      setCurrentParams(response.parameters);
      
    } catch (error) {
      setMessages([{
        role: "assistant",
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment."
      }]);
    }

    setIsLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setIsLoading(true);

    // Add user message to chat
    const newMessages = [...messages, { role: "user" as const, content: userMessage }];
    setMessages(newMessages);

    try {
      const response = await getChatResponse(newMessages, currentParams);
      
      // Check if we need to show preferences
      const shouldShowPreferences = response.parameters.destination && 
                                   response.parameters.story && 
                                   !response.parameters.preferences;
      
      // Add assistant response
      const assistantMessage: Message = {
        role: "assistant",
        content: response.message,
        locations: response.locations,
        showPreferences: shouldShowPreferences
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Update parameters
      setCurrentParams(response.parameters);
      
    } catch (error) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment."
      }]);
    }

    setIsLoading(false);
  };

  const handlePreferenceToggle = (preference: string) => {
    setSelectedPreferences(prev => {
      if (prev.includes(preference)) {
        return prev.filter(p => p !== preference);
      } else {
        return [...prev, preference];
      }
    });
  };

  const handlePreferencesSubmit = async () => {
    if (selectedPreferences.length === 0) return;

    setIsLoading(true);
    
    // Add user message with preferences
    const preferencesMessage = `My preferences are: ${selectedPreferences.join(", ")}`;
    const newMessages = [...messages, { role: "user" as const, content: preferencesMessage }];
    setMessages(newMessages);

    // Update current params with preferences
    const updatedParams = { ...currentParams, preferences: selectedPreferences };
    setCurrentParams(updatedParams);

    try {
      const response = await getChatResponse(newMessages, updatedParams);
      
      // Add assistant response
      const assistantMessage: Message = {
        role: "assistant",
        content: response.message,
        locations: response.locations
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Update parameters
      setCurrentParams(response.parameters);
      
    } catch (error) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment."
      }]);
    }

    setIsLoading(false);
  };

  const renderLandingScreen = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-orange-500">
      <div className="container mx-auto px-6 py-32 text-center">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full border border-white/20 mb-4">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">AI-Powered Story Travel</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            Travel like in your
            <span className="block mt-2">
              favorite story
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Design your perfect journey inspired by your favorite books, movies, and TV shows
          </p>

          {/* Chat-like Input Box */}
          <div className="max-w-3xl mx-auto mt-12">
            <form onSubmit={(e) => {
              e.preventDefault();
              if (input.trim()) {
                handleFirstSubmit(input);
                setInput("");
              }
            }}>
              <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all">
                <div className="flex items-center gap-4">
                  <Input
                    type="text"
                    placeholder="Ask KultripGPT to create your story-inspired journey..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 border-0 bg-transparent text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                    disabled={isLoading}
                  />
                  <Button 
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white px-8 py-2 rounded-2xl font-medium"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Start Journey
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMessage = (message: Message, index: number) => {
    return (
      <div key={index} className="space-y-4">
        <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-4xl rounded-lg p-4 shadow-sm border ${
            message.role === 'user' 
              ? 'bg-blue-500 text-white ml-12' 
              : 'bg-white text-gray-800 mr-12'
          }`}>
            <p className="whitespace-pre-wrap">{message.content}</p>
            
            {/* Show locations if available */}
            {message.locations && message.locations.length > 0 && (
              <div className="mt-4 space-y-3">
                <h4 className="font-semibold text-gray-900">Recommended Locations:</h4>
                <div className="grid gap-3">
                  {message.locations.map((location, locationIndex) => (
                    <div key={locationIndex} className="p-3 bg-gray-50 rounded-lg">
                      <h5 className="font-medium">{location.name}</h5>
                      <p className="text-sm text-gray-600">{location.description}</p>
                      <p className="text-xs text-gray-500 mt-1">Type: {location.type}</p>
                    </div>
                  ))}
                </div>
                {message.locations.length > 0 && (
                  <div className="mt-4">
                    <MapComponent locations={message.locations} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Show preference buttons if needed */}
        {message.showPreferences && (
          <div className="bg-gray-50 rounded-lg p-6 mr-12">
            <h4 className="font-semibold text-gray-900 mb-4">What interests you most? (Select all that apply)</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {PREFERENCE_OPTIONS.map((preference) => (
                <Button
                  key={preference}
                  variant={selectedPreferences.includes(preference) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePreferenceToggle(preference)}
                  className={`text-left justify-start ${
                    selectedPreferences.includes(preference) 
                      ? "bg-gradient-to-r from-purple-600 to-orange-500 text-white" 
                      : "hover:bg-gray-100"
                  }`}
                >
                  {preference}
                </Button>
              ))}
            </div>
            <Button
              onClick={handlePreferencesSubmit}
              disabled={selectedPreferences.length === 0 || isLoading}
              className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white"
            >
              Continue with Selected Preferences ({selectedPreferences.length})
            </Button>
          </div>
        )}
      </div>
    );
  };

  if (showLanding) {
    return (
      <PageTransition>
        {renderLandingScreen()}
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-orange-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Kultrip</h1>
                <p className="text-sm text-gray-600">Story-inspired travel planning</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowLanding(true);
                  setMessages([]);
                  setCurrentParams({});
                  setSelectedPreferences([]);
                  setInput("");
                }}
                className="text-gray-600 hover:text-gray-900"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="max-w-5xl mx-auto">
            <Card className="border-0 shadow-xl bg-white/50 backdrop-blur-sm">
              <div className="p-6">
                {/* Messages */}
                <div className="space-y-6 mb-6 h-96 overflow-y-auto">
                  {messages.map((message, index) => renderMessage(message, index))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white rounded-lg p-4 shadow-sm border max-w-4xl mr-12">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="flex space-x-3">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Continue your conversation..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    className="flex-1 bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    disabled={isLoading}
                  />
                  <Button 
                    onClick={handleSend} 
                    disabled={isLoading || !input.trim()}
                    className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white px-6"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <PaymentModal 
          isOpen={showPaymentModal} 
          onClose={() => setShowPaymentModal(false)}
          destinationInfo={{
            destination: currentParams.destination || "Your destination",
            story: currentParams.story || "",
            duration: currentParams.duration || 3,
            preferences: currentParams.preferences || []
          }}
        />
      </div>
    </PageTransition>
  );
};

export default ChatWidget;
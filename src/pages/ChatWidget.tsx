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
};

const ChatWidget = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentParams, setCurrentParams] = useState<TravelParameters>({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Initialize with welcome message
  useEffect(() => {
    setMessages([{
      role: "assistant",
      content: "Welcome to Kultrip! ✈️ Let's create your perfect story-inspired travel experience. Where would you like to go, or do you have a favorite story that could guide your journey?",
    }]);
  }, []);

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

  const renderMessage = (message: Message, index: number) => {
    return (
      <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
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
    );
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
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
                  setMessages([{
                    role: "assistant",
                    content: "Welcome back to Kultrip! ✈️ Let's create your perfect story-inspired travel experience. Where would you like to go, or do you have a favorite story that could guide your journey?",
                  }]);
                  setCurrentParams({});
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
                    placeholder="Tell me about your dream destination or favorite story..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    className="flex-1 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <Button 
                    onClick={handleSend} 
                    disabled={isLoading || !input.trim()}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6"
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
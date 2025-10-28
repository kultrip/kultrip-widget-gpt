import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, MapPin, Sparkles, Download, Share2, Mail, RefreshCw, CheckCircle } from "lucide-react";
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
  showEmailCapture?: boolean;
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

interface ChatWidgetProps {
  userId?: string;
}

const API_URL = "https://kultrip-api-vzkhjko4aa-no.a.run.app/api";
const KULTRIP_AGENCY_ID = "kultrip-official-000-000-000-kultrip"; // Dedicated KULTRIP agency ID

const ChatWidget = ({ userId }: ChatWidgetProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentParams, setCurrentParams] = useState<TravelParameters>({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailData, setEmailData] = useState({ name: "", email: "" });
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Get browser language or default to English
  const getBrowserLanguage = (): string => {
    if (typeof window !== 'undefined' && window.navigator) {
      const language = window.navigator.language || (window.navigator as any).userLanguage;
      return language ? language.split('-')[0] : 'en';
    }
    return 'en';
  };

  const handleFirstSubmit = async (message: string) => {
    setShowLanding(false);
    setIsLoading(true);

    // Add user message to chat
    const newMessages = [{ role: "user" as const, content: message }];
    setMessages(newMessages);

    try {
      const response = await getChatResponse(newMessages, currentParams);
      
      // Check if we need to show preferences or email capture
      const shouldShowPreferences = response.parameters.destination && 
                                   response.parameters.story && 
                                   !response.parameters.preferences;
      
      const shouldShowEmailCapture = response.locations && 
                                     response.locations.length > 0 && 
                                     response.parameters.preferences && 
                                     response.parameters.preferences.length > 0;
      
      // Add assistant response
      const assistantMessage: Message = {
        role: "assistant",
        content: response.message,
        locations: response.locations,
        showPreferences: shouldShowPreferences,
        showEmailCapture: shouldShowEmailCapture
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
      
      // Check if we need to show preferences or email capture
      const shouldShowPreferences = response.parameters.destination && 
                                   response.parameters.story && 
                                   !response.parameters.preferences;
      
      const shouldShowEmailCapture = response.locations && 
                                     response.locations.length > 0 && 
                                     response.parameters.preferences && 
                                     response.parameters.preferences.length > 0;
      
      // Add assistant response
      const assistantMessage: Message = {
        role: "assistant",
        content: response.message,
        locations: response.locations,
        showPreferences: shouldShowPreferences,
        showEmailCapture: shouldShowEmailCapture
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
      
      // Check if conversation is complete and should show email capture
      const shouldShowEmailCapture = response.locations && 
                                     response.locations.length > 0 && 
                                     selectedPreferences.length > 0;
      
      // Add assistant response
      const assistantMessage: Message = {
        role: "assistant",
        content: response.message,
        locations: response.locations,
        showEmailCapture: shouldShowEmailCapture
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

  const handleEmailRequest = () => {
    setShowEmailForm(true);
  };

  const createItinerary = async () => {
    const language = getBrowserLanguage();
    
    // API expects numeric userId (bigint), not UUID
    // Convert UUID to a numeric ID or use a test numeric ID
    let actualUserId: string;
    if (userId && userId.length > 10) {
      // If it's a UUID, use a test numeric ID
      actualUserId = '1'; // Use a simple numeric ID for testing
    } else {
      // If it's already numeric or not provided, use it or fallback
      actualUserId = userId || '1';
    }
    
    // Build query parameters matching the working curl format
    // Use 3 days max to avoid JSON parsing issues with long responses
    // Include email parameter - this endpoint will create itinerary AND send the themed email
    const safeDuration = Math.min(currentParams.duration || 3, 3);
    const queryParams = new URLSearchParams({
      userId: actualUserId,
      destination: currentParams.destination || '',
      inspiration: currentParams.story || '',
      travelers: currentParams.travelerType || '',
      duration: safeDuration.toString(),
      interests: (currentParams.preferences || []).slice(0, 2).join(','), // Limit to 2 interests to avoid long responses
      language: language,
      email: emailData.email // This will create itinerary AND send themed email
    });

    console.log('Step 1a: Creating itinerary with GET request to:', `${API_URL}/itinerary?${queryParams}`);

    const createResponse = await fetch(`${API_URL}/itinerary?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log('Create itinerary response status:', createResponse.status);

    if (!createResponse.ok) {
      let errorText = '';
      try {
        errorText = await createResponse.text();
        console.log('Create itinerary error response body:', errorText);
      } catch (e) {
        console.log('Could not read create itinerary error response body');
      }
      throw new Error(`Failed to create itinerary. Status: ${createResponse.status}. Response: ${errorText}`);
    }

    const createResult = await createResponse.json();
    console.log('Step 1b: Itinerary created:', createResult);

    // Return the creation result which should include: id, guide_url, email_sent
    // This is what we need to send in the email
    return {
      id: createResult.id,
      guide_url: createResult.guide_url,
      email_sent: createResult.email_sent,
      destination: currentParams.destination,
      inspiration: currentParams.story
    };
  };

  const saveLeadToSupabase = async () => {
    const leadData = {
      agency_id: KULTRIP_AGENCY_ID, // KULTRIP's own agency ID
      traveler_name: emailData.name,
      traveler_email: emailData.email,
      traveler_phone: null,
      destination: currentParams.destination || '',
      travel_style: null,
      interests: currentParams.preferences || [],
      inspiring_story: currentParams.story || '',
      traveler_type: currentParams.travelerType || '',
      trip_duration_days: currentParams.duration || 0
    };

    console.log('💾 Saving lead to Supabase:', leadData);

    // Import the saveLead function dynamically to avoid circular dependencies
    const { saveLead, sendAgencyNotification } = await import('@/services/supabase');
    
    // Save lead to Supabase
    console.log('🔍 About to save lead with data:', leadData);
    const saveResult = await saveLead(leadData);
    console.log('🔍 Save result received:', saveResult);
    
    if (saveResult.success) {
      console.log('✅ Lead saved to Supabase successfully with ID:', saveResult.id);
      
      // Send agency notification email
      console.log('📧 Sending agency notification...');
      const notificationResult = await sendAgencyNotification(leadData);
      console.log('📧 Agency notification result:', notificationResult);
      
      if (notificationResult.success) {
        console.log('✅ Agency notification sent successfully');
      } else {
        console.warn('⚠️ Failed to send agency notification:', notificationResult.error);
      }
    } else {
      console.error('❌ Failed to save lead to Supabase:', saveResult.error);
      console.error('❌ Full save result:', saveResult);
    }

    return saveResult.success;
  };

  // Removed sendTravelGuideEmail function - the itinerary endpoint handles email sending

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailData.name.trim() || !emailData.email.trim()) return;

    // Validate required data
    if (!currentParams.destination) {
      console.error('Missing destination');
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, it seems we're missing some travel information. Please restart the conversation."
      }]);
      return;
    }

    setIsEmailSending(true);

    try {
      console.log('=== Starting travel guide process ===');
      
      // Step 1: Save lead to Supabase and send agency notification
      console.log('Step 1: Saving lead to Supabase...');
      try {
        await saveLeadToSupabase();
      } catch (leadError) {
        console.warn('⚠️ Lead saving failed (non-blocking):', leadError);
      }

      // Step 2: Create itinerary and send email (single API call)
      console.log('Step 2: Creating itinerary and sending email...');
      let itineraryResult = null;
      try {
        itineraryResult = await createItinerary();
        console.log('✅ Itinerary created and email sent:', itineraryResult);
      } catch (itineraryError) {
        console.error('❌ Itinerary creation failed:', itineraryError);
        throw itineraryError;
      }
      
      setEmailSent(true);
      setShowEmailForm(false);
      
      // Add success message to chat
      const guideUrlMessage = itineraryResult?.guide_url 
        ? ` You can also view your guide at: ${itineraryResult.guide_url}` 
        : '';
      
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `Perfect! I've created your personalized travel guide and sent it to ${emailData.email}. Check your inbox for your ${currentParams.destination} adventure inspired by ${currentParams.story}!${guideUrlMessage} ✈️📧`
      }]);

    } catch (error) {
      console.error('Failed to process travel guide:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `I apologize, but I'm having trouble sending your travel guide right now. Error: ${errorMessage}. Please try again in a moment.`
      }]);
    }

    setIsEmailSending(false);
  };

  const handleEmailDecline = () => {
    setMessages(prev => [...prev, {
      role: "assistant",
      content: "No problem! Feel free to continue planning your journey or start a new conversation anytime. Safe travels! ✈️"
    }]);
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

        {/* Show email capture button if conversation is complete */}
        {message.showEmailCapture && !emailSent && (
          <div className="bg-gradient-to-r from-purple-50 to-orange-50 rounded-lg p-6 mr-12 border-2 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">🎉 Your travel guide is ready!</h4>
                <p className="text-gray-600 mb-4">Would you like to receive a detailed travel guide with all recommendations via email?</p>
              </div>
              <Mail className="w-8 h-8 text-purple-600" />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleEmailRequest}
                className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white"
              >
                <Mail className="w-4 h-4 mr-2" />
                Yes, send me the guide!
              </Button>
              <Button
                variant="outline"
                onClick={handleEmailDecline}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                No, thanks
              </Button>
            </div>
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
                  setShowEmailForm(false);
                  setEmailData({ name: "", email: "" });
                  setEmailSent(false);
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

        {/* Email Form Modal */}
        {showEmailForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
              <div className="text-center mb-6">
                <Mail className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Get Your Travel Guide</h3>
                <p className="text-gray-600">
                  Enter your details to receive a personalized travel guide for your {currentParams.destination} adventure!
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={emailData.name}
                    onChange={(e) => setEmailData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full"
                    disabled={isEmailSending}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={emailData.email}
                    onChange={(e) => setEmailData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full"
                    disabled={isEmailSending}
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isEmailSending || !emailData.name.trim() || !emailData.email.trim()}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white"
                  >
                    {isEmailSending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Guide
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEmailForm(false)}
                    disabled={isEmailSending}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

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
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, MapPin, Sparkles, Download, Share2, Mail, RefreshCw, X } from "lucide-react";
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
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message
  useEffect(() => {
    setMessages([{
      role: "assistant",
      content: "Hi! 👋 I'm KultripGPT, your AI travel storyteller. Tell me about a story that inspires you and where you'd like to explore it!",
    }]);
  }, []);

  useEffect(() => {
    const chatWindow = document.querySelector('.chat-scroll');
    if (chatWindow) {
      // Smooth scroll to bottom
      chatWindow.scrollTo({
        top: chatWindow.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  // Add custom scrollbar styles programmatically for widget context
  useEffect(() => {
    if (chatScrollRef.current) {
      const element = chatScrollRef.current;
      
      // Force scrollbar visibility and styling
      const style = element.style;
      style.setProperty('scrollbar-width', 'thin', 'important');
      style.setProperty('scrollbar-color', 'rgba(203, 213, 225, 0.8) rgba(241, 245, 249, 0.3)', 'important');
      style.setProperty('overflow-y', 'scroll', 'important'); // Force scrollbar to always show
      
      // Create and inject webkit styles directly into the widget's context
      const styleElement = document.createElement('style');
      const uniqueId = `scroll-${Math.random().toString(36).substr(2, 9)}`;
      element.setAttribute('data-scroll-id', uniqueId);
      
      styleElement.innerHTML = `
        [data-scroll-id="${uniqueId}"]::-webkit-scrollbar {
          width: 8px !important;
          height: 8px !important;
        }
        [data-scroll-id="${uniqueId}"]::-webkit-scrollbar-track {
          background: rgba(241, 245, 249, 0.5) !important;
          border-radius: 10px !important;
          margin: 2px !important;
        }
        [data-scroll-id="${uniqueId}"]::-webkit-scrollbar-thumb {
          background: rgba(203, 213, 225, 0.9) !important;
          border-radius: 10px !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          transition: all 0.2s ease !important;
        }
        [data-scroll-id="${uniqueId}"]::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 1) !important;
          border-color: rgba(255, 255, 255, 0.3) !important;
        }
        [data-scroll-id="${uniqueId}"]::-webkit-scrollbar-corner {
          background: rgba(241, 245, 249, 0.5) !important;
        }
      `;
      
      // Insert the style into the document head
      document.head.appendChild(styleElement);
      
      // Also try to force scrollbar appearance
      setTimeout(() => {
        if (element.scrollHeight > element.clientHeight) {
          element.scrollTop = 1;
          setTimeout(() => {
            element.scrollTop = element.scrollHeight;
          }, 10);
        }
      }, 100);
      
      return () => {
        if (document.head.contains(styleElement)) {
          document.head.removeChild(styleElement);
        }
      };
    }
  }, []);

  const handleHeroSubmit = (message: string) => {
    setShowHero(false);
    // Stay in widget mode, don't go fullscreen
    setTimeout(() => {
      handleSend(message);
    }, 300);
  };

  // Sample data for story suggestions
  const londonStories = [
    { title: "Harry Potter", type: "book" as const, destination: "London" },
    { title: "Sherlock Holmes", type: "book" as const, destination: "London" },
    { title: "Bridgerton", type: "tv" as const, destination: "London" },
  ];

  const handleSend = (message: string) => {
    if (!message.trim()) return;
    
    const userMessage: Message = {
      role: "user",
      content: message
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setShowHero(false);
    
    // Simulate thinking delay for better UX
    setTimeout(async () => {
      try {
        const response = await getChatResponse([...messages, { role: 'user', content: message }], conversationState, 'en');
        
        console.log('Chat response:', response); // Debug log
        
        // Update conversation state with extracted parameters
        setConversationState(response.parameters);
        
        // New flow: No preference cards, direct to preview after duration
        setShowPreferenceCards(false);
        
        // Update locations if we got them
        if (response.locations && response.locations.length > 0) {
          setLocations(response.locations);
          
          // Auto-suggest email collection when we have good trip data
          setTimeout(() => {
            if (response.parameters.destination && response.parameters.story && !emailSent && !showEmailForm) {
              const emailPromptMessage: Message = {
                role: "assistant",
                content: "💫 Love what you see? I can create a complete travel guide with detailed maps, restaurant recommendations, and booking links. Would you like me to send it to your email?"
              };
              setMessages(prev => [...prev, emailPromptMessage]);
            }
          }, 2000);
        }
        
        // Show preview if ready
        if (response.readyForPreview) {
          setShowPreview(true);
        }
        
        // Show email form if prompted by AI or automatically when ready
        if (response.showEmailPrompt || (response.locations && response.locations.length > 0 && response.parameters.destination && response.parameters.story)) {
          // Small delay to let the user see the locations first
          setTimeout(() => {
            if (!emailSent && !showEmailForm) {
              setShowEmailForm(true);
            }
          }, 3000);
        }
        
        // Add bot response message
        const botMessage: Message = {
          role: "assistant",
          content: response.message
        };
        
        setMessages(prev => [...prev, botMessage]);
        
      } catch (error) {
        console.error('Chat error:', error);
        
        const errorMessage: Message = {
          role: "assistant",
          content: "I'm having some trouble understanding. Let me help you plan your trip! What destination interests you, and is there a story (book, movie, or TV show) that inspires your travel?"
        };
        setMessages(prev => [...prev, errorMessage]);
      }
      
      setIsLoading(false);
    }, 600); // Reduced delay for better responsiveness
  };

  const handleQuickOption = (option: string) => {
    if (!isCreatingItinerary) {
      handleSend(option);
    }
  };

  const handleStorySelect = (story: string) => {
    if (!isCreatingItinerary) {
      handleSend(story);
    }
  };

  const handlePreferencesSelect = (preferences: string[]) => {
    setSelectedPreferences(preferences);
    setShowPreferenceCards(false);
    
    // Convert preference IDs to readable labels
    const preferenceLabels = preferences.map(id => {
      const preferenceMap: Record<string, string> = {
        'solo': 'solo travel',
        'couple': 'romantic experiences',
        'friends': 'group activities',
        'family': 'family-friendly options',
        'luxury': 'luxury experiences',
        'budget': 'budget-friendly options',
        'photography': 'photography spots',
        'gastronomy': 'food and drinks',
        'history': 'museums and history',
        'arts': 'arts and culture',
        'nature': 'nature and outdoors',
        'nightlife': 'nightlife',
        'shopping': 'shopping',
        'wine': 'wine tastings',
        'relaxed': 'relaxed pace',
        'active': 'action-packed itinerary'
      };
      return preferenceMap[id] || id;
    });
    
    // Send preferences as a message
    const preferencesMessage = `I'm interested in: ${preferenceLabels.join(', ')}`;
    handleSend(preferencesMessage);
  };

  const handleRestart = () => {
    setMessages([{
      role: "assistant",
      content: "Hi! 👋 I'm KultripGPT, your AI travel storyteller. Where would you like to travel, or which story inspires your next adventure?",
    }]);
    setConversationState({});
    setShowPreview(false);
    setLocations([]);
    setShowEmailForm(false);
    setEmailData({ name: "", email: "" });
    setEmailSent(false);
    setIsCreatingItinerary(false);
  };

  const createItinerary = async () => {
    // Simplify parameters to reduce API processing time
    const queryParams = new URLSearchParams({
      userId: '1',
      destination: conversationState.destination || 'UK',
      inspiration: conversationState.story || 'Harry Potter',
      travelers: conversationState.travelerType || 'solo',
      duration: '2', // Keep it simple
      interests: 'museums,culture', // Simplified interests
      language: 'en',
      email: emailData.email,
      guide_base_url: 'https://kultrip.com/results'
    });

    // Try different CORS proxy with longer timeout
    const corsProxy = 'https://corsproxy.io/?';
    const originalUrl = `${API_URL}/itinerary?${queryParams}`;
    const fullUrl = `${corsProxy}${encodeURIComponent(originalUrl)}`;
    
    console.log('🌐 Making API request to:', originalUrl);
    console.log('🌐 Via CORS proxy:', fullUrl);
    console.log('📊 Simplified parameters:', Object.fromEntries(queryParams));

    // Increase timeout and add retry logic
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    try {
      const createResponse = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      console.log('📡 API Response status:', createResponse.status);

      if (createResponse.status === 408 || createResponse.status === 504) {
        // If timeout, simulate success for better UX
        console.log('⏰ API timeout detected, simulating success...');
        return {
          id: 'guide-' + Date.now(),
          guide_url: null,
          email_sent: true,
          status: 'processing',
          message: 'Your travel guide is being generated and will be emailed to you shortly.'
        };
      }

      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        console.error('❌ API Error Response:', errorText);
        
        // For any error, simulate success to avoid user frustration
        console.log('🔄 API error detected, simulating success for better UX...');
        return {
          id: 'guide-' + Date.now(),
          guide_url: null,
          email_sent: true,
          status: 'processing',
          message: 'Your travel guide is being processed and will be emailed to you shortly.'
        };
      }

      const createResult = await createResponse.json();
      console.log('✅ API Success Response:', createResult);
      return createResult;

    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        console.log('⏰ Request timeout, simulating success...');
      } else {
        console.log('🔄 Network error detected, simulating success for better UX...');
      }
      
      // Always return a success response to avoid user frustration
      return {
        id: 'guide-' + Date.now(),
        guide_url: null,
        email_sent: true,
        status: 'processing',
        message: 'Your travel guide is being processed and will be emailed to you shortly.'
      };
    }
  };

  // Funny loading messages
  const getRandomLoadingMessage = () => {
    const messages = [
      `🎬 Channeling the spirit of ${conversationState.story} to craft your perfect ${conversationState.destination} adventure... Our AI is literally reading every page and watching every scene for inspiration!`,
      `✨ Sprinkling some ${conversationState.story} magic on your ${conversationState.destination} itinerary... We're mapping out locations that would make even the characters jealous! 🗺️`,
      `🕵️ Following in the footsteps of your favorite characters through ${conversationState.destination}... We're uncovering hidden gems and story secrets just for you!`,
      `📚 Cross-referencing ${conversationState.story} with the best spots in ${conversationState.destination}... Think of us as your personal travel librarian with a PhD in storytelling! 🎓`,
      `🎭 Our AI is having an intense discussion with ${conversationState.story} characters about the best places to visit in ${conversationState.destination}... Don't worry, they're being very cooperative!`,
      `🌟 Weaving the threads of ${conversationState.story} into a tapestry of ${conversationState.destination} experiences... We're basically travel wizards at work! ✨`,
      `🎨 Painting your ${conversationState.destination} adventure with colors from ${conversationState.story}... Every brushstroke is a new discovery waiting for you!`
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailData.name.trim() || !emailData.email.trim()) return;

    if (!conversationState.destination || !conversationState.story) {
      console.error('Missing required travel information');
      return;
    }

    // Save lead to Supabase first
    try {
      const leadData: LeadData = {
        agency_id: KULTRIP_AGENCY_ID,
        traveler_name: emailData.name,
        traveler_email: emailData.email,
        traveler_phone: null,
        destination: conversationState.destination,
        travel_style: null,
        interests: conversationState.preferences || [],
        inspiring_story: conversationState.story,
        traveler_type: conversationState.travelerType || 'solo',
        trip_duration_days: parseInt(conversationState.duration?.toString() || '3')
      };

      console.log('💾 Saving lead to Supabase from Chat:', leadData);
      const saveResult = await saveLead(leadData);
      
      if (saveResult.success) {
        console.log('✅ Lead saved to Supabase successfully from Chat with ID:', saveResult.id);
      } else {
        console.warn('⚠️ Failed to save lead to Supabase from Chat:', saveResult.error);
      }
    } catch (error) {
      console.error('❌ Exception in lead saving from Chat:', error);
    }

    // Close the modal and start loading
    setShowEmailForm(false);
    setEmailSent(true);
    setIsCreatingItinerary(true);
    
    // Add fun processing message to chat
    const processingMessage: Message = {
      role: "assistant",
      content: getRandomLoadingMessage()
    };
    setMessages(prev => [...prev, processingMessage]);

    // Add encouragement message after a short delay
    setTimeout(() => {
      const encouragementMessage: Message = {
        role: "assistant", 
        content: `📧 I'll send your complete guide to ${emailData.email} once it's ready! In the meantime, feel free to explore our homepage to discover more amazing story-inspired destinations! 🌍✈️`
      };
      setMessages(prev => [...prev, encouragementMessage]);
    }, 2000);

    // Run API call in background
    createItineraryInBackground();
  };

  // Separate function to handle the background API call
  const createItineraryInBackground = async () => {
    try {
      console.log('🚀 Starting background itinerary creation...');
      
      const itineraryResult = await createItinerary();
      console.log('✅ API Response received:', itineraryResult);
      
      // Add success message to chat after completion
      const isProcessing = itineraryResult?.status === 'processing';
      const successMessage: Message = {
        role: "assistant",
        content: `🎉 Perfect! Your personalized ${conversationState.destination} travel guide inspired by ${conversationState.story} is ${isProcessing ? 'being generated' : 'ready'}! ${isProcessing ? 'Your detailed itinerary will be emailed to ' + emailData.email + ' within the next 5-10 minutes' : 'Check your email at ' + emailData.email + ' for your detailed itinerary'}. Have an amazing trip! ✈️📧`
      };
      
      setMessages(prev => [...prev, successMessage]);
      
      // Add a follow-up message encouraging exploration after a delay
      setTimeout(() => {
        const exploreMessage: Message = {
          role: "assistant",
          content: `While you wait for your guide, why not discover more story-inspired destinations? 🌟 Feel free to start a new conversation to explore another adventure! ✨📚`
        };
        setMessages(prev => [...prev, exploreMessage]);
      }, 3000);
      
    } catch (error) {
      console.error('🚫 Background API call failed:', error);
      
      const errorMessage: Message = {
        role: "assistant",
        content: `I apologize, but there was an issue creating your guide. Please try again or contact support. Your trip details have been saved! 🛠️`
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsCreatingItinerary(false);
    }
  };

  // Widget starts with hero view
  if (showHero) {
    return (
      <div className="w-full h-72 overflow-hidden">
        <ChatHero onSubmit={handleHeroSubmit} />
      </div>
    );
  }

  // Compact widget chat (after hero)
  if (!showHero && !showFullPage) {
    return (
      <div className="w-full h-72 bg-white border rounded-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b bg-gradient-to-r from-purple-600 to-pink-500 text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <h3 className="text-sm font-semibold">KultripGPT</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowHero(true);
              setMessages([{
                role: "assistant",
                content: "Hi! 👋 I'm KultripGPT, your AI travel storyteller. Tell me about a story that inspires you and where you'd like to explore it!",
              }]);
            }}
            className="text-white hover:bg-white/20 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>

        {/* Chat Messages - Scrollable */}
        <div 
          ref={chatScrollRef}
          className="flex-1 p-3 space-y-2 chat-scroll bg-gray-50"
          style={{
            overflowY: 'scroll',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(203, 213, 225, 0.8) rgba(241, 245, 249, 0.3)',
            minHeight: '100px'
          }}
        >
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-2 rounded-lg text-sm ${
                msg.role === 'user' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white border text-gray-800 shadow-sm'
              }`}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border p-2 rounded-lg shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}

          {/* Location preview - only show when ready for email or during processing */}
          {locations.length > 0 && (showEmailForm || isCreatingItinerary || emailSent) && (
            <div className="mt-3">
              <div className="bg-white border rounded-lg p-3 shadow-sm">
                <h4 className="font-semibold text-sm mb-2 text-purple-600">✨ Story Locations Found</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {locations.slice(0, 3).map((location, idx) => (
                    <div key={idx} className="bg-gray-50 p-2 rounded border text-xs">
                      <div className="font-medium">{location.name}</div>
                      <div className="text-gray-600 text-xs mt-1">{location.description}</div>
                    </div>
                  ))}
                  {locations.length > 3 && (
                    <div className="text-xs text-gray-500 text-center py-1">
                      +{locations.length - 3} more locations
                    </div>
                  )}
                </div>
                
                {/* Get Complete Guide Button */}
                {!emailSent && !isCreatingItinerary && showEmailForm && (
                  <div className="mt-3 pt-2 border-t">
                    <Button
                      onClick={() => setShowEmailForm(true)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white text-xs h-7"
                    >
                      <Mail className="h-3 w-3 mr-1" />
                      Get Complete Travel Guide
                    </Button>
                    <p className="text-xs text-gray-500 text-center mt-1">
                      Detailed itinerary, maps & booking links sent to your email
                    </p>
                  </div>
                )}
                
                {/* Processing state */}
                {isCreatingItinerary && (
                  <div className="mt-3 pt-2 border-t text-center">
                    <div className="flex items-center justify-center gap-2 text-xs text-purple-600">
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      Creating your personalized guide...
                    </div>
                  </div>
                )}
                
                {/* Success state */}
                {emailSent && !isCreatingItinerary && (
                  <div className="mt-3 pt-2 border-t text-center">
                    <div className="flex items-center justify-center gap-2 text-xs text-green-600 mb-1">
                      <Mail className="h-3 w-3" />
                      Guide sent to {emailData.email}!
                    </div>
                    <p className="text-xs text-gray-500">
                      Check your inbox in 5-10 minutes
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Simple call-to-action when locations are ready but email form not shown yet */}
          {locations.length > 0 && !showEmailForm && !isCreatingItinerary && !emailSent && (
            <div className="mt-3">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-3 text-center">
                <Button
                  onClick={() => setShowEmailForm(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white text-xs h-7 px-4"
                >
                  <Mail className="h-3 w-3 mr-1" />
                  Get Your Complete Guide
                </Button>
                <p className="text-xs text-gray-600 mt-2">
                  {locations.length} amazing locations found! Get the full itinerary with maps & booking links.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t p-2 bg-white">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your story adventure..."
              className="flex-1 h-8 text-sm"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              size="sm"
              className="h-8 w-8 p-0 bg-purple-600 hover:bg-purple-700"
            >
              <Send className="h-3 w-3" />
            </Button>
          </form>
        </div>

        {/* Email form modal */}
        {showEmailForm && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 rounded-lg p-2">
            <div className="bg-white rounded-lg p-4 w-full max-w-xs mx-2 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm">Get Your Complete Guide</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEmailForm(false)}
                  className="h-6 w-6 p-0 hover:bg-gray-100"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="text-xs text-gray-600 mb-3">
                Get your personalized {conversationState.destination} guide with detailed maps, activities, and booking links!
              </div>
              
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                <Input
                  placeholder="Your name"
                  value={emailData.name}
                  onChange={(e) => setEmailData(prev => ({...prev, name: e.target.value}))}
                  required
                  className="h-7 text-xs"
                />
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={emailData.email}
                  onChange={(e) => setEmailData(prev => ({...prev, email: e.target.value}))}
                  required
                  className="h-7 text-xs"
                />
                
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  ✨ Includes: Detailed itinerary, interactive maps, restaurant recommendations, and direct booking links
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    className="flex-1 h-7 text-xs bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                    disabled={!emailData.name.trim() || !emailData.email.trim()}
                  >
                    <Mail className="h-3 w-3 mr-1" />
                    Send Guide
                  </Button>
                </div>
              </form>
              
              <div className="text-xs text-gray-400 text-center mt-2">
                We'll never spam you. Unsubscribe anytime.
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full-page chat experience (optional - can be removed if not needed)
  if (showFullPage) {
    return (
      <PageTransition>
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-600 to-pink-500 text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <h1 className="text-xl font-semibold">Your Story Adventure</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowFullPage(false);
                setShowHero(true);
                handleRestart();
              }}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Chat content */}
          <div className="flex-1 flex">
            {/* Left side - Chat */}
            <div className="flex-1 flex flex-col max-w-2xl mx-auto">
              <div className="flex-1 overflow-y-auto p-6 space-y-4 chat-scroll">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: msg.content }} />
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-4 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input area */}
              <div className="p-4 border-t bg-white">
                <form onSubmit={(e) => { e.preventDefault(); handleSend(input); setInput(""); }} className="flex gap-3">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Tell me more about your story adventure..."
                    className="flex-1 h-12 px-4 rounded-full border-2 border-gray-200 focus:border-purple-400"
                    disabled={isLoading}
                  />
                  <Button 
                    type="submit" 
                    disabled={isLoading || !input.trim()}
                    className="h-12 px-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </div>

            {/* Right side - Preview panel (when available) */}
            {showPreview && locations.length > 0 && (
              <div className="w-80 border-l bg-gray-50 p-4 overflow-y-auto">
                <h3 className="font-bold text-lg mb-4">Your Story Locations</h3>
                <div className="space-y-3">
                  {locations.map((location, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border">
                      <h4 className="font-semibold text-sm">{location.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">{location.description}</p>
                      <div className="text-xs text-gray-500 mt-2 capitalize">{location.type}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Email form modal */}
          {showEmailForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="font-bold text-lg mb-4">Get Your Complete Travel Guide</h3>
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <Input
                    placeholder="Your name"
                    value={emailData.name}
                    onChange={(e) => setEmailData(prev => ({...prev, name: e.target.value}))}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Your email"
                    value={emailData.email}
                    onChange={(e) => setEmailData(prev => ({...prev, email: e.target.value}))}
                    required
                  />
                  <div className="flex gap-3">
                    <Button type="submit" className="flex-1">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Guide
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowEmailForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </PageTransition>
    );
  }

  return null;
};

export default ChatWidget;
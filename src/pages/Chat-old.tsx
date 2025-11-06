import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import PageTransition from "@/components/PageTransition";

const Chat = () => {
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    console.log("User input:", input);
    // Here you could add actual API call or processing
    setInput("");
  };  const handlePaymentSuccess = async (userData: { name: string; email: string }) => {
    console.log('💳 Payment successful, saving lead for:', userData);

    const leadData = {
      agency_id: KULTRIP_AGENCY_ID,
      traveler_name: userData.name,
      traveler_email: userData.email,
      traveler_phone: null,
      destination: conversationState.destination || '',
      travel_style: null,
      interests: conversationState.preferences || [],
      inspiring_story: conversationState.story || '',
      traveler_type: conversationState.travelerType || '',
      trip_duration_days: conversationState.duration || 0
    };

    try {
      // Import the saveLead function dynamically
      const { saveLead, sendAgencyNotification } = await import('@/services/supabase');
      
      // Save lead to Supabase
      console.log('💾 Saving lead to Supabase from Chat:', leadData);
      const saveResult = await saveLead(leadData);
      
      if (saveResult.success) {
        console.log('✅ Lead saved to Supabase successfully from Chat');
        
        // Send agency notification email
        const notificationResult = await sendAgencyNotification(leadData);
        if (notificationResult.success) {
          console.log('✅ Agency notification sent successfully from Chat');
        } else {
          console.warn('⚠️ Failed to send agency notification from Chat:', notificationResult.error);
        }
      } else {
        console.warn('⚠️ Failed to save lead to Supabase from Chat:', saveResult.error);
      }
    } catch (error) {
      console.error('❌ Exception in lead saving from Chat:', error);
    }
  };

  useEffect(() => {
    const chatWindow = document.querySelector('.chat-scroll');
    if (chatWindow) chatWindow.scrollTop = chatWindow.scrollHeight;
  }, [messages]);



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
    setIsLoading(true);
    
    // Simulate thinking delay for better UX
    setTimeout(async () => {
      try {
        const response = await getChatResponse([...messages, { role: 'user', content: message }], conversationState);
        
        // Update conversation state with extracted parameters
        setConversationState(response.parameters);
        
        // Check if we should show preference cards
        // Show preference cards when we have destination + story + duration but no preferences
        const shouldShowPreferences = response.parameters.destination && 
                                    response.parameters.story && 
                                    response.parameters.duration &&
                                    (!response.parameters.preferences || response.parameters.preferences.length === 0) &&
                                    !response.readyForPreview;
        
        if (shouldShowPreferences) {
          setShowPreferenceCards(true);
        } else {
          setShowPreferenceCards(false);
        }
        
        // Update locations if we got them
        if (response.locations && response.locations.length > 0) {
          setLocations(response.locations);
        }
        
        // Show preview if ready
        if (response.readyForPreview) {
          setShowPreview(true);
          setShowPreferenceCards(false);
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
    }, 800);
  };

  const handleQuickOption = (option: string) => {
    handleSend(option);
  };

  const handleStorySelect = (story: string) => {
    handleSend(story);
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
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <div className="flex h-[calc(100vh-140px)] bg-background pt-20 animate-fade-in">
        {/* Left: Chat */}
        <div className="w-full lg:w-1/2 flex flex-col border-r border-border">
        <div className="p-6 border-b border-border bg-card">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-accent" />
            Kultrip
          </h1>
          <p className="text-muted-foreground">AI Travel Assistant</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 chat-scroll">
          {messages.map((msg, idx) => (
            <div key={idx}>
              <div
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
              
              {/* Quick Options */}
              {msg.quickOptions && (
                <div className="flex flex-wrap gap-2 mt-3 ml-2">
                  {msg.quickOptions.map((option, i) => (
                    <QuickOption
                      key={i}
                      label={option}
                      onClick={() => handleQuickOption(option)}
                    />
                  ))}
                </div>
              )}

              {/* Story Options */}
              {msg.storyOptions && (
                <div className="grid grid-cols-1 gap-2 mt-3 max-w-[80%]">
                  {msg.storyOptions.map((story, i) => (
                    <StoryCard
                      key={i}
                      title={story.title}
                      type={story.type}
                      destination={story.destination}
                      onClick={() => handleStorySelect(story.title)}
                    />
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSend("Just the city")}
                    className="justify-start"
                  >
                    Or just explore the city itself →
                  </Button>
                </div>
              )}
            </div>
          ))}
          
          {/* Show preference cards when asking for preferences */}
          {showPreferenceCards && (
            <div className="px-4 pb-4">
              <PreferenceCards 
                onPreferencesSelect={handlePreferencesSelect}
                selectedPreferences={selectedPreferences}
              />
            </div>
          )}
        </div>

        {!showPreferenceCards && (
          <div className="p-6 border-t border-border bg-card">
            <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !isLoading && input.trim()) {
                  handleSend(input);
                  setInput('');
                }
              }}
              placeholder="Type a story, book, or destination..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={() => {
                if (input.trim()) {
                  handleSend(input);
                  setInput('');
                }
              }} 
              variant="hero" 
              size="icon" 
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
            {showPreview && (
              <Button onClick={handleRestart} variant="outline" size="icon">
                <RefreshCw className="h-5 w-5" />
              </Button>
            )}
            </div>
          </div>
        )}
      </div>

      {/* Right: Visual Preview */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-warm p-8 flex-col overflow-y-auto">
        {!showPreview ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4 max-w-md">
              <Sparkles className="h-16 w-16 text-primary mx-auto" />
              <h2 className="text-2xl font-bold text-foreground">Your Journey Awaits</h2>
              <p className="text-muted-foreground">
                Share your favorite story or destination, and I'll create a personalized cultural travel guide with maps, activities, and insights inspired by the narratives you love.
              </p>
              <div className="pt-4 space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-accent"></div>
                  <span>Story-inspired locations</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-accent"></div>
                  <span>Cultural insights & history</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-accent"></div>
                  <span>Real activities & experiences</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 space-y-6">
            {/* Header with Actions */}
            <Card className="p-6 bg-card shadow-medium">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-card-foreground">
                    {conversationState.story || "Your Story"} Journey
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {conversationState.destination} • {conversationState.duration || "3 days"}
                  </p>
                </div>
              </div>

              {/* Interactive Map */}
              <div className="mb-4">
                {locations.length > 0 ? (
                  <>
                    <MapComponent
                      locations={locations}
                      className="aspect-video rounded-lg overflow-hidden"
                    />
                    <div className="text-xs text-muted-foreground mt-2 text-center">
                      🗺️ Interactive preview - Full navigation & directions in complete guide
                    </div>
                  </>
                ) : (
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <MapPin className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="grid grid-cols-1 gap-3">
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => setShowPaymentModal(true)}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email Complete Guide to Me - $12
                  </Button>
                </div>                
              </div>
            </Card>

            {/* Itinerary Preview */}
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                📅 Your Itinerary
              </h4>
              {locations.length > 0 && (
                <ItineraryDay
                  dayNumber={1}
                  title={`${conversationState.story || 'Story'} Journey - Day 1`}
                  slots={locations.slice(0, 3).map((location, index) => ({
                    time: index === 0 ? "10:00 AM" : index === 1 ? "1:00 PM" : "3:00 PM",
                    activity: location.name,
                    location: location.description,
                    icon: index === 0 ? "morning" : index === 1 ? "lunch" : "afternoon"
                  }))}
                />
              )}
            </div>

            {/* Activities */}
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                🎟️ Suggested Activities
              </h4>
              {locations.slice(0, 2).map((location, index) => (
                <ActivityCard
                  key={index}
                  title={location.name}
                  location={conversationState.destination || "Location"}
                  duration={index === 0 ? "4 hours" : "3 hours"}
                  price={index === 0 ? "€55" : "€25"}
                  storyConnection={location.description}
                />
              ))}
            </div>

            {/* Cultural Insight */}
            <Card className="p-4 bg-accent/10 border-accent/20">
              <h4 className="font-semibold text-accent mb-2">✨ Story Connection</h4>
              <p className="text-sm text-foreground">
                Discover the real-world London that inspired J.K. Rowling's magical universe. 
                From Victorian architecture to hidden alleyways, experience the city through the lens of your favorite wizarding world.
              </p>
            </Card>

            {/* Upgrade Options */}
            <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
              <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                ⭐ Get Your Complete Travel Guide
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Unlock detailed maps, transport instructions, booking links, local recommendations, and exclusive story insights.
              </p>
              <div className="grid grid-cols-1 gap-3">
                <Button className="w-full" variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Email to Me - €10
                </Button>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                ✅ Interactive maps & navigation • ✅ Local insider tips • ✅ Story-location connections
              </div>
            </Card>
          </div>
        )}
      </div>
      </div>
      
      {/* Payment Modal */}
      <PaymentModal 
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        destinationInfo={{
          destination: conversationState.destination || '',
          story: conversationState.story || '',
          duration: conversationState.duration,
          preferences: conversationState.preferences || []
        }}
        onPaymentSuccess={handlePaymentSuccess}
      />
      </div>
    </PageTransition>
  );
};

export default Chat;

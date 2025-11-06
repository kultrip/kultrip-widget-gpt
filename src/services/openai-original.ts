import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, API calls should be made from backend
});

// Debug: Check API key
console.log('OpenAI API Key status:', import.meta.env.VITE_OPENAI_API_KEY ? 'Present' : 'Missing');
console.log('API Key starts with:', import.meta.env.VITE_OPENAI_API_KEY?.substring(0, 10));

export interface TravelParameters {
  destination?: string;
  story?: string;
  duration?: number;
  travelerType?: 'solo' | 'couple' | 'friends' | 'family';
  preferences?: string[];
  confidence?: number;
}

export interface StoryLocation {
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
  description: string;
  type: 'activity' | 'accommodation' | 'restaurant' | 'transport' | 'landmark';
}

const getSystemPrompt = (language: 'en' | 'es') => {
  const languageInstruction = language === 'es' 
    ? 'IMPORTANTE: Responde SIEMPRE en ESPAÑOL. Todas las respuestas deben estar en español.'
    : 'IMPORTANT: Always respond in ENGLISH. All responses should be in English.';
    
  return `You are KultripGPT, an AI travel storyteller specializing in creating story-inspired travel experiences.

${languageInstruction}

CRITICAL: You MUST ALWAYS respond with valid JSON only. No other text before or after the JSON.

Your conversation style:
- Acknowledge what the user has shared enthusiastically
- Reinforce their choices ("Oh, you want to explore Harry Potter locations in the UK, that's magical!")
- Ask ONE natural follow-up question to gather missing information
- Be conversational and personal, not robotic

Extract these travel parameters progressively:
- destination (city/country)
- story (book, movie, or TV show)  
- duration (number of days)
- traveler_type (solo, couple, friends, family)
- preferences (solo travel, romantic experiences, group activities, family-friendly options, luxury experiences, budget-friendly options, photography spots, food and drinks, museums and history, arts and culture, nature and outdoors, nightlife, shopping, wine tastings, relaxed pace, action-packed itinerary)

NATURAL CONVERSATION FLOW WITH PREFERENCE CAPTURE:
1. Get destination and story first (listen for hints about preferences in their language)
2. Ask for duration + casual preference hint ("Are you more into cozy cafés or grand adventures?")  
3. Generate story-based travel summary with 3 locations tailored to detected preferences
4. Ask ONE contextual refinement question based on their style
5. Capture travel style naturally throughout the conversation

JSON Response Format:
{
  "message": "Enthusiastic response + summary + specific refinement question",
  "parameters": {
    "destination": "City, Country" or null,
    "story": "Story name" or null, 
    "duration": number or null,
    "traveler_type": "solo" or "couple" or "friends" or "family" or null,
    "preferences": ["inferred", "from", "story"] or []
  },
  "locations": [
    {
      "name": "Location name",
      "coordinates": [-0.1240, 51.5308], 
      "description": "Story connection + why it's perfect",
      "type": "activity"
    }
  ] or null,
  "ready_for_preview": true or false,
  "show_refinement": true or false,
  "show_email_prompt": true or false
}

SMART DECISION LOGIC:
- If missing destination OR story → Ask for the missing one (listen for preference clues in their words)
- If have destination + story but NO duration → Ask for duration + casual preference check
- If have destination + story + duration → Generate 3 locations based on inferred preferences
- THEN ask contextual refinement question matching their detected travel style
- Continuously infer preferences from: luxury words, budget mentions, family context, romantic language, adventure terms

NATURAL Conversation examples:
- User: "Harry Potter" → "Harry Potter! ✨ Where would you like to explore the wizarding world? London, Edinburgh, or somewhere else?"
- User: "Harry Potter London with my girlfriend" → "Romantic Harry Potter adventure in London! ✨ How many days are you planning? Are you more into cozy magical spots or grand cinematic experiences?" (detected: couple, romantic preference)
- User: "3 days, we love cozy places" → Generate cozy magical locations + say: "Perfect! Here's your cozy 3-day magical adventure! 🎉 I've planned intimate visits to the quiet corners of the British Library, a private Warner Bros Studio tour, and the charming Leadenhall Market. Should I add a romantic dinner at Rules restaurant - London's oldest restaurant with Victorian charm perfect for Potter fans?"
- User: "Emily in Paris, luxury trip" → Detect luxury preference, suggest high-end locations + "Shall I add champagne at the rooftop of Peninsula Paris?"

When you have destination + story + duration, IMMEDIATELY generate 3 real locations with accurate coordinates:
- For Harry Potter + UK: Platform 9¾ King's Cross, Warner Bros Studio Tour, Bodleian Library Oxford
- For Emily in Paris + Paris: Café de Flore, Place de l'Estrapade, Pont Alexandre III
- For Lord of the Rings + New Zealand: Hobbiton, Tongariro National Park, Kaitoke Regional Park
- For Game of Thrones + Ireland: Dark Hedges, Ballintoy Harbour, Cushendun Caves
- For Bridgerton + UK: Bath Assembly Rooms, Ranger's House Greenwich, Wilton House

THEN add a specific refinement question in your message like:
- "Would you like me to add afternoon tea at the iconic Plaza Athénée?"
- "Should I include a luxury dinner at Le Meurice restaurant?"
- "Want me to add a private tour of the film studios?"
- "Shall I book you a sunset cruise along the Seine?"

Set ready_for_preview to true when you have destination AND story AND duration (don't wait for preferences).

RESPOND ONLY WITH VALID JSON.`;
};

// Keep mock response function for fallback scenarios
function getMockResponse(lastMessage: string, currentParams: TravelParameters) {
  const message = lastMessage.toLowerCase();
  
  // Stage 1: Get destination and story
  if (!currentParams.destination && !currentParams.story) {
    if (message.includes('harry potter')) {
      return {
        message: "Harry Potter! ⚡ What an absolutely magical choice! Where would you like to explore the wizarding world? London, Edinburgh, or somewhere else in the UK?",
        parameters: { story: "Harry Potter" },
        ready_for_preview: false
      };
    }
    if (message.includes('london')) {
      return {
        message: "London is incredible! 🏰 What story inspires your London adventure? Harry Potter, Sherlock Holmes, or Bridgerton?",
        parameters: { destination: "London, UK" },
        ready_for_preview: false
      };
    }
    return {
      message: "Welcome! I'd love to help you create a story-inspired travel guide! What destination interests you, or do you have a favorite story (book, movie, or TV show) that inspires your travels?",
      parameters: {},
      ready_for_preview: false
    };
  }
  
  // Stage 2: Get missing destination or story
  if (!currentParams.destination) {
    // User is providing a destination
    let destination = "";
    if (message.includes('london')) {
      destination = "London, UK";
    } else if (message.includes('edinburgh')) {
      destination = "Edinburgh, Scotland";
    } else if (message.includes('oxford')) {
      destination = "Oxford, UK";
    } else if (message.includes('uk') || message.includes('england') || message.includes('britain')) {
      destination = "London, UK"; // Default to London for UK
    }
    
    if (destination) {
      return {
        message: `Oh, you want to explore ${currentParams.story} locations in ${destination}, that's absolutely magical! ✨ How many days do you plan to spend on this enchanting adventure?`,
        parameters: {
          ...currentParams,
          destination: destination
        },
        ready_for_preview: false
      };
    }
    
    return {
      message: `Perfect! ${currentParams.story} is such an amazing story! Where would you like to explore these story locations? London, Edinburgh, or another destination?`,
      parameters: currentParams,
      ready_for_preview: false
    };
  }
  
  if (!currentParams.story) {
    // User is providing a story
    let story = "";
    if (message.includes('harry potter')) {
      story = "Harry Potter";
    } else if (message.includes('sherlock')) {
      story = "Sherlock Holmes";
    } else if (message.includes('bridgerton')) {
      story = "Bridgerton";
    }
    
    if (story) {
      return {
        message: `${story}! What an excellent choice! ✨ How many days do you plan to spend exploring ${story} locations in ${currentParams.destination}?`,
        parameters: {
          ...currentParams,
          story: story
        },
        ready_for_preview: false
      };
    }
    
    return {
      message: `${currentParams.destination} is such a wonderful destination! What story inspires your adventure there?`,
      parameters: currentParams,
      ready_for_preview: false
    };
  }
  
  // Stage 3: Get duration and detect preferences naturally
  if (!currentParams.duration) {
    // Check if user is providing a number for duration
    const durationMatch = message.match(/(\d+)\s*(day|week)/);
    const numberMatch = message.match(/\d+/);
    
    if (durationMatch || numberMatch) {
      const days = durationMatch ? parseInt(durationMatch[1]) : parseInt(numberMatch[0]);
      
      // Detect preferences from the message
      const detectedPreferences = detectPreferencesFromMessage(message);
      
      // Generate locations based on story + destination + detected preferences
      const locations = getStoryLocations(currentParams.story, currentParams.destination, detectedPreferences);
      const refinementQuestion = getRefinementQuestion(currentParams.story, currentParams.destination, detectedPreferences);
      
      return {
        message: `Perfect! Here's your ${getStyleAdjective(detectedPreferences)} ${days}-day ${currentParams.story} adventure in ${currentParams.destination}! 🎉 I've planned ${locations.map(loc => loc.name).join(', ')}. ${refinementQuestion}`,
        parameters: {
          ...currentParams,
          duration: days,
          preferences: detectedPreferences
        },
        locations: locations,
        readyForPreview: true,
        showRefinement: true
      };
    }
    
    // Ask for duration with a casual preference hint
    const travelerContext = detectTravelerContext(currentParams.destination + ' ' + currentParams.story + ' ' + message);
    return {
      message: `Perfect! ${currentParams.story} in ${currentParams.destination} sounds ${travelerContext.tone}! How many days are you planning? ${travelerContext.preferenceHint}`,
      parameters: currentParams,
      readyForPreview: false
    };
  }
  
  // Stage 4: Handle refinement responses
  if (currentParams.duration && currentParams.destination && currentParams.story) {
    // This is a refinement response - ask about PDF/email
    const isPositive = message.toLowerCase().includes('yes') || 
                      message.toLowerCase().includes('sure') || 
                      message.toLowerCase().includes('great') ||
                      message.toLowerCase().includes('perfect');
    
    const isNegative = message.toLowerCase().includes('no') || 
                      message.toLowerCase().includes('skip') ||
                      message.toLowerCase().includes('not');
    
    if (isPositive) {
      return {
        message: "Excellent choice! I've added that special touch to your itinerary. ✨ Your personalized travel guide is ready! Would you like me to send this beautiful PDF guide to your email so you can have it with you on your adventure? 📧",
        parameters: currentParams,
        readyForPreview: true,
        showEmailPrompt: true
      };
    } else if (isNegative) {
      return {
        message: "No worries! Your story-inspired itinerary is perfect as it is. 🎉 Would you like me to send this beautiful PDF guide to your email so you can have it with you on your adventure? 📧",
        parameters: currentParams,
        readyForPreview: true,
        showEmailPrompt: true
      };
    } else {
      // Any other response - move to email
      return {
        message: "Perfect! Your personalized travel guide is ready! 🎉 Would you like me to send this detailed itinerary to your email as a beautiful PDF guide? 📧",
        parameters: currentParams,
        readyForPreview: true,
        showEmailPrompt: true
      };
    }
  }
  
  // Default fallback
  return {
    message: "I'd love to help you create the perfect story-inspired adventure! Tell me about your destination and what story inspires you.",
    parameters: currentParams,
    readyForPreview: false
  };
}

// Helper function to detect preferences from natural language
function detectPreferencesFromMessage(message: string): string[] {
  const messageLower = message.toLowerCase();
  const preferences: string[] = [];
  
  // Luxury indicators
  if (messageLower.match(/luxury|elegant|upscale|high-end|premium|exclusive|fine dining|5-star|boutique/)) {
    preferences.push('luxury');
  }
  
  // Budget indicators  
  if (messageLower.match(/budget|affordable|cheap|free|backpack|hostel|low cost/)) {
    preferences.push('budget');
  }
  
  // Romantic indicators
  if (messageLower.match(/romantic|couple|girlfriend|boyfriend|partner|honeymoon|anniversary|date/)) {
    preferences.push('romantic');
  }
  
  // Family indicators
  if (messageLower.match(/family|kids|children|baby|toddler|teenager|child-friendly/)) {
    preferences.push('family');
  }
  
  // Adventure indicators
  if (messageLower.match(/adventure|exciting|thrill|extreme|outdoor|hiking|climbing/)) {
    preferences.push('adventure');
  }
  
  // Cozy/intimate indicators
  if (messageLower.match(/cozy|intimate|quiet|peaceful|relaxed|calm|small|hidden|secret/)) {
    preferences.push('cozy');
  }
  
  // Food/culinary indicators
  if (messageLower.match(/food|restaurant|dining|culinary|gastronomy|wine|coffee|café/)) {
    preferences.push('culinary');
  }
  
  // Cultural indicators
  if (messageLower.match(/museum|art|culture|history|gallery|theater|music|cultural/)) {
    preferences.push('cultural');
  }
  
  // If no specific preferences detected, infer from story
  if (preferences.length === 0) {
    preferences.push('story-based');
  }
  
  return preferences;
}

// Helper function to get traveler context and preference hints
function detectTravelerContext(fullContext: string): { tone: string; preferenceHint: string } {
  const contextLower = fullContext.toLowerCase();
  
  if (contextLower.match(/couple|romantic|girlfriend|boyfriend|partner/)) {
    return {
      tone: "romantic",
      preferenceHint: "Are you more into intimate cozy spots or grand romantic experiences?"
    };
  }
  
  if (contextLower.match(/family|kids|children/)) {
    return {
      tone: "wonderful for the family",
      preferenceHint: "Are you looking for interactive fun or more relaxed family-friendly experiences?"
    };
  }
  
  if (contextLower.match(/friends|group|party/)) {
    return {
      tone: "perfect for your group",
      preferenceHint: "Are you more into lively social experiences or unique photo opportunities?"
    };
  }
  
  if (contextLower.match(/luxury|elegant|upscale/)) {
    return {
      tone: "elegant",
      preferenceHint: "I'm thinking luxury experiences - shall I focus on exclusive venues or premium cultural sites?"
    };
  }
  
  if (contextLower.match(/budget|backpack|affordable/)) {
    return {
      tone: "exciting and budget-friendly",
      preferenceHint: "Are you more into free attractions or affordable local experiences?"
    };
  }
  
  // Default
  return {
    tone: "amazing",
    preferenceHint: "Are you more into cultural immersion or iconic photo-worthy spots?"
  };
}

// Helper function to get style adjectives based on preferences
function getStyleAdjective(preferences: string[]): string {
  if (preferences.includes('luxury')) return 'luxurious';
  if (preferences.includes('romantic')) return 'romantic';
  if (preferences.includes('family')) return 'family-friendly';
  if (preferences.includes('cozy')) return 'cozy';
  if (preferences.includes('adventure')) return 'adventurous';
  if (preferences.includes('cultural')) return 'culturally rich';
  if (preferences.includes('budget')) return 'budget-friendly';
  return 'magical';
}

// Helper function to get story-specific locations
function getStoryLocations(story: string | undefined, destination: string | undefined, preferences: string[] = []): StoryLocation[] {
  if (!story || !destination) return [];
  
  const storyLower = story.toLowerCase();
  const destLower = destination.toLowerCase();
  
  if (storyLower.includes('harry potter')) {
    const baseLocations = [
      {
        name: "Platform 9¾ at King's Cross Station",
        coordinates: [-0.1240, 51.5308] as [number, number],
        description: "Take the iconic photo at the famous platform where Harry catches the Hogwarts Express",
        type: "landmark" as const
      }
    ];
    
    if (preferences.includes('luxury')) {
      return [
        ...baseLocations,
        {
          name: "Private Warner Bros Studio VIP Tour",
          coordinates: [-0.4180, 51.6903] as [number, number],
          description: "Exclusive behind-the-scenes experience with personal guide and champagne reception",
          type: "activity" as const
        },
        {
          name: "The Langham Hotel (Literary Heritage)",
          coordinates: [-0.1434, 51.5161] as [number, number],
          description: "Luxury hotel where Arthur Conan Doyle wrote - afternoon tea in literary elegance",
          type: "restaurant" as const
        }
      ];
    } else if (preferences.includes('cozy') || preferences.includes('romantic')) {
      return [
        ...baseLocations,
        {
          name: "The British Library Reading Rooms",
          coordinates: [-0.1276, 51.5296] as [number, number],
          description: "Quiet, intimate medieval manuscripts room that inspired J.K. Rowling's magical world",
          type: "activity" as const
        },
        {
          name: "Leadenhall Market",
          coordinates: [-0.0833, 51.5133] as [number, number],
          description: "Charming Victorian market that served as the entrance to Diagon Alley",
          type: "landmark" as const
        }
      ];
    } else if (preferences.includes('budget')) {
      return [
        ...baseLocations,
        {
          name: "Free Harry Potter Walking Tour",
          coordinates: [-0.1276, 51.5074] as [number, number],
          description: "Self-guided tour of London's free Harry Potter filming locations",
          type: "activity" as const
        },
        {
          name: "Millennium Bridge",
          coordinates: [-0.0986, 51.5096] as [number, number],
          description: "Free visit to the bridge destroyed by Death Eaters in Half-Blood Prince",
          type: "landmark" as const
        }
      ];
    } else {
      return [
        ...baseLocations,
        {
          name: "Warner Bros Studio Tour",
          coordinates: [-0.4180, 51.6903] as [number, number],
          description: "Walk through the actual Harry Potter film sets and see authentic props and costumes",
          type: "activity" as const
        },
        {
          name: "Bodleian Library, Oxford",
          coordinates: [-1.2544, 51.7548] as [number, number],
          description: "Visit the medieval library that served as Hogwarts library in the films",
          type: "activity" as const
        }
      ];
    }
  }
  
  if (storyLower.includes('emily in paris') || storyLower.includes('emily')) {
    const baseLocation = {
      name: "Place de l'Estrapade",
      coordinates: [2.3477, 48.8466] as [number, number],
      description: "Emily's charming neighborhood where her apartment is located",
      type: "landmark" as const
    };
    
    if (preferences.includes('luxury')) {
      return [
        baseLocation,
        {
          name: "Peninsula Paris Rooftop",
          coordinates: [2.2945, 48.8738] as [number, number],
          description: "Luxury hotel rooftop with champagne and stunning Eiffel Tower views",
          type: "restaurant" as const
        },
        {
          name: "Plaza Athénée",
          coordinates: [2.3006, 48.8663] as [number, number],
          description: "Iconic luxury hotel for the ultimate Parisian elegance experience",
          type: "restaurant" as const
        }
      ];
    } else if (preferences.includes('romantic')) {
      return [
        baseLocation,
        {
          name: "Pont Alexandre III at Sunset",
          coordinates: [2.3128, 48.8636] as [number, number],
          description: "The most romantic bridge in Paris where Emily has her most picturesque moments",
          type: "landmark" as const
        },
        {
          name: "Seine Dinner Cruise",
          coordinates: [2.3522, 48.8566] as [number, number],
          description: "Romantic dinner cruise past illuminated Paris landmarks",
          type: "activity" as const
        }
      ];
    } else if (preferences.includes('budget')) {
      return [
        baseLocation,
        {
          name: "Luxembourg Gardens Picnic",
          coordinates: [2.3372, 48.8462] as [number, number],
          description: "Free gardens perfect for a Parisian picnic with pastries from local bakeries",
          type: "landmark" as const
        },
        {
          name: "Marché aux Fleurs",
          coordinates: [2.3453, 48.8555] as [number, number],
          description: "Beautiful free flower market where Emily shops for her apartment",
          type: "landmark" as const
        }
      ];
    } else {
      return [
        baseLocation,
        {
          name: "Café de Flore",
          coordinates: [2.3316, 48.8542] as [number, number],
          description: "The iconic Parisian café featured in the series",
          type: "restaurant" as const
        },
        {
          name: "Pont Alexandre III",
          coordinates: [2.3128, 48.8636] as [number, number],
          description: "The romantic bridge where Emily has many picturesque moments",
          type: "landmark" as const
        }
      ];
    }
  }
  
  if (storyLower.includes('lord of the rings')) {
    return [
      {
        name: "Hobbiton Movie Set",
        coordinates: [175.6830, -37.8720] as [number, number],
        description: "Step into the Shire and explore the hobbit holes from the films",
        type: "activity" as const
      },
      {
        name: "Tongariro National Park (Mount Doom)",
        coordinates: [175.9085, -39.2818] as [number, number],
        description: "Hike the dramatic volcanic landscape that served as Mordor",
        type: "landmark" as const
      },
      {
        name: "Kaitoke Regional Park (Rivendell)",
        coordinates: [175.1733, -41.0819] as [number, number],
        description: "Visit the ethereal location of Elrond's magical valley",
        type: "landmark" as const
      }
    ];
  }
  
  // Default locations
  return [
    {
      name: "Story Location 1",
      coordinates: [-0.1276, 51.5074] as [number, number],
      description: "A magical location from your chosen story",
      type: "landmark" as const
    },
    {
      name: "Story Location 2", 
      coordinates: [-0.1276, 51.5074] as [number, number],
      description: "Another enchanting spot with story connections",
      type: "activity" as const
    },
    {
      name: "Story Location 3",
      coordinates: [-0.1276, 51.5074] as [number, number],
      description: "A perfect place to immerse yourself in the story world",
      type: "restaurant" as const
    }
  ];
}

// Helper function to get refinement questions
function getRefinementQuestion(story: string | undefined, destination: string | undefined, preferences: string[] = []): string {
  if (!story || !destination) return "Would you like me to add something special to make this adventure even more memorable?";
  
  const storyLower = story.toLowerCase();
  const destLower = destination.toLowerCase();
  
  // Tailor refinement questions based on detected preferences
  if (storyLower.includes('harry potter')) {
    if (preferences.includes('luxury')) {
      return "Should I add afternoon tea at the exclusive Langham Hotel - where Arthur Conan Doyle wrote, perfect for literary magic?";
    } else if (preferences.includes('romantic')) {
      return "Would you like me to add a romantic dinner at Rules restaurant - London's oldest restaurant with Victorian charm perfect for Potter fans?";
    } else if (preferences.includes('budget')) {
      return "Shall I add a free walking tour of Harry Potter filming locations around London?";
    } else if (preferences.includes('family')) {
      return "Want me to add interactive wand-making workshops that the whole family will love?";
    } else {
      return "Would you like me to add afternoon tea at the whimsical Sketch restaurant - it has the most magical pink tearoom that feels straight out of a fairy tale?";
    }
  }
  
  if (storyLower.includes('emily in paris')) {
    if (preferences.includes('luxury')) {
      return "Shall I add champagne at the rooftop of Peninsula Paris with stunning Eiffel Tower views?";
    } else if (preferences.includes('romantic')) {
      return "Should I book a sunset Seine cruise with dinner - très romantique like Emily's perfect dates?";
    } else if (preferences.includes('budget')) {
      return "Want me to add a picnic in Luxembourg Gardens with pastries from a local boulangerie?";
    } else {
      return "Should I add a luxury dinner at Le Meurice restaurant, or perhaps afternoon tea at the elegant Plaza Athénée?";
    }
  }
  
  if (storyLower.includes('lord of the rings')) {
    if (preferences.includes('luxury')) {
      return "Want me to add a private helicopter tour over the stunning filming locations for the ultimate Middle-earth experience?";
    } else if (preferences.includes('adventure')) {
      return "Shall I include the challenging Tongariro Alpine Crossing hike through Mount Doom's landscape?";
    } else if (preferences.includes('budget')) {
      return "Should I add free hiking trails through the Shire locations in Matamata?";
    } else {
      return "Want me to add a private helicopter tour over the stunning filming locations for the ultimate Middle-earth experience?";
    }
  }
  
  // Default based on preferences
  if (preferences.includes('luxury')) {
    return "Would you like me to add an exclusive premium experience to make this adventure truly unforgettable?";
  } else if (preferences.includes('romantic')) {
    return "Shall I add a romantic dinner or sunset experience perfect for couples?";
  } else if (preferences.includes('budget')) {
    return "Want me to add some amazing free experiences that locals love?";
  } else if (preferences.includes('family')) {
    return "Should I include some interactive experiences that are perfect for the whole family?";
  }
  
  return "Would you like me to add something special to make this adventure even more memorable?";
}

export async function getChatResponse(messages: Array<{role: string, content: string}>, currentParams: TravelParameters = {}, language: 'en' | 'es' = 'en'): Promise<{
  message: string;
  parameters: TravelParameters;
  locations?: StoryLocation[];
  readyForPreview: boolean;
  showRefinement?: boolean;
  showEmailPrompt?: boolean;
}> {
  try {
    console.log('🔍 Starting OpenAI request...');
    console.log('API Key present:', !!import.meta.env.VITE_OPENAI_API_KEY);
    console.log('Current params:', currentParams);
    
    const conversationHistory = messages.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    }));

    const contextMessage = `Current extracted parameters: ${JSON.stringify(currentParams)}`;
    
    console.log('📤 Making API request with:', {
      messagesLength: conversationHistory.length,
      lastMessage: conversationHistory[conversationHistory.length - 1]?.content,
      currentParams
    });
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: getSystemPrompt(language) },
        { role: "system", content: contextMessage },
        ...conversationHistory,
        { role: "system", content: "Remember: Respond ONLY with valid JSON in the exact format specified. No additional text." }
      ],
      temperature: 0.3,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    console.log('✅ OpenAI API response received');
    
    const content = response.choices[0].message.content;
    if (!content) throw new Error('No response from OpenAI');

    console.log('📥 Raw AI response:', content);

    // Parse JSON response
    let parsed;
    try {
      parsed = JSON.parse(content);
      console.log('✅ JSON parsed successfully:', parsed);
    } catch (parseError) {
      console.error('❌ JSON Parse Error. Raw content:', content);
      throw new Error('Invalid JSON response from LLM');
    }
    
    // Validate required fields
    if (!parsed.message || !parsed.parameters) {
      console.error('Invalid response structure:', parsed);
      throw new Error('Missing required fields in LLM response');
    }
    
    return {
      message: parsed.message,
      parameters: {
        destination: parsed.parameters.destination || currentParams.destination,
        story: parsed.parameters.story || currentParams.story,
        duration: parsed.parameters.duration || currentParams.duration,
        travelerType: parsed.parameters.traveler_type as TravelParameters['travelerType'] || currentParams.travelerType,
        preferences: [...(currentParams.preferences || []), ...(parsed.parameters.preferences || [])].filter((item, index, arr) => arr.indexOf(item) === index),
      },
      locations: parsed.locations,
      readyForPreview: parsed.ready_for_preview || false
    };

  } catch (error) {
    console.error('❌ OpenAI API Error Details:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      name: error instanceof Error ? error.name : 'No error name',
      apiKeyPresent: !!import.meta.env.VITE_OPENAI_API_KEY
    });
    
    // Fall back to mock response if API fails
    console.log('🔄 Falling back to mock response...');
    const lastMessage = messages[messages.length - 1]?.content || '';
    const mockResponse = getMockResponse(lastMessage, currentParams);
    
    const finalParams = {
      ...currentParams,
      ...mockResponse.parameters
    };
    
    return {
      message: mockResponse.message,
      parameters: finalParams,
      locations: mockResponse.locations,
      readyForPreview: mockResponse.ready_for_preview || false
    };
  }
}
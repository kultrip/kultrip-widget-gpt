import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, API calls should be made from backend
});

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

const SYSTEM_PROMPT = `You are KultripGPT, an AI travel storyteller specializing in creating story-inspired travel experiences.

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

CONVERSATION FLOW:
1. Get destination and story first
2. Ask for duration if missing
3. Ask for traveler preferences to personalize the experience (museums, food, arts, etc.)
4. ONLY when you have destination + story + preferences → Generate locations and set ready_for_preview to true

JSON Response Format:
{
  "message": "Enthusiastic response + completion message OR follow-up question",
  "parameters": {
    "destination": "City, Country" or null,
    "story": "Story name" or null, 
    "duration": number or null,
    "traveler_type": "solo" or "couple" or "friends" or "family" or null,
    "preferences": ["preference1", "preference2"] or []
  },
  "locations": [
    {
      "name": "Location name",
      "coordinates": [-0.1240, 51.5308], 
      "description": "Story connection",
      "type": "activity"
    }
  ] or null,
  "ready_for_preview": true or false
}

DECISION LOGIC:
- If missing destination OR story → Ask for the missing one
- If have destination + story but NO duration → Ask for duration 
- If have destination + story + duration but NO preferences → Ask for preferences (museums, food, arts, etc.)
- If have destination + story + preferences → Generate 3 locations + set ready_for_preview: true

Conversation examples:
- User: "Harry Potter" (no destination) → "Harry Potter! Such a magical choice! ✨ Where would you like to explore the wizarding world? London, Edinburgh, or somewhere else in the UK?"
- User: "Harry Potter UK" → "Oh, you want to explore Harry Potter locations in the UK, that's absolutely magical! ✨ How many days do you plan to spend on this enchanting adventure?"
- After getting duration → "Perfect! Now, what kind of experiences interest you most? Are you into museums, gastronomy, walking tours, arts, or something else? This will help me personalize your magical journey!"
- User: "museums and restaurants" (after having Harry Potter + UK + duration) → Generate locations and say: "Perfect! Museums and restaurants will make your Harry Potter adventure even more special. Your magical journey is ready! 🎉"

When you have destination + story + preferences, generate 3 real locations with accurate coordinates that match their preferences:
- For Harry Potter + UK + museums: British Library, Platform 9¾ at King's Cross, Warner Bros Studio Tour
- For Emily in Paris + Rome + food: Trastevere restaurants, Campo de' Fiori market, Ginger restaurant  
- For luxury preferences: High-end hotels, Michelin restaurants, exclusive experiences
- For budget preferences: Free attractions, local markets, affordable eateries
- For family: Kid-friendly activities, parks, interactive museums
- For couples: Romantic viewpoints, intimate restaurants, scenic walks
- Always match the locations to their stated preferences and travel style
- For Lord of the Rings + New Zealand: Hobbiton, Mount Doom (Tongariro), Rivendell (Kaitoke Regional Park)  
- For Game of Thrones + Ireland: Dark Hedges, Ballintoy Harbour, Cushendun Caves

Set ready_for_preview to true when you have destination AND story AND generated 3 locations.

RESPOND ONLY WITH VALID JSON.`;

export async function getChatResponse(messages: Array<{role: string, content: string}>, currentParams: TravelParameters = {}): Promise<{
  message: string;
  parameters: TravelParameters;
  locations?: StoryLocation[];
  readyForPreview: boolean;
}> {
  try {
    const conversationHistory = messages.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    }));

    const contextMessage = `Current extracted parameters: ${JSON.stringify(currentParams)}`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "system", content: contextMessage },
        ...conversationHistory,
        { role: "system", content: "Remember: Respond ONLY with valid JSON in the exact format specified. No additional text." }
      ],
      temperature: 0.3,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('No response from OpenAI');

    // Parse JSON response
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (parseError) {
      console.error('JSON Parse Error. Raw content:', content);
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
    console.error('OpenAI API Error:', error);
    
    // Fallback response
    return {
      message: "I'm having some trouble understanding. Let me help you plan your trip! What destination interests you, and is there a story (book, movie, or TV show) that inspires your travel?",
      parameters: currentParams,
      readyForPreview: false
    };
  }
}
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
  coordinates: [number, number];
  description: string;
  type: 'activity' | 'accommodation' | 'restaurant' | 'transport' | 'landmark';
}

export async function getChatResponse(
  messages: Array<{role: string, content: string}>, 
  currentParams: TravelParameters = {}
): Promise<{
  message: string;
  parameters: TravelParameters;
  locations?: StoryLocation[];
  readyForPreview: boolean;
}> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    message: "I'm KultripGPT! I can help you plan story-inspired travels. Tell me about your dream destination or favorite story!",
    parameters: currentParams,
    locations: [],
    readyForPreview: false
  };
}

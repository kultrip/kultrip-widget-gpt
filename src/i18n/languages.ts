// Language detection and translation system for Kultrip Widget// Language detection and translation system for Kultrip Widget

export type SupportedLanguage = 'en' | 'es';export type SupportedLanguage = 'en' | 'es';



// Language mapping from browser locales to supported languages// Language mapping from browser locales to supported languages

const LANGUAGE_MAP: Record<string, SupportedLanguage> = {const LANGUAGE_MAP: Record<string, SupportedLanguage> = {

  // English variants  // English variants

  'en': 'en', 'en-US': 'en', 'en-GB': 'en', 'en-CA': 'en', 'en-AU': 'en',  'en': 'en', 'en-US': 'en', 'en-GB': 'en', 'en-CA': 'en', 'en-AU': 'en',

    

  // Spanish variants  // Spanish variants

  'es': 'es', 'es-ES': 'es', 'es-MX': 'es', 'es-AR': 'es', 'es-CO': 'es',  'es': 'es', 'es-ES': 'es', 'es-MX': 'es', 'es-AR': 'es', 'es-CO': 'es',

  'es-CL': 'es', 'es-PE': 'es', 'es-VE': 'es', 'es-EC': 'es', 'es-GT': 'es',  'es-CL': 'es', 'es-PE': 'es', 'es-VE': 'es', 'es-EC': 'es', 'es-GT': 'es',

  'es-CR': 'es', 'es-PA': 'es', 'es-DO': 'es', 'es-HN': 'es', 'es-PY': 'es',  'es-CR': 'es', 'es-PA': 'es', 'es-DO': 'es', 'es-HN': 'es', 'es-PY': 'es',

  'es-SV': 'es', 'es-NI': 'es', 'es-BO': 'es', 'es-UY': 'es'  'es-SV': 'es', 'es-NI': 'es', 'es-BO': 'es', 'es-UY': 'es'

};};



// Detect user's preferred language from browser// Detect user's preferred language from browser

export function detectUserLanguage(): SupportedLanguage {export function detectUserLanguage(): SupportedLanguage {

  try {  try {

    // Check navigator.language first (most specific)    // Check navigator.language first (most specific)

    const primaryLang = navigator.language;    const primaryLang = navigator.language;

    if (LANGUAGE_MAP[primaryLang]) {    if (LANGUAGE_MAP[primaryLang]) {

      return LANGUAGE_MAP[primaryLang];      return LANGUAGE_MAP[primaryLang];

    }    }

        

    // Check just the language code (e.g., 'es' from 'es-MX')    // Check just the language code (e.g., 'es' from 'es-MX')

    const langCode = primaryLang.split('-')[0];    const langCode = primaryLang.split('-')[0];

    if (LANGUAGE_MAP[langCode]) {    if (LANGUAGE_MAP[langCode]) {

      return LANGUAGE_MAP[langCode];      return LANGUAGE_MAP[langCode];

    }    }

        

    // Check navigator.languages array for fallbacks    // Check navigator.languages array for fallbacks

    for (const lang of navigator.languages) {    for (const lang of navigator.languages) {

      if (LANGUAGE_MAP[lang]) {      if (LANGUAGE_MAP[lang]) {

        return LANGUAGE_MAP[lang];        return LANGUAGE_MAP[lang];

      }      }

            

      const code = lang.split('-')[0];      const code = lang.split('-')[0];

      if (LANGUAGE_MAP[code]) {      if (LANGUAGE_MAP[code]) {

        return LANGUAGE_MAP[code];        return LANGUAGE_MAP[code];

      }      }

    }    }

        

    // Default to English if no supported language found    // Default to English if no supported language found

    return 'en';    return 'en';

  } catch (error) {  } catch (error) {

    console.log('Language detection failed, defaulting to English:', error);    console.log('Language detection failed, defaulting to English:', error);

    return 'en';    return 'en';

  }  }

}}



// Translation strings for the widget interface// Translation strings for the widget interface

export const translations: Record<SupportedLanguage, Record<string, string>> = {export const translations: Record<SupportedLanguage, Record<string, string>> = {

  en: {  en: {

    // Landing screen    // Landing screen

    landingTitle: "Travel like in your favorite story",    landingTitle: "Travel like in your favorite story",

    landingSubtitle: "Design your perfect journey inspired by your favorite books, movies, and TV shows",    landingSubtitle: "Design your perfect journey inspired by your favorite books, movies, and TV shows",

    landingPlaceholder: "Ask KultripGPT to create your story-inspired journey...",    landingPlaceholder: "Ask KultripGPT to create your story-inspired journey...",

    landingButton: "Start Planning",    landingButton: "Start Planning",

        

    // Chat interface    // Chat interface

    resetButton: "Reset",    resetButton: "Reset",

    messagePlaceholder: "Continue your conversation...",    messagePlaceholder: "Continue your conversation...",

    sendButton: "Send",    sendButton: "Send",

        

    // Preferences    // Preferences

    preferencesTitle: "What interests you most?",    preferencesTitle: "What interests you most?",

    museumsHistory: "Museums and History",    museumsHistory: "Museums and History",

    foodRestaurants: "Food and Restaurants",     foodRestaurants: "Food and Restaurants", 

    artsCulture: "Arts and Culture",    artsCulture: "Arts and Culture",

    natureOutdoors: "Nature and Outdoors",    natureOutdoors: "Nature and Outdoors",

    photographySpots: "Photography Spots",    photographySpots: "Photography Spots",

    nightlife: "Nightlife",    nightlife: "Nightlife",

    shopping: "Shopping",    shopping: "Shopping",

    wineTastings: "Wine Tastings",    wineTastings: "Wine Tastings",

    budgetFriendly: "Budget-friendly",    budgetFriendly: "Budget-friendly",

    luxuryExperiences: "Luxury Experiences",    luxuryExperiences: "Luxury Experiences",

    familyFriendly: "Family-friendly",    familyFriendly: "Family-friendly",

    romanticExperiences: "Romantic Experiences",    romanticExperiences: "Romantic Experiences",

        

    // Email form    // Email form

    emailTitle: "Get your personalized travel guide",    emailTitle: "Get your personalized travel guide",

    emailSubtitle: "We'll send your custom itinerary to your email",    emailSubtitle: "We'll send your custom itinerary to your email",

    namePlaceholder: "Your name",    namePlaceholder: "Your name",

    emailPlaceholder: "Your email",    emailPlaceholder: "Your email",

    submitButton: "Get My Travel Guide",    submitButton: "Get My Travel Guide",

    submitting: "Creating your guide...",    submitting: "Creating your guide...",

        

    // Success messages    // Success messages

    successModalTitle: "Great! Your personalized guide will arrive within a couple of minutes",    successModalTitle: "Great! Your personalized guide will arrive within a couple of minutes",

    emailSent: "Perfect! I've created your personalized travel guide and sent it to {email}. Check your inbox for your adventure!",    emailSent: "Perfect! I've created your personalized travel guide and sent it to {email}. Check your inbox for your adventure!",

        

    // Chat responses    // Chat responses

    durationQuestion: "How many days do you plan to spend on this adventure?",    durationQuestion: "How many days do you plan to spend on this adventure?",

    preferencesQuestion: "Perfect! Now, what kind of experiences interest you most? This will help me personalize your journey!",    preferencesQuestion: "Perfect! Now, what kind of experiences interest you most? This will help me personalize your journey!",

    readyMessage: "Your magical journey is ready! 🎉",    readyMessage: "Your magical journey is ready! 🎉",

        

    // Buttons    // Buttons

    continueButton: "Continue",    continueButton: "Continue",

    skipButton: "Skip",    skipButton: "Skip",

        

    // Errors    // Errors

    errorGeneral: "Something went wrong. Please try again.",    errorGeneral: "Something went wrong. Please try again.",

    errorEmail: "Please enter a valid email address.",    errorEmail: "Please enter a valid email address.",

    errorName: "Please enter your name.",    errorName: "Please enter your name.",

    errorMissingData: "Sorry, it seems we're missing some travel information. Please restart the conversation.",    errorMissingData: "Sorry, it seems we're missing some travel information. Please restart the conversation.",

    errorItinerary: "I apologize, but I'm having trouble sending your travel guide right now. Please try again in a moment.",    errorItinerary: "I apologize, but I'm having trouble sending your travel guide right now. Please try again in a moment.",

    errorDeclineMessage: "No problem! Feel free to continue planning your journey or start a new conversation anytime. Safe travels! ✈️"    errorDeclineMessage: "No problem! Feel free to continue planning your journey or start a new conversation anytime. Safe travels! ✈️"

  },  },

    

  es: {  es: {

    // Landing screen    // Landing screen

    landingTitle: "Viaja como en tu historia favorita",    landingTitle: "Viaja como en tu historia favorita",

    landingSubtitle: "Diseña tu viaje perfecto inspirado en tus libros, películas y series favoritas",    landingSubtitle: "Diseña tu viaje perfecto inspirado en tus libros, películas y series favoritas",

    landingPlaceholder: "Pide a KultripGPT que cree tu viaje inspirado en historias...",    landingPlaceholder: "Pide a KultripGPT que cree tu viaje inspirado en historias...",

    landingButton: "Comenzar a Planificar",    landingButton: "Comenzar a Planificar",

        

    // Chat interface    // Chat interface

    resetButton: "Reiniciar",    resetButton: "Reiniciar",

    messagePlaceholder: "Continúa tu conversación...",    messagePlaceholder: "Continúa tu conversación...",

    sendButton: "Enviar",    sendButton: "Enviar",

        

    // Preferences    // Preferences

    preferencesTitle: "¿Qué te interesa más?",    preferencesTitle: "¿Qué te interesa más?",

    museumsHistory: "Museos e Historia",    museumsHistory: "Museos e Historia",

    foodRestaurants: "Comida y Restaurantes",    foodRestaurants: "Comida y Restaurantes",

    artsCulture: "Arte y Cultura",     artsCulture: "Arte y Cultura", 

    natureOutdoors: "Naturaleza y Aire Libre",    natureOutdoors: "Naturaleza y Aire Libre",

    photographySpots: "Lugares Fotogénicos",    photographySpots: "Lugares Fotogénicos",

    nightlife: "Vida Nocturna",    nightlife: "Vida Nocturna",

    shopping: "Compras",    shopping: "Compras",

    wineTastings: "Catas de Vino",    wineTastings: "Catas de Vino",

    budgetFriendly: "Económico",    budgetFriendly: "Económico",

    luxuryExperiences: "Experiencias de Lujo",    luxuryExperiences: "Experiencias de Lujo",

    familyFriendly: "Para Familias",    familyFriendly: "Para Familias",

    romanticExperiences: "Experiencias Románticas",    romanticExperiences: "Experiencias Románticas",

        

    // Email form    // Email form

    emailTitle: "Obtén tu guía de viaje personalizada",    emailTitle: "Obtén tu guía de viaje personalizada",

    emailSubtitle: "Te enviaremos tu itinerario personalizado por email",    emailSubtitle: "Te enviaremos tu itinerario personalizado por email",

    namePlaceholder: "Tu nombre",    namePlaceholder: "Tu nombre",

    emailPlaceholder: "Tu email",    emailPlaceholder: "Tu email",

    submitButton: "Obtener Mi Guía de Viaje",    submitButton: "Obtener Mi Guía de Viaje",

    submitting: "Creando tu guía...",    submitting: "Creando tu guía...",

        

    // Success messages    // Success messages

    successModalTitle: "¡Genial! Tu guía personalizada llegará en un par de minutos",    successModalTitle: "¡Genial! Tu guía personalizada llegará en un par de minutos",

    emailSent: "¡Perfecto! He creado tu guía de viaje personalizada y la he enviado a {email}. ¡Revisa tu bandeja de entrada para tu aventura!",    emailSent: "¡Perfecto! He creado tu guía de viaje personalizada y la he enviado a {email}. ¡Revisa tu bandeja de entrada para tu aventura!",

        

    // Chat responses      // Chat responses  

    durationQuestion: "¿Cuántos días planeas pasar en esta aventura?",    durationQuestion: "¿Cuántos días planeas pasar en esta aventura?",

    preferencesQuestion: "¡Perfecto! Ahora, ¿qué tipo de experiencias te interesan más? ¡Esto me ayudará a personalizar tu viaje!",    preferencesQuestion: "¡Perfecto! Ahora, ¿qué tipo de experiencias te interesan más? ¡Esto me ayudará a personalizar tu viaje!",

    readyMessage: "¡Tu viaje mágico está listo! 🎉",    readyMessage: "¡Tu viaje mágico está listo! 🎉",

        

    // Buttons    // Buttons

    continueButton: "Continuar",    continueButton: "Continuar",

    skipButton: "Saltar",    skipButton: "Saltar",

        

    // Errors    // Errors

    errorGeneral: "Algo salió mal. Por favor intenta de nuevo.",    errorGeneral: "Algo salió mal. Por favor intenta de nuevo.",

    errorEmail: "Por favor ingresa un email válido.",    errorEmail: "Por favor ingresa un email válido.",

    errorName: "Por favor ingresa tu nombre.",    errorName: "Por favor ingresa tu nombre.",

    errorMissingData: "Lo siento, parece que falta información del viaje. Por favor reinicia la conversación.",    errorMissingData: "Lo siento, parece que falta información del viaje. Por favor reinicia la conversación.",

    errorItinerary: "Disculpa, tengo problemas enviando tu guía de viaje ahora. Por favor intenta de nuevo en un momento.",    errorItinerary: "Disculpa, tengo problemas enviando tu guía de viaje ahora. Por favor intenta de nuevo en un momento.",

    errorDeclineMessage: "¡No hay problema! Siéntete libre de continuar planeando tu viaje o iniciar una nueva conversación cuando quieras. ¡Buen viaje! ✈️"    errorDeclineMessage: "¡No hay problema! Siéntete libre de continuar planeando tu viaje o iniciar una nueva conversación cuando quieras. ¡Buen viaje! ✈️"

  }  }

};    // Landing screen

    landingTitle: "Planeje sua viagem dos sonhos com IA",

// Get translation for current language    landingSubtitle: "Obtenha recomendações de viagem personalizadas inspiradas nas suas histórias, filmes e livros favoritos",

export function getTranslation(key: string, language: SupportedLanguage, replacements: Record<string, string> = {}): string {    landingPlaceholder: "Para onde você gostaria de ir? (ex: 'Paris como Emily em Paris')",

  let text = translations[language]?.[key] || translations['en'][key] || key;    landingButton: "Começar a Planejar",

      

  // Replace placeholders like {email} with actual values    // Chat interface

  Object.keys(replacements).forEach(placeholder => {    resetButton: "Reiniciar",

    text = text.replace(`{${placeholder}}`, replacements[placeholder]);    messagePlaceholder: "Continue sua conversa...",

  });    sendButton: "Enviar",

      

  return text;    // Preferences

}    preferencesTitle: "O que mais te interessa?",

    museums: "Museus",

// Get language code for API calls (spanish or english)    gastronomy: "Gastronomia",

export function getLanguageForAPI(language: SupportedLanguage): string {    walkingTours: "Tours a Pé",

  const apiLanguageMap: Record<SupportedLanguage, string> = {    arts: "Arte",

    'en': 'english',    nature: "Natureza", 

    'es': 'spanish'    nightlife: "Vida Noturna",

  };    shopping: "Compras",

      culture: "Cultura",

  return apiLanguageMap[language] || 'english';    adventure: "Aventura",

}    relaxation: "Relaxamento",
    
    // Email form
    emailTitle: "Receba seu guia de viagem personalizado",
    emailSubtitle: "Enviaremos seu roteiro personalizado por email",
    namePlaceholder: "Seu nome",
    emailPlaceholder: "Seu email", 
    submitButton: "Receber Meu Guia de Viagem",
    submitting: "Criando seu guia...",
    
    // Success messages
    emailSent: "Perfeito! Criei seu guia de viagem personalizado e enviei para {email}. Verifique sua caixa de entrada para sua aventura!",
    
    // Chat responses
    durationQuestion: "Quantos dias você planeja passar nesta aventura?",
    preferencesQuestion: "Perfeito! Agora, que tipo de experiências mais te interessam? Isso me ajudará a personalizar sua jornada!",
    readyMessage: "Sua jornada mágica está pronta! 🎉",
    
    // Errors
    errorGeneral: "Algo deu errado. Por favor tente novamente.",
    errorEmail: "Por favor insira um email válido.",
    errorName: "Por favor insira seu nome.",
  }
};

// Get translation for current language
export function getTranslation(key: string, language: SupportedLanguage, replacements: Record<string, string> = {}): string {
  let text = translations[language]?.[key] || translations['en'][key] || key;
  
  // Replace placeholders like {email} with actual values
  Object.keys(replacements).forEach(placeholder => {
    text = text.replace(`{${placeholder}}`, replacements[placeholder]);
  });
  
  return text;
}

// Get language code for API calls (maps pt to portuguese, es to spanish, en to english)
export function getLanguageForAPI(language: SupportedLanguage): string {
  const apiLanguageMap: Record<SupportedLanguage, string> = {
    'en': 'en',
    'es': 'es', 
    'pt': 'pt'
  };
  
  return apiLanguageMap[language] || 'en';
}
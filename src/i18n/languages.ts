// Language detection and translation system for Kultrip Widget
export type SupportedLanguage = 'en' | 'es' | 'pt';

// Language mapping from browser locales to supported languages
const LANGUAGE_MAP: Record<string, SupportedLanguage> = {
  // English variants
  'en': 'en', 'en-US': 'en', 'en-GB': 'en', 'en-CA': 'en', 'en-AU': 'en',
  
  // Spanish variants
  'es': 'es', 'es-ES': 'es', 'es-MX': 'es', 'es-AR': 'es', 'es-CO': 'es',
  'es-CL': 'es', 'es-PE': 'es', 'es-VE': 'es', 'es-EC': 'es', 'es-GT': 'es',
  'es-CR': 'es', 'es-PA': 'es', 'es-DO': 'es', 'es-HN': 'es', 'es-PY': 'es',
  'es-SV': 'es', 'es-NI': 'es', 'es-BO': 'es', 'es-UY': 'es',
  
  // Portuguese variants
  'pt': 'pt', 'pt-BR': 'pt', 'pt-PT': 'pt'
};

// Detect user's preferred language from browser
export function detectUserLanguage(): SupportedLanguage {
  try {
    // Check navigator.language first (most specific)
    const primaryLang = navigator.language;
    if (LANGUAGE_MAP[primaryLang]) {
      return LANGUAGE_MAP[primaryLang];
    }
    
    // Check just the language code (e.g., 'es' from 'es-MX')
    const langCode = primaryLang.split('-')[0];
    if (LANGUAGE_MAP[langCode]) {
      return LANGUAGE_MAP[langCode];
    }
    
    // Check navigator.languages array for fallbacks
    for (const lang of navigator.languages) {
      if (LANGUAGE_MAP[lang]) {
        return LANGUAGE_MAP[lang];
      }
      
      const code = lang.split('-')[0];
      if (LANGUAGE_MAP[code]) {
        return LANGUAGE_MAP[code];
      }
    }
    
    // Default to English if no supported language found
    return 'en';
  } catch (error) {
    console.log('Language detection failed, defaulting to English:', error);
    return 'en';
  }
}

// Translation strings for the widget interface
export const translations: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Landing screen
    landingTitle: "Plan your dream trip with AI",
    landingSubtitle: "Get personalized travel recommendations inspired by your favorite stories, movies, and books",
    landingPlaceholder: "Where would you like to go? (e.g., 'Paris like Emily in Paris')",
    landingButton: "Start Planning",
    
    // Chat interface
    resetButton: "Reset",
    messagePlaceholder: "Continue your conversation...",
    sendButton: "Send",
    
    // Preferences
    preferencesTitle: "What interests you most?",
    museums: "Museums",
    gastronomy: "Gastronomy", 
    walkingTours: "Walking Tours",
    arts: "Arts",
    nature: "Nature",
    nightlife: "Nightlife",
    shopping: "Shopping",
    culture: "Culture",
    adventure: "Adventure",
    relaxation: "Relaxation",
    
    // Email form
    emailTitle: "Get your personalized travel guide",
    emailSubtitle: "We'll send your custom itinerary to your email",
    namePlaceholder: "Your name",
    emailPlaceholder: "Your email",
    submitButton: "Get My Travel Guide",
    submitting: "Creating your guide...",
    
    // Success messages
    emailSent: "Perfect! I've created your personalized travel guide and sent it to {email}. Check your inbox for your adventure!",
    
    // Chat responses
    durationQuestion: "How many days do you plan to spend on this adventure?",
    preferencesQuestion: "Perfect! Now, what kind of experiences interest you most? This will help me personalize your journey!",
    readyMessage: "Your magical journey is ready! 🎉",
    
    // Errors
    errorGeneral: "Something went wrong. Please try again.",
    errorEmail: "Please enter a valid email address.",
    errorName: "Please enter your name.",
  },
  
  es: {
    // Landing screen
    landingTitle: "Planifica tu viaje soñado con IA",
    landingSubtitle: "Obtén recomendaciones de viaje personalizadas inspiradas en tus historias, películas y libros favoritos",
    landingPlaceholder: "¿A dónde te gustaría ir? (ej: 'París como Emily en París')",
    landingButton: "Comenzar a Planificar",
    
    // Chat interface
    resetButton: "Reiniciar",
    messagePlaceholder: "Continúa tu conversación...",
    sendButton: "Enviar",
    
    // Preferences
    preferencesTitle: "¿Qué te interesa más?",
    museums: "Museos",
    gastronomy: "Gastronomía",
    walkingTours: "Tours a Pie", 
    arts: "Arte",
    nature: "Naturaleza",
    nightlife: "Vida Nocturna",
    shopping: "Compras",
    culture: "Cultura",
    adventure: "Aventura",
    relaxation: "Relajación",
    
    // Email form
    emailTitle: "Obtén tu guía de viaje personalizada",
    emailSubtitle: "Te enviaremos tu itinerario personalizado por email",
    namePlaceholder: "Tu nombre",
    emailPlaceholder: "Tu email",
    submitButton: "Obtener Mi Guía de Viaje",
    submitting: "Creando tu guía...",
    
    // Success messages
    emailSent: "¡Perfecto! He creado tu guía de viaje personalizada y la he enviado a {email}. ¡Revisa tu bandeja de entrada para tu aventura!",
    
    // Chat responses  
    durationQuestion: "¿Cuántos días planeas pasar en esta aventura?",
    preferencesQuestion: "¡Perfecto! Ahora, ¿qué tipo de experiencias te interesan más? ¡Esto me ayudará a personalizar tu viaje!",
    readyMessage: "¡Tu viaje mágico está listo! 🎉",
    
    // Errors
    errorGeneral: "Algo salió mal. Por favor intenta de nuevo.",
    errorEmail: "Por favor ingresa un email válido.",
    errorName: "Por favor ingresa tu nombre.",
  },
  
  pt: {
    // Landing screen
    landingTitle: "Planeje sua viagem dos sonhos com IA",
    landingSubtitle: "Obtenha recomendações de viagem personalizadas inspiradas nas suas histórias, filmes e livros favoritos",
    landingPlaceholder: "Para onde você gostaria de ir? (ex: 'Paris como Emily em Paris')",
    landingButton: "Começar a Planejar",
    
    // Chat interface
    resetButton: "Reiniciar",
    messagePlaceholder: "Continue sua conversa...",
    sendButton: "Enviar",
    
    // Preferences
    preferencesTitle: "O que mais te interessa?",
    museums: "Museus",
    gastronomy: "Gastronomia",
    walkingTours: "Tours a Pé",
    arts: "Arte",
    nature: "Natureza", 
    nightlife: "Vida Noturna",
    shopping: "Compras",
    culture: "Cultura",
    adventure: "Aventura",
    relaxation: "Relaxamento",
    
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
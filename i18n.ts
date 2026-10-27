import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Comprehensive translations for the SEMEX AI Agricultural Platform
const resources = {
  en: {
    translation: {
      "welcome": "Welcome to SEMEX AI",
      "farmer_login": "Farmer Login",
      "customer_login": "Customer Login",
      "expert_login": "Expert Login",
      "volunteer_login": "Volunteer Login",
      "admin_login": "Admin Login",
      "onboarding_title": "Build Your Smart Farm Profile",
      "onboarding_sub": "Let our AI analyze your land to maximize your harvest profitability.",
      // Voice & Form Prompts
      "tap_to_speak": "Tap to Speak",
      "listening": "Listening...",
      "save_next": "Save & Next",
      "submit_profile": "Complete Smart Profile",
      // Dashboard Strings
      "market_demand": "Live Market Demand",
      "crop_recommendation": "AI Crop Recommendations",
      "my_land": "My Land Analysis",
      "sos_expert": "Ask Expert",
      "sos_volunteer": "Request NGO Visit"
    }
  },
  ta: {
    translation: {
      "welcome": "SEMEX AI க்கு வரவேற்கிறோம்",
      "farmer_login": "விவசாயி உள்நுழைவு",
      "customer_login": "வாடிக்கையாளர் உள்நுழைவு",
      "expert_login": "நிபுணர் உள்நுழைவு",
      "volunteer_login": "தன்னார்வலர் உள்நுழைவு",
      "admin_login": "நிர்வாகி உள்நுழைவு",
      "onboarding_title": "உங்கள் ஸ்மார்ட் பண்ணை விவரத்தை உருவாக்கவும்",
      "onboarding_sub": "உங்கள் அறுவடை லாபத்தை அதிகரிக்க எங்கள் AI உங்கள் நிலத்தை பகுப்பாய்வு செய்ய அனுமதிக்கவும்.",
      "tap_to_speak": "பேச தட்டவும்",
      "listening": "கேட்கிறது...",
      "save_next": "சேமித்து அடுத்து",
      "submit_profile": "ஸ்மார்ட் சுயவிவரத்தை முடிக்கவும்",
      "market_demand": "நேரடி சந்தை தேவை",
      "crop_recommendation": "AI பயிர் பரிந்துரைகள்",
      "my_land": "என் நிலப்பகுதி பகுப்பாய்வு",
      "sos_expert": "நிபுணரை கேளுங்கள்",
      "sos_volunteer": "NGO வருகையை கோரவும்"
    }
  },
  hi: {
    translation: {
      "welcome": "SEMEX AI में आपका स्वागत है",
      "farmer_login": "किसान लॉगिन",
      "customer_login": "ग्राहक लॉगिन",
      "expert_login": "विशेषज्ञ लॉगिन",
      "volunteer_login": "स्वयंसेवक लॉगिन",
      "admin_login": "व्यवस्थापक लॉगिन",
      "onboarding_title": "अपना स्मार्ट कृषि प्रोफ़ाइल बनाएं",
      "onboarding_sub": "अपनी फसल लाभप्रदता को अधिकतम करने के लिए हमारे AI को अपनी भूमि का विश्लेषण करने दें।",
      "tap_to_speak": "बोलने के लिए टैप करें",
      "listening": "सुन रहा है...",
      "save_next": "सेव करें और अगला",
      "submit_profile": "स्मार्ट प्रोफाइल पूरा करें",
      "market_demand": "लाइव बाजार की मांग",
      "crop_recommendation": "एआई फसल सिफारिशें",
      "my_land": "मेरी भूमि का विश्लेषण",
      "sos_expert": "विशेषज्ञ से पूछें",
      "sos_volunteer": "एनजीओ विजिट का अनुरोध करें"
    }
  },
  te: { translation: { "welcome": "SEMEX AI కి స్వాగతం", "farmer_login": "రైతు లాగిన్", "onboarding_title": "మీ స్మార్ట్ ఫార్మ్ ప్రొఫైల్‌ను సృష్టించండి", "save_next": "సేవ్ చేసి తదుపరిది" } },
  kn: { translation: { "welcome": "SEMEX AI ಗೆ ಸ್ವಾಗತ", "farmer_login": "ರೈತ ಲಾಗಿನ್", "onboarding_title": "ನಿಮ್ಮ ಸ್ಮಾರ್ಟ್ ಫಾರ್ಮ್ ಪ್ರೊಫೈಲ್ ಅನ್ನು ರಚಿಸಿ", "save_next": "ಉಳಿಸಿ ಮತ್ತು ಮುಂದಿನದು" } }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;

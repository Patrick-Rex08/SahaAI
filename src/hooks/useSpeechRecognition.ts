import { useState, useEffect, useRef, useCallback } from 'react';

export interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
}

interface SpeechRecognitionHook {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  isSupported: boolean;
  isPermissionDenied: boolean;
  errorMessage: string | null;
  startListening: () => Promise<void>;
  stopListening: () => void;
  resetTranscript: () => void;
  clearError: () => void;
  setLanguage: (lang: string) => void;
  currentLanguage: string;
}

interface IWindow extends Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
}

export const detectLanguageCodeFromText = (text: string): string => {
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta-IN'; // Tamil
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te-IN'; // Telugu
  if (/[\u0C80-\u0CFF]/.test(text)) return 'kn-IN'; // Kannada
  if (/[\u0D00-\u0D7F]/.test(text)) return 'ml-IN'; // Malayalam
  if (/[\u0980-\u09FF]/.test(text)) return 'bn-IN'; // Bengali / Assamese
  if (/[\u0A80-\u0AFF]/.test(text)) return 'gu-IN'; // Gujarati
  if (/[\u0A00-\u0A7F]/.test(text)) return 'pa-IN'; // Punjabi
  if (/[\u0B00-\u0B7F]/.test(text)) return 'or-IN'; // Odia
  if (/[\u0600-\u06FF]/.test(text)) return 'ur-IN'; // Urdu / Sindhi
  if (/[\u0900-\u097F]/.test(text)) {
    if (/\b(आहे|नाही|करा|झाले|पाहिजे|मिळेल)\b/.test(text)) return 'mr-IN'; // Marathi
    return 'hi-IN'; // Hindi
  }
  return 'en-IN';
};

const getInitialLanguage = (): string => {
  if (typeof navigator !== 'undefined' && navigator.language) {
    const nav = navigator.language.toLowerCase();
    if (nav.startsWith('hi')) return 'hi-IN';
    if (nav.startsWith('ta')) return 'ta-IN';
    if (nav.startsWith('te')) return 'te-IN';
    if (nav.startsWith('bn')) return 'bn-IN';
    if (nav.startsWith('mr')) return 'mr-IN';
    if (nav.startsWith('gu')) return 'gu-IN';
    if (nav.startsWith('kn')) return 'kn-IN';
    if (nav.startsWith('ml')) return 'ml-IN';
    if (nav.startsWith('pa')) return 'pa-IN';
    if (nav.startsWith('ur')) return 'ur-IN';
    if (nav.startsWith('or')) return 'or-IN';
    return navigator.language;
  }
  return 'en-IN';
};

export interface SpeechLanguageOption {
  code: string;
  label: string;
  name: string;
}

export const SUPPORTED_SPEECH_LANGUAGES: SpeechLanguageOption[] = [
  { code: 'en-IN', label: 'English', name: 'Indian English' },
  { code: 'hi-IN', label: 'हिन्दी', name: 'Hindi' },
  { code: 'ta-IN', label: 'தமிழ்', name: 'Tamil' },
  { code: 'te-IN', label: 'తెలుగు', name: 'Telugu' },
  { code: 'bn-IN', label: 'বাংলা', name: 'Bengali' },
  { code: 'mr-IN', label: 'मराठी', name: 'Marathi' },
  { code: 'gu-IN', label: 'ગુજરાતી', name: 'Gujarati' },
  { code: 'kn-IN', label: 'ಕನ್ನಡ', name: 'Kannada' },
  { code: 'ml-IN', label: 'മലയാളം', name: 'Malayalam' },
  { code: 'pa-IN', label: 'ਪੰਜਾਬੀ', name: 'Punjabi' },
  { code: 'or-IN', label: 'ଓଡ଼ିଆ', name: 'Odia' },
  { code: 'ur-IN', label: 'اردو', name: 'Urdu' },
];

export const useSpeechRecognition = (initialLang?: string): SpeechRecognitionHook => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(initialLang || getInitialLanguage());

  const recognitionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isStartingRef = useRef(false);
  const silenceTimerRef = useRef<any>(null);
  const maxSilenceTimerRef = useRef<any>(null);

  // 1. Inspect browser compatibility & secure context on mount
  useEffect(() => {
    const win = typeof window !== 'undefined' ? (window as unknown as IWindow) : null;
    if (!win) {
      setIsSupported(false);
      return;
    }

    const hasSpeechClass = !!(win.SpeechRecognition || win.webkitSpeechRecognition);
    const isSecure = typeof window !== 'undefined' ? window.isSecureContext : true;

    if (!hasSpeechClass || !isSecure) {
      setIsSupported(false);
      if (!isSecure) {
        setErrorMessage('Voice recognition requires a secure connection (HTTPS or localhost). Text input is available below.');
      }
    } else {
      setIsSupported(true);
    }

    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (maxSilenceTimerRef.current) clearTimeout(maxSilenceTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore cleanup abort
        }
      }
    };
  }, []);

  // 2. Factory to instantiate fresh SpeechRecognition instance with event handlers
  const buildRecognitionInstance = useCallback(() => {
    const win = window as unknown as IWindow;
    const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) return null;

    const recognition = new SpeechRecognitionClass();

    // Keep active continuously until speech ends
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.lang = currentLanguage;

    recognition.onstart = () => {
      setIsListening(true);
      isStartingRef.current = false;
      setErrorMessage(null);

      // Max safety timeout: if 12s pass with no speech at all, stop cleanly
      if (maxSilenceTimerRef.current) clearTimeout(maxSilenceTimerRef.current);
      maxSilenceTimerRef.current = setTimeout(() => {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch {
            // ignore
          }
        }
      }, 12000);
    };

    recognition.onresult = (event: any) => {
      // Clear safety timeout once sound is captured
      if (maxSilenceTimerRef.current) {
        clearTimeout(maxSilenceTimerRef.current);
        maxSilenceTimerRef.current = null;
      }

      let fullFinal = '';
      let fullInterim = '';

      for (let i = 0; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          fullFinal += item[0].transcript + ' ';
        } else {
          fullInterim += item[0].transcript;
        }
      }

      const cleanFinal = fullFinal.trim();
      const cleanInterim = fullInterim.trim();

      if (cleanFinal) {
        setTranscript(cleanFinal);
      }
      setInterimTranscript(cleanInterim);

      // Auto-stop when user finishes speaking (1.8s of silence after speech)
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch {
            // ignore
          }
        }
      }, 1800);
    };

    recognition.onerror = (event: any) => {
      const errorCode = event.error;

      // Handle benign silence without alarming the user
      if (errorCode === 'no-speech') {
        return;
      }

      isStartingRef.current = false;
      setIsListening(false);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (maxSilenceTimerRef.current) clearTimeout(maxSilenceTimerRef.current);

      if (errorCode === 'aborted') {
        return;
      }

      // User-friendly, non-technical explanations (per UX guidelines)
      if (errorCode === 'not-allowed') {
        setIsPermissionDenied(true);
        setErrorMessage('Microphone access was denied. Please allow microphone permission in your browser address bar, or use the text box below.');
      } else if (errorCode === 'network') {
        setErrorMessage('Voice service connection issue. This can happen with strict ad-blockers or privacy browsers. You can type your question directly below.');
      } else if (errorCode === 'language-not-supported') {
        try {
          recognition.lang = 'en-IN';
        } catch {
          // ignore
        }
      } else {
        setErrorMessage('Could not recognize voice. Please try speaking again or type in the box below.');
      }
    };

    recognition.onend = () => {
      isStartingRef.current = false;
      setIsListening(false);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (maxSilenceTimerRef.current) clearTimeout(maxSilenceTimerRef.current);
    };

    return recognition;
  }, [currentLanguage]);

  // 3. User taps microphone to start listening
  const startListening = useCallback(async () => {
    if (isListening) return;
    isStartingRef.current = true;

    setErrorMessage(null);
    setTranscript('');
    setInterimTranscript('');

    const win = window as unknown as IWindow;
    const SpeechRecognitionClass = win?.SpeechRecognition || win?.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      isStartingRef.current = false;
      setIsSupported(false);
      setErrorMessage('Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari, or type in the box below.');
      return;
    }

    // Step A: Request microphone hardware access and immediately release it so hardware is not locked
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
        setIsPermissionDenied(false);
      } catch (err: any) {
        isStartingRef.current = false;
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setIsPermissionDenied(true);
          setErrorMessage('Microphone access was denied. Please allow microphone permission in your browser address bar.');
          return;
        }
      }
    }

    // Step B: Abort any leftover instance cleanly
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }

    // Step C: Build fresh recognition instance and start listening
    const recognition = buildRecognitionInstance();
    if (!recognition) {
      isStartingRef.current = false;
      return;
    }

    recognitionRef.current = recognition;

    try {
      recognition.start();
      isStartingRef.current = false;
    } catch (e: any) {
      isStartingRef.current = false;
      console.warn('SpeechRecognition start error:', e);
      setErrorMessage('Could not start microphone. Please try speaking again or type below.');
    }
  }, [buildRecognitionInstance, isListening]);

  // 4. Stop listening manually if user taps stop
  const stopListening = useCallback(() => {
    isStartingRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach((track) => track.stop());
      } catch {
        // ignore
      }
      streamRef.current = null;
    }
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  const clearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const setLanguage = useCallback((lang: string) => {
    setCurrentLanguage(lang);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = lang;
      } catch {
        // ignore
      }
    }
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    isPermissionDenied,
    errorMessage,
    startListening,
    stopListening,
    resetTranscript,
    clearError,
    setLanguage,
    currentLanguage,
  };
};

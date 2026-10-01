import React, { useState, FormEvent, KeyboardEvent, useEffect } from 'react';
import { Mic, MicOff, Send, MessageSquare, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SahaLogo } from './SahaLogo';
import { SUPPORTED_SPEECH_LANGUAGES } from '../hooks/useSpeechRecognition';

interface InitialScreenProps {
  onSendMessage: (text: string) => void;
  isListening: boolean;
  isSpeechSupported: boolean;
  onToggleVoice: () => void;
  interimTranscript: string;
  finalTranscript?: string;
  errorMessage: string | null;
  currentLanguage?: string;
  onSelectLanguage?: (langCode: string) => void;
}

export const InitialScreen: React.FC<InitialScreenProps> = ({
  onSendMessage,
  isListening,
  isSpeechSupported,
  onToggleVoice,
  interimTranscript,
  finalTranscript = '',
  errorMessage,
  currentLanguage = 'en-IN',
  onSelectLanguage,
}) => {
  const [inputText, setInputText] = useState('');

  // When speech is recognized, sync it into the input area
  useEffect(() => {
    if (finalTranscript) {
      setInputText(finalTranscript);
    }
  }, [finalTranscript]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const textToSend = (inputText || interimTranscript || finalTranscript).trim();
    if (!textToSend) return;
    onSendMessage(textToSend);
    setInputText('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Live text display while listening or typing
  const liveDisplayValue = isListening
    ? (interimTranscript ? `${finalTranscript ? finalTranscript + ' ' : ''}${interimTranscript}` : (inputText || ''))
    : inputText;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-md mx-auto w-full text-center relative select-none">
      {/* Background Soft Organic Lavender Glows */}
      <div className="absolute top-10 -left-16 w-64 h-64 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 -right-16 w-64 h-64 bg-purple-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Stylized Saha Logo */}
      <div className="mb-3 transform hover:scale-105 transition-transform duration-300">
        <SahaLogo className="w-20 h-20 sm:w-22 sm:h-22 mx-auto drop-shadow-sm" />
      </div>

      {/* Brand Name & Tagline */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1E1B4B] tracking-tight">
        Saha
      </h1>
      <p className="text-sm font-medium text-slate-500 mt-2 leading-relaxed">
        Your guide to government support.
        <br />
        In your language.
      </p>

      {/* Speech Bubble Greeting */}
      <div className="mt-8 relative inline-block">
        <div className="bg-[#EEF2FF] text-[#1E1B4B] font-bold text-base sm:text-lg px-6 py-3.5 rounded-3xl shadow-xs">
          How can I help you today?
        </div>
        <div className="w-3 h-3 bg-[#EEF2FF] transform rotate-45 absolute -bottom-1.5 left-8" />
      </div>

      {/* Quick Speech Language Bar */}
      {onSelectLanguage && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5 max-w-sm mx-auto">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
            Speak in:
          </span>
          {SUPPORTED_SPEECH_LANGUAGES.slice(0, 5).map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => onSelectLanguage(lang.code)}
              className={`text-xs font-semibold px-3 py-1 rounded-full transition-all min-h-[30px] touch-manipulation ${
                currentLanguage === lang.code
                  ? 'bg-[#5448C8] text-white shadow-xs font-bold'
                  : 'bg-white hover:bg-indigo-50 text-slate-700 border border-slate-200'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}

      {/* Active Listening Indicator with Live Voice Wave & Streamed Text */}
      {isListening && (
        <div className="w-full mt-6 p-4 bg-indigo-50 border-2 border-indigo-400 rounded-3xl animate-pulse text-indigo-950 shadow-md">
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-indigo-900">
            <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
            <span>Listening to your voice...</span>
          </div>

          {/* Voice Wave Animation */}
          <div className="mt-2.5 flex items-center justify-center gap-1.5 h-6">
            <span className="w-1.5 h-3 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-6 bg-indigo-600 rounded-full animate-bounce" />
            <span className="w-1.5 h-4 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.2s]" />
            <span className="w-1.5 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.4s]" />
          </div>

          <p className="mt-3 text-base sm:text-lg font-bold text-[#1E1B4B] min-h-[32px] bg-white/80 py-2 px-4 rounded-2xl border border-indigo-200/80 shadow-2xs">
            {interimTranscript || finalTranscript || 'Speak now... your words will appear here live'}
          </p>
        </div>
      )}

      {/* Recognized Speech Preview */}
      {!isListening && finalTranscript && (
        <div className="w-full mt-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-left flex items-start gap-2.5 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Recognized Speech:
            </p>
            <p className="text-sm font-semibold text-emerald-950 mt-0.5">
              "{finalTranscript}"
            </p>
          </div>
        </div>
      )}

      {/* Clear, Non-Technical Error / Permission Notice */}
      {errorMessage && (
        <div className="w-full mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs font-medium flex items-start gap-2.5 text-left">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Central Large Microphone Button */}
      <div className="mt-7 flex flex-col items-center">
        <div
          className={`rounded-full p-3 transition-all duration-300 ${
            isListening ? 'bg-rose-100 scale-105' : 'bg-[#EEF2FF]'
          }`}
        >
          <button
            type="button"
            onClick={onToggleVoice}
            disabled={!isSpeechSupported}
            className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-xl touch-manipulation ${
              isListening
                ? 'bg-rose-600 ring-8 ring-rose-200 animate-pulse'
                : isSpeechSupported
                ? 'bg-[#5448C8] hover:bg-[#4338CA] active:scale-95 shadow-indigo-200'
                : 'bg-slate-300 cursor-not-allowed text-slate-500'
            }`}
            aria-label={isListening ? 'Stop listening' : 'Tap to speak'}
            title={
              !isSpeechSupported
                ? 'Voice recognition not supported in this browser'
                : isListening
                ? 'Listening... tap to stop'
                : 'Tap to speak'
            }
          >
            {isListening ? (
              <MicOff className="w-10 h-10 sm:w-12 sm:h-12" />
            ) : (
              <Mic className="w-10 h-10 sm:w-12 sm:h-12" />
            )}
          </button>
        </div>

        <span className="mt-4 text-base font-bold text-[#1E1B4B]">
          {isListening ? 'Listening... Tap to stop' : 'Tap to speak'}
        </span>
        <span className="text-xs text-slate-400 font-medium mt-0.5">
          {isListening ? 'Speak naturally. Converts live on screen.' : 'Speak or type naturally. All Indian languages supported.'}
        </span>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 w-full max-w-xs my-6">
        <div className="flex-1 h-px bg-slate-200/80" />
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          OR
        </span>
        <div className="flex-1 h-px bg-slate-200/80" />
      </div>

      {/* Pill-Shaped Input Box with Live Streamed Speech */}
      <form onSubmit={handleSubmit} className="w-full">
        <div className={`flex items-center gap-2 bg-white border ${isListening ? 'border-[#5448C8] ring-2 ring-indigo-200' : 'border-[#E0E7FF]'} focus-within:border-[#5448C8] rounded-full p-2 shadow-xs transition-all`}>
          <MessageSquare className="w-5 h-5 text-slate-400 ml-3 flex-shrink-0" />
          <input
            type="text"
            value={liveDisplayValue}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? 'Converting speech live... speak now' : 'Type your question here...'}
            className="flex-1 px-2 py-2.5 text-base text-slate-900 placeholder-slate-400 bg-transparent outline-none"
            aria-label="Type your question here"
          />
          <button
            type="submit"
            disabled={!liveDisplayValue.trim()}
            className="w-11 h-11 rounded-full bg-[#7C6EE6] hover:bg-[#6857E0] disabled:bg-slate-200 text-white disabled:text-slate-400 flex items-center justify-center transition-all flex-shrink-0 shadow-xs touch-manipulation active:scale-95"
            aria-label="Send question"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </div>
      </form>

      {/* Reassurance Footer */}
      <div className="mt-8 flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
        <ShieldCheck className="w-4 h-4 text-indigo-500" />
        <span>No signup needed</span>
        <span>•</span>
        <span>No language selection</span>
      </div>
    </div>
  );
};

import React, { useState, FormEvent, KeyboardEvent, useEffect } from 'react';
import { Mic, MicOff, Send, MessageSquare, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SahaLogo } from './SahaLogo';

interface InitialScreenProps {
  onSendMessage: (text: string) => void;
  isListening: boolean;
  isSpeechSupported: boolean;
  onToggleVoice: () => void;
  interimTranscript: string;
  finalTranscript?: string;
  errorMessage: string | null;
}

export const InitialScreen: React.FC<InitialScreenProps> = ({
  onSendMessage,
  isListening,
  isSpeechSupported,
  onToggleVoice,
  interimTranscript,
  finalTranscript = '',
  errorMessage,
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
    const textToSend = inputText.trim() || interimTranscript.trim();
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

      {/* Active Listening Indicator */}
      {isListening && (
        <div className="w-full mt-6 p-4 bg-indigo-50 border-2 border-indigo-300 rounded-2xl animate-pulse text-indigo-950">
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-indigo-900">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
            <span>Listening...</span>
          </div>
          <p className="mt-2 text-base font-semibold text-slate-800 min-h-[24px]">
            {interimTranscript || 'Speak now in your language...'}
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
            aria-label={isListening ? 'Listening...' : 'Tap to speak'}
            title={
              !isSpeechSupported
                ? 'Voice recognition not supported in this browser'
                : isListening
                ? 'Listening...'
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
          {isListening ? 'Listening...' : 'Tap to speak'}
        </span>
        <span className="text-xs text-slate-400 font-medium mt-0.5">
          {isListening ? 'Speak naturally. Stops when you pause.' : 'Speak or type naturally. All Indian languages supported.'}
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

      {/* Pill-Shaped Input Box */}
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex items-center gap-2 bg-white border border-[#E0E7FF] focus-within:border-[#5448C8] rounded-full p-2 shadow-xs transition-all">
          <MessageSquare className="w-5 h-5 text-slate-400 ml-3 flex-shrink-0" />
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question here..."
            className="flex-1 px-2 py-2.5 text-base text-slate-900 placeholder-slate-400 bg-transparent outline-none"
            aria-label="Type your question here"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
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

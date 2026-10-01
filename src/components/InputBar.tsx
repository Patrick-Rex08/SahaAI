import React, { useState, FormEvent, KeyboardEvent, useEffect } from 'react';
import { Mic, MicOff, Send, MessageSquare, Loader2 } from 'lucide-react';

interface InputBarProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  isListening: boolean;
  isSpeechSupported: boolean;
  onToggleVoice: () => void;
  interimTranscript?: string;
  finalTranscript?: string;
}

export const InputBar: React.FC<InputBarProps> = ({
  onSendMessage,
  isLoading,
  isListening,
  isSpeechSupported,
  onToggleVoice,
  interimTranscript = '',
  finalTranscript = '',
}) => {
  const [inputText, setInputText] = useState('');

  // Sync recognized speech into the input field
  useEffect(() => {
    if (finalTranscript) {
      setInputText(finalTranscript);
    }
  }, [finalTranscript]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = (inputText || interimTranscript || finalTranscript).trim();
    if (!trimmed || isLoading) return;
    onSendMessage(trimmed);
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
    <footer className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-indigo-50/80 p-3 sm:p-4 shadow-lg">
      <div className="max-w-2xl mx-auto">
        {/* Real-time Listening Banner with Voice Wave */}
        {isListening && (
          <div className="mb-2 p-2.5 bg-indigo-50 border border-indigo-300 rounded-2xl flex items-center justify-between gap-2 animate-pulse text-indigo-950">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
              <span>Listening...</span>
            </div>
            <span className="text-xs font-bold text-[#1E1B4B]">
              {interimTranscript || finalTranscript || 'Speak now...'}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-center gap-2 sm:gap-3">
          {/* Microphone Button */}
          <button
            type="button"
            onClick={onToggleVoice}
            disabled={isLoading || !isSpeechSupported}
            className={`relative flex items-center justify-center rounded-full w-12 h-12 sm:w-13 sm:h-13 transition-all touch-manipulation flex-shrink-0 shadow-md ${
              isListening
                ? 'bg-rose-600 text-white ring-4 ring-rose-200 animate-pulse'
                : isSpeechSupported
                ? 'bg-[#5448C8] hover:bg-[#4338CA] active:scale-95 text-white'
                : 'bg-slate-300 cursor-not-allowed text-slate-500'
            }`}
            title={
              !isSpeechSupported
                ? 'Voice recognition is not supported in this browser'
                : isListening
                ? 'Listening... tap to stop'
                : 'Tap to speak'
            }
            aria-label={isListening ? 'Stop listening' : 'Tap to speak'}
          >
            {isListening ? (
              <MicOff className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </button>

          {/* Pill-shaped text input with live converting speech */}
          <div className={`relative flex-1 flex items-center bg-white border ${isListening ? 'border-[#5448C8] ring-2 ring-indigo-200' : 'border-[#E0E7FF]'} focus-within:border-[#5448C8] rounded-full px-3 py-1 shadow-xs transition-all`}>
            <MessageSquare className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              value={liveDisplayValue}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder={
                isListening
                  ? 'Converting speech live... speak now'
                  : 'Type your question here...'
              }
              className="w-full py-2.5 text-sm sm:text-base text-slate-900 placeholder-slate-400 bg-transparent outline-none"
              aria-label="Type your question"
            />
          </div>

          {/* Circular Purple Send Button */}
          <button
            type="submit"
            disabled={isLoading || (!inputText.trim() && !interimTranscript.trim())}
            className="w-12 h-12 sm:w-13 sm:h-13 bg-[#7C6EE6] hover:bg-[#6857E0] disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-full flex items-center justify-center transition-all touch-manipulation flex-shrink-0 shadow-md active:scale-95"
            title="Send question"
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5 ml-0.5" />
            )}
          </button>
        </form>
      </div>
    </footer>
  );
};

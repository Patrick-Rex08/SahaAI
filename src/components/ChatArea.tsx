import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, AlertCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatAreaProps {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  speakingMessageId: string | null;
  onSpeak: (messageId: string, text: string) => void;
  renderSchemeCard?: (schemeId: string) => React.ReactNode;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isLoading,
  error,
  onRetry,
  speakingMessageId,
  onSpeak,
  renderSchemeCard,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, error]);

  const toggleCard = (messageId: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  };

  return (
    <main
      className="flex-1 overflow-y-auto px-4 py-4 max-w-2xl w-full mx-auto space-y-4"
      role="log"
      aria-live="polite"
      aria-label="Conversation messages"
    >
      {messages.map((msg) => {
        const isUser = msg.role === 'user';
        const isSpeaking = speakingMessageId === msg.id;
        const isCardOpen = !!expandedCards[msg.id];

        return (
          <div
            key={msg.id}
            className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} transition-opacity duration-200`}
          >
            <div
              className={`max-w-[92%] sm:max-w-[85%] rounded-3xl p-4 text-[15px] sm:text-base leading-relaxed shadow-xs ${
                isUser
                  ? 'bg-[#1E1B4B] text-white rounded-br-xs font-normal'
                  : 'bg-white text-slate-900 border border-indigo-100/90 rounded-bl-xs'
              }`}
            >
              {/* Header: Role & Audio Listen Button */}
              <div className="flex items-center justify-between gap-3 mb-2 pb-1.5 border-b border-black/5">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${isUser ? 'text-indigo-200' : 'text-indigo-700'}`}>
                  {isUser ? 'You' : 'Saha'}
                </span>

                {!isUser && (
                  <button
                    onClick={() => onSpeak(msg.id, msg.text)}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-xl transition-all min-h-[34px] touch-manipulation ${
                      isSpeaking
                        ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/60'
                    }`}
                    aria-label={isSpeaking ? 'Stop voice' : 'Listen to response'}
                    title={isSpeaking ? 'Stop voice' : 'Listen aloud'}
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                        <span>Stop</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Listen</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Message text */}
              <div className="whitespace-pre-wrap font-sans text-slate-900">
                <span className={isUser ? 'text-white' : 'text-slate-900'}>{msg.text}</span>
              </div>

              {/* Optional user-controlled scheme guidance toggle */}
              {msg.schemeCardId && renderSchemeCard && (
                <div className="mt-3 pt-2 border-t border-slate-100">
                  {isCardOpen ? (
                    <div>
                      <div className="flex justify-end mb-2">
                        <button
                          onClick={() => toggleCard(msg.id)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-indigo-700"
                        >
                          <span>Hide Details</span>
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {renderSchemeCard(msg.schemeCardId)}
                    </div>
                  ) : (
                    <button
                      onClick={() => toggleCard(msg.id)}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-indigo-50/80 hover:bg-indigo-100/90 border border-indigo-200 text-indigo-950 transition-all font-semibold text-xs shadow-2xs group"
                    >
                      <span className="flex items-center gap-2">
                        <span>📋</span>
                        <span className="group-hover:text-indigo-700">Open Interactive Eligibility & Checklist</span>
                      </span>
                      <ChevronDown className="w-4 h-4 text-indigo-600 group-hover:translate-y-0.5 transition-transform" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center gap-3 p-3.5 bg-white border border-indigo-100 rounded-3xl w-fit shadow-xs">
          <div className="flex gap-1.5 px-1">
            <span className="w-2.5 h-2.5 bg-[#5448C8] rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2.5 h-2.5 bg-[#5448C8] rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2.5 h-2.5 bg-[#5448C8] rounded-full animate-bounce" />
          </div>
          <span className="text-xs font-medium text-slate-600 pr-2">
            Thinking & verifying...
          </span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div
          role="alert"
          className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start justify-between gap-3 text-red-900 shadow-xs"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">{error}</p>
              <p className="text-xs text-red-700 mt-0.5">
                Tap retry to try again.
              </p>
            </div>
          </div>
          <button
            onClick={onRetry}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors min-h-[44px] touch-manipulation flex-shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      <div ref={bottomRef} aria-hidden="true" />
    </main>
  );
};

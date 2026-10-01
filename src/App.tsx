import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InitialScreen } from './components/InitialScreen';
import { ChatArea } from './components/ChatArea';
import { InputBar } from './components/InputBar';
import { AuthModal, UserProfile } from './components/AuthModal';
import { ChatMessage } from './types';
import { getSchemeById, detectSchemeFromText, PMUY_SCHEME } from './data/schemes';
import { SchemeGuidance } from './components/SchemeGuidance';
import { useSpeechRecognition, detectLanguageCodeFromText } from './hooks/useSpeechRecognition';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';

export const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUserMessage, setLastUserMessage] = useState<string | null>(null);

  // Optional user authentication state
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Voice recognition and speech synthesis
  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported: isSpeechSupported,
    errorMessage: speechError,
    startListening,
    stopListening,
    resetTranscript,
    setLanguage,
  } = useSpeechRecognition();

  const { speak, stop: stopSpeaking, speakingId } = useSpeechSynthesis();

  // If live speech recognition produces final text, send it automatically
  useEffect(() => {
    if (!isListening && transcript.trim()) {
      const text = transcript.trim();
      resetTranscript();
      handleSendMessage(text);
    }
  }, [isListening, transcript]);

  // Toggle voice recording
  const handleToggleVoice = async () => {
    if (isListening) {
      stopListening();
    } else {
      stopSpeaking();
      await startListening();
    }
  };

  // Send text message to server-side endpoint
  const handleSendMessage = async (userText: string) => {
    if (!userText.trim()) return;

    setError(null);
    setLastUserMessage(userText);

    // Auto-tune speech recognition language based on user's script
    const langCode = detectLanguageCodeFromText(userText);
    if (langCode !== 'en-IN') {
      setLanguage(langCode);
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: userText,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            text: m.text,
          })),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${res.status}`);
      }

      const data = await res.json();
      const replyText = data.text;

      // Dynamically attach scheme card if user asked about any supported scheme
      const matchedScheme = detectSchemeFromText(userText);
      const schemeCardId = matchedScheme ? matchedScheme.id : undefined;

      const botMessageId = `asst-${Date.now()}`;
      const botMessage: ChatMessage = {
        id: botMessageId,
        role: 'assistant',
        text: replyText,
        timestamp: new Date(),
        schemeCardId,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: unknown) {
      console.error('Chat error:', err);
      const errMsg = err instanceof Error ? err.message : 'An error occurred while connecting to server';
      setError(`Notice: ${errMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage);
    }
  };

  const handleReset = () => {
    stopSpeaking();
    stopListening();
    resetTranscript();
    setMessages([]);
    setError(null);
    setLastUserMessage(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 text-slate-900 font-sans">
      <Header
        onReset={handleReset}
        hasMessages={messages.length > 0}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={() => setUser(null)}
      />

      {messages.length === 0 ? (
        <InitialScreen
          onSendMessage={handleSendMessage}
          isListening={isListening}
          isSpeechSupported={isSpeechSupported}
          onToggleVoice={handleToggleVoice}
          interimTranscript={interimTranscript}
          finalTranscript={transcript}
          errorMessage={speechError}
        />
      ) : (
        <>
          <ChatArea
            messages={messages}
            isLoading={isLoading}
            error={error}
            onRetry={handleRetry}
            speakingMessageId={speakingId}
            onSpeak={speak}
            renderSchemeCard={(cardId) => {
              const scheme = getSchemeById(cardId) || PMUY_SCHEME;
              return <SchemeGuidance scheme={scheme} />;
            }}
          />

          <InputBar
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            isListening={isListening}
            isSpeechSupported={isSpeechSupported}
            onToggleVoice={handleToggleVoice}
            interimTranscript={interimTranscript}
            finalTranscript={transcript}
          />
        </>
      )}

      {/* Optional Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(profile) => setUser(profile)}
      />
    </div>
  );
};

export default App;

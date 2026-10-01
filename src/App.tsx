import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AuthModal, UserProfile } from './components/AuthModal';
import { InitialScreen } from './components/InitialScreen';
import { ChatArea } from './components/ChatArea';
import { InputBar } from './components/InputBar';
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

  // User authentication state with local persistence
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('saha_user_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLoginSuccess = (profile: UserProfile) => {
    setUser(profile);
    try {
      localStorage.setItem('saha_user_profile', JSON.stringify(profile));
    } catch {}
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem('saha_user_profile');
    } catch {}
  };

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

  // Send text message to server-side endpoint with timeout handling
  const handleSendMessage = async (userText: string) => {
    const trimmedText = userText.trim();
    if (!trimmedText) return;

    setError(null);
    setLastUserMessage(trimmedText);

    // Auto-tune speech recognition language based on user's script
    const langCode = detectLanguageCodeFromText(trimmedText);
    if (langCode !== 'en-IN') {
      setLanguage(langCode);
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmedText,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    // Abort controller for network timeout (60-second timeout for detailed AI answers)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            text: m.text,
          })),
        }),
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${res.status}`);
      }

      const data = await res.json();
      const replyText = data.text;

      // Dynamically attach scheme card if a specific verified scheme has been identified
      // Avoid attaching during open-ended discovery or clarifying questions
      const lowerQuery = trimmedText.toLowerCase();
      const isDiscoveryQuery =
        lowerQuery.includes("don't know") ||
        lowerQuery.includes('dont know') ||
        lowerQuery.includes('not sure') ||
        lowerQuery.includes('which scheme');

      let matchedScheme = undefined;
      if (!isDiscoveryQuery) {
        matchedScheme = detectSchemeFromText(trimmedText);
        if (!matchedScheme && !replyText.endsWith('?')) {
          matchedScheme = detectSchemeFromText(replyText);
        }
      }
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
      clearTimeout(timeoutId);
      console.error('Chat error:', err);
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Notice: The request took longer than expected due to a slow network. Please tap Retry.');
      } else {
        setError('Notice: Unable to connect to server. Please check your connection and tap Retry.');
      }
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
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
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

      {/* Login & Sign-Up Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default App;

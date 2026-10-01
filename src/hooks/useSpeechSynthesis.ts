import { useState, useCallback, useRef } from 'react';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setSpeakingId(null);
  }, []);

  const speak = useCallback(
    (id: string, text: string) => {
      // If already speaking this message, toggle stop
      if (speakingId === id && isSpeaking) {
        stop();
        return;
      }

      // Stop any ongoing audio
      stop();

      if (!text || !text.trim()) return;

      const isTamil = /[\u0B80-\u0BFF]/.test(text);
      const isHindi = /[\u0900-\u097F]/.test(text);
      const langParam = isTamil ? 'ta' : isHindi ? 'hi' : 'en';

      const audioUrl = `/api/tts?text=${encodeURIComponent(text.slice(0, 200))}&lang=${langParam}`;
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      setIsSpeaking(true);
      setSpeakingId(id);

      audio.onended = () => {
        setIsSpeaking(false);
        setSpeakingId(null);
        audioRef.current = null;
      };

      audio.onerror = () => {
        // Fallback to native browser speechSynthesis if network audio fails
        try {
          if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text.slice(0, 200));
            utterance.onend = () => {
              setIsSpeaking(false);
              setSpeakingId(null);
            };
            utterance.onerror = () => {
              setIsSpeaking(false);
              setSpeakingId(null);
            };
            window.speechSynthesis.speak(utterance);
            return;
          }
        } catch {
          // ignore
        }
        setIsSpeaking(false);
        setSpeakingId(null);
        audioRef.current = null;
      };

      // Play HTML5 audio
      audio.play().catch((err) => {
        console.warn('HTML5 Audio playback caught error:', err);
        // Fallback to native synthesis
        try {
          if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text.slice(0, 150));
            utterance.onend = () => {
              setIsSpeaking(false);
              setSpeakingId(null);
            };
            window.speechSynthesis.speak(utterance);
          }
        } catch {
          setIsSpeaking(false);
          setSpeakingId(null);
        }
      });
    },
    [speakingId, isSpeaking, stop]
  );

  return {
    isSpeaking,
    speakingId,
    isSupported: true, // Always supported via HTML5 Audio
    speak,
    stop,
  };
};

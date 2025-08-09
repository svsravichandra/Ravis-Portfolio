import { useState, useEffect, useRef, useCallback } from "react";

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

export function useVoiceAgent() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isProcessingRef = useRef(false);

  // Check browser support
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const speechSynthesis = window.speechSynthesis;
    
    if (!SpeechRecognition || !speechSynthesis) {
      setIsSupported(false);
      setError("Your browser doesn't support voice features. Please use Chrome, Edge, or Safari.");
      return;
    }

    // Initialize speech recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      setTranscript("");
    };
    
    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      setTranscript(transcript);
      
      // If final result, process it
      if (event.results[current].isFinal) {
        processUserInput(transcript);
      }
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      if (event.error === 'no-speech') {
        setError("No speech detected. Please try again.");
      } else if (event.error === 'audio-capture') {
        setError("Microphone not found. Please check your microphone.");
      } else if (event.error === 'not-allowed') {
        setError("Microphone access denied. Please allow microphone access.");
      } else {
        setError(`Speech recognition error: ${event.error}`);
      }
    };
    
    recognition.onend = () => {
      setIsListening(false);
      if (!isProcessingRef.current) {
        setTranscript("");
      }
    };
    
    recognitionRef.current = recognition;
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Process user input and get AI response
  const processUserInput = async (userMessage: string) => {
    if (!userMessage.trim() || isProcessingRef.current) return;
    
    isProcessingRef.current = true;
    setError(null);
    
    try {
      // Add user message to history
      const newHistory = [...conversationHistory, { role: "user" as const, content: userMessage }];
      setConversationHistory(newHistory);
      
      // Call API for AI response
      const response = await fetch('/api/voice-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: newHistory
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }
      
      const data = await response.json();
      const aiResponse = data.response;
      
      // Add AI response to history
      setConversationHistory(prev => [...prev, { role: "assistant" as const, content: aiResponse }]);
      
      // Speak the response
      await speakText(aiResponse);
      
    } catch (error) {
      console.error('Error processing voice input:', error);
      setError('Failed to process your message. Please try again.');
    } finally {
      isProcessingRef.current = false;
      setTranscript("");
    }
  };

  // Text-to-speech function
  const speakText = (text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!window.speechSynthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }
      
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Try to use a natural-sounding voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Microsoft') ||
        voice.name.includes('Natural')
      ) || voices[0];
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.onstart = () => {
        setIsSpeaking(true);
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
      };
      
      utterance.onerror = (event) => {
        setIsSpeaking(false);
        console.error('Speech synthesis error:', event);
        reject(event);
      };
      
      synthRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    });
  };

  // Start listening
  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current || isListening || isSpeaking) return;
    
    try {
      // Stop any ongoing speech
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setError('Failed to start listening. Please try again.');
    }
  }, [isSupported, isListening, isSpeaking]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return;
    
    try {
      recognitionRef.current.stop();
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  }, [isListening]);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (!window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  // Toggle listening
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Reset conversation
  const resetConversation = useCallback(() => {
    setConversationHistory([]);
    setTranscript("");
    setError(null);
    stopListening();
    stopSpeaking();
  }, [stopListening, stopSpeaking]);

  return {
    // State
    isListening,
    isSpeaking,
    transcript,
    conversationHistory,
    error,
    isSupported,
    
    // Actions
    startListening,
    stopListening,
    stopSpeaking,
    toggleListening,
    resetConversation,
  };
}
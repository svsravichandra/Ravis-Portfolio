import { motion, AnimatePresence } from "framer-motion";
import { X, Mic, MicOff } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface VoiceAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
        confidence: number;
      };
      isFinal: boolean;
    };
  };
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export default function VoiceAgentModal({ isOpen, onClose }: VoiceAgentModalProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [lastAiResponse, setLastAiResponse] = useState("");
  const [speechError, setSpeechError] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Chat mutation for getting AI responses
  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }
      
      const data = await response.json();
      return data.response;
    },
    onSuccess: async (aiResponse: string) => {
      setLastAiResponse(aiResponse);
      // Try to play audio, but don't fail if it doesn't work
      try {
        await playAiResponse(aiResponse);
      } catch (error) {
        console.warn("Audio playback failed, showing text response only:", error);
      }
    },
    onError: (error) => {
      console.error("Chat error:", error);
      setLastAiResponse("Sorry, I'm having trouble responding right now.");
    },
  });

  // Speech synthesis mutation
  const speechMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await fetch("/api/speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate speech");
      }
      
      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
    },
  });

  // Initialize speech recognition
  useEffect(() => {
    if (!isOpen) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < Object.keys(event.results).length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);

      if (finalTranscript) {
        setIsListening(false);
        chatMutation.mutate(finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [isOpen]);

  // Play AI response using ElevenLabs
  const playAiResponse = async (text: string) => {
    try {
      setSpeechError(""); // Clear any previous errors
      setIsSpeaking(true);
      const audioUrl = await speechMutation.mutateAsync(text);
      
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
    } catch (error: any) {
      console.error("Error playing AI response:", error);
      setIsSpeaking(false);
      
      // Check if it's a quota exceeded error
      if (error?.message?.includes("quota") || error?.message?.includes("401")) {
        setSpeechError("Voice synthesis quota exceeded. Showing text response only.");
      } else {
        setSpeechError("Voice synthesis temporarily unavailable. Showing text response only.");
      }
    }
  };

  // Toggle listening
  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Stop current speech
  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsSpeaking(false);
  };

  // Cleanup when modal closes
  useEffect(() => {
    if (!isOpen) {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsListening(false);
      setIsSpeaking(false);
      setTranscript("");
      setLastAiResponse("");
      setSpeechError("");
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-gray-900 rounded-3xl p-12 max-w-2xl w-full mx-4 pointer-events-auto relative">
              {/* Orb Container */}
              <div className="flex flex-col items-center space-y-8">
                {/* Animated Orb */}
                <div className="relative w-64 h-64">
                  {/* Outer glow ring */}
                  <div className={`absolute inset-0 rounded-full ${isSpeaking ? 'animate-pulse' : ''}`}>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blur-3xl" />
                  </div>
                  
                  {/* Main orb */}
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    {/* Gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-cyan-300 to-white" />
                    
                    {/* Animated clouds/waves effect */}
                    <div className={`absolute inset-0 ${isSpeaking ? 'voice-wave-active' : 'voice-wave'}`}>
                      <svg className="w-full h-full" viewBox="0 0 200 200">
                        <defs>
                          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
                            <stop offset="100%" stopColor="rgba(59,130,246,0.4)" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M 0,100 Q 50,60 100,100 T 200,100 L 200,200 L 0,200 Z"
                          fill="url(#waveGradient)"
                          className="wave-path"
                        />
                        <path
                          d="M 0,120 Q 50,80 100,120 T 200,120 L 200,200 L 0,200 Z"
                          fill="url(#waveGradient)"
                          opacity="0.5"
                          className="wave-path-2"
                        />
                      </svg>
                    </div>
                    
                    {/* Inner highlight */}
                    <div className="absolute top-8 left-8 w-20 h-20 bg-white/40 rounded-full blur-2xl" />
                    
                    {/* Speaking indicator rings */}
                    {isSpeaking && (
                      <>
                        <div className="absolute inset-4 rounded-full border-2 border-white/20 animate-ping" />
                        <div className="absolute inset-8 rounded-full border-2 border-white/10 animate-ping animation-delay-200" />
                      </>
                    )}
                  </div>
                </div>

                {/* Status Text */}
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-semibold text-gray-100">
                    {isSpeaking ? "Satya is speaking..." : 
                     isListening ? "Listening..." : 
                     chatMutation.isPending ? "Processing..." :
                     "Ask Satya anything"}
                  </h3>
                  <p className="text-gray-400">
                    {chatMutation.isPending || speechMutation.isPending ? 
                      "AI Voice Agent • Processing..." : 
                      speechError ? 
                        "AI Voice Agent • Text-only mode" :
                        "AI Voice Agent • Ready to connect"}
                  </p>
                </div>

                {/* Transcript Display */}
                {transcript && (
                  <div className="text-center p-4 bg-gray-800/50 rounded-xl max-w-md">
                    <p className="text-gray-300 text-sm">{transcript}</p>
                  </div>
                )}

                {/* AI Response Display */}
                {lastAiResponse && (
                  <div className="text-center p-4 bg-primary/10 rounded-xl max-w-md">
                    <p className="text-gray-200 text-sm">{lastAiResponse}</p>
                  </div>
                )}

                {/* Speech Error Display */}
                {speechError && (
                  <div className="text-center p-3 bg-yellow-600/20 border border-yellow-500/30 rounded-xl max-w-md">
                    <p className="text-yellow-200 text-xs">{speechError}</p>
                  </div>
                )}

                {/* Controls */}
                <div className="flex items-center gap-8">
                  {/* Microphone Button */}
                  <button
                    onClick={toggleListening}
                    className={`p-4 rounded-full transition-colors ${
                      isListening 
                        ? "bg-red-600 hover:bg-red-700 animate-pulse" 
                        : "bg-gray-800 hover:bg-gray-700"
                    }`}
                    aria-label={isListening ? "Stop Listening" : "Start Listening"}
                    disabled={chatMutation.isPending || speechMutation.isPending}
                  >
                    <Mic className={`w-6 h-6 ${isListening ? "text-white" : "text-gray-300"}`} />
                  </button>

                  {/* Stop Speaking Button */}
                  {isSpeaking && (
                    <button
                      onClick={stopSpeaking}
                      className="px-6 py-3 rounded-full bg-red-600/20 hover:bg-red-600/30 text-red-400 font-medium transition-colors"
                    >
                      Stop Speaking
                    </button>
                  )}

                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className="p-4 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
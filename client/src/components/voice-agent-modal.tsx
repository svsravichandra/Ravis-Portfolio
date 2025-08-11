import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

// Import ElevenLabs Conversation API
import { Conversation } from "@elevenlabs/client";

interface VoiceAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VoiceAgentModal({ isOpen, onClose }: VoiceAgentModalProps) {
  const [conversationStatus, setConversationStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [agentMode, setAgentMode] = useState<'listening' | 'speaking' | 'idle'>('idle');
  const [error, setError] = useState("");
  const [conversation, setConversation] = useState<any>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [shouldReconnect, setShouldReconnect] = useState(true);
  const isOpenRef = useRef(isOpen);
  const conversationRef = useRef<any>(null);
  const maxReconnectAttempts = 3;
  const reconnectDelayMs = 2000;

  // Keep refs in sync
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    conversationRef.current = conversation;
  }, [conversation]);

  // Your personalized agent ID
  const AGENT_ID = "agent_7301k2756861f0zs3jmmf1c6t96s";

  // Start conversation when modal opens, cleanup when it closes
  useEffect(() => {
    if (isOpen && !conversation) {
      (window as any).voiceModalOpen = true;
      setShouldReconnect(true);
      startConversation();
    } else if (!isOpen && conversation) {
      (window as any).voiceModalOpen = false;
      setShouldReconnect(false);
      endConversation();
    }
    
    return () => {
      (window as any).voiceModalOpen = false;
      setShouldReconnect(false);
      if (conversationRef.current) {
        endConversation();
      }
    };
  }, [isOpen]);

  const startConversation = async (isReconnect = false) => {
    try {
      if (isReconnect) {
        setIsReconnecting(true);
        await new Promise(resolve => setTimeout(resolve, reconnectDelayMs));
      }
      
      setConversationStatus('connecting');
      setError("");

      // Request microphone permission first (only if not reconnecting)
      if (!isReconnect) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setMediaStream(stream);
      }

      const conv = await Conversation.startSession({
        agentId: AGENT_ID,
        connectionType: 'websocket',
        onConnect: () => {
          console.log('Connected to Satya\'s AI agent');
          setConversationStatus('connected');
          setAgentMode('listening');
          setReconnectAttempts(0);
          setIsReconnecting(false);
          setError("");
        },
        onDisconnect: () => {
          console.log('Disconnected from agent');
          setConversationStatus('disconnected');
          setAgentMode('idle');
          
          // Use setTimeout to avoid closure issues
          setTimeout(() => {
            // Check if modal is still open using global window state
            if (!(window as any).voiceModalOpen) {
              console.log('Modal closed - not reconnecting');
              return;
            }
            
            // Only attempt reconnection if modal is still open and we haven't exceeded max attempts
            setReconnectAttempts(prev => {
              const newAttempts = prev + 1;
              if (newAttempts <= maxReconnectAttempts && (window as any).voiceModalOpen) {
                console.log(`Attempting reconnection ${newAttempts}/${maxReconnectAttempts}`);
                setError(`Connection lost. Reconnecting... (${newAttempts}/${maxReconnectAttempts})`);
                startConversation(true);
                return newAttempts;
              } else if (newAttempts > maxReconnectAttempts) {
                setError("Connection failed after multiple attempts. Please try restarting the voice agent.");
                setIsReconnecting(false);
                return newAttempts;
              }
              return prev;
            });
          }, 100);
        },
        onModeChange: ({ mode }: { mode: string }) => {
          console.log('Agent mode changed to:', mode);
          setAgentMode(mode as 'listening' | 'speaking' | 'idle');
        },
        onError: (error: any) => {
          console.error('Conversation error:', error);
          
          // Handle different types of errors
          if (error.message?.includes('WebSocket')) {
            setError("Connection interrupted. Reconnecting...");
            // Don't immediately reconnect on WebSocket errors, let onDisconnect handle it
          } else if (error.message?.includes('quota') || error.message?.includes('limit')) {
            setError("Voice service temporarily unavailable. Please try again later.");
            setConversationStatus('disconnected');
          } else {
            setError("Connection error. Please try again.");
            setConversationStatus('disconnected');
          }
        }
      });

      setConversation(conv);
    } catch (error: any) {
      console.error('Failed to start conversation:', error);
      setIsReconnecting(false);
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setError("Microphone access required. Please allow microphone permission and try again.");
      } else if (error.message?.includes('quota') || error.message?.includes('limit')) {
        setError("Voice service quota exceeded. Please try again later.");
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        setError("Network connection error. Please check your internet and try again.");
      } else {
        setError("Failed to connect to voice agent. Please try again.");
      }
      setConversationStatus('disconnected');
    }
  };

  const endConversation = async () => {
    console.log('Ending conversation session...');
    
    // Disable reconnection first
    setShouldReconnect(false);
    
    if (conversation) {
      try {
        await conversation.endSession();
      } catch (error) {
        console.error('Error ending conversation:', error);
      }
    }
    
    // Stop microphone tracks
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => {
        track.stop();
        console.log('Stopped microphone track:', track.label);
      });
      setMediaStream(null);
    }
    
    // Reset all states
    setConversation(null);
    setConversationStatus('disconnected');
    setAgentMode('idle');
    setReconnectAttempts(0);
    setIsReconnecting(false);
    setError("");
  };

  const handleClose = () => {
    endConversation();
    onClose();
  };

  const isSpeaking = agentMode === 'speaking';
  const isListening = agentMode === 'listening';
  const isConnected = conversationStatus === 'connected';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
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
            <div className="bg-gray-900 rounded-3xl p-12 max-w-2xl w-full mx-4 pointer-events-auto relative" data-voice-modal="true">
              {/* Orb Container */}
              <div className="flex flex-col items-center space-y-8">
                {/* Animated Orb */}
                <div className="relative w-64 h-64">
                  {/* Outer glow ring */}
                  <div className={`absolute inset-0 rounded-full ${isSpeaking ? 'animate-pulse' : isListening ? 'animate-ping' : ''}`}>
                    <div className={`absolute inset-0 rounded-full blur-3xl ${
                      isSpeaking ? 'bg-gradient-to-br from-blue-400/30 to-cyan-400/30' :
                      isListening ? 'bg-gradient-to-br from-green-400/20 to-emerald-400/20' :
                      isConnected ? 'bg-gradient-to-br from-blue-400/10 to-cyan-400/10' :
                      'bg-gradient-to-br from-gray-400/10 to-gray-500/10'
                    }`} />
                  </div>
                  
                  {/* Main orb */}
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    {/* Gradient background */}
                    <div className={`absolute inset-0 transition-all duration-500 ${
                      isSpeaking ? 'bg-gradient-to-br from-blue-400 via-cyan-300 to-white' :
                      isListening ? 'bg-gradient-to-br from-green-400 via-emerald-300 to-white' :
                      isConnected ? 'bg-gradient-to-br from-blue-400/80 via-cyan-300/80 to-white/80' :
                      'bg-gradient-to-br from-gray-400 via-gray-300 to-gray-100'
                    }`} />
                    
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
                    
                    {/* Speaking/Listening indicator rings */}
                    {(isSpeaking || isListening) && (
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
                    {isReconnecting ? `Reconnecting... (${reconnectAttempts}/${maxReconnectAttempts})` :
                     conversationStatus === 'connecting' ? "Connecting..." : 
                     conversationStatus === 'connected' && isSpeaking ? "Satya is speaking..." : 
                     conversationStatus === 'connected' && isListening ? "Listening..." :
                     conversationStatus === 'connected' ? "Connected - Ready to talk" :
                     "Voice Agent"}
                  </h3>
                  <p className="text-gray-400">
                    {isReconnecting ? "Attempting to restore voice connection..." :
                     conversationStatus === 'connecting' ? "Initializing voice connection..." :
                     conversationStatus === 'connected' ? `AI Voice Agent • ${isSpeaking ? 'Speaking' : isListening ? 'Listening' : 'Ready'}` :
                     "AI Voice Agent • Disconnected"}
                  </p>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="text-center p-4 bg-red-600/20 border border-red-500/30 rounded-xl max-w-md">
                    <p className="text-red-200 text-sm">{error}</p>
                    {error.includes("Microphone") && (
                      <button 
                        onClick={() => startConversation(false)}
                        className="mt-3 px-4 py-2 bg-red-600/30 hover:bg-red-600/40 rounded-lg text-red-200 text-xs transition-colors"
                      >
                        Try Again
                      </button>
                    )}
                    {error.includes("multiple attempts") && (
                      <button 
                        onClick={() => {
                          setReconnectAttempts(0);
                          setError("");
                          startConversation(false);
                        }}
                        className="mt-3 px-4 py-2 bg-red-600/30 hover:bg-red-600/40 rounded-lg text-red-200 text-xs transition-colors"
                      >
                        Restart Connection
                      </button>
                    )}
                  </div>
                )}

                {/* Instructions */}
                {conversationStatus === 'connected' && !error && (
                  <div className="text-center p-4 bg-blue-600/20 border border-blue-500/30 rounded-xl max-w-md">
                    <p className="text-blue-200 text-sm">
                      🎙️ Speak naturally - I'm Satya's personalized AI assistant and I'll respond with voice
                    </p>
                  </div>
                )}

                {/* Controls */}
                <div className="flex items-center gap-4">
                  {/* Connection Status Indicator */}
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      conversationStatus === 'connected' ? 'bg-green-400' : 
                      conversationStatus === 'connecting' ? 'bg-yellow-400' : 
                      'bg-red-400'
                    }`} />
                    <span className="text-xs text-gray-400">
                      {conversationStatus === 'connected' ? 'Connected' : 
                       conversationStatus === 'connecting' ? 'Connecting' : 
                       'Disconnected'}
                    </span>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={handleClose}
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
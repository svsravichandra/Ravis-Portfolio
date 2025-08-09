import { motion, AnimatePresence } from "framer-motion";
import { X, Mic, MicOff, Volume2, VolumeX, RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { useVoiceAgent } from "@/hooks/use-voice-agent";

interface VoiceAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VoiceAgentModal({ isOpen, onClose }: VoiceAgentModalProps) {
  const {
    isListening,
    isSpeaking,
    transcript,
    conversationHistory,
    error,
    isSupported,
    startListening,
    stopListening,
    stopSpeaking,
    toggleListening,
    resetConversation,
  } = useVoiceAgent();

  // Auto-start listening when modal opens
  useEffect(() => {
    if (isOpen && isSupported) {
      // Give a small delay for modal animation
      const timer = setTimeout(() => {
        startListening();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isSupported, startListening]);

  // Stop everything when modal closes
  useEffect(() => {
    if (!isOpen) {
      stopListening();
      stopSpeaking();
    }
  }, [isOpen, stopListening, stopSpeaking]);

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
                  <div className={`absolute inset-0 rounded-full ${(isSpeaking || isListening) ? 'animate-pulse' : ''}`}>
                    <div className={`absolute inset-0 rounded-full blur-3xl transition-all duration-500 ${
                      isListening ? 'bg-gradient-to-br from-red-400/30 to-orange-400/30' :
                      isSpeaking ? 'bg-gradient-to-br from-blue-400/30 to-cyan-400/30' :
                      'bg-gradient-to-br from-blue-400/10 to-cyan-400/10'
                    }`} />
                  </div>
                  
                  {/* Main orb */}
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    {/* Gradient background - changes color based on state */}
                    <div className={`absolute inset-0 transition-all duration-500 ${
                      isListening ? 'bg-gradient-to-br from-red-400 via-orange-300 to-yellow-200' :
                      isSpeaking ? 'bg-gradient-to-br from-blue-400 via-cyan-300 to-white' :
                      'bg-gradient-to-br from-gray-400 via-gray-300 to-white'
                    }`} />
                    
                    {/* Animated clouds/waves effect */}
                    <div className={`absolute inset-0 ${
                      isSpeaking ? 'voice-wave-active' :
                      isListening ? 'voice-wave-active' :
                      'voice-wave'
                    }`}>
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
                    
                    {/* Activity indicator rings */}
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
                    {!isSupported ? "Voice Not Supported" :
                     error ? "Error Occurred" :
                     isSpeaking ? "Satya is speaking..." :
                     isListening ? "Listening..." :
                     "Ask Satya anything"}
                  </h3>
                  
                  {/* Show transcript or error */}
                  {transcript && (
                    <p className="text-gray-300 italic">"{transcript}"</p>
                  )}
                  
                  {error && (
                    <p className="text-red-400 text-sm">{error}</p>
                  )}
                  
                  {!error && !transcript && (
                    <p className="text-gray-400">
                      {isListening ? "Speak now..." : "AI Voice Agent • Ready to connect"}
                    </p>
                  )}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">
                  {/* Microphone Button */}
                  <button
                    onClick={toggleListening}
                    disabled={!isSupported || isSpeaking}
                    className={`p-4 rounded-full transition-all ${
                      isListening 
                        ? "bg-primary animate-pulse" 
                        : "bg-gray-800 hover:bg-gray-700"
                    } ${(!isSupported || isSpeaking) ? "opacity-50 cursor-not-allowed" : ""}`}
                    aria-label={isListening ? "Stop Listening" : "Start Listening"}
                  >
                    {isListening ? (
                      <Mic className="w-6 h-6 text-white" />
                    ) : (
                      <MicOff className="w-6 h-6 text-gray-400" />
                    )}
                  </button>

                  {/* Stop Speaking Button (when AI is speaking) */}
                  {isSpeaking && (
                    <button
                      onClick={stopSpeaking}
                      className="p-4 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                      aria-label="Stop Speaking"
                    >
                      <VolumeX className="w-6 h-6 text-gray-400" />
                    </button>
                  )}

                  {/* Reset Conversation */}
                  {conversationHistory.length > 0 && (
                    <button
                      onClick={resetConversation}
                      className="p-4 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                      aria-label="Reset Conversation"
                    >
                      <RefreshCw className="w-6 h-6 text-gray-400" />
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

                {/* Conversation History (optional - shows last few messages) */}
                {conversationHistory.length > 0 && (
                  <div className="mt-4 max-h-32 overflow-y-auto text-sm text-gray-400 space-y-1">
                    {conversationHistory.slice(-2).map((msg, idx) => (
                      <div key={idx} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
                        <span className={msg.role === 'user' ? 'text-blue-400' : 'text-green-400'}>
                          {msg.role === 'user' ? 'You: ' : 'Satya: '}
                        </span>
                        {msg.content}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
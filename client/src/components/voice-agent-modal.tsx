import { motion, AnimatePresence } from "framer-motion";
import { X, Mic, MicOff } from "lucide-react";
import { useState } from "react";

interface VoiceAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VoiceAgentModal({ isOpen, onClose }: VoiceAgentModalProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

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
                    {isSpeaking ? "Satya is speaking..." : "Ask Satya anything"}
                  </h3>
                  <p className="text-gray-400">
                    AI Voice Agent • Ready to connect
                  </p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-8">
                  {/* Microphone Button */}
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-4 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? (
                      <MicOff className="w-6 h-6 text-gray-400" />
                    ) : (
                      <Mic className="w-6 h-6 text-white" />
                    )}
                  </button>

                  {/* Demo Speaking Toggle (for testing animation) */}
                  <button
                    onClick={() => setIsSpeaking(!isSpeaking)}
                    className="px-6 py-3 rounded-full bg-primary/20 hover:bg-primary/30 text-primary font-medium transition-colors"
                  >
                    {isSpeaking ? "Stop Demo" : "Start Demo"}
                  </button>

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
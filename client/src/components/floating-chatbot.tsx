import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import portraitImage from "@assets/ChatGPT Image Aug 8, 2025, 04_52_14 AM_1754660498096.png";
import VoiceAgentModal from "./voice-agent-modal";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hey, I'm Ravi – your AI guide. Curious about my projects or philosophy? Ask me anything about my work, mindset, or ideas!",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chat", { message });
      return response.json();
    },
    onSuccess: (data) => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: data.response,
        isBot: true,
        timestamp: new Date()
      }]);
    },
    onError: () => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: "Sorry, I couldn't process that. Please try again.",
        isBot: true,
        timestamp: new Date()
      }]);
    }
  });

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    sendMessageMutation.mutate(inputValue);
    setInputValue("");
  };

  return (
    <>
      {/* Floating Avatar Button */}
      <motion.div
        className="fixed bottom-8 right-4 sm:right-8 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-16 h-16 rounded-full overflow-hidden glass-strong shadow-2xl"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            boxShadow: [
              "0 0 20px rgba(0, 212, 255, 0.3)",
              "0 0 40px rgba(0, 212, 255, 0.5)",
              "0 0 20px rgba(0, 212, 255, 0.3)"
            ]
          }}
          transition={{
            boxShadow: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <img 
            src={portraitImage} 
            alt="Chat with Ravi" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-dark animate-pulse" />
        </motion.button>
      </motion.div>
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-28 right-2 sm:right-8 w-[calc(100vw-16px)] sm:w-96 max-w-96 h-[500px] max-h-[calc(100vh-140px)] glass-terminal rounded-2xl shadow-2xl z-50 overflow-hidden"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 20 }}
          >
            {/* Terminal Header */}
            <div className="glass-strong p-4 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-primary font-mono text-sm">ravi@portfolio:~$</span>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setIsVoiceModalOpen(true)}
                  className="text-gray-400 hover:text-primary transition-colors"
                  title="Start voice conversation"
                >
                  <i className="fas fa-phone mt-[1px] mb-[1px] ml-[19px] mr-[19px]"></i>
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="h-[calc(100%-120px)] sm:h-[350px] overflow-y-auto p-3 sm:p-4 space-y-3 font-mono text-xs sm:text-sm">
              {messages.map((message) => (
                <motion.div 
                  key={message.id}
                  className="chat-message"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {message.isBot ? (
                    <div className="flex items-start space-x-2">
                      <span className="text-green-400">ravi$</span>
                      <p className="text-gray-300 flex-1">{message.content}</p>
                    </div>
                  ) : (
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-400">user$</span>
                      <p className="text-white flex-1">{message.content}</p>
                    </div>
                  )}
                </motion.div>
              ))}
              {isTyping && (
                <motion.div 
                  className="flex items-start space-x-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span className="text-green-400">ravi$</span>
                  <div className="flex space-x-1">
                    <motion.span 
                      className="text-green-400"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.4, repeat: Infinity, delay: 0 }}
                    >.</motion.span>
                    <motion.span 
                      className="text-green-400"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.4, repeat: Infinity, delay: 0.2 }}
                    >.</motion.span>
                    <motion.span 
                      className="text-green-400"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.4, repeat: Infinity, delay: 0.4 }}
                    >.</motion.span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 glass-strong border-t border-gray-700">
              <div className="flex items-center space-x-2">
                <span className="text-blue-400 font-mono text-xs sm:text-sm">user$</span>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="_"
                  className="flex-1 bg-transparent text-white font-mono text-xs sm:text-sm focus:outline-none placeholder-gray-600"
                  disabled={sendMessageMutation.isPending}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={sendMessageMutation.isPending || !inputValue.trim()}
                  className="text-primary hover:text-white transition-colors"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Voice Agent Modal */}
      <VoiceAgentModal 
        isOpen={isVoiceModalOpen} 
        onClose={() => setIsVoiceModalOpen(false)} 
      />
    </>
  );
}
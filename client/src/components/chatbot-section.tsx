import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

export default function ChatbotSection() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm Ravi- Virtual Me. Ask me anything about Satya's experience, skills, or projects. I'm here to help! 🚀",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const { toast } = useToast();

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chat", { message });
      return response.json();
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: data.response,
        isBot: true,
        timestamp: new Date()
      }]);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
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
    sendMessageMutation.mutate(inputValue);
    setInputValue("");
  };

  const quickQuestions = [
    "What projects has Satya worked on?",
    "Tell me about his AI experience",
    "How can I contact Satya?"
  ];

  return (
    <section id="chatbot" className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-12 py-20 sm:py-16 lg:py-0 section-snap">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div 
          className="text-center mb-8 sm:mb-10 lg:mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-space text-2xl sm:text-3xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Meet <span className="text-primary">Ravi- Virtual Me</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-secondary font-medium italic mb-6 sm:mb-8">
            Where conversation meets innovation.
          </p>
          <p className="text-sm sm:text-base lg:text-lg text-gray-300 max-w-3xl mx-auto px-4 sm:px-0">
            Meet Ravi- Virtual Me—your AI-powered interactive guide. This agentic chatbot answers questions, 
            shares insights, and demonstrates how user experience is elevated by real-time, conversational AI. 
            It's a living showcase of my technical and UX vision.
          </p>
        </motion.div>

        {/* Chatbot Interface */}
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="glass-strong rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8">
            {/* Chat Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-600">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                  <i className="fas fa-robot text-dark"></i>
                </div>
                <div>
                  <h3 className="font-semibold">Ravi- Virtual Me</h3>
                  <p className="text-sm text-green-400 flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                    Online & Ready
                  </p>
                </div>
              </div>
              <div className="text-gray-400">
                <i className="fas fa-cog"></i>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="space-y-4 mb-6 h-64 overflow-y-auto">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex items-start space-x-3 ${message.isBot ? '' : 'justify-end'}`}
                >
                  {message.isBot && (
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-robot text-xs text-dark"></i>
                    </div>
                  )}
                  <div className={`rounded-2xl p-4 max-w-md ${
                    message.isBot 
                      ? 'glass rounded-tl-sm' 
                      : 'bg-primary rounded-tr-sm text-dark'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                  {!message.isBot && (
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-user text-xs"></i>
                    </div>
                  )}
                </div>
              ))}
              {sendMessageMutation.isPending && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-robot text-xs text-dark"></i>
                  </div>
                  <div className="glass rounded-2xl rounded-tl-sm p-4 max-w-xs">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="flex space-x-4">
              <Input 
                type="text" 
                placeholder="Ask Ravi- Virtual Me anything..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 glass rounded-xl px-4 py-3 text-white placeholder-gray-400 border-0 focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={sendMessageMutation.isPending}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={sendMessageMutation.isPending || !inputValue.trim()}
                className="bg-primary text-dark px-6 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all duration-300 btn-glow"
              >
                <i className="fas fa-paper-plane"></i>
              </Button>
            </div>

            {/* Quick Questions */}
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-3">Quick questions to get started:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInputValue(question)}
                    className="glass px-3 py-1 rounded-full text-xs hover:bg-primary hover:text-dark transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quote */}
          <div className="glass rounded-2xl p-6 border-l-4 border-primary max-w-3xl mx-auto mt-8">
            <blockquote className="text-lg italic text-gray-300 text-center">
              "Any sufficiently advanced technology is indistinguishable from magic."
            </blockquote>
            <cite className="text-primary font-semibold mt-2 block text-center">– Arthur C. Clarke</cite>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

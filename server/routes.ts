import type { Express } from "express";
import { createServer, type Server } from "http";
import { generateChatResponse, generateVoiceResponse } from "./services/openai";
import { z } from "zod";

const chatRequestSchema = z.object({
  message: z.string().min(1).max(1000)
});

const voiceChatRequestSchema = z.object({
  message: z.string().min(1).max(1000),
  conversationHistory: z.array(z.object({
    role: z.enum(["system", "user", "assistant"]),
    content: z.string()
  })).optional()
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat endpoint for the AI assistant
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = chatRequestSchema.parse(req.body);
      
      const response = await generateChatResponse(message);
      
      res.json({ response });
    } catch (error) {
      console.error("Chat endpoint error:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid request format",
          details: error.errors 
        });
      }
      
      res.status(500).json({ 
        error: "Failed to process chat message. Please try again." 
      });
    }
  });

  // Voice chat endpoint for the AI voice assistant
  app.post("/api/voice-chat", async (req, res) => {
    try {
      const { message, conversationHistory } = voiceChatRequestSchema.parse(req.body);
      
      const response = await generateVoiceResponse(message, conversationHistory);
      
      res.json({ response });
    } catch (error) {
      console.error("Voice chat endpoint error:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid request format",
          details: error.errors 
        });
      }
      
      res.status(500).json({ 
        error: "Failed to process voice message. Please try again." 
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}

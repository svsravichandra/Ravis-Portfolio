import type { Express } from "express";
import { createServer, type Server } from "http";
import { generateChatResponse } from "./services/openai";
import { z } from "zod";

const chatRequestSchema = z.object({
  message: z.string().min(1).max(1000)
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

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}

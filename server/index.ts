import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Enhanced startup function with improved error handling for deployment
async function startServer() {
  try {
    log("Starting server initialization...");
    
    const server = await registerRoutes(app);
    log("Routes registered successfully");

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      log(`Error occurred: ${status} - ${message}`);
      res.status(status).json({ message });
      // Don't throw in production - let the error middleware handle it
      if (app.get("env") === "development") {
        throw err;
      }
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    const environment = process.env.NODE_ENV || app.get("env") || "production";
    log(`Environment detected: ${environment}`);
    
    if (environment === "development") {
      log("Setting up Vite in development mode...");
      await setupVite(app, server);
      log("Vite setup completed");
    } else {
      log("Setting up static file serving for production...");
      serveStatic(app);
      log("Static file serving setup completed");
    }

    // ALWAYS serve the app on the port specified in the environment variable PORT
    // Other ports are firewalled. Default to 5000 if not specified.
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = parseInt(process.env.PORT || '5000', 10);
    const host = process.env.HOST || "localhost";
    
    log(`Attempting to start server on ${host}:${port}...`);
    
    return new Promise<void>((resolve, reject) => {
      const serverInstance = server.listen(port, host, () => {
        log(`✓ Server successfully started and serving on ${host}:${port}`);
        log(`✓ Environment: ${environment}`);
        log(`✓ Process ID: ${process.pid}`);
        log(`✓ Server ready to accept connections`);
        resolve();
      });

      // Handle server startup errors
      serverInstance.on('error', (error: any) => {
        log(`✗ Server startup error: ${error.message}`);
        log(`✗ Error code: ${error.code}`);
        
        if (error.code === 'EADDRINUSE') {
          log(`✗ Port ${port} is already in use. This should not happen in deployment.`);
        } else if (error.code === 'EACCES') {
          log(`✗ Permission denied on port ${port}. Check if port requires elevated privileges.`);
        } else if (error.code === 'EADDRNOTAVAIL') {
          log(`✗ Cannot bind to address ${host}:${port}. Address not available.`);
        }
        
        reject(error);
      });

      // Handle process-level errors
      process.on('uncaughtException', (error) => {
        log(`✗ Uncaught Exception: ${error.message}`);
        log(`✗ Stack: ${error.stack}`);
        process.exit(1);
      });

      process.on('unhandledRejection', (reason, promise) => {
        log(`✗ Unhandled Rejection at: ${promise}, reason: ${reason}`);
        process.exit(1);
      });

      // Graceful shutdown handling
      const gracefulShutdown = (signal: string) => {
        log(`Received ${signal}. Graceful shutdown initiated...`);
        serverInstance.close(() => {
          log('Server closed. Exiting process.');
          process.exit(0);
        });
      };

      process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
      process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    });

  } catch (error: any) {
    log(`✗ Fatal error during server startup: ${error.message}`);
    if (error.stack) {
      log(`✗ Stack trace: ${error.stack}`);
    }
    throw error;
  }
}

// Start the server
startServer().catch((error) => {
  log(`✗ Server failed to start: ${error.message}`);
  process.exit(1);
});

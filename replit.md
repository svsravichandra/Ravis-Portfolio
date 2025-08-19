
# Portfolio Website

## Overview

This is a modern, dark-themed portfolio website for Satya Ravi, showcasing expertise in front-end engineering, AI systems, product innovation, and software architecture. The application features a single-page design with smooth scroll-based transitions, interactive elements, and an AI-powered chatbot. Built as a full-stack application with React frontend and Express backend, it demonstrates advanced UX sensibilities with glassmorphism design elements and cinematic frame transitions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom CSS variables for dark theme implementation
- **UI Components**: Shadcn/ui component library built on Radix UI primitives for accessible, customizable components
- **Animations**: Framer Motion for smooth scroll-based transitions and interactive animations
- **State Management**: TanStack Query (React Query) for server state management and API interactions
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for REST API endpoints
- **Language**: TypeScript for full-stack type safety
- **API Design**: RESTful endpoints for chat functionality and health checks
- **Error Handling**: Centralized error middleware with structured error responses
- **Development**: Hot module replacement and development server integration
- **Deployment**: Enhanced startup error handling with comprehensive logging for production deployment (Jan 2025)
- **Server Configuration**: Listens on PORT environment variable with 0.0.0.0 host binding for Replit deployment compatibility
- **Process Management**: Graceful shutdown handling with SIGTERM/SIGINT support for container environments (Jan 2025)
- **Error Recovery**: Improved production error handling without process crashes for better uptime (Jan 2025)

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for database migrations and schema evolution
- **Connection**: Neon Database serverless PostgreSQL integration
- **Fallback Storage**: In-memory storage implementation for development/testing scenarios

### Authentication and Authorization
- **Session Management**: Connect-pg-simple for PostgreSQL-backed session storage
- **Schema**: User model with username/password authentication structure
- **Validation**: Zod schemas for runtime type validation and data integrity

### Component Design System
- **Design Language**: Glassmorphism with dark matted backgrounds and high contrast accents
- **Theme**: CSS custom properties for consistent color scheme and spacing
- **Typography**: Space Grotesk and Inter font families for modern, readable text
- **Responsive Design**: Mobile-first approach with tablet and desktop breakpoints
- **Accessibility**: ARIA compliance through Radix UI primitives and semantic HTML

### User Experience Features
- **Scroll Interactions**: Intersection Observer API for section-based navigation and smooth transitions
- **Progressive Enhancement**: Core functionality works without JavaScript, enhanced with interactive features
- **Performance**: Code splitting and lazy loading for optimal bundle size
- **SEO**: Meta tags and semantic HTML structure for search engine optimization

## External Dependencies

### Core Technologies
- **React Ecosystem**: React 18, React DOM, TypeScript for component architecture
- **Styling Framework**: Tailwind CSS with PostCSS for utility-first styling
- **Animation Library**: Framer Motion for declarative animations and transitions
- **Component Library**: Radix UI primitives with Shadcn/ui abstractions

### Database and ORM
- **Database Provider**: Neon Database for serverless PostgreSQL hosting
- **ORM**: Drizzle ORM with Drizzle Kit for type-safe database operations
- **Session Storage**: Connect-pg-simple for PostgreSQL session management

### Backend Services
- **API Framework**: Express.js with TypeScript for REST endpoints
- **Validation**: Zod for schema validation and type inference
- **Development Tools**: TSX for TypeScript execution and hot reloading

### AI Integration
- **AI Provider**: ElevenLabs Conversational Agent (agent_7301k2756861f0zs3jmmf1c6t96s) for personalized voice interactions
- **Voice Interface**: Real-time conversational AI with integrated speech recognition, processing, and synthesis
- **Conversation Flow**: Natural turn-taking with ~75ms latency for seamless voice interactions
- **Fallback Handling**: Graceful error handling for microphone permissions and connectivity issues

### Interactive Background Features
- **Hexagonal Grid**: Dynamic SVG-based honeycomb pattern with skill icons (HTML5, React, Python, TensorFlow, etc.)
- **Cursor Interaction**: Desktop devices track mouse position for hover effects with green neon glow
- **Mobile Optimization**: Automatic wave animations flow across hexagons when no cursor is detected
- **Smart Device Detection**: Fixed mobile detection logic to properly distinguish between desktop and mobile devices (Jan 2025)
- **Performance**: Optimized rendering with conditional animation modes for smooth 60fps interactions

### Development Tools
- **Build System**: Vite with React plugin for fast development and production builds
- **Code Quality**: TypeScript strict mode for compile-time error detection
- **Development Experience**: Replit integration with runtime error overlay and cartographer plugins

### UI Enhancement Libraries
- **Icons**: Font Awesome for comprehensive icon library
- **Utilities**: clsx and tailwind-merge for conditional styling
- **Date Handling**: date-fns for date manipulation and formatting
- **Carousel**: Embla Carousel for touch-friendly image/content carousels
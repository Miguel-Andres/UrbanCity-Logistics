# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Urban City Logistics is a modern logistics management platform for urban environments. This is a Next.js 16 application using React 19, TypeScript, and Tailwind CSS 4. The project is currently in development with a basic landing page.

## Development Commands

- **Install dependencies**: `pnpm install` (uses pnpm as package manager)
- **Development server**: `pnpm dev` (runs on http://localhost:3000)
- **Build for production**: `pnpm build`
- **Start production server**: `pnpm start`
- **Run linter**: `pnpm lint` (uses ESLint with Next.js configuration)

## Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4
- **Package Manager**: pnpm
- **Fonts**: Geist Sans and Geist Mono from Google Fonts

### Project Structure
```
urbancity-logistics/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with font configuration
│   ├── page.tsx           # Home page (construction landing)
│   ├── globals.css        # Global styles
│   └── etiquetas/         # Additional routes
├── public/                # Static assets (includes Bike.lottie)
└── DISEÑO_Y_PLANIFICACIÓN.md  # Comprehensive design and development plan
```

### Key Design Decisions
- Uses Next.js App Router for modern routing
- TypeScript configuration includes path aliases (`@/*` maps to root)
- ESLint configured with Next.js core web vitals and TypeScript rules
- Currently implements a construction landing page with orange branding

### Future Implementation Plan
The project has an extensive design document (DISEÑO_Y_PLANIFICACIÓN.md) outlining:
- Modern UI with glassmorphism and neumorphism effects
- Interactive components (service calculator, coverage map, testimonials)
- Advanced animations using Framer Motion
- Responsive mobile-first design
- Performance optimizations

## Development Guidelines

### Styling Approach
- Uses Tailwind CSS with dark mode support
- Color scheme focuses on orange (#FF6B35) as primary color
- Implements modern design patterns (gradients, animations)
- Geist fonts for consistent typography

### Code Conventions
- TypeScript strict mode enabled
- React components use modern syntax (React 19)
- ESLint configuration enforces Next.js best practices
- Path aliases configured for cleaner imports (`@/`)

### Notes
- Project is in early development stage
- Design document contains detailed implementation plans
- Lottie animations already present in public folder
- Spanish language content (es)
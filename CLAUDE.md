# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- **Development**: `npm run dev` - Start the development server
- **Build**: `npm run build` - Build the production version
- **Lint**: `npm run lint` - Run ESLint on the codebase
- **Preview**: `npm run preview` - Preview the production build locally

## Code Style Guidelines
- **Formatting**: Follow TypeScript/React best practices with 2-space indentation
- **Imports**: Group imports: React, libraries, components, styles
- **Types**: Use TypeScript interfaces for component props and state
- **Naming**: 
  - Components: PascalCase (ActivityCard.tsx)
  - Functions/variables: camelCase
  - Files: match component name (PascalCase for components)
- **Error Handling**: Use try/catch blocks with proper error logging
- **Components**: Functional components with hooks
- **State Management**: Use React Context for global state

## Architecture
- src/components: Reusable UI components
- src/pages: Page components
- src/services: API and third-party services
- src/context: React Context providers
- src/types: TypeScript interfaces
- src/utils: Helper functions
# replit.md

## Overview

LouDao is a hybrid platform for reporting gender-based violence that combines public transparency with intelligent privacy using blockchain technology. The application features a public "tendedero" (clothesline) where reports are visible to all users, while private victim data is encrypted using Fully Homomorphic Encryption (FHE) for analysis without revealing sensitive information. The platform provides pattern detection to identify repeat offenders, analytics dashboards, and a comprehensive support directory for victims.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, built using Vite
- **Styling**: Tailwind CSS with shadcn/ui component library using the "new-york" style
- **State Management**: TanStack React Query for server state management and caching
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Color Scheme**: Custom purple (#6b02a7), pink (#bf0398), and green (#02a412) theme reflecting the application's branding

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints for reports, analytics, and support organizations
- **Data Validation**: Zod schemas for request/response validation shared between frontend and backend
- **Storage**: In-memory storage implementation with interface for future database integration

### Blockchain Integration
- **Network**: Lisk Sepolia testnet (Chain ID: 4202) for development and testing
- **Smart Contracts**: Hardhat development environment with Solidity 0.8.24
- **FHE Integration**: Zama FHEVM for encrypted computation on private victim data
- **Wallet Connection**: MetaMask integration for user authentication and transaction signing
- **Hybrid Data Model**: Public report data (aggressor name, institution) stored on-chain, private data (victim age, relationship type) encrypted with FHE

### Data Storage Solutions
- **Database ORM**: Drizzle ORM configured for PostgreSQL with migration support
- **Schema Design**: Separate tables for users, reports, and support organizations
- **Hybrid Storage**: Public report metadata on blockchain, encrypted private data via FHE, support directory in traditional database
- **Development Storage**: In-memory implementation for rapid prototyping and testing

### Authentication and Authorization
- **Wallet-Based Auth**: Ethereum wallet addresses as user identifiers
- **Network Validation**: Automatic network switching to Lisk Sepolia
- **Session Management**: Stateless authentication using wallet signatures

### External Dependencies
- **Blockchain Provider**: Lisk Sepolia RPC endpoint for blockchain interactions
- **Encryption**: Zama FHEVM library for homomorphic encryption operations
- **Development Tools**: Replit-specific plugins for development environment integration
- **UI Components**: Radix UI primitives for accessible component foundation

### Key Features
- **Public Tendedero**: Transparent display of all reports with pattern detection
- **Private Analytics**: FHE-powered statistics without revealing individual victim data
- **Pattern Matching**: Automatic detection of multiple reports against the same aggressor
- **Support Directory**: Curated list of Mexican organizations providing victim support
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Real-time Updates**: Query invalidation and refetching for live data updates

### Development Workflow
- **Build System**: Vite for frontend bundling, esbuild for server compilation
- **Type Safety**: Strict TypeScript configuration with shared types between client and server
- **Hot Reload**: Vite HMR for frontend, tsx for server development
- **Deployment**: Production build creates static frontend and bundled server
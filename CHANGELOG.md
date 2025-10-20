# Changelog

All notable changes to QuickShip CLI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-20

### 🎉 MAJOR RELEASE: v1.0.0 - Production Ready

#### Added

- **🎯 Optional ORM/ODM Support** - Maximum Flexibility
  - **Separate Database and ORM Choices** - Choose database first, then optionally add ORM/ODM
  - **PostgreSQL Options**:
    - With Prisma ORM (type-safe, migrations, recommended)
    - With raw `pg` driver (lightweight, direct SQL)
  - **MongoDB Options**:
    - With Mongoose ODM (schemas, validation, modeling)
    - With raw `mongodb` driver (lightweight, direct queries)
  - **SQLite Options**:
    - With Prisma ORM (type-safe, migrations)
    - With `better-sqlite3` (synchronous, fast, simple)
  - **No Database Option** - Build APIs without database dependencies

- **🔌 Express + TypeScript API Template** - Production-ready RESTful API
  - ✅ Express.js 4+ with TypeScript
  - ✅ 6 Database Configurations (3 databases × 2 options each + none)
  - ✅ JWT Authentication (optional, requires database)
  - ✅ Swagger Documentation (optional)
  - ✅ Docker Support (optional)
  - ✅ Zod Validation
  - ✅ Complete error handling
  - ✅ Security (Helmet, CORS, bcrypt)
  - ✅ Jest testing setup

- **🏗️ NestJS API Template** - Enterprise-grade modular API
  - ✅ NestJS 10+ with TypeScript
  - ✅ 6 Database Configurations (3 databases × 2 options each + none)
  - ✅ Passport.js + JWT Authentication (optional, requires database)
  - ✅ Swagger Documentation (optional, auto-generated)
  - ✅ Docker Support (optional)
  - ✅ Class Validator with DTOs
  - ✅ Modular architecture (Auth, Users, Database modules)
  - ✅ JWT Guards & Strategies
  - ✅ Jest with NestJS testing utilities

#### Fixed

- **🐛 NestJS MongoDB Dependency Injection** - Resolved Mongoose schema registration issues
  - Fixed UsersModule to properly import MongooseModule.forFeature()
  - Fixed AuthModule to properly import MongooseModule.forFeature()
  - Fixed JWT Strategy constructor to properly inject ConfigService
  - All modules now correctly resolve UserModel dependencies

- **🔧 Environment Variable Management**
  - Both `.env.example` and `.env` files now created automatically
  - No more "JWT secret missing" errors on first run
  - Projects work immediately after creation without manual file copying

- **📋 Platform Selection Order**
  - Reordered to: Website → Backend → Mobile App
  - Removed "Browser Extension (Coming Soon)" option for cleaner UX

#### Changed

- **💾 Database Selection UX** - Two-step process for clarity
  - Step 1: Choose database type (PostgreSQL, MongoDB, SQLite, None)
  - Step 2: Choose ORM/ODM if database selected (optional)
  - Clear labels explain what each option provides
  - Smart defaults (Prisma/Mongoose recommended)

- **📦 Dependency Management** - Lighter, more flexible
  - Only installs selected database driver
  - No unnecessary ORM dependencies if raw driver chosen
  - Cleaner package.json for simpler projects

#### Improved

- **📖 Success Messages** - Context-aware instructions
  - Shows different setup steps based on database choice
  - Hides database configuration for no-database projects
  - Clear next steps for each combination
  - No confusing Prisma instructions for raw driver users

- **🎨 Template Structure** - Conditional module generation
  - Database modules only created when needed
  - Auth/Users modules only for database-enabled projects
  - Cleaner project structure for API-only apps

## [0.12.0] - 2025-10-20

### Added - 🎉 MAJOR RELEASE: Backend API Support

- **🔌 Express + TypeScript API Template** - Production-ready RESTful API
  - ✅ **Express.js 4+** - Fast, minimalist web framework
  - ✅ **TypeScript** - Full type safety throughout
  - ✅ **3 Database Options**:
    - PostgreSQL with Prisma ORM (type-safe, migrations)
    - MongoDB with Mongoose (NoSQL, flexible)
    - SQLite (zero-config, local development)
  - ✅ **JWT Authentication** (Optional) - Complete auth system with register/login/protected routes
  - ✅ **Swagger Documentation** (Optional) - Auto-generated API docs at `/api/docs`
  - ✅ **Docker Support** (Optional) - Dockerfile + docker-compose with database
  - ✅ **Zod Validation** - Request validation with TypeScript inference
  - ✅ **Error Handling** - Centralized error middleware with proper HTTP codes
  - ✅ **Security** - Helmet, CORS, bcrypt password hashing
  - ✅ **Testing** - Jest configuration with example tests
  - ✅ **Production Ready** - TypeScript build, environment validation

- **🏗️  NestJS API Template** - Enterprise-grade modular API
  - ✅ **NestJS 10+** - Progressive Node.js framework
  - ✅ **TypeScript** - Decorators, dependency injection, modular architecture
  - ✅ **3 Database Options**:
    - PostgreSQL with Prisma ORM (type-safe, migrations)
    - MongoDB with Mongoose (NoSQL, flexible)
    - SQLite (zero-config, local development)
  - ✅ **Passport.js + JWT Authentication** (Optional) - Complete auth with JWT strategy
  - ✅ **Swagger Documentation** (Optional) - Auto-generated from decorators at `/api`
  - ✅ **Docker Support** (Optional) - Dockerfile + docker-compose with database
  - ✅ **Class Validator** - DTO validation with decorators
  - ✅ **Modular Structure** - Auth module, Users module, Database module
  - ✅ **Guards & Strategies** - JWT authentication guard
  - ✅ **Testing** - Jest with NestJS testing utilities
  - ✅ **Production Ready** - TypeScript build, environment configuration

- **🌐 New Platform: API / Backend**
  - Added to platform selector alongside Website and Mobile App
  - Dedicated backend prompts with database/auth/Docker options
  - Smart defaults for headless mode (`-y` flag)
  - Support for both Express and NestJS stacks

- **📦 Backend Template Features**:
  - **Modular Architecture**: Controllers, services, routes, middleware
  - **Environment Validation**: Zod-based .env validation on startup
  - **Database Setup**:
    - Prisma schema generation for PostgreSQL/SQLite
    - Mongoose models for MongoDB
    - Connection handling with error recovery
  - **Authentication System** (when enabled):
    - User registration with password hashing
    - JWT token generation and verification
    - Protected route middleware
    - Auth endpoints: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
  - **API Documentation** (when enabled):
    - Swagger UI at `/api/docs`
    - OpenAPI 3.0 specification
    - Bearer token authentication support
  - **Docker Configuration** (when enabled):
    - Multi-stage Dockerfile for production
    - docker-compose with database service
    - Environment variable configuration
  - **Comprehensive README**: Setup instructions, API endpoints, deployment guide

- **🔧 CLI Enhancements**:
  - New backend prompts: `src/prompts/backend-prompts.js`
  - Backend template generation: `src/core/backend-templates.js`
  - Express detection in `project-detector.js`
  - Backend success messages in `engine.js`

- **🚀 Deployment Support**:
  - Railway (Recommended) - Easy backend deployment with database support
  - Render - Free tier with managed databases
  - Fly.io - Global edge deployment
  - Platform recommendations for Express APIs

### Technical Implementation

- **Files Created**:
  - `src/prompts/backend-prompts.js` - Backend configuration prompts
  - `src/core/backend-templates.js` - Template generation helpers (~2100+ lines)
    - Express helper methods (~1200 lines)
    - NestJS helper methods (~900 lines)
  - Template structure: 15+ TypeScript files generated per Express project
  - Template structure: 20+ TypeScript files generated per NestJS project

- **Files Modified**:
  - `src/config/templates.json` - Added backend template definitions (express-api, nestjs-api)
  - `src/prompts/platform-selector.js` - Added "API / Backend" option
  - `src/commands/build.js` - Backend platform handling
  - `src/core/template-manager.js` - `createExpressApp()` and `createNestApp()` integration
  - `src/core/engine.js` - Backend success messages for Express and NestJS
  - `src/utils/project-detector.js` - Express/NestJS detection
  - `README.md` - Backend documentation (6 templates now)

### Usage

**Express API:**
```bash
# Interactive mode
quickship build my-api
# Select: 🔌 API / Backend
# Choose: Express + TypeScript
# Database: PostgreSQL with Prisma
# Auth: Yes
# Swagger: Yes
# Docker: Yes

# Headless mode (uses defaults)
quickship build my-api --template express-api -y

# Custom configuration
quickship build my-api --template express-api -p pnpm --no-git
```

**NestJS API:**
```bash
# Interactive mode
quickship build my-api
# Select: 🔌 API / Backend
# Choose: NestJS
# Database: PostgreSQL with Prisma
# Auth: Yes (Passport.js + JWT)
# Swagger: Yes
# Docker: Yes

# Headless mode (uses defaults)
quickship build my-api --template nestjs-api -y

# Custom configuration
quickship build my-api --template nestjs-api -p pnpm --no-git
```

### Future Plans

- **GraphQL Support** (v0.13.0) - GraphQL APIs with Apollo Server and type generation
- **More Auth Providers** (v0.14.0) - OAuth providers, social login
- **API Gateway** - Kong, Traefik integration templates
- **Microservices** - Multi-service architecture templates

---

## [0.10.21] - 2025-01-19

### Added
- **Expo Template Selection** - Choose between Tabs or Blank templates
  - **Tabs Template** (Default) - Includes Expo Router with file-based routing and tab navigation
  - **Blank Template** - Minimal starter template for custom navigation
  - Interactive prompt for template selection
  - Headless mode defaults to tabs template

- **Styling Choice** - Choose between StyleSheet or NativeWind
  - **StyleSheet** (Default) - Expo's official default styling approach (React Native StyleSheet)
  - **NativeWind** (Optional) - Tailwind CSS for React Native
  - Respects Expo's official defaults
  - Only configures NativeWind if explicitly chosen

### Improved
- **Latest Expo Best Practices** - Updated to match Expo SDK 53+ compatibility
  - Changed from `create-expo-app@latest` to `create-expo` (official recommendation)
  - react-native-reanimated now installed via `npx expo install` for automatic SDK version matching
  - No more version mismatch warnings across different Expo SDK versions
  - Compatible with Expo SDK 52 (React Native 0.77) and SDK 53+ (React Native 0.79+)
  - **Respects Expo's defaults**: StyleSheet is the default (not NativeWind)

- **Automatic NativeWind Setup** - Only when explicitly chosen
  - Automatically imports global.css in app/_layout.tsx (tabs template)
  - Automatically imports global.css in App.tsx/App.js (blank template)
  - Smart detection of layout file location
  - Babel config with correct preset structure (nativewind/babel in presets, not plugins)
  - All required dependencies installed automatically

- **Success Messages** - Enhanced CLI output
  - Shows selected Expo template (Tabs or Blank)
  - Shows selected styling approach (StyleSheet or NativeWind)
  - Indicates when Expo Router is included (tabs template)
  - Template-specific success messages

### Fixed
- **Babel Configuration** - Fixed NativeWind babel.config.js syntax and dependencies
  - Removed trailing comma after last plugin in babel config
  - Added `babel-preset-expo` as devDependency (required for custom babel config)
  - Resolves `[BABEL] .plugins is not a valid Plugin property` error
  - Resolves `Cannot find module 'babel-preset-expo'` error
  - Mobile app now starts correctly with `npx expo start`

- **Dependency Management** - react-native-reanimated version now managed by Expo
  - Uses `npx expo install react-native-reanimated` to get SDK-compatible version
  - Fixes compatibility issues across different Expo SDK versions
  - Prevents "expected version" warnings

---

## [0.10.1] - 2025-01-19

### Fixed
- **ES Module Compatibility** - Fixed `fs-extra` import in template-manager.js
  - Changed dynamic import to static import using default import pattern
  - Resolves `Error: writeFile is not a function` in setupNativeWind method
  - Mobile app creation now works correctly

---

## [0.10.0] - 2025-01-19

### Added - 🎉 PHASE 2: Mobile Development Support

- **📱 Expo React Native Template** - Cross-platform mobile app development
  - ✅ **Expo SDK 52+** - Latest stable Expo version with all modern features
  - ✅ **TypeScript Support** - Full type safety for React Native development
  - ✅ **NativeWind v4** - Tailwind CSS for React Native (automatic setup)
  - ✅ **Expo Router** - File-based navigation with tabs template
  - ✅ **Tab Navigation** - Pre-configured tab-based navigation structure
  - ✅ **Dark Mode Support** - Built-in dark mode theming
  - ✅ **Hot Reload** - Fast Refresh for instant feedback
  - ✅ **Multi-Platform** - Run on iOS, Android, and Web from single codebase

- **🔧 Mobile Platform Integration**:
  - `src/prompts/mobile-prompts.js` - Mobile-specific project configuration prompts
  - Mobile platform selection in main CLI flow (`platform-selector.js`)
  - Template detection for `expo-react-native` and `expo` keywords
  - Headless mode support with `-y` flag for mobile templates
  - Package manager choice for mobile projects (npm, pnpm, yarn, bun)

- **🛠️ Template Manager Enhancements**:
  - `createExpoApp()` - Automated Expo project creation using `create-expo-app`
  - `setupNativeWind()` - Complete NativeWind configuration with 5 config files:
    - `tailwind.config.js` - Tailwind CSS configuration with NativeWind preset
    - `global.css` - Global styles with Tailwind directives
    - `nativewind-env.d.ts` - TypeScript declarations for NativeWind
    - `babel.config.js` - Babel configuration with NativeWind plugin
    - `metro.config.js` - Metro bundler configuration for CSS processing
  - `getTemplate()` - Unified template lookup across website and mobile categories
  - Automatic dependency installation (nativewind, tailwindcss, react-native-reanimated)

- **📋 Templates Configuration**:
  - Added `mobile` category to `templates.json`
  - Expo React Native template configuration with priority and features list
  - Platform metadata (iOS, Android, Web)
  - Development command specification (`npx expo start`)

- **✨ User Experience**:
  - Mobile-specific success message with platform instructions
  - QR code scanning instructions for Expo Go app
  - Platform-specific run commands (a for Android, i for iOS, w for Web)
  - NativeWind confirmation message when configured
  - Enhanced CLI output for mobile app creation

### Improved

- **Build Command**:
  - Mobile platform detection from `--template expo-react-native` flag
  - Automatic platform switching for mobile templates
  - Mobile prompts integration with full configuration flow

- **Documentation**:
  - README updated with Expo React Native template details
  - Mobile template comparison table
  - Mobile app creation examples
  - Headless mode examples for CI/CD with mobile templates
  - Updated feature list to reflect 5 templates (was 4)

### Technical Details

- **Dependencies**:
  - Projects use `create-expo-app@latest` for initialization
  - NativeWind v4.0.1+ with Tailwind CSS v3.4.0+
  - React Native Reanimated ~3.16.1 (required by NativeWind)

- **Template Structure**:
  - Uses official Expo `tabs` template as base
  - Maintains Expo Router file-based navigation
  - Compatible with Expo Go for instant device testing
  - Supports iOS Simulator (macOS) and Android Emulator

---

## [0.9.3] - 2025-01-19

### Improved
- **Deployment URL Extraction** - Success box now shows actual deployment URLs
  - **Vercel**: Extracts production URL from `vercel ls` after deployment
  - **Netlify**: Extracts site URL from `netlify status` after deployment
  - **Railway**: Extracts deployment URL from `railway status` for both single and MERN deployments
  - **MERN Stack on Railway**: Shows both backend and frontend URLs separately
  - Fallback to dashboard links if URL extraction fails

### Fixed
- Deployment success message now displays actual live URLs instead of generic "Deployment successful" text
- URL extraction works with all platform CLI outputs

---

## [0.9.2] - 2025-01-19

### Fixed
- **ES Module Compatibility** - Fixed `fs-extra` import issues in deployment modules
  - Changed all `fs-extra` imports to use default import pattern for ES module compatibility
  - Fixed `project-detector.js` - Using `import pkg from 'fs-extra'` pattern
  - Fixed `env-manager.js` - Using `import pkg from 'fs-extra'` pattern
  - Fixed `platform-railway.js` - Using `import pkg from 'fs-extra'` pattern
  - Fixed `platform-render.js` - Using `import pkg from 'fs-extra'` pattern
  - Resolves `SyntaxError: Named export 'readFile' not found` error

---

## [0.9.0] - 2025-01-19

### Added - 🎉 MAJOR RELEASE: One-Command Deployment

- **🚀 `quickship deploy` Command** - Production deployment with a single command
  - **Platform Support**:
    - ✅ Vercel - Optimized for Next.js, T3 Stack, and Vite projects
    - ✅ Netlify - Perfect for Vite and Next.js static exports
    - ✅ Railway - Full-stack MERN deployments with MongoDB support
    - ✅ Render - MERN Stack alternative with free tier

  - **Smart Features**:
    - 🔍 Automatic project type detection (Next.js, T3 Stack, Vite, MERN)
    - 📦 Platform recommendations based on your stack
    - ✅ Pre-deployment validation (build setup, dependencies)
    - 🔐 Authentication handling (browser-based login flows)
    - 🔑 Interactive environment variable setup
    - 📊 Environment variable detection from `.env.example`
    - 🔒 Sensitive value masking (secrets, passwords, tokens)
    - ⚠️  Critical variable validation (DATABASE_URL, API keys)

  - **Deployment Options**:
    - `-p, --platform <name>` - Specify platform (vercel, netlify, railway, render)
    - `-y, --yes` - Skip confirmation prompts
    - `--skip-env` - Skip environment variable setup
    - `--production` - Deploy to production (default: true)
    - `-v, --verbose` - Show detailed logs

  - **Platform-Specific Features**:
    - **Vercel**: Zero-config deployment, automatic CI/CD, edge functions
    - **Netlify**: Fast CDN, instant builds, deploy previews, site linking
    - **Railway**: CLI auto-installation, MERN Stack dual-service deployment
    - **Render**: Blueprint generation (render.yaml), Git-based deployment

- **📦 New Deployment Infrastructure**:
  - `src/deployment/platform-vercel.js` - Vercel deployment handler
  - `src/deployment/platform-netlify.js` - Netlify deployment handler
  - `src/deployment/platform-railway.js` - Railway deployment handler with MERN support
  - `src/deployment/platform-render.js` - Render deployment handler with blueprint generation
  - `src/deployment/env-manager.js` - Environment variable management system
  - `src/utils/project-detector.js` - Project type and configuration detection

- **🔧 Enhanced Project Detection**:
  - `detectProjectType()` - Identifies Next.js, T3 Stack, Vite, MERN projects
  - `detectPackageManager()` - Detects npm, pnpm, yarn, bun from lock files
  - `getRecommendedPlatforms()` - Suggests best platforms for each stack
  - `detectRequiredEnvVars()` - Parses `.env.example` for required variables
  - `validateBuildSetup()` - Checks build scripts and node_modules

- **🌐 MERN Stack Special Handling**:
  - Dual-service deployment (frontend + backend)
  - MongoDB connection configuration
  - Separate environment variables for client and server
  - Railway: Sequential deployment with status monitoring
  - Render: Blueprint generation for infrastructure-as-code

### Improved

- **Enhanced User Experience**:
  - Beautiful deployment progress indicators
  - Platform-specific tips after deployment
  - Comprehensive error messages with solutions
  - Troubleshooting guides for common issues
  - Post-deployment next steps and URLs

- **Better Error Handling**:
  - Authentication failures with recovery instructions
  - Build failures with local testing suggestions
  - Missing CLI detection and auto-installation (Railway)
  - Environment variable validation with helpful suggestions
  - Platform status links for debugging

### Documentation

- **Comprehensive Deployment Documentation**:
  - Complete deployment guide in README.md
  - Platform comparison table (features, best use cases)
  - Deployment options and flags documentation
  - Platform-specific examples for all 4 templates
  - Environment variable setup guide
  - Deployment troubleshooting section
  - Step-by-step deployment examples with expected flow

- **Updated Examples**:
  - Next.js to Vercel deployment walkthrough
  - MERN Stack to Railway deployment guide
  - Environment variable configuration examples
  - Platform authentication instructions

- **Updated Roadmap**:
  - Marked `quickship deploy` as completed in v0.9.0
  - Added future deployment enhancements (env encryption, custom domains)
  - Outlined upcoming features for v0.10.0+

### Technical

- **New Dependencies** (Implicit - using via npx):
  - `vercel` - Vercel CLI for deployments
  - `netlify-cli` - Netlify CLI for deployments
  - `@railway/cli` - Railway CLI for full-stack deployments

- **Architecture Improvements**:
  - Modular platform handlers with consistent interface
  - Environment variable manager with validation and masking
  - Project detector utility for reusable detection logic
  - Comprehensive error handling across all platforms

### Files Added

```
src/
├── commands/
│   └── deploy.js                      # Main deployment command
├── deployment/
│   ├── platform-vercel.js            # Vercel integration
│   ├── platform-netlify.js           # Netlify integration
│   ├── platform-railway.js           # Railway integration
│   ├── platform-render.js            # Render integration
│   └── env-manager.js                # Environment variable manager
└── utils/
    └── project-detector.js           # Project detection utilities
```

---

## [0.8.13] - 2025-01-19

### Added
- **New Commands** - Added 4 essential CLI commands for enhanced project management:
  - `quickship doctor` - Comprehensive health check for project and development environment
    - Checks Node.js version, package manager, Git installation
    - Validates project structure, dependencies, environment variables
    - Provides health score (0-100%) with warnings and fixes
  - `quickship info` - Detailed project information display
    - Shows detected project type, location, package manager, Node.js version
    - Lists installed features (TypeScript, Tailwind, ESLint, etc.)
    - Suggests available features to add
    - Displays quick commands for development
  - `quickship templates` - Rich template browser with detailed information
    - Beautiful formatted display of all 4 templates
    - Shows complete tech stack, features, and use cases
    - Includes deployment options and popularity metrics
    - Provides create commands for each template
    - `--compare` flag for side-by-side comparison (coming soon)
  - `quickship update` - Built-in CLI updater
    - Checks current vs latest version automatically
    - Shows what's new in latest release
    - Interactive update confirmation
    - Automatic installation

### Fixed
- **`-y` flag now works correctly** - Headless mode properly skips all prompts
  - Uses intelligent defaults when `-y` flag is provided
  - Defaults: Next.js template, TypeScript, Tailwind CSS, npm, Git enabled
  - Can be combined with `--template` flag to specify different stack
  - Perfect for CI/CD pipelines and automated workflows
- **`--no-install` flag now works correctly** - Properly skips dependency installation
  - Vite projects: Skips manual npm install step
  - Next.js projects: Passes `--skip-install` to create-next-app
  - Respects flag throughout the entire build process
  - Useful for custom dependency management workflows
- **Platform selector skip logic** - Platform selection now skips when using `-y` with `--template`

### Improved
- **Enhanced Logger System** - Complete overhaul of CLI output:
  - Professional boxed outputs using `boxen` throughout all commands
  - Consistent color coding: cyan (primary), green (success), yellow (warning), red (error)
  - New logger methods: `header()`, `dim()`, `highlight()`, `divider()`, `log()`
  - Two logo variants: main banner (large) and small ship logo (compact)
  - `logoWithMessage()` for contextual branding moments
  - Centralized logging eliminates direct `console.log` usage
- **Consistent CLI Experience** - All commands now use the unified logger:
  - Beautiful boxes for important messages
  - Color-coded status indicators
  - Professional formatting across all outputs
  - Clear visual hierarchy with headers and sections
- **Better Option Handling** - Improved flag and option processing:
  - Options properly passed through build chain
  - Template manager receives and respects all flags
  - Consistent behavior across all template types

### Technical
- Updated `bin/index.js` to register all new commands
- Added `options` parameter to `websitePrompts()` function
- Passing `options` through `Engine` → `TemplateManager` → template methods
- Enhanced `createViteApp()` and `createNextApp()` to respect `--no-install` flag
- Migrated 13 files from direct `chalk` usage to centralized logger
- Updated `logger.js` with compact ship logo and new utility methods

### Documentation
- Comprehensive README.md update with all new commands documented
- Added "Available Commands" section with categorized command list
- Detailed usage examples for all new commands
- Added headless mode examples for CI/CD workflows
- Updated feature list to reflect new capabilities
- Added troubleshooting section for new commands
- Updated roadmap with completed v0.8.13 features

---

## [0.8.12] - 2025-01-19

### Internal
- Initial logger improvements and bug fixes
- Not published to npm

---

## [0.8.11] - 2025-01-19

### Fixed
- Minor bug fixes and improvements
- Stability enhancements

---

## [0.7.2] - 2025-01-19

### Documentation
- **Completely redesigned README** with comprehensive documentation
- Added detailed template descriptions for all 4 templates
- Template comparison table for easy decision-making
- Real-world examples for Next.js, T3 Stack, Vite, and MERN
- Comprehensive troubleshooting guide
- Updated badges with npm downloads and version
- Better structured sections with emojis and formatting

---

## [0.7.1] - 2025-01-19

### Improved
- **Enhanced success messages** with stack-specific setup instructions
- MERN Stack now shows MongoDB configuration steps (`.env` setup, connection URI)
- T3 Stack now shows Prisma database setup steps
- Clearer port information for different stacks (Vite: 5173, Next.js: 3000, MERN: both)
- Better user experience with important warnings for required configuration
- **Better installation feedback** - Show live npm output during MERN Stack installations
- Users can now see real-time progress instead of frozen spinners
- Clear labels for each installation step (backend, frontend, Tailwind, root dependencies)

---

## [0.7.0] - 2025-01-19

### Added
- **🎉 NEW: MERN Stack Template** - Full-stack MongoDB + Express + React + Node.js
- Client/server monorepo structure with separate package.json files
- Express backend with Mongoose ODM, JWT auth, and bcryptjs
- React frontend using Vite with TypeScript and Tailwind CSS support
- Axios for API calls, React Router for navigation
- Concurrently for running both client and server with one command
- Complete README with setup instructions and MongoDB configuration
- Environment variable templates (.env.example)

### Features
- 4 production-ready templates now available (Next.js, Vite, T3 Stack, MERN)
- MERN Stack includes:
  - Express.js server with proper project structure (routes, models, controllers, middleware)
  - MongoDB connection with Mongoose
  - CORS and security middleware
  - JWT authentication setup
  - React + Vite frontend
  - TypeScript support throughout
  - Tailwind CSS v4 with PostCSS plugin

---

## [0.6.0] - 2025-01-18

### Added
- **T3 Stack Template** - Full-stack, type-safe Next.js application
  - Next.js 15+ with App Router
  - tRPC for end-to-end type safety
  - Prisma ORM for database
  - NextAuth.js for authentication
  - TypeScript throughout
  - Tailwind CSS
  - Optional shadcn/ui components

### Improved
- Better template selection UI
- Enhanced prompts for different stacks
- Stack-specific configuration options

---

## [0.5.6] - 2025-01-17

### Fixed
- shadcn/ui installation issues
- Tailwind CSS v4 configuration for Vite projects
- Package manager detection improvements

### Improved
- Better error messages with actionable solutions
- Enhanced spinner feedback during long operations

---

## [0.5.5] - 2025-01-17

### Added
- **Vite Template** - React + Vite SPA development
  - Blazing fast HMR with Vite 7+
  - React 18+ with TypeScript
  - Tailwind CSS v4 support
  - React Router for navigation
  - Axios for API calls

### Improved
- Package manager choice (npm, pnpm, yarn, bun)
- Better TypeScript configuration
- Enhanced Tailwind CSS setup

---

## [0.5.0] - 2025-01-16

### Added
- **`quickship add` command** for extensibility
- shadcn/ui integration for Next.js projects
- `quickship add shadcn` - Adds shadcn/ui to existing Next.js projects

### Improved
- Better project detection
- Enhanced error handling
- Improved user feedback

---

## [0.4.0] - 2025-01-15

### Added
- Next.js 15+ template with App Router
- TypeScript support
- Tailwind CSS integration
- ESLint and Prettier configuration
- Git initialization with initial commit
- Automated dependency installation

### Features
- Interactive CLI with beautiful prompts
- Package manager selection (npm, pnpm, yarn, bun)
- Configurable project options
- 60-second project setup

---

## [0.3.0] - 2025-01-14

### Added
- Initial release
- Basic Next.js project generation
- TypeScript and Tailwind CSS setup

---

## Contributing

When adding entries to the changelog:
1. Follow the format: `## [version] - YYYY-MM-DD`
2. Use categories: Added, Changed, Deprecated, Removed, Fixed, Security
3. Write clear, user-focused descriptions
4. Link to issues/PRs where applicable
5. Keep entries concise but informative

---

**Legend:**
- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security improvements
- **Improved**: Enhancements to existing features
- **Documentation**: Documentation updates

<div align="center">
  <img src="./assets/QuickShip-Logo.png" alt="QuickShip CLI Logo" width="200">

  # QuickShip CLI ⚡

  ### Ship production-ready projects in 60 seconds

[![npm version](https://img.shields.io/npm/v/quickship-cli?color=blue)](https://www.npmjs.com/package/quickship-cli)
[![npm downloads](https://img.shields.io/npm/dm/quickship-cli)](https://www.npmjs.com/package/quickship-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)

</div>

Stop wasting hours on boilerplate setup. QuickShip creates production-ready full-stack applications with **TypeScript**, **Tailwind CSS**, **Git**, and more - all configured and ready to code in under 60 seconds.

```bash
npx quickship-cli@latest build my-app
```

---

## ✨ Features

- ⚡ **60-Second Setup** - From zero to coding in under a minute
- 🎨 **Beautiful Interactive CLI** - Professional output with colors, boxes, and progress indicators
- 🚀 **5 Production-Ready Templates** - Next.js, T3 Stack, React + Vite, MERN Stack, Expo React Native
- 📱 **Mobile Development** - Build iOS, Android, and Web apps with Expo React Native
- 📦 **Fully Automated** - Dependencies, Git, TypeScript, Tailwind - all configured
- 🔧 **Latest Versions** - Always uses the latest stable versions of frameworks
- 🌍 **Cross-Platform** - Works on Windows, macOS, and Linux
- 💎 **Zero Configuration** - Sensible defaults, start coding immediately
- 🛠️ **Extensible** - Add features like shadcn/ui, auth, and database with simple commands
- 🏥 **Health Check** - Built-in doctor command to verify your environment
- 📊 **Project Info** - Get detailed information about your project structure
- 🚢 **One-Command Deploy** - Deploy to Vercel, Netlify, Railway, or Render instantly

---

## 🚀 Quick Start

### Using npx (Recommended - No Installation Required)

```bash
npx quickship-cli@latest build my-awesome-app
```

### Global Installation

```bash
npm install -g quickship-cli
quickship build my-awesome-app
```

### Headless Mode (CI/CD)

```bash
# Skip all prompts and use defaults
npx quickship-cli@latest build my-app -y

# Full control with flags
npx quickship-cli@latest build my-app --template nextjs -p npm --no-git -y
```

That's it! Your project is ready to code.

---

## 📋 Available Commands

QuickShip CLI provides a comprehensive set of commands for all your project needs:

### Core Commands

```bash
# Create a new project (interactive)
quickship build [project-name]

# List all available templates
quickship list

# Add features to existing projects
quickship add <feature>
```

### Project Management

```bash
# Show detailed project information
quickship info

# Check project and environment health
quickship doctor

# View detailed template information
quickship templates [--compare]

# Update CLI to latest version
quickship update
```

### Deployment

```bash
# Deploy to production (interactive)
quickship deploy

# Deploy to specific platform
quickship deploy --platform vercel
quickship deploy --platform netlify
quickship deploy --platform railway
quickship deploy --platform render

# Skip confirmations
quickship deploy -y
```

### Configuration

```bash
# Configure CLI settings (coming soon)
quickship config
```

### Get Help

```bash
quickship --help              # Show all commands
quickship build --help        # Show build command options
quickship --version           # Show CLI version
```

---

## 🎯 Available Templates

QuickShip offers **5 production-ready templates** across web and mobile platforms:

### Website Templates

#### 1. 🌐 **Next.js** (Recommended)
Full-stack React framework with server components and API routes.

**Includes:**
- ✅ Next.js 15+ with App Router
- ✅ React 19
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ ESLint + Prettier
- ✅ Optional: shadcn/ui components

**Perfect for:** Full-stack web applications, marketing sites, dashboards

---

#### 2. 🔥 **T3 Stack**
The best way to start a full-stack, type-safe Next.js app.

**Includes:**
- ✅ Next.js 15+ with App Router
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ tRPC (End-to-end type safety)
- ✅ Prisma (Database ORM)
- ✅ NextAuth.js (Authentication)
- ✅ Optional: shadcn/ui components

**Perfect for:** Type-safe full-stack apps with database and auth

---

#### 3. ⚛️ **React + Vite**
Lightning-fast React SPA development.

**Includes:**
- ✅ React 18+
- ✅ Vite 7+ (Blazing fast HMR)
- ✅ TypeScript
- ✅ Tailwind CSS v4 with PostCSS
- ✅ React Router
- ✅ Axios

**Perfect for:** Single-page applications, admin dashboards, client-side apps

---

#### 4. 🗄️ **MERN Stack**
Full-stack MongoDB + Express + React + Node.js application.

**Includes:**

**Backend (Express):**
- ✅ Express.js server
- ✅ MongoDB + Mongoose ODM
- ✅ JWT Authentication
- ✅ bcryptjs password hashing
- ✅ CORS configured
- ✅ Express Validator
- ✅ Nodemon for development

**Frontend (React + Vite):**
- ✅ React + TypeScript
- ✅ Tailwind CSS
- ✅ React Router
- ✅ Axios for API calls

**DevOps:**
- ✅ Concurrently (run both client/server together)
- ✅ Environment variables setup (.env.example)
- ✅ Monorepo structure

**Perfect for:** Full-stack CRUD apps, REST APIs, MongoDB-based projects

---

### Mobile Templates

#### 5. 📱 **Expo React Native** (New!)
Cross-platform mobile app development for iOS, Android, and Web.

**Includes:**
- ✅ Expo SDK 52+ (Latest stable)
- ✅ React Native with TypeScript
- ✅ StyleSheet (React Native's default styling) or NativeWind (Tailwind CSS) - your choice
- ✅ Expo Router (File-based navigation with tabs template)
- ✅ Tab Navigation (Pre-configured) or Blank template
- ✅ Dark Mode Support
- ✅ Hot Reload (Fast Refresh)
- ✅ Runs on iOS, Android, and Web

**Development:**
- ✅ Test on your phone with Expo Go app
- ✅ iOS Simulator support (macOS)
- ✅ Android Emulator support
- ✅ Web browser support

**Perfect for:** Cross-platform mobile apps, MVPs, prototypes, production mobile apps

---

## 📊 Template Comparison

### Website Templates

| Feature | Next.js | T3 Stack | React + Vite | MERN Stack |
|---------|---------|----------|--------------|------------|
| **Framework** | Next.js | Next.js | React | Express + React |
| **Type Safety** | ✅ TypeScript | ✅ TypeScript + tRPC | ✅ TypeScript | ✅ TypeScript |
| **Styling** | Tailwind CSS | Tailwind CSS | Tailwind CSS v4 | Tailwind CSS v4 |
| **Database** | ❌ | ✅ Prisma | ❌ | ✅ MongoDB + Mongoose |
| **Auth** | ❌ | ✅ NextAuth | ❌ | ✅ JWT + bcrypt |
| **API** | Next.js API Routes | tRPC | ❌ | ✅ Express REST API |
| **Deployment** | Vercel, Netlify | Vercel | Netlify, Vercel | VPS, Heroku, AWS |
| **Best For** | Full-stack apps | Type-safe apps | SPAs | REST APIs + MongoDB |

### Mobile Templates

| Feature | Expo React Native |
|---------|-------------------|
| **Framework** | React Native + Expo |
| **Type Safety** | ✅ TypeScript |
| **Styling** | NativeWind (Tailwind CSS) |
| **Navigation** | ✅ Expo Router (File-based) |
| **Platforms** | iOS, Android, Web |
| **Hot Reload** | ✅ Fast Refresh |
| **Deployment** | EAS Build, App Store, Play Store |
| **Best For** | Cross-platform mobile apps |

---

## 📖 Usage

### Create a New Project

#### Interactive Mode (Default)
```bash
npx quickship-cli@latest build
```
Answer a few questions, and QuickShip handles the rest.

#### With Project Name
```bash
npx quickship-cli@latest build my-project
```

#### Headless Mode (Skip All Prompts)
```bash
# Use all defaults
npx quickship-cli@latest build my-project -y

# Specify template
npx quickship-cli@latest build my-project --template nextjs -y

# Full customization
npx quickship-cli@latest build my-project \
  --template vite \
  -p pnpm \
  --no-git \
  --no-install \
  -y
```

#### Available Build Options

```bash
-t, --template <name>     # Template to use (nextjs, vite, t3-stack, mern-stack, expo-react-native)
-p, --package-manager <pm> # Package manager (npm, pnpm, yarn, bun)
-y, --yes                 # Skip prompts and use defaults
--no-git                  # Skip git initialization
--no-install              # Skip dependency installation
-v, --verbose             # Show detailed logs
```

**Examples:**

```bash
# Skip all prompts, use Next.js
npx quickship-cli@latest build my-app -y

# Use Vite with pnpm
npx quickship-cli@latest build my-app --template vite -p pnpm -y

# Create without installing dependencies (for CI/CD)
npx quickship-cli@latest build my-app --no-install -y

# Skip Git initialization
npx quickship-cli@latest build my-app --no-git -y
```

---

### Add Features to Existing Projects

QuickShip can add features to your existing Next.js projects:

```bash
# Add shadcn/ui component library
cd my-nextjs-app
npx quickship-cli@latest add shadcn

# Add NextAuth.js authentication
npx quickship-cli@latest add auth

# Add Prisma database ORM
npx quickship-cli@latest add database
```

**Note:** The `add` command currently supports Next.js projects only.

---

### Check Project Health

Run a comprehensive health check on your project and development environment:

```bash
npx quickship-cli@latest doctor
```

**Checks:**
- ✅ Node.js version
- ✅ Package manager availability
- ✅ Git installation
- ✅ Project structure validity
- ✅ Dependencies status
- ✅ Environment variables
- ✅ TypeScript configuration

**Output:**
- Health score (0-100%)
- Warnings with fixes
- Errors with solutions

---

### View Project Information

Get detailed information about your current project:

```bash
cd my-project
npx quickship-cli@latest info
```

**Shows:**
- 📊 Detected project type
- 📁 Project location
- 📦 Package manager
- 🔧 Node.js version
- ✅ Installed features
- 💡 Available features to add
- 🚀 Quick commands

---

### Browse Templates

View detailed information about all available templates:

```bash
# View all templates
npx quickship-cli@latest templates

# Compare templates side-by-side (coming soon)
npx quickship-cli@latest templates --compare
```

**Shows:**
- Template descriptions
- Full tech stack
- Features included
- Best use cases
- Deployment options
- Popularity metrics
- Create commands

---

### List Templates (Quick View)

Get a quick list of available templates:

```bash
npx quickship-cli@latest list
```

---

### Update CLI

Check for and install the latest version:

```bash
npx quickship-cli@latest update
```

**Features:**
- Checks current vs latest version
- Shows what's new in the latest version
- Interactive update confirmation
- Automatic installation

---

### Deploy Your Project

Deploy your project to production with a single command:

```bash
cd my-project
npx quickship-cli@latest deploy
```

**Interactive Deployment:**

The deploy command will:
1. 🔍 Detect your project type (Next.js, T3 Stack, Vite, MERN)
2. ✅ Validate build setup and dependencies
3. 📦 Suggest best deployment platform for your stack
4. 🔐 Handle authentication with the platform
5. 🔑 Configure environment variables interactively
6. 🚀 Deploy to production
7. 🌐 Show deployment URL and next steps

**Supported Platforms:**

| Platform | Best For | Features |
|----------|----------|----------|
| **Vercel** | Next.js, T3 Stack | Zero-config, automatic CI/CD, edge functions |
| **Netlify** | Vite, Next.js | Fast CDN, instant builds, deploy previews |
| **Railway** | MERN Stack | Full-stack apps, MongoDB support, $5 free credit |
| **Render** | MERN Stack | Free tier, managed databases, auto-deploy from Git |

**Deployment Options:**

```bash
# Deploy to specific platform
quickship deploy --platform vercel

# Skip all prompts
quickship deploy --platform netlify -y

# Skip environment variable setup
quickship deploy --skip-env

# Show detailed logs
quickship deploy --verbose
```

**Platform-Specific Examples:**

```bash
# Next.js to Vercel (recommended)
cd my-nextjs-app
quickship deploy --platform vercel

# Vite to Netlify (recommended)
cd my-vite-app
quickship deploy --platform netlify

# MERN Stack to Railway (recommended)
cd my-mern-app
quickship deploy --platform railway

# T3 Stack to Vercel
cd my-t3-app
quickship deploy --platform vercel
```

**Environment Variables:**

The deploy command automatically:
- ✅ Detects required variables from `.env.example`
- ✅ Prompts for missing values
- ✅ Masks sensitive information
- ✅ Validates critical variables (DATABASE_URL, API keys, etc.)
- ✅ Sets variables on the deployment platform

**What Gets Deployed:**

- **Next.js/T3 Stack**: Full application with API routes, optimized for platform
- **Vite**: Static build from `dist` folder, served via CDN
- **MERN Stack**: Both frontend and backend deployed as separate services

---

## 🎓 Examples

### Create a Next.js App with shadcn/ui

```bash
npx quickship-cli@latest build my-saas-app
# Select: Next.js
# TypeScript: Yes
# Tailwind CSS: Yes
# shadcn/ui: Yes
# Package Manager: pnpm
# Git: Yes

cd my-saas-app
pnpm dev
```

### Create a MERN Stack App

```bash
npx quickship-cli@latest build my-mern-app
# Select: MERN Stack
# TypeScript: Yes
# Tailwind CSS: Yes
# Package Manager: npm
# Git: Yes

cd my-mern-app
# Configure MongoDB
cd server
cp .env.example .env
# Edit .env with your MongoDB URI

# Run both client and server
cd ..
npm run dev
```

**Access:**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

### Create a T3 Stack App

```bash
npx quickship-cli@latest build my-t3-app
# Select: T3 Stack
# Package Manager: pnpm

cd my-t3-app
# Set up environment variables
cp .env.example .env
# Edit .env with database URL, NextAuth secret, etc.

# Push database schema
npx prisma db push

# Run development server
pnpm dev
```

### Create an Expo React Native Mobile App

```bash
npx quickship-cli@latest build my-mobile-app
# Select: 📱 Mobile App
# Stack: Expo React Native
# Expo Template: Tabs (with Expo Router - Recommended)
# Styling: StyleSheet (Expo's default - Recommended)
# Package Manager: npm
# Git: Yes

cd my-mobile-app
npx expo start

# Then:
# - Scan QR code with Expo Go app on your phone
# - Press 'a' for Android emulator
# - Press 'i' for iOS simulator
# - Press 'w' for web browser
```

**Template Options:**
- **Tabs** (Recommended): Includes Expo Router with file-based routing and tab navigation
- **Blank**: Minimal template for custom navigation setup

**Styling Options:**
- **StyleSheet** (Default): React Native's official styling approach
- **NativeWind**: Tailwind CSS for React Native (automatically configured if chosen)

**Access your mobile app:**
- 📱 iOS/Android: Scan QR code with Expo Go app
- 🖥️ iOS Simulator: Press `i` (macOS only)
- 📲 Android Emulator: Press `a` (requires Android Studio)
- 🌐 Web: Press `w` (opens in browser)

**Headless mode for CI/CD:**
```bash
# Tabs template with Expo Router (default)
npx quickship-cli@latest build my-mobile-app \
  --template expo-react-native \
  -p npm \
  -y
```

### Headless CI/CD Example

```bash
# Perfect for automated deployments
npx quickship-cli@latest build production-app \
  --template nextjs \
  -p npm \
  --no-git \
  -y

cd production-app
npm run build
```

### Deploy a Next.js App to Vercel

```bash
# Create the app
npx quickship-cli@latest build my-saas

# Select Next.js, TypeScript, Tailwind CSS
cd my-saas

# Deploy to production
npx quickship-cli@latest deploy

# The CLI will:
# 1. Detect it's a Next.js project
# 2. Recommend Vercel as the platform
# 3. Prompt you to log in to Vercel (opens browser)
# 4. Ask about environment variables
# 5. Deploy to production
# 6. Show you the live URL

# Your app is now live! 🎉
```

### Deploy MERN Stack to Railway

```bash
# Create the app
npx quickship-cli@latest build my-fullstack-app

# Select MERN Stack
cd my-fullstack-app

# Set up MongoDB connection
cd server
cp .env.example .env
# Edit .env with your MongoDB URI

cd ..

# Deploy both client and server
npx quickship-cli@latest deploy --platform railway

# The CLI will:
# 1. Detect MERN Stack structure
# 2. Install Railway CLI if needed
# 3. Prompt for login
# 4. Deploy backend (Express + MongoDB)
# 5. Deploy frontend (React + Vite)
# 6. Show both deployment URLs

# Your full-stack app is now live! 🚀
```

---

## 💻 Requirements

- **Node.js:** 18.0.0 or higher (22.12+ recommended for Vite)
- **npm:** 9.0.0 or higher (or pnpm, yarn, bun)
- **Git:** Any recent version (optional with `--no-git`)
- **MongoDB:** Required for MERN Stack template
- **Operating System:** Windows, macOS, or Linux

---

## 🐛 Troubleshooting

### MERN Stack: MongoDB Connection Error

```bash
cd server
cp .env.example .env
# Edit .env and add your MongoDB URI
```

**Local MongoDB:**
```env
MONGO_URI=mongodb://localhost:27017/my-database
```

**MongoDB Atlas (Cloud):**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
```

Get a free MongoDB Atlas URI: https://www.mongodb.com/cloud/atlas

---

### T3 Stack: Environment Variables

```bash
cp .env.example .env
# Add required variables:
# - DATABASE_URL (PostgreSQL, MySQL, or SQLite)
# - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)
# - NEXTAUTH_URL (http://localhost:3000 for development)
```

---

### Vite: Node.js Version Warning

Vite 7+ requires Node.js 20.19+ or 22.12+. If you see a version warning, upgrade Node.js:

```bash
# Using nvm
nvm install 22
nvm use 22

# Or download from https://nodejs.org
```

---

### "Command not found: quickship"

Use `npx quickship-cli@latest` instead of installing globally.

---

### Permission Errors

Don't use `sudo` with npm. Fix permissions instead:
```bash
# macOS/Linux
sudo chown -R $USER /usr/local/lib/node_modules
```

---

### Deployment Issues

#### Authentication Failed

```bash
# Manually log in to the platform first
npx vercel login
npx netlify login
railway login  # Requires CLI installation

# Then try deploying again
quickship deploy
```

#### Build Fails on Platform

```bash
# Test your build locally first
npm run build

# Check for errors
quickship doctor

# Verify environment variables are set
quickship deploy --verbose
```

#### MERN Stack: Railway CLI Not Found

```bash
# Install Railway CLI globally
npm install -g @railway/cli

# Or let QuickShip install it automatically
quickship deploy --platform railway
# Select "Yes" when prompted to install
```

#### Environment Variables Not Working

```bash
# Make sure .env.example exists with all required vars
# Deploy command will auto-detect and prompt for values

# Or skip env setup and configure manually
quickship deploy --skip-env
```

---

### Get More Help

```bash
# Run the doctor command
npx quickship-cli@latest doctor

# Check the documentation
npx quickship-cli@latest --help

# Open an issue
# https://github.com/SeifElkadyy/QuickShip-CLI/issues
```

---

## 🗺️ Roadmap

### ✅ Completed (v0.9.0)
- ✅ Next.js template with TypeScript & Tailwind
- ✅ React + Vite template
- ✅ T3 Stack template (Next.js + tRPC + Prisma + NextAuth)
- ✅ MERN Stack template (MongoDB + Express + React + Node.js)
- ✅ shadcn/ui integration
- ✅ Package manager choice (npm, pnpm, yarn, bun)
- ✅ `quickship add` command (shadcn, auth, database)
- ✅ `quickship doctor` - Health check command
- ✅ `quickship info` - Project information command
- ✅ `quickship templates` - Detailed template browser
- ✅ `quickship update` - CLI updater
- ✅ Headless mode with `-y` flag
- ✅ `--no-install` and `--no-git` flags
- ✅ Enhanced logger with professional output
- ✅ **`quickship deploy` - One-command deployment** 🎉
  - ✅ Vercel integration (Next.js, T3 Stack, Vite)
  - ✅ Netlify integration (Vite, Next.js)
  - ✅ Railway integration (MERN Stack)
  - ✅ Render integration (MERN Stack)
  - ✅ Environment variable management
  - ✅ Auto-detection of project type
  - ✅ Platform authentication handling
  - ✅ Pre-deployment validation

### ✅ Phase 2 Complete (v0.10.0)
- ✅ **📱 Expo React Native template** - Cross-platform mobile development
- ✅ Mobile platform selection in CLI
- ✅ NativeWind (Tailwind CSS for React Native) integration
- ✅ Expo Router with tab navigation
- ✅ TypeScript support for mobile apps
- ✅ iOS, Android, and Web support

### 🚀 Coming Soon (v0.11.0+)
- 🔜 Environment variable encryption for teams
- 🔜 Component generator (`quickship generate component`)
- 🔜 Custom template creation and sharing
- 🔜 More styling options (Emotion, CSS-in-JS)
- 🔜 Database integrations (Supabase, Planetscale)
- 🔜 Auth provider integrations (Clerk, Auth0)
- 🔜 Astro template (static sites, blogs)
- 🔜 SvelteKit template
- 🔜 Remix template
- 🔜 Template marketplace

### 🌟 Future (v1.0.0+)
- 🧩 Browser extension templates
- 🖥️ Electron/Tauri desktop app templates
- 🎨 Visual template selector
- 👥 Team collaboration features
- 🔌 Plugin system

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with amazing open-source tools:
- [Commander.js](https://github.com/tj/commander.js) - CLI framework
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) - Interactive prompts
- [Chalk](https://github.com/chalk/chalk) - Terminal styling
- [Ora](https://github.com/sindresorhus/ora) - Elegant terminal spinners
- [Boxen](https://github.com/sindresorhus/boxen) - Terminal boxes
- [execa](https://github.com/sindresorhus/execa) - Process execution

Inspired by create-next-app, create-t3-app, create-vite, and the MERN community.

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/SeifElkadyy/QuickShip-CLI/issues)
- **Discussions:** [GitHub Discussions](https://github.com/SeifElkadyy/QuickShip-CLI/discussions)
- **Documentation:** [GitHub README](https://github.com/SeifElkadyy/QuickShip-CLI#readme)

---

## ⭐ Show Your Support

If QuickShip saves you time, give it a ⭐ on [GitHub](https://github.com/SeifElkadyy/QuickShip-CLI)!

---

**Built with ❤️ for developers who want to ship fast**

**Version:** 0.8.13 | **License:** MIT

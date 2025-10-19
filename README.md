<div align="center">
  <img src="./assets/QuickShip-Logo.png" alt="QuickShip CLI Logo" width="200">

  # QuickShip CLI ⚡

  ### Ship production-ready projects in 60 seconds

[![npm version](https://img.shields.io/npm/v/quickship-cli?color=blue&style=flat-square)](https://www.npmjs.com/package/quickship-cli)
[![npm downloads](https://img.shields.io/npm/dm/quickship-cli?style=flat-square)](https://www.npmjs.com/package/quickship-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?style=flat-square)](https://nodejs.org)

**Stop wasting hours on boilerplate.** Create production-ready web and mobile apps with TypeScript, Tailwind CSS, and modern tooling - fully configured in under 60 seconds.

[Getting Started](#-quick-start) • [Templates](#-templates) • [Deploy](#-deployment) • [Documentation](#-documentation)

</div>

---

## ⚡ Quick Start

```bash
npx quickship-cli@latest build my-app
```

That's it! Your production-ready project is created, configured, and ready to code.

**What you get:**
- ✅ TypeScript configured
- ✅ Tailwind CSS ready
- ✅ Git initialized
- ✅ Dependencies installed
- ✅ ESLint + Prettier setup
- ✅ Development server ready

---

## 🎯 Why QuickShip?

| Traditional Setup | With QuickShip |
|-------------------|----------------|
| ❌ 30-60 minutes setup | ✅ **60 seconds** |
| ❌ Manual configuration | ✅ **Fully automated** |
| ❌ Version conflicts | ✅ **Latest stable versions** |
| ❌ Missing best practices | ✅ **Production-ready** |
| ❌ Complex deployment | ✅ **One command deploy** |

---

## 🚀 Templates

Choose from **5 production-ready templates** for web and mobile:

### 🌐 Web Development

#### Next.js (Recommended)
Full-stack React framework with server components and API routes.
```bash
npx quickship-cli@latest build my-app --template nextjs -y
```
**Stack:** Next.js 15+ • React 19 • TypeScript • Tailwind CSS • App Router

#### T3 Stack
Type-safe full-stack with tRPC, Prisma, and NextAuth.
```bash
npx quickship-cli@latest build my-app --template t3-stack -y
```
**Stack:** Next.js • tRPC • Prisma • NextAuth • TypeScript • Tailwind CSS

#### React + Vite
Lightning-fast React SPA development.
```bash
npx quickship-cli@latest build my-app --template react-vite -y
```
**Stack:** React 18+ • Vite 7+ • TypeScript • Tailwind CSS v4 • React Router

#### MERN Stack
Full-stack with MongoDB, Express, React, and Node.js.
```bash
npx quickship-cli@latest build my-app --template mern-stack -y
```
**Stack:** MongoDB • Express • React • Node.js • TypeScript • Tailwind CSS

### 📱 Mobile Development

#### Expo React Native
Cross-platform mobile apps for iOS, Android, and Web.
```bash
npx quickship-cli@latest build my-app --template expo-react-native -y
```
**Stack:** Expo SDK 52+ • React Native • TypeScript • Expo Router • StyleSheet/NativeWind

**Features:**
- 📂 Tabs or Blank template
- 🎨 StyleSheet (default) or NativeWind (Tailwind CSS)
- 🧭 File-based routing with Expo Router
- 📱 Test instantly with Expo Go
- 🌐 Runs on iOS, Android, and Web

---

## 📦 Installation

### npx (Recommended)
No installation needed:
```bash
npx quickship-cli@latest build my-app
```

### Global Install
```bash
npm install -g quickship-cli
quickship build my-app
```

### Headless Mode (CI/CD)
```bash
# Use defaults
quickship build my-app -y

# Full control
quickship build my-app --template nextjs -p pnpm --no-git -y
```

---

## 🛠️ Commands

### Core

```bash
quickship build [name]       # Create new project
quickship list               # List templates
quickship add <feature>      # Add features (shadcn, auth, etc.)
```

### Project Management

```bash
quickship info               # Show project details
quickship doctor             # Health check
quickship templates          # View all templates
quickship update             # Update CLI
```

### Deployment

```bash
quickship deploy             # Deploy to production
quickship deploy --platform vercel
quickship deploy --platform netlify
quickship deploy --platform railway
quickship deploy --platform render
```

---

## 🚢 Deployment

Deploy your project with a single command:

```bash
cd my-app
quickship deploy
```

**Supported Platforms:**

| Platform | Best For | Features |
|----------|----------|----------|
| **Vercel** | Next.js, T3 Stack | Zero-config, Edge functions, CI/CD |
| **Netlify** | Vite, Next.js | Fast CDN, Deploy previews, Forms |
| **Railway** | MERN Stack | MongoDB support, $5 free credit |
| **Render** | MERN Stack | Free tier, Managed databases |

**What it does:**
- 🔍 Auto-detects your project type
- ✅ Validates build setup
- 🔐 Handles platform authentication
- 🔑 Manages environment variables
- 🚀 Deploys to production
- 🌐 Returns live URL

---

## ✨ Features

### 🎨 Add Features Post-Creation

Enhance your Next.js projects:

```bash
cd my-app

# Add shadcn/ui components
quickship add shadcn

# Add NextAuth.js (coming soon)
quickship add auth

# Add Prisma database (coming soon)
quickship add database
```

### 🏥 Health Check

Verify your environment and project setup:

```bash
quickship doctor
```

Checks:
- Node.js version
- Package managers
- Git installation
- Project structure
- Dependencies
- Environment variables
- TypeScript config

### 📊 Project Info

Get detailed project information:

```bash
quickship info
```

Shows:
- Project type
- Tech stack
- Available commands
- Features to add

---

## 📚 Examples

### Next.js App with shadcn/ui

```bash
# Create project
npx quickship-cli@latest build my-saas

# Select Next.js, TypeScript, Tailwind, shadcn/ui
# Then:
cd my-saas
npm run dev
```

### MERN Stack App

```bash
# Create project
npx quickship-cli@latest build my-api

# Configure MongoDB
cd my-api/server
cp .env.example .env
# Edit .env with MongoDB URI

# Run both client and server
cd ..
npm run dev
```

### Expo Mobile App

```bash
# Create project
npx quickship-cli@latest build my-mobile-app

# Select Mobile, Tabs template, StyleSheet
cd my-mobile-app
npx expo start

# Scan QR code with Expo Go app
```

### Deploy to Vercel

```bash
# Create and deploy
npx quickship-cli@latest build my-next-app
cd my-next-app
quickship deploy --platform vercel
```

---

## 🎯 Comparison

| Feature | QuickShip | create-next-app | create-vite | create-expo-app |
|---------|-----------|-----------------|-------------|-----------------|
| **Web Templates** | ✅ 4 templates | ✅ 1 | ✅ Many | ❌ |
| **Mobile Templates** | ✅ Expo | ❌ | ❌ | ✅ 1 |
| **TypeScript** | ✅ Default | ✅ Optional | ✅ Optional | ✅ Optional |
| **Tailwind CSS** | ✅ Pre-configured | ❌ Manual | ❌ Manual | ❌ Manual |
| **Deployment** | ✅ One command | ❌ Manual | ❌ Manual | ❌ Manual |
| **Add Features** | ✅ CLI commands | ❌ Manual | ❌ Manual | ❌ Manual |
| **Health Check** | ✅ Built-in | ❌ | ❌ | ❌ |
| **Project Info** | ✅ Built-in | ❌ | ❌ | ❌ |

---

## 💻 Requirements

- **Node.js:** 18.0.0 or higher
- **npm:** 9.0.0 or higher (or pnpm, yarn, bun)
- **Git:** Any recent version (optional)
- **OS:** Windows, macOS, or Linux

---

## 🗺️ Roadmap

### ✅ Released (v0.10)
- ✅ Next.js, Vite, T3 Stack, MERN templates
- ✅ Expo React Native mobile development
- ✅ shadcn/ui integration
- ✅ One-command deployment (Vercel, Netlify, Railway, Render)
- ✅ Health check and project info
- ✅ Headless mode for CI/CD

### 🚀 Coming Soon (v0.11+)
- 🔜 More Expo templates (drawer, stack navigation)
- 🔜 Supabase integration
- 🔜 Component generator
- 🔜 Auth provider integrations (Clerk, Auth0)
- 🔜 Database integrations (PlanetScale, Supabase)
- 🔜 Astro, SvelteKit, Remix templates

### 🌟 Future (v1.0+)
- Browser extension templates
- Desktop app templates (Electron, Tauri)
- Visual project builder
- Custom template marketplace
- Team collaboration features

---

## 🤝 Contributing

Contributions are welcome! Please see our [Contributing Guide](CONTRIBUTING.md).

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with these amazing tools:
- [Commander.js](https://github.com/tj/commander.js) - CLI framework
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) - Interactive prompts
- [Chalk](https://github.com/chalk/chalk) - Terminal styling
- [Ora](https://github.com/sindresorhus/ora) - Spinners
- [Boxen](https://github.com/sindresorhus/boxen) - Boxes
- [execa](https://github.com/sindresorhus/execa) - Process execution

Inspired by create-next-app, create-t3-app, create-vite, and create-expo-app.

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/SeifElkadyy/QuickShip-CLI/issues)
- **Discussions:** [GitHub Discussions](https://github.com/SeifElkadyy/QuickShip-CLI/discussions)
- **NPM:** [npmjs.com/package/quickship-cli](https://www.npmjs.com/package/quickship-cli)

---

## ⭐ Show Your Support

If QuickShip saves you time, give it a ⭐ on [GitHub](https://github.com/SeifElkadyy/QuickShip-CLI)!

---

<div align="center">

**Built with ❤️ for developers who want to ship fast**

[Get Started](#-quick-start) • [View Templates](#-templates) • [Deploy](#-deployment)

</div>

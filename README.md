<div align="center">
  <img src="assets/logo.png" alt="QuickShip CLI Logo" width="200">

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
- 🎨 **Beautiful Interactive CLI** - Colorful prompts, spinners, and progress feedback
- 🚀 **4 Production-Ready Templates** - Next.js, T3 Stack, React + Vite, MERN Stack
- 📦 **Fully Automated** - Dependencies, Git, TypeScript, Tailwind - all configured
- 🔧 **Latest Versions** - Always uses the latest stable versions of frameworks
- 🌍 **Cross-Platform** - Works on Windows, macOS, and Linux
- 💎 **Zero Configuration** - Sensible defaults, start coding immediately

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

That's it! Your project is ready to code.

---

## 🎯 Available Templates

QuickShip offers **4 production-ready templates** to choose from:

### 1. 🌐 **Next.js** (Recommended)
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

### 2. 🔥 **T3 Stack**
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

### 3. ⚛️ **React + Vite**
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

### 4. 🗄️ **MERN Stack**
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

## 📊 Template Comparison

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

---

## 📖 Usage

### Create a New Project

**Interactive Mode:**
```bash
npx quickship-cli@latest build
```
Answer a few questions, and QuickShip handles the rest.

**With Project Name:**
```bash
npx quickship-cli@latest build my-project
```

**With Options:**
```bash
# Choose package manager
npx quickship-cli@latest build my-project -p pnpm

# Skip Git initialization
npx quickship-cli@latest build my-project --no-git

# Skip dependency installation
npx quickship-cli@latest build my-project --no-install

# Verbose output
npx quickship-cli@latest build my-project -v
```

---

### Add Features to Existing Projects

```bash
# Add shadcn/ui to Next.js projects
npx quickship-cli@latest add shadcn

# Add NextAuth.js (Coming Soon)
npx quickship-cli@latest add auth

# Add Prisma database (Coming Soon)
npx quickship-cli@latest add database
```

---

### List Available Templates

```bash
npx quickship-cli@latest list
```

---

### Get Help

```bash
npx quickship-cli@latest --help
npx quickship-cli@latest build --help
```

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

For more help, open an issue on [GitHub](https://github.com/SeifElkadyy/QuickShip-CLI/issues).

---

## 🗺️ Roadmap

### ✅ Completed (v0.7.x)
- ✅ Next.js template with TypeScript & Tailwind
- ✅ React + Vite template
- ✅ T3 Stack template (Next.js + tRPC + Prisma + NextAuth)
- ✅ MERN Stack template (MongoDB + Express + React + Node.js)
- ✅ shadcn/ui integration
- ✅ Package manager choice (npm, pnpm, yarn, bun)
- ✅ `quickship add` command for extensibility

### 🚀 Coming Soon (v0.8.0+)
- 🔜 More `quickship add` features (auth, database, payments)
- 🔜 Astro template (static sites, blogs)
- 🔜 SvelteKit template
- 🔜 Remix template
- 🔜 Automated deployment commands
- 🔜 Custom template creation

### 🌟 Future (v1.0.0+)
- 🧩 Browser extension templates
- 📱 React Native + Expo templates
- 🖥️ Electron/Tauri desktop app templates
- 🎨 Template marketplace
- 👥 Team collaboration features

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
- **Twitter:** [@YourTwitter](https://twitter.com/YourTwitter)

---

## ⭐ Show Your Support

If QuickShip saves you time, give it a ⭐ on [GitHub](https://github.com/SeifElkadyy/QuickShip-CLI)!

---

**Built with ❤️ for developers who want to ship fast**

**Version:** 0.7.1 | **License:** MIT

# QuickShip CLI

> Ship production-ready projects in 60 seconds ⚡

[![npm version](https://img.shields.io/badge/npm-v0.1.0-blue)](https://www.npmjs.com/package/quickship-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)

Stop wasting hours on boilerplate setup. QuickShip creates production-ready Next.js projects with TypeScript, Tailwind CSS, Git, and more - all configured and ready to code in under 60 seconds.

---

## ✨ Features

- ⚡ **60-Second Setup:** From zero to coding in under a minute
- 🎨 **Beautiful CLI:** Interactive prompts with colored output and spinners
- 📦 **Production Ready:** TypeScript, Tailwind CSS, ESLint, Prettier included
- 🔧 **Fully Automated:** Git init, dependencies, configuration - all handled
- 💻 **Next.js 14:** Latest Next.js with App Router
- 🌍 **Cross-Platform:** Works on Windows, macOS, and Linux
- ✅ **No Configuration:** Sensible defaults, start coding immediately

---

## 🚀 Quick Start

### Using npx (Recommended - No Installation)

```bash
npx quickship-cli build my-awesome-app
```

### Global Installation

```bash
npm install -g quickship-cli
quickship build my-awesome-app
```

That's it! Your project is ready.

---

## 📖 Usage

### Create a New Project

**Interactive Mode:**
```bash
npx quickship-cli build
```

Answer a few questions, and QuickShip handles the rest.

**With Project Name:**
```bash
npx quickship-cli build my-project
```

**Skip Options:**
```bash
# Skip Git initialization
npx quickship-cli build my-project --no-git

# Skip dependency installation
npx quickship-cli build my-project --no-install

# Both
npx quickship-cli build my-project --no-git --no-install
```

**Verbose Mode:**
```bash
npx quickship-cli build my-project -v
```

### List Available Templates

```bash
npx quickship-cli list
```

### Get Help

```bash
npx quickship-cli --help
npx quickship-cli build --help
```

---

## 🎯 What You Get

When you run `quickship build`, you get a complete Next.js project with:

✅ **Next.js 14** with App Router
✅ **TypeScript** configured
✅ **Tailwind CSS** ready to use
✅ **ESLint** for code quality
✅ **Prettier** for formatting
✅ **Git** repository initialized
✅ **README.md** with project info
✅ **.gitignore** with sensible defaults
✅ **Dependencies** installed
✅ **Ready to run** `npm run dev`

**Total setup time:** < 60 seconds

---

## 🛠️ Available Templates

### Website Templates

| Template | Description | Status |
|----------|-------------|--------|
| ⭐ **Next.js + TypeScript + Tailwind** | Modern Next.js with TypeScript and Tailwind CSS | ✅ Available |
| React + Vite | Fast React setup with Vite | 🔜 Coming Soon |
| MERN Stack | MongoDB, Express, React, Node.js | 🔜 Coming Soon |

### Coming Soon
- 🧩 Browser Extensions (Chrome, Firefox)
- 📱 Mobile Apps (React Native + Expo)
- ⚡ API/Backend (Express, Fastify, NestJS)
- 🖥️ Desktop Apps (Electron, Tauri)

---

## 📚 Documentation

- [CHANGELOG.md](CHANGELOG.md) - Version history and release notes
- [LICENSE](LICENSE) - MIT License

---

## 💻 Requirements

- **Node.js:** 18.0.0 or higher
- **npm:** 9.0.0 or higher
- **Git:** Any recent version (for Git integration)
- **Operating System:** Windows, macOS, or Linux

---

## 🐛 Troubleshooting

### "Command not found: quickship"

If using npx, no installation needed. If globally installed, make sure npm global bin is in your PATH.

### "Permission denied"

Try running without sudo. If you need to change directory permissions, use chmod.

### "Git not found"

Install Git from [git-scm.com](https://git-scm.com) or use `--no-git` flag.

### "Network error"

Check your internet connection. Template cloning requires network access.

For more help, open an issue on GitHub.

---

## 🗺️ Roadmap

### v0.2.0 - Pro Features (Coming Soon)
- GitHub OAuth integration
- Automated deployment (Vercel/Netlify)
- Database setup (Supabase, MongoDB)
- Authentication providers (Clerk, NextAuth)

### v0.3.0 - Platform Expansion
- React + Vite template
- Browser extension templates
- Mobile app templates

### v0.4.0 - Advanced Features
- Custom template creation
- Template marketplace
- Team collaboration features

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with amazing open-source tools:
- [Commander.js](https://github.com/tj/commander.js) - CLI framework
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) - Interactive prompts
- [Chalk](https://github.com/chalk/chalk) - Terminal styling
- [degit](https://github.com/Rich-Harris/degit) - Template cloning

Inspired by create-next-app, create-t3-app, and create-react-app.

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/yourusername/quickship-cli/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/quickship-cli/discussions)

---

**Built with ❤️ for developers who want to ship fast**

**Version:** 0.1.0 | **License:** MIT
# QuickShip-CLI

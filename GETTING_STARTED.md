# Getting Started with QuickShip CLI Development

## 🎯 Your Mission
Build QuickShip CLI - a universal project generator that helps developers ship production-ready projects in under 60 seconds.

---

## 📋 Prerequisites

Before you begin, ensure you have:

- [ ] **Node.js 18+** installed ([Download](https://nodejs.org))
- [ ] **Git** installed ([Download](https://git-scm.com))
- [ ] **npm** (comes with Node.js)
- [ ] **Code editor** (VS Code recommended)
- [ ] **Terminal/Command Line** access
- [ ] **GitHub account** for template repositories

Check your installations:
```bash
node --version  # Should be v18 or higher
npm --version   # Should be v9 or higher
git --version   # Any recent version
```

---

## 🚀 Day 1: Project Setup (2-3 hours)

### Step 1: Create Project Structure (15 minutes)

```bash
# Navigate to your projects directory
cd /mnt/c/Projects

# Verify you're in QuickShip-CLI directory
pwd

# Initialize npm project
npm init -y

# Create folder structure
mkdir -p bin
mkdir -p src/{commands,core,prompts,integrations/{github,deployment},utils,config}
mkdir -p tests/{unit,integration}
mkdir -p docs

# Verify structure
ls -R
```

### Step 2: Install Dependencies (10 minutes)

```bash
# Core dependencies
npm install commander inquirer chalk ora boxen fs-extra degit execa validate-npm-package-name conf simple-git

# Development dependencies
npm install --save-dev eslint prettier jest

# Verify installation
npm list --depth=0
```

### Step 3: Configure Tools (20 minutes)

**Create `.eslintrc.js`:**
```bash
cat > .eslintrc.js << 'EOF'
module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'no-console': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
};
EOF
```

**Create `.prettierrc`:**
```bash
cat > .prettierrc << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
EOF
```

**Create `.gitignore`:**
```bash
cat > .gitignore << 'EOF'
node_modules/
dist/
.env
.DS_Store
*.log
coverage/
.vscode/
.idea/
EOF
```

**Create `jest.config.js`:**
```bash
cat > jest.config.js << 'EOF'
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.js'],
  testMatch: ['**/tests/**/*.test.js'],
};
EOF
```

### Step 4: Update package.json (15 minutes)

Open `package.json` and replace the contents:

```json
{
  "name": "quickship-cli",
  "version": "0.1.0",
  "description": "Universal project generator - ship projects in 60 seconds",
  "main": "src/index.js",
  "bin": {
    "quickship": "./bin/index.js"
  },
  "scripts": {
    "dev": "node bin/index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/**/*.js",
    "lint:fix": "eslint src/**/*.js --fix",
    "format": "prettier --write \"src/**/*.js\" \"bin/**/*.js\"",
    "format:check": "prettier --check \"src/**/*.js\" \"bin/**/*.js\""
  },
  "keywords": [
    "cli",
    "generator",
    "nextjs",
    "react",
    "boilerplate",
    "template",
    "quickship",
    "scaffold",
    "project-generator"
  ],
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "engines": {
    "node": ">=18.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/quickship-cli.git"
  },
  "bugs": {
    "url": "https://github.com/yourusername/quickship-cli/issues"
  },
  "homepage": "https://quickship.dev"
}
```

### Step 5: Initialize Git (10 minutes)

```bash
git init
git add .
git commit -m "chore: initial project setup

- Set up npm project structure
- Configure ESLint and Prettier
- Add Jest for testing
- Create folder structure for CLI
"
```

### Step 6: Create Entry Point (30 minutes)

**Create `bin/index.js`:**

```bash
cat > bin/index.js << 'EOF'
#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const packageJson = require('../package.json');

const program = new Command();

program
  .name('quickship')
  .description('Universal project generator - ship projects in 60 seconds')
  .version(packageJson.version);

// Build command
program
  .command('build [project-name]')
  .description('Create a new project')
  .option('-t, --template <name>', 'template to use')
  .option('-y, --yes', 'skip prompts and use defaults')
  .option('--no-git', 'skip git initialization')
  .option('--no-install', 'skip dependency installation')
  .option('-v, --verbose', 'show detailed logs')
  .action((projectName, options) => {
    const buildCommand = require('../src/commands/build');
    buildCommand(projectName, options);
  });

// List command
program
  .command('list')
  .description('List available templates')
  .action(() => {
    const listCommand = require('../src/commands/list');
    listCommand();
  });

// Config command
program
  .command('config')
  .description('Configure CLI settings')
  .action(() => {
    console.log(chalk.blue('Config command coming soon...'));
  });

program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
EOF
```

Make it executable:
```bash
chmod +x bin/index.js
```

### Step 7: Test Your Setup (10 minutes)

```bash
# Test the CLI
node bin/index.js --help

# Should show:
# Usage: quickship [options] [command]
# ...

# Test with build command
node bin/index.js build --help
```

If you see the help output, congratulations! Your CLI is set up correctly.

### Step 8: Commit Your Progress

```bash
git add .
git commit -m "feat: create CLI entry point with basic commands

- Add bin/index.js with commander setup
- Define build, list, and config commands
- Add help documentation
"
```

---

## ✅ Day 1 Complete!

You've successfully:
- ✅ Set up project structure
- ✅ Installed dependencies
- ✅ Configured development tools
- ✅ Created CLI entry point
- ✅ Tested basic functionality

**Time spent:** ~2-3 hours
**Lines of code:** ~100

---

## 📅 What's Next?

### Day 2-3: Build Utilities & Prompts

Tomorrow, you'll create:
1. **Logger utility** - Beautiful colored console output
2. **Spinner utility** - Loading indicators
3. **Validator utility** - Input validation
4. **Platform selector** - Interactive menu
5. **Website prompts** - Configuration questions

Estimated time: 4-6 hours

### Day 4-6: Core Engine

Next, you'll build:
1. **Template manager** - Clone templates from GitHub
2. **Dependency installer** - Install npm packages
3. **File generator** - Create/update files
4. **Build command** - Orchestrate the entire process

Estimated time: 8-10 hours

---

## 💡 Pro Tips

1. **Test frequently**: After each step, run your CLI to make sure it works

2. **Commit often**: Small, atomic commits help track progress and fix bugs

3. **Read the errors**: Error messages usually tell you exactly what's wrong

4. **Use the roadmap**: Refer to `IMPLEMENTATION_ROADMAP.md` for detailed code

5. **Don't skip steps**: Each step builds on the previous one

6. **Ask for help**: If stuck, check documentation or ask ChatGPT/Claude

7. **Take breaks**: Step away if you're stuck, fresh eyes help

---

## 🐛 Troubleshooting

### "command not found: quickship"

You haven't linked the package yet. Use:
```bash
node bin/index.js
```

Or link it globally (later):
```bash
npm link
```

### "Cannot find module 'commander'"

Dependencies not installed. Run:
```bash
npm install
```

### "Permission denied"

Make the file executable:
```bash
chmod +x bin/index.js
```

### "SyntaxError: Unexpected token"

Check Node.js version:
```bash
node --version  # Should be v18+
```

---

## 📚 Resources

### Documentation
- [Commander.js Docs](https://github.com/tj/commander.js)
- [Inquirer.js Docs](https://github.com/SBoudrias/Inquirer.js)
- [Node.js Docs](https://nodejs.org/docs)

### Learning
- [How to Build a CLI](https://www.twilio.com/blog/how-to-build-a-cli-with-node-js)
- [Node.js CLI Best Practices](https://github.com/lirantal/nodejs-cli-apps-best-practices)

### Inspiration
- [create-next-app source](https://github.com/vercel/next.js/tree/canary/packages/create-next-app)
- [create-t3-app source](https://github.com/t3-oss/create-t3-app)

---

## 🎯 Your Goal for Week 1

By the end of Week 1, you should have:
- ✅ Working CLI that accepts commands
- ✅ Interactive prompts for user input
- ✅ Basic template cloning working
- ✅ File generation system functional
- ✅ First successful project created

**You can do this!** 🚀

Start with Day 1, then move to Day 2 in the `IMPLEMENTATION_ROADMAP.md`.

---

Need help? Check the roadmap or revisit the main documentation.

Happy coding! 💻

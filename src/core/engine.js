import { resolve } from 'path';
import { pathExists, remove } from 'fs-extra';
import { Listr } from 'listr2';
import { execa } from 'execa';
import { confirm, isCancel } from '@clack/prompts';
import ci from 'ci-info';
import TemplateManager from './template-manager.js';
import DependencyInstaller from './dependency-installer.js';
import FileGenerator from './file-generator.js';
import GitManager from '../integrations/github/git-manager.js';
import logger from '../utils/logger.js';
import validator from '../utils/validator.js';

class Engine {
  constructor(config, options = {}) {
    this.config = config;
    this.options = options;
    this.projectPath = resolve(process.cwd(), config.projectName);

    this.templateManager = new TemplateManager();
    this.dependencyInstaller = new DependencyInstaller(
      config.packageManager || 'npm'
    );
    this.fileGenerator = new FileGenerator();

    this._sigintHandler = async () => {
      try {
        if (await pathExists(this.projectPath)) {
          await remove(this.projectPath);
          process.stdout.write(
            `\n  Cleaned up partial project at ${this.projectPath}\n`
          );
        }
      } catch {
        /* best effort */
      }
      process.exit(130);
    };
    process.on('SIGINT', this._sigintHandler);
    process.on('SIGTERM', this._sigintHandler);
  }

  async build() {
    // Validate before showing the task list so errors surface cleanly
    await this.validatePath();

    const templateName = this.templateManager.determineTemplate(this.config);
    const template = this.templateManager.getTemplate(templateName);
    const toolsWithAutoInstall =
      template.useCreateNextApp ||
      template.useCreateT3App ||
      template.useCreateVite ||
      template.useManualScaffold;

    const tasks = new Listr(
      [
        {
          title: `Scaffold project — ${templateName}`,
          task: async () => {
            await this.templateManager.cloneTemplate(
              templateName,
              this.projectPath,
              this.config,
              this.options
            );
          },
        },
        {
          title: 'Generate project files',
          enabled: () => !toolsWithAutoInstall,
          task: async () => {
            await this.fileGenerator.updatePackageJson(
              this.projectPath,
              this.config
            );
            await this.fileGenerator.generateReadme(
              this.projectPath,
              this.config
            );
            await this.fileGenerator.generateGitignore(this.projectPath);
          },
        },
        {
          title: 'Install dependencies',
          enabled: () =>
            !toolsWithAutoInstall && this.options.install !== false,
          task: async () => {
            await this.dependencyInstaller.install(this.projectPath);
          },
        },
        {
          title: 'Initialize shadcn/ui',
          enabled: () => !!this.config.shadcn && this.options.install !== false,
          task: async () => {
            await this.templateManager.initShadcn(this.projectPath);
          },
        },
        {
          title: 'Initialize Git repository',
          enabled: () => this.options.git !== false && !!this.config.git,
          task: async (ctx, task) => {
            const gitManager = new GitManager(this.projectPath);
            const isGitAvailable = await gitManager.isGitInstalled();
            if (!isGitAvailable) {
              task.skip('Git not installed');
              return;
            }
            await gitManager.init();
            await gitManager.createInitialCommit();
          },
        },
      ],
      {
        rendererOptions: {
          showTimer: true,
          collapseErrors: false,
        },
        exitOnError: false,
      }
    );

    try {
      await tasks.run();
      process.removeListener('SIGINT', this._sigintHandler);
      process.removeListener('SIGTERM', this._sigintHandler);
      this.showSuccessMessage();
      await this._offerOpenEditor();
    } catch (error) {
      process.removeListener('SIGINT', this._sigintHandler);
      process.removeListener('SIGTERM', this._sigintHandler);
      logger.error('Failed to create project');
      throw error;
    }
  }

  async validatePath() {
    const nameValidation = validator.validateProjectName(
      this.config.projectName
    );
    if (!nameValidation.valid) {
      throw new Error(
        `Invalid project name: ${nameValidation.errors.join(', ')}`
      );
    }

    const cwd = resolve(process.cwd());
    if (!this.projectPath.startsWith(cwd + '/') && this.projectPath !== cwd) {
      throw new Error('Invalid project name: path traversal detected');
    }

    const exists = await pathExists(this.projectPath);
    if (exists) {
      throw new Error(`Directory ${this.projectPath} already exists`);
    }
  }

  showSuccessMessage() {
    const pm = this.config.packageManager || 'npm';
    const runCommand = this.getRunCommand(pm);
    const stack = this.config.stack;

    // Base message
    let message = `
🎉 Success! Your project is ready!

📁 Location: ${this.projectPath}
`;

    // Add stack-specific instructions
    if (stack === 'mern-stack') {
      message += `
⚠️  IMPORTANT: Configure MongoDB before running

1. Set up environment variables:
   cd ${this.config.projectName}/server
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret

2. Make sure MongoDB is installed and running:
   - Local: mongod
   - Cloud: Get free URI from https://www.mongodb.com/cloud/atlas

Next steps:
  cd ${this.config.projectName}
  ${runCommand} dev

Your app will be running at:
  Frontend: http://localhost:5173
  Backend:  http://localhost:5000
`;
    } else if (stack === 't3-stack') {
      message += `
⚠️  IMPORTANT: Configure environment variables

1. Set up your .env file:
   cd ${this.config.projectName}
   cp .env.example .env
   # Add your database URL, NextAuth secret, etc.

2. Set up your database with Prisma:
   npx prisma db push

Next steps:
  cd ${this.config.projectName}
  ${runCommand} dev

Your app will be running at: http://localhost:3000
`;
    } else if (stack === 'expo-react-native') {
      const expoTemplate = this.config.expoTemplate || 'tabs';
      const styling = this.config.nativewind
        ? 'NativeWind (Tailwind CSS)'
        : 'StyleSheet (React Native default)';
      message += `
📱 Mobile App Ready!
${expoTemplate === 'tabs' ? '📂 Template: Tabs (with Expo Router file-based routing)\n' : '📂 Template: Blank (minimal)\n'}🎨 Styling: ${styling}

Next steps:
  cd ${this.config.projectName}
  npx expo start

Scan the QR code with:
  • Expo Go app (iOS/Android)
  • Camera app (iOS only)

Or press:
  • a - Open on Android emulator
  • i - Open on iOS simulator
  • w - Open in web browser

${this.config.nativewind ? '✨ NativeWind (Tailwind CSS) is configured and ready!\n' : ''}${expoTemplate === 'tabs' ? '🧭 Expo Router is ready for file-based navigation!\n' : ''}
Your cross-platform mobile app will run on iOS, Android, and Web!
`;
    } else if (stack === 'express-api') {
      const dbName = this.config.database.startsWith('postgresql')
        ? 'PostgreSQL'
        : this.config.database.startsWith('mongodb')
          ? 'MongoDB'
          : this.config.database.startsWith('sqlite')
            ? 'SQLite'
            : 'None';
      message += `
🔌 Express API Ready!
${this.config.database !== 'none' ? `💾 Database: ${dbName}\n` : ''}${this.config.includeAuth ? '🔐 Auth: JWT Authentication\n' : ''}${this.config.includeSwagger ? '📚 Docs: Swagger/OpenAPI\n' : ''}${this.config.includeDocker ? '🐳 Docker: Ready to containerize\n' : ''}

${
  this.config.database === 'postgresql-prisma' ||
  this.config.database === 'mongodb-mongoose'
    ? `⚠️  IMPORTANT: Configure your database before running

1. Set up environment variables:
   cd ${this.config.projectName}
   cp .env.example .env
   # Edit .env with your database connection

${
  this.config.database === 'postgresql-prisma'
    ? `2. Run Prisma migrations:
   npx prisma migrate dev --name init
   npx prisma generate

`
    : `2. Make sure ${dbName} is running locally or use a cloud instance

`
}`
    : this.config.database === 'sqlite'
      ? `1. Set up environment (optional):
   cd ${this.config.projectName}
   cp .env.example .env

`
      : ''
}Next steps:
  cd ${this.config.projectName}
  ${runCommand} dev

Your API will be running at:
  🚀 http://localhost:3000
  ❤️  Health: http://localhost:3000/health${this.config.includeSwagger ? '\n  📖 Swagger docs: http://localhost:3000/api/docs' : ''}
${
  this.config.includeAuth
    ? `
🔐 Authentication endpoints:
  POST /api/auth/register - Register new user
  POST /api/auth/login    - Login user
  GET  /api/auth/me       - Get current user (protected)
`
    : ''
}${
        this.config.includeDocker
          ? `
🐳 Run with Docker:
  docker-compose up
`
          : ''
      }`;
    } else if (stack === 'nestjs-api') {
      const dbName = this.config.database.startsWith('postgresql')
        ? 'PostgreSQL'
        : this.config.database.startsWith('mongodb')
          ? 'MongoDB'
          : this.config.database.startsWith('sqlite')
            ? 'SQLite'
            : 'None';
      message += `
🏗️  NestJS API Ready!
${this.config.database !== 'none' ? `💾 Database: ${dbName}\n` : ''}${this.config.includeAuth ? '🔐 Auth: Passport.js + JWT\n' : ''}${this.config.includeSwagger ? '📚 Docs: Swagger/OpenAPI (auto-generated)\n' : ''}${this.config.includeDocker ? '🐳 Docker: Ready to containerize\n' : ''}

${
  this.config.database === 'postgresql-prisma' ||
  this.config.database === 'mongodb-mongoose'
    ? `⚠️  IMPORTANT: Configure your database before running

1. Set up environment variables:
   cd ${this.config.projectName}
   cp .env.example .env
   # Edit .env with your database connection

${
  this.config.database === 'postgresql-prisma'
    ? `2. Run Prisma migrations:
   npx prisma migrate dev --name init
   npx prisma generate

`
    : `2. Make sure ${dbName} is running locally or use a cloud instance

`
}`
    : this.config.database === 'sqlite'
      ? `1. Set up environment (optional):
   cd ${this.config.projectName}
   cp .env.example .env

`
      : ''
}Next steps:
  cd ${this.config.projectName}
  ${runCommand} start:dev

Your API will be running at:
  🚀 http://localhost:3000
  ❤️  Health: http://localhost:3000/api/health${this.config.includeSwagger ? '\n  📖 Swagger docs: http://localhost:3000/api/docs' : ''}
${
  this.config.includeAuth
    ? `
🔐 Authentication endpoints:
  POST /api/auth/register - Register new user
  POST /api/auth/login    - Login user
  GET  /api/auth/me       - Get current user (protected)
`
    : ''
}${
        this.config.includeDocker
          ? `
🐳 Run with Docker:
  docker-compose up
`
          : ''
      }`;
    } else {
      // Default message for Next.js and Vite
      message += `
Next steps:
  cd ${this.config.projectName}
  ${runCommand} dev

Your app will be running at: http://localhost:${stack === 'react-vite' ? '5173' : '3000'}
`;
    }

    // Add footer
    message += `
Documentation: https://github.com/SeifElkadyy/QuickShip-CLI#readme
Need help? https://github.com/SeifElkadyy/QuickShip-CLI/issues

Happy coding! 💻
    `;

    logger.box(message, '✨ QuickShip');
  }

  async _offerOpenEditor() {
    // Skip in CI or non-interactive contexts
    if (ci.isCI || this.options.yes) return;

    // Detect available editors
    const editors = [];
    for (const [cmd, label] of [
      ['code', 'VS Code'],
      ['cursor', 'Cursor'],
      ['zed', 'Zed'],
    ]) {
      try {
        await execa(cmd, ['--version'], { stdio: 'pipe' });
        editors.push({ cmd, label });
      } catch {
        /* not installed */
      }
    }
    if (editors.length === 0) return;

    const open = await confirm({
      message: `Open in ${editors[0].label}?`,
      initialValue: false,
    });
    if (!isCancel(open) && open) {
      await execa(editors[0].cmd, [this.projectPath], { stdio: 'ignore' });
    }
  }

  getRunCommand(packageManager) {
    const commands = {
      npm: 'npm run',
      pnpm: 'pnpm',
      yarn: 'yarn',
      bun: 'bun',
    };
    return commands[packageManager] || 'npm run';
  }
}

export default Engine;

import { resolve } from 'path';
import { pathExists } from 'fs-extra';
import TemplateManager from './template-manager.js';
import DependencyInstaller from './dependency-installer.js';
import FileGenerator from './file-generator.js';
import GitManager from '../integrations/github/git-manager.js';
import logger from '../utils/logger.js';

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
  }

  async build() {
    try {
      // 1. Validate project path
      await this.validatePath();

      // 2. Clone template
      const templateName = this.templateManager.determineTemplate(this.config);
      const template = this.templateManager.getTemplate(templateName);
      const toolsWithAutoInstall =
        template.useCreateNextApp ||
        template.useCreateT3App ||
        template.useCreateVite ||
        template.useManualScaffold;

      await this.templateManager.cloneTemplate(
        templateName,
        this.projectPath,
        this.config,
        this.options
      );

      // 3. Generate/update files
      // Only update package.json and README for non-tool-generated templates
      if (!toolsWithAutoInstall) {
        await this.fileGenerator.updatePackageJson(
          this.projectPath,
          this.config
        );
        await this.fileGenerator.generateReadme(this.projectPath, this.config);
        await this.fileGenerator.generateGitignore(this.projectPath);
      }

      // 4. Install dependencies (unless --no-install or tool already did it)

      if (this.options.install !== false && !toolsWithAutoInstall) {
        await this.dependencyInstaller.install(this.projectPath);
      } else if (toolsWithAutoInstall) {
        logger.success('Dependencies installed successfully');
      } else {
        logger.info('Skipping dependency installation (--no-install flag)');
      }

      // 4.5. Initialize shadcn/ui if requested
      if (this.config.shadcn && this.options.install !== false) {
        await this.templateManager.initShadcn(this.projectPath);
      }

      // 5. Initialize Git (unless --no-git)
      if (this.options.git !== false && this.config.git) {
        try {
          const gitManager = new GitManager(this.projectPath);
          const isGitAvailable = await gitManager.isGitInstalled();

          if (isGitAvailable) {
            await gitManager.init();
            await gitManager.createInitialCommit();
          } else {
            logger.warning(
              'Git is not installed, skipping repository initialization'
            );
          }
        } catch (error) {
          logger.warning('Git initialization failed, but continuing...');
          if (this.options.verbose) {
            console.error(error);
          }
        }
      } else {
        logger.info('Skipping Git initialization (--no-git flag)');
      }

      // 6. Success!
      this.showSuccessMessage();
    } catch (error) {
      logger.error('Failed to create project');
      throw error;
    }
  }

  async validatePath() {
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

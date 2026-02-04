import degit from 'degit';
import { execa } from 'execa';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Spinner from '../utils/spinner.js';
import pkg from 'fs-extra';
const { writeFile } = pkg;
import * as backendTemplates from './backend-templates.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class TemplateManager {
  constructor() {
    this.spinner = new Spinner();
    this.templates = JSON.parse(
      readFileSync(join(__dirname, '../config/templates.json'), 'utf-8')
    ).templates;
  }

  async cloneTemplate(
    templateName,
    destinationPath,
    config = {},
    options = {}
  ) {
    const template = this.getTemplate(templateName);

    if (!template) {
      throw new Error(`Template ${templateName} not found`);
    }

    // Use create-next-app for Next.js templates
    if (template.useCreateNextApp) {
      await this.createNextApp(destinationPath, config, options);
      return;
    }

    // Use create-vite for Vite templates
    if (template.useCreateVite) {
      await this.createViteApp(destinationPath, config, options);
      return;
    }

    // Use create-t3-app for T3 Stack
    if (template.useCreateT3App) {
      await this.createT3App(destinationPath, config, options);
      return;
    }

    // Manual scaffold for MERN Stack
    if (template.useManualScaffold && templateName === 'mern-stack') {
      await this.createMERNApp(destinationPath, config, options);
      return;
    }

    // Manual scaffold for Express API
    if (template.useManualScaffold && templateName === 'express-api') {
      await this.createExpressApp(destinationPath, config, options);
      return;
    }

    // Manual scaffold for NestJS API
    if (template.useManualScaffold && templateName === 'nestjs-api') {
      await this.createNestApp(destinationPath, config, options);
      return;
    }

    // Use create-expo-app for Expo React Native
    if (template.useCreateExpoApp) {
      await this.createExpoApp(destinationPath, config, options);
      return;
    }

    // Fall back to degit for other templates
    this.spinner.start(`Cloning template: ${templateName}`);

    try {
      const emitter = degit(template.repo, {
        cache: false,
        force: true,
      });

      await emitter.clone(destinationPath);
      this.spinner.succeed('Template cloned successfully');
    } catch (error) {
      this.spinner.fail('Failed to clone template');
      throw error;
    }
  }

  async createNextApp(destinationPath, config, options = {}) {
    this.spinner.start('Creating Next.js app with latest versions...');

    try {
      const packageManager = config.packageManager || 'npm';
      const pmFlag = this.getPackageManagerFlag(packageManager);

      const args = [
        'create-next-app@latest',
        destinationPath,
        '--typescript',
        '--tailwind',
        '--app',
        '--no-src-dir',
        '--import-alias',
        '@/*',
        pmFlag,
        '--eslint',
        '--no-git',
        '--yes', // Skip all prompts and use defaults
      ];

      // Add --skip-install if --no-install flag is set
      if (options.install === false) {
        args.push('--skip-install');
      }

      await execa('npx', args, {
        stdio: 'pipe',
      });

      this.spinner.succeed('Next.js app created with latest versions');
    } catch (error) {
      this.spinner.fail('Failed to create Next.js app');
      throw error;
    }
  }

  getPackageManagerFlag(packageManager) {
    const flags = {
      npm: '--use-npm',
      pnpm: '--use-pnpm',
      yarn: '--use-yarn',
      bun: '--use-bun',
    };
    return flags[packageManager] || '--use-npm';
  }

  getTemplate(templateName) {
    // Search through all platforms
    for (const platform in this.templates) {
      if (this.templates[platform][templateName]) {
        return this.templates[platform][templateName];
      }
    }
    return null;
  }

  getTemplatesForPlatform(platform) {
    return this.templates[platform] || {};
  }

  async createViteApp(destinationPath, config, options = {}) {
    this.spinner.start('Creating Vite + React app with latest versions...');

    try {
      const template = config.typescript ? 'react-ts' : 'react';
      const { basename, dirname } = await import('path');

      // Get project name and parent directory
      const projectName = basename(destinationPath);
      const parentDir = dirname(destinationPath);

      const args = [
        '--yes',
        'create-vite@latest',
        projectName,
        '--template',
        template,
      ];

      // Use pipe to avoid interactive prompts (like "start dev server now?")
      await execa('npx', args, {
        cwd: parentDir,
        stdio: 'pipe',
      });

      this.spinner.succeed('Vite + React app created with latest versions');

      // Install dependencies manually since we're using stdio: 'pipe' (unless --no-install)
      if (options.install !== false) {
        this.spinner.start('Installing dependencies...');

        const packageManager = config.packageManager || 'npm';
        await execa(packageManager, ['install'], {
          cwd: destinationPath,
          stdio: 'pipe',
        });

        this.spinner.succeed('Dependencies installed');

        // Install Tailwind CSS if selected
        if (config.styling === 'tailwind') {
          await this.setupTailwindForVite(destinationPath, config);
        }
      } else {
        this.spinner.info(
          'Skipping dependency installation (--no-install flag)'
        );
      }
    } catch (error) {
      this.spinner.fail('Failed to create Vite app');
      console.error('Error details:', error.message);
      throw error;
    }
  }

  async setupTailwindForVite(destinationPath, config) {
    this.spinner.start('Setting up Tailwind CSS...');

    try {
      const packageManager = config.packageManager || 'npm';
      const installCmd = packageManager === 'npm' ? 'install' : 'add';
      const devFlag = packageManager === 'npm' ? '--save-dev' : '-D';

      // Install Tailwind v4 PostCSS plugin and dependencies
      this.spinner.succeed('Tailwind CSS setup started');
      console.log('\n📦 Installing Tailwind CSS packages...\n');
      await execa(
        packageManager,
        [
          installCmd,
          devFlag,
          '@tailwindcss/postcss',
          'tailwindcss',
          'autoprefixer',
        ],
        {
          cwd: destinationPath,
          stdio: 'inherit',
        }
      );

      console.log('');

      // Create Tailwind and PostCSS config files manually
      const { writeFile } = await import('fs/promises');

      const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;
      await writeFile(
        join(destinationPath, 'tailwind.config.js'),
        tailwindConfig
      );

      // Create postcss.config.js with @tailwindcss/postcss
      const postcssConfig = `export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
`;
      await writeFile(
        join(destinationPath, 'postcss.config.js'),
        postcssConfig
      );

      // Update index.css with Tailwind directives
      const indexCss = `@tailwind base;
@tailwind components;
@tailwind utilities;
`;
      await writeFile(join(destinationPath, 'src', 'index.css'), indexCss);

      this.spinner.succeed('Tailwind CSS configured');
    } catch (error) {
      this.spinner.fail('Failed to setup Tailwind CSS');
      throw error;
    }
  }

  async createT3App(destinationPath, _config) {
    this.spinner.start('Creating T3 Stack app...');

    try {
      // T3 doesn't support package manager flags in CI mode
      // Just use default features with CI mode
      const args = [
        '--yes',
        'create-t3-app@latest',
        destinationPath,
        '--CI',
        '--noGit',
        '--tailwind',
        '--trpc',
        '--prisma',
        '--nextAuth',
        '--appRouter',
      ];

      await execa('npx', args, {
        stdio: 'inherit',
      });

      this.spinner.succeed('T3 Stack app created successfully');
    } catch (error) {
      this.spinner.fail('Failed to create T3 app');
      throw error;
    }
  }

  async createMERNApp(destinationPath, config) {
    const { mkdir } = await import('fs/promises');

    try {
      // Create main project directory
      await mkdir(destinationPath, { recursive: true });

      // 1. Create backend (server)
      await this.createMERNBackend(destinationPath, config);

      // 2. Create frontend (client) using Vite
      await this.createMERNFrontend(destinationPath, config);

      // 3. Create root files
      await this.createMERNRootFiles(destinationPath, config);

      this.spinner.succeed('MERN Stack project created successfully');
    } catch (error) {
      this.spinner.fail('Failed to create MERN Stack project');
      throw error;
    }
  }

  async createMERNBackend(projectPath, config) {
    const { mkdir, writeFile } = await import('fs/promises');
    const packageManager = config.packageManager || 'npm';
    const serverPath = join(projectPath, 'server');

    this.spinner.start('Setting up Express backend...');

    // Create server directory structure
    await mkdir(join(serverPath, 'routes'), { recursive: true });
    await mkdir(join(serverPath, 'models'), { recursive: true });
    await mkdir(join(serverPath, 'controllers'), { recursive: true });
    await mkdir(join(serverPath, 'middleware'), { recursive: true });
    await mkdir(join(serverPath, 'config'), { recursive: true });

    // Create server package.json
    const serverPackageJson = {
      name: `${config.projectName}-server`,
      version: '1.0.0',
      description: 'MERN Stack Backend',
      main: 'server.js',
      type: 'module',
      scripts: {
        start: 'node server.js',
        dev: 'nodemon server.js',
      },
      dependencies: {
        express: '^4.18.2',
        mongoose: '^8.0.3',
        cors: '^2.8.5',
        dotenv: '^16.3.1',
        bcryptjs: '^2.4.3',
        jsonwebtoken: '^9.0.2',
        'express-validator': '^7.0.1',
      },
      devDependencies: {
        nodemon: '^3.0.2',
      },
    };

    await writeFile(
      join(serverPath, 'package.json'),
      JSON.stringify(serverPackageJson, null, 2)
    );

    // Create server.js
    const serverCode = `import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
`;

    await writeFile(join(serverPath, 'server.js'), serverCode);

    // Create config/db.js
    const dbConfig = `import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
`;

    await writeFile(join(serverPath, 'config', 'db.js'), dbConfig);

    // Create .env.example
    const envExample = `PORT=5000
MONGO_URI=mongodb://localhost:27017/${config.projectName}
JWT_SECRET=your_jwt_secret_here_change_in_production
`;

    await writeFile(join(serverPath, '.env.example'), envExample);

    // Install backend dependencies
    this.spinner.succeed('Backend files created');
    console.log(
      '\n📦 Installing backend dependencies (this may take a minute)...\n'
    );
    await execa(packageManager, ['install'], {
      cwd: serverPath,
      stdio: 'inherit',
    });

    console.log('');
  }

  async createMERNFrontend(projectPath, config) {
    const packageManager = config.packageManager || 'npm';
    const clientPath = join(projectPath, 'client');

    this.spinner.start('Setting up React frontend...');

    // Create Vite React app in client directory
    const parentDir = projectPath;
    const template = config.typescript ? 'react-ts' : 'react';

    const args = [
      '--yes',
      'create-vite@latest',
      'client',
      '--template',
      template,
    ];

    await execa('npx', args, {
      cwd: parentDir,
      stdio: 'pipe',
    });

    // Install frontend dependencies
    this.spinner.succeed('Frontend files created');
    console.log(
      '\n📦 Installing frontend dependencies (this may take a minute)...\n'
    );
    await execa(packageManager, ['install'], {
      cwd: clientPath,
      stdio: 'inherit',
    });

    // Install additional frontend packages
    console.log(
      '\n📦 Installing additional packages (axios, react-router-dom)...\n'
    );
    const installCmd = packageManager === 'npm' ? 'install' : 'add';
    await execa(packageManager, [installCmd, 'axios', 'react-router-dom'], {
      cwd: clientPath,
      stdio: 'inherit',
    });

    // Setup Tailwind if selected
    if (config.styling === 'tailwind') {
      console.log('');
      await this.setupTailwindForVite(clientPath, config);
    }

    console.log('');
  }

  async createMERNRootFiles(projectPath, config) {
    const { writeFile } = await import('fs/promises');
    const packageManager = config.packageManager || 'npm';

    // Create root package.json with scripts to run both
    const rootPackageJson = {
      name: config.projectName,
      version: '1.0.0',
      description: 'MERN Stack Application',
      scripts: {
        'start:server': `cd server && ${packageManager} start`,
        'dev:server': `cd server && ${packageManager} run dev`,
        'start:client': `cd client && ${packageManager} run dev`,
        dev: 'concurrently "npm run dev:server" "npm run start:client"',
        install: `cd server && ${packageManager} install && cd ../client && ${packageManager} install`,
      },
      devDependencies: {
        concurrently: '^8.2.2',
      },
    };

    await writeFile(
      join(projectPath, 'package.json'),
      JSON.stringify(rootPackageJson, null, 2)
    );

    // Create README
    const readme = `# ${config.projectName}

MERN Stack Application generated with [QuickShip](https://github.com/SeifElkadyy/QuickShip-CLI) 🚀

## Project Structure

\`\`\`
${config.projectName}/
├── client/          # React frontend (Vite)
├── server/          # Express backend
└── package.json     # Root package.json with scripts
\`\`\`

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB installed and running

### Installation

1. Install dependencies for both client and server:
\`\`\`bash
${packageManager} install
\`\`\`

2. Set up environment variables:
\`\`\`bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
\`\`\`

3. Start MongoDB (if not already running):
\`\`\`bash
mongod
\`\`\`

### Development

Run both frontend and backend concurrently:
\`\`\`bash
${packageManager} run dev
\`\`\`

Or run them separately:

**Backend only:**
\`\`\`bash
${packageManager} run dev:server
\`\`\`

**Frontend only:**
\`\`\`bash
${packageManager} run start:client
\`\`\`

## API Endpoints

- \`GET /api/health\` - Health check

## Tech Stack

**Frontend:**
- React ${config.typescript ? '+ TypeScript' : ''}
- Vite
${config.styling === 'tailwind' ? '- Tailwind CSS' : ''}
- React Router
- Axios

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs

## Learn More

- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
`;

    await writeFile(join(projectPath, 'README.md'), readme);

    // Install concurrently in root
    console.log('\n📦 Installing root dependencies (concurrently)...\n');
    const installCmd = packageManager === 'npm' ? 'install' : 'add';
    const devFlag = packageManager === 'npm' ? '--save-dev' : '-D';
    await execa(packageManager, [installCmd, devFlag, 'concurrently'], {
      cwd: projectPath,
      stdio: 'inherit',
    });

    console.log('');
  }

  async createExpressApp(destinationPath, config, options = {}) {
    const { mkdir } = await import('fs/promises');
    const packageManager = config.packageManager || 'npm';

    try {
      this.spinner.start('Creating Express API project...');

      // Create main project directory
      await mkdir(destinationPath, { recursive: true });

      // Create directory structure
      await mkdir(join(destinationPath, 'src', 'config'), { recursive: true });
      await mkdir(join(destinationPath, 'src', 'controllers'), {
        recursive: true,
      });
      await mkdir(join(destinationPath, 'src', 'middleware'), {
        recursive: true,
      });
      await mkdir(join(destinationPath, 'src', 'models'), { recursive: true });
      await mkdir(join(destinationPath, 'src', 'routes'), { recursive: true });
      await mkdir(join(destinationPath, 'src', 'services'), {
        recursive: true,
      });
      await mkdir(join(destinationPath, 'src', 'utils'), { recursive: true });
      await mkdir(join(destinationPath, 'src', 'validators'), {
        recursive: true,
      });
      await mkdir(join(destinationPath, 'src', 'types'), { recursive: true });
      await mkdir(join(destinationPath, 'tests'), { recursive: true });

      // Create package.json
      await backendTemplates.createExpressPackageJson(destinationPath, config);

      // Create TypeScript config
      await backendTemplates.createExpressTsConfig(destinationPath);

      // Create main entry point
      await backendTemplates.createExpressIndex(destinationPath, config);

      // Create config files
      await backendTemplates.createExpressConfig(destinationPath, config);

      // Create middleware
      await backendTemplates.createExpressMiddleware(destinationPath, config);

      // Create routes
      await backendTemplates.createExpressRoutes(destinationPath, config);

      // Create controllers and services (if auth is enabled and database is present)
      if (config.includeAuth && config.database !== 'none') {
        await backendTemplates.createExpressAuth(destinationPath, config);
      }

      // Create database setup (if database is enabled)
      if (config.database !== 'none') {
        await backendTemplates.createExpressDatabase(destinationPath, config);
      }

      // Create Docker files (if enabled)
      if (config.includeDocker) {
        await backendTemplates.createExpressDocker(destinationPath, config);
      }

      // Create Swagger setup (if enabled)
      if (config.includeSwagger) {
        await backendTemplates.createExpressSwagger(destinationPath, config);
      }

      // Create .env.example and .gitignore
      await backendTemplates.createExpressEnvFiles(destinationPath, config);
      await backendTemplates.createBackendGitignore(destinationPath);

      // Create README
      await backendTemplates.createExpressReadme(destinationPath, config);

      // Create Jest config
      await backendTemplates.createExpressJestConfig(destinationPath);

      this.spinner.succeed('Express API files created');

      // Install dependencies
      if (options.install !== false) {
        console.log(
          '\n📦 Installing dependencies (this may take a minute)...\n'
        );
        await execa(packageManager, ['install'], {
          cwd: destinationPath,
          stdio: 'inherit',
        });
        console.log('');
      }
    } catch (error) {
      this.spinner.fail('Failed to create Express API project');
      throw error;
    }
  }

  async createNestApp(destinationPath, config, options = {}) {
    const { mkdir } = await import('fs/promises');
    const packageManager = config.packageManager || 'npm';

    try {
      this.spinner.start('Creating NestJS API project...');

      // Create main project directory
      await mkdir(destinationPath, { recursive: true });

      // Create directory structure
      await mkdir(join(destinationPath, 'src', 'common'), { recursive: true });
      await mkdir(join(destinationPath, 'src', 'config'), { recursive: true });
      await mkdir(join(destinationPath, 'test'), { recursive: true });

      // Only create database/auth/users modules if database is enabled
      if (config.database !== 'none') {
        await mkdir(join(destinationPath, 'src', 'auth'), { recursive: true });
        await mkdir(join(destinationPath, 'src', 'users'), { recursive: true });
        await mkdir(join(destinationPath, 'src', 'database'), {
          recursive: true,
        });
      }

      // Create package.json
      await backendTemplates.createNestPackageJson(destinationPath, config);

      // Create TypeScript config
      await backendTemplates.createNestTsConfig(destinationPath);

      // Create main files
      await backendTemplates.createNestMainFiles(destinationPath, config);

      // Create database module (if database is enabled)
      if (config.database !== 'none') {
        await backendTemplates.createNestDatabase(destinationPath, config);

        // Create users module
        await backendTemplates.createNestUsers(destinationPath, config);

        // Create auth module (if enabled)
        if (config.includeAuth) {
          await backendTemplates.createNestAuth(destinationPath, config);
        }
      }

      // Create Docker files (if enabled)
      if (config.includeDocker) {
        await backendTemplates.createNestDocker(destinationPath, config);
      }

      // Create .env.example and .gitignore
      await backendTemplates.createNestEnvFiles(destinationPath, config);
      await backendTemplates.createBackendGitignore(destinationPath);

      // Create README
      await backendTemplates.createNestReadme(destinationPath, config);

      // Create nest-cli.json
      await backendTemplates.createNestCliConfig(destinationPath);

      // Create Jest config
      await backendTemplates.createNestJestConfig(destinationPath);

      this.spinner.succeed('NestJS API files created');

      // Install dependencies
      if (options.install !== false) {
        console.log(
          '\n📦 Installing dependencies (this may take a minute)...\n'
        );
        await execa(packageManager, ['install'], {
          cwd: destinationPath,
          stdio: 'inherit',
        });
        console.log('');
      }
    } catch (error) {
      this.spinner.fail('Failed to create NestJS API project');
      throw error;
    }
  }

  async initShadcn(projectPath) {
    this.spinner.start('Initializing shadcn/ui...');

    try {
      // Use inherit to show the actual shadcn prompts and progress
      await execa('npx', ['shadcn@latest', 'init', '-d', '-y'], {
        cwd: projectPath,
        stdio: 'inherit',
      });

      this.spinner.succeed('shadcn/ui initialized successfully');
    } catch (error) {
      this.spinner.fail('Failed to initialize shadcn/ui');
      throw error;
    }
  }

  async createExpoApp(destinationPath, config, _options = {}) {
    this.spinner.start('Creating Expo React Native app...');

    try {
      const projectName = destinationPath.split('/').pop();
      const parentDir = destinationPath.substring(
        0,
        destinationPath.lastIndexOf('/')
      );

      // Use user's template choice or default to tabs
      const templateName = config.expoTemplate || 'tabs';

      const args = ['create-expo', projectName, '--template', templateName];

      //Create the Expo app
      await execa('npx', args, {
        cwd: parentDir || '.',
        stdio: 'pipe',
      });

      this.spinner.succeed(
        `Expo app created with ${templateName} template${templateName === 'tabs' ? ' (includes Expo Router)' : ''}`
      );

      // Add NativeWind if requested
      if (config.nativewind !== false) {
        await this.setupNativeWind(destinationPath, config);
      }
    } catch (error) {
      this.spinner.fail('Failed to create Expo app');
      throw error;
    }
  }

  async setupNativeWind(projectPath, config) {
    this.spinner.start('Setting up NativeWind (Tailwind CSS)...');

    try {
      const packageManager = config.packageManager || 'npm';

      // Install NativeWind and dependencies
      const installCmd = packageManager === 'npm' ? 'install' : 'add';
      const saveDevFlag = packageManager === 'npm' ? '--save-dev' : '-D';

      // Install NativeWind and Tailwind CSS
      const deps = ['nativewind@^4.0.1', 'tailwindcss@^3.4.0'];
      await execa(packageManager, [installCmd, ...deps], {
        cwd: projectPath,
        stdio: 'pipe',
      });

      // Install babel-preset-expo as devDependency (required for babel config)
      this.spinner.text = 'Installing babel-preset-expo...';
      await execa(
        packageManager,
        [installCmd, saveDevFlag, 'babel-preset-expo'],
        {
          cwd: projectPath,
          stdio: 'pipe',
        }
      );

      // Install react-native-reanimated using expo install to get SDK-compatible version
      this.spinner.text = 'Installing react-native-reanimated...';
      await execa('npx', ['expo', 'install', 'react-native-reanimated'], {
        cwd: projectPath,
        stdio: 'pipe',
      });

      // Create Tailwind config
      const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}`;

      await writeFile(
        `${projectPath}/tailwind.config.js`,
        tailwindConfig,
        'utf-8'
      );

      // Create global.css
      const globalCss = `@tailwind base;
@tailwind components;
@tailwind utilities;`;

      await writeFile(`${projectPath}/global.css`, globalCss, 'utf-8');

      // Create nativewind-env.d.ts
      const nativewindEnv = `/// <reference types="nativewind/types" />`;

      await writeFile(
        `${projectPath}/nativewind-env.d.ts`,
        nativewindEnv,
        'utf-8'
      );

      // Create babel.config.js for NativeWind
      // Expo projects don't include babel.config.js by default
      const babelPath = `${projectPath}/babel.config.js`;
      const babelConfig = `module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel"
    ],
    plugins: ["react-native-reanimated/plugin"]
  };
};`;

      await writeFile(babelPath, babelConfig, 'utf-8');

      // Update metro.config.js
      const metroConfig = `const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './global.css' });`;

      await writeFile(`${projectPath}/metro.config.js`, metroConfig, 'utf-8');

      // Import global.css in the appropriate layout file
      this.spinner.text = 'Updating app layout to import global styles...';
      const { readFile } = pkg;

      // Try app/_layout.tsx first (tabs template), then App.tsx (blank template)
      const possibleLayoutPaths = [
        `${projectPath}/app/_layout.tsx`,
        `${projectPath}/App.tsx`,
        `${projectPath}/App.js`,
      ];

      for (const layoutPath of possibleLayoutPaths) {
        try {
          let layoutContent = await readFile(layoutPath, 'utf-8');
          const importPath = layoutPath.includes('/app/')
            ? '../global.css'
            : './global.css';

          // Add import at the top if it doesn't exist
          if (!layoutContent.includes('global.css')) {
            // Find the first import statement
            const importRegex = /^import /m;
            const match = layoutContent.match(importRegex);

            if (match) {
              const insertPosition = match.index;
              layoutContent =
                layoutContent.slice(0, insertPosition) +
                `import '${importPath}';\n` +
                layoutContent.slice(insertPosition);
            } else {
              // If no imports found, add at the very top
              layoutContent = `import '${importPath}';\n` + layoutContent;
            }

            await writeFile(layoutPath, layoutContent, 'utf-8');
            break; // Successfully updated, exit loop
          }
        } catch (_layoutError) {
          // Try next path
          continue;
        }
      }

      this.spinner.succeed('NativeWind configured successfully');
    } catch (error) {
      this.spinner.fail('Failed to setup NativeWind');
      throw error;
    }
  }

  determineTemplate(config) {
    // Expo React Native
    if (config.stack === 'expo-react-native') {
      return 'expo-react-native';
    }

    // React + Vite
    if (config.stack === 'react-vite') {
      return 'react-vite';
    }

    // T3 Stack
    if (config.stack === 't3-stack') {
      return 't3-stack';
    }

    // MERN Stack
    if (config.stack === 'mern-stack') {
      return 'mern-stack';
    }

    // Express API
    if (config.stack === 'express-api') {
      return 'express-api';
    }

    // NestJS API
    if (config.stack === 'nestjs-api') {
      return 'nestjs-api';
    }

    // Next.js (default)
    if (config.stack === 'nextjs') {
      return 'nextjs-typescript-tailwind';
    }

    // Default fallback
    return 'nextjs-typescript-tailwind';
  }

  getTemplate(templateName) {
    // Check in website templates
    if (this.templates.website && this.templates.website[templateName]) {
      return this.templates.website[templateName];
    }

    // Check in mobile templates
    if (this.templates.mobile && this.templates.mobile[templateName]) {
      return this.templates.mobile[templateName];
    }

    // Check in backend templates
    if (this.templates.backend && this.templates.backend[templateName]) {
      return this.templates.backend[templateName];
    }

    return null;
  }
}

export default TemplateManager;

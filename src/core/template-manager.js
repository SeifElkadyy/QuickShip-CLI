import degit from 'degit';
import { execa } from 'execa';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Spinner from '../utils/spinner.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class TemplateManager {
  constructor() {
    this.spinner = new Spinner();
    this.templates = JSON.parse(
      readFileSync(join(__dirname, '../config/templates.json'), 'utf-8')
    ).templates;
  }

  async cloneTemplate(templateName, destinationPath, config = {}) {
    const template = this.getTemplate(templateName);

    if (!template) {
      throw new Error(`Template ${templateName} not found`);
    }

    // Use create-next-app for Next.js templates
    if (template.useCreateNextApp) {
      await this.createNextApp(destinationPath, config);
      return;
    }

    // Use create-vite for Vite templates
    if (template.useCreateVite) {
      await this.createViteApp(destinationPath, config);
      return;
    }

    // Use create-t3-app for T3 Stack
    if (template.useCreateT3App) {
      await this.createT3App(destinationPath, config);
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

  async createNextApp(destinationPath, config) {
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

  async createViteApp(destinationPath, config) {
    this.spinner.start('Creating Vite + React app with latest versions...');

    try {
      const template = config.typescript ? 'react-ts' : 'react';

      const args = [
        'create-vite@latest',
        destinationPath,
        '--',
        '--template',
        template,
      ];

      await execa('npx', args, {
        stdio: 'pipe',
      });

      this.spinner.succeed('Vite + React app created with latest versions');
    } catch (error) {
      this.spinner.fail('Failed to create Vite app');
      throw error;
    }
  }

  async createT3App(destinationPath, config) {
    this.spinner.start('Creating T3 Stack app...');

    try {
      const packageManager = config.packageManager || 'npm';
      const pmFlag = this.getPackageManagerFlag(packageManager);

      const args = [
        'create-t3-app@latest',
        destinationPath,
        '--CI',
        pmFlag,
        '--tailwind',
        '--trpc',
        '--prisma',
        '--nextAuth',
        '--appRouter',
        '--noGit',
      ];

      await execa('npx', args, {
        stdio: 'pipe',
      });

      this.spinner.succeed('T3 Stack app created successfully');
    } catch (error) {
      this.spinner.fail('Failed to create T3 app');
      throw error;
    }
  }

  async initShadcn(projectPath) {
    this.spinner.start('Initializing shadcn/ui...');

    try {
      await execa('npx', ['shadcn@latest', 'init', '-y', '--defaults'], {
        cwd: projectPath,
        stdio: 'pipe',
      });

      this.spinner.succeed('shadcn/ui initialized successfully');
    } catch (error) {
      this.spinner.fail('Failed to initialize shadcn/ui');
      throw error;
    }
  }

  determineTemplate(config) {
    // React + Vite
    if (config.stack === 'react-vite') {
      return 'react-vite';
    }

    // T3 Stack
    if (config.stack === 't3-stack') {
      return 't3-stack';
    }

    // Next.js (default)
    if (config.stack === 'nextjs') {
      return 'nextjs-typescript-tailwind';
    }

    // Default fallback
    return 'nextjs-typescript-tailwind';
  }
}

export default TemplateManager;

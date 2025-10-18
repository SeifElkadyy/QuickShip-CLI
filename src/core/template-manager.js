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

    // Use create-next-app for Next.js templates to get latest versions
    if (template.useCreateNextApp) {
      await this.createNextApp(destinationPath, config);
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
      const args = [
        'create-next-app@latest',
        destinationPath,
        '--typescript',
        '--tailwind',
        '--app',
        '--no-src-dir',
        '--import-alias',
        '@/*',
        '--use-npm',
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

  determineTemplate(config) {
    // For MVP: Only support Next.js with TypeScript and Tailwind
    if (config.stack === 'nextjs') {
      if (config.typescript && config.styling === 'tailwind') {
        return 'nextjs-typescript-tailwind';
      }
    }

    // Default fallback
    return 'nextjs-typescript-tailwind';
  }
}

export default TemplateManager;

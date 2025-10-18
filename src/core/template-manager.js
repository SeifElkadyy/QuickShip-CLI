import degit from 'degit';
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

  async cloneTemplate(templateName, destinationPath) {
    const template = this.getTemplate(templateName);

    if (!template) {
      throw new Error(`Template ${templateName} not found`);
    }

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

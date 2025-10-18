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
    this.dependencyInstaller = new DependencyInstaller();
    this.fileGenerator = new FileGenerator();
  }

  async build() {
    try {
      // 1. Validate project path
      await this.validatePath();

      // 2. Clone template
      const templateName = this.templateManager.determineTemplate(this.config);
      await this.templateManager.cloneTemplate(templateName, this.projectPath);

      // 3. Generate/update files
      await this.fileGenerator.updatePackageJson(this.projectPath, this.config);
      await this.fileGenerator.generateReadme(this.projectPath, this.config);
      await this.fileGenerator.generateGitignore(this.projectPath);

      // 4. Install dependencies (unless --no-install)
      if (this.options.install !== false) {
        await this.dependencyInstaller.install(this.projectPath);
      } else {
        logger.info('Skipping dependency installation (--no-install flag)');
      }

      // 5. Initialize Git (unless --no-git)
      if (this.options.git !== false && this.config.git) {
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
    const message = `
🎉 Success! Your project is ready!

📁 Location: ${this.projectPath}

Next steps:
  cd ${this.config.projectName}
  npm run dev

Your app will be running at: http://localhost:3000

Documentation: https://quickship.dev/docs
Need help? https://quickship.dev/support

Happy coding! 💻
    `;

    logger.box(message, '✨ QuickShip');
  }
}

export default Engine;

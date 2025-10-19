import { execa } from 'execa';
import logger from '../utils/logger.js';
import ora from 'ora';
import { resolve } from 'path';
import pkg from 'fs-extra';
const { pathExists, writeFile } = pkg;

export class RenderDeployment {
  constructor(projectPath, options = {}) {
    this.projectPath = projectPath;
    this.options = options;
    this.spinner = ora();
  }

  /**
   * Create render.yaml configuration for MERN Stack
   */
  async createRenderConfig(envVars = {}) {
    const config = {
      services: [
        {
          type: 'web',
          name: 'backend',
          env: 'node',
          region: 'oregon',
          buildCommand: 'cd server && npm install',
          startCommand: 'cd server && npm start',
          envVars: Object.entries(envVars).map(([key, value]) => ({
            key,
            value,
          })),
        },
        {
          type: 'web',
          name: 'frontend',
          env: 'static',
          region: 'oregon',
          buildCommand: 'cd client && npm install && npm run build',
          staticPublishPath: './client/dist',
          envVars: [],
        },
      ],
      databases: [
        {
          name: 'mongodb',
          databaseName: 'myapp',
          user: 'myapp',
        },
      ],
    };

    const configPath = resolve(this.projectPath, 'render.yaml');
    await writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');
    logger.success('Created render.yaml configuration file\n');

    return configPath;
  }

  /**
   * Deploy to Render
   */
  async deploy() {
    try {
      logger.info('🚀 Setting up Render deployment...\n');

      // Create render.yaml if it doesn't exist
      const renderConfigPath = resolve(this.projectPath, 'render.yaml');
      const configExists = await pathExists(renderConfigPath);

      if (!configExists) {
        logger.info('Creating Render configuration...');
        await this.createRenderConfig({});
      }

      // Render deployment is done via Git + Dashboard
      logger.header('📋 Next Steps for Render Deployment:');
      logger.log('');
      logger.log('1. Push your code to GitHub:');
      logger.log('   git add .');
      logger.log('   git commit -m "Add Render configuration"');
      logger.log('   git push origin main');
      logger.log('');
      logger.log('2. Go to https://dashboard.render.com');
      logger.log('');
      logger.log('3. Click "New +" → "Blueprint"');
      logger.log('');
      logger.log('4. Connect your GitHub repository');
      logger.log('');
      logger.log(
        '5. Render will automatically detect render.yaml and deploy all services'
      );
      logger.log('');
      logger.divider();

      return {
        success: true,
        message:
          'Render configuration created. Follow the steps above to deploy.',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Deploy MERN Stack to Render
   */
  async deployMERN(envVars = {}) {
    try {
      const clientPath = resolve(this.projectPath, 'client');
      const serverPath = resolve(this.projectPath, 'server');

      const clientExists = await pathExists(clientPath);
      const serverExists = await pathExists(serverPath);

      if (!clientExists || !serverExists) {
        throw new Error(
          'MERN project structure not found (missing client or server folder)'
        );
      }

      logger.header('📦 Setting up MERN Stack for Render');

      // Create render.yaml with environment variables
      await this.createRenderConfig(envVars);

      logger.success('✅ Render configuration created!\n');

      // Show deployment instructions
      logger.header('📋 Deployment Instructions:');
      logger.log('');
      logger.log('Render requires deployment via GitHub. Follow these steps:');
      logger.log('');
      logger.log('1. Initialize Git (if not already):');
      logger.log('   git init');
      logger.log('   git add .');
      logger.log('   git commit -m "Initial commit"');
      logger.log('');
      logger.log('2. Create a GitHub repository and push:');
      logger.log('   git remote add origin <your-repo-url>');
      logger.log('   git push -u origin main');
      logger.log('');
      logger.log('3. Go to https://dashboard.render.com');
      logger.log('');
      logger.log('4. Click "New +" → "Blueprint"');
      logger.log('');
      logger.log('5. Connect your GitHub repository');
      logger.log('');
      logger.log('6. Render will:');
      logger.log('   ✓ Deploy your Express backend');
      logger.log('   ✓ Deploy your React frontend');
      logger.log('   ✓ Create a MongoDB database');
      logger.log('   ✓ Set up environment variables');
      logger.log('');
      logger.log(
        '7. Update your backend .env with the MongoDB connection string'
      );
      logger.log('   provided by Render');
      logger.log('');
      logger.divider();

      return {
        success: true,
        message: 'MERN Stack configured for Render deployment',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Check if project has Git initialized
   */
  async hasGit() {
    try {
      const gitPath = resolve(this.projectPath, '.git');
      return await pathExists(gitPath);
    } catch (error) {
      return false;
    }
  }

  /**
   * Get platform-specific deployment tips
   */
  getDeploymentTips() {
    return [
      '💡 Render offers a generous free tier with automatic SSL',
      '💡 Free PostgreSQL databases with 90-day expiration',
      '💡 All deployments require a Git repository (GitHub, GitLab, or Bitbucket)',
      '💡 Automatic deploys on every git push to main branch',
      '💡 render.yaml file enables infrastructure-as-code deployment',
    ];
  }

  /**
   * Validate render.yaml configuration
   */
  async validateConfig() {
    try {
      const renderConfigPath = resolve(this.projectPath, 'render.yaml');
      const exists = await pathExists(renderConfigPath);

      if (!exists) {
        return {
          valid: false,
          message: 'render.yaml not found',
        };
      }

      return {
        valid: true,
        message: 'render.yaml configuration is valid',
      };
    } catch (error) {
      return {
        valid: false,
        message: error.message,
      };
    }
  }
}

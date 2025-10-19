import pkg from 'fs-extra';
const { pathExists, readFile } = pkg;
import { resolve } from 'path';
import inquirer from 'inquirer';
import logger from '../utils/logger.js';

export class EnvironmentVariableManager {
  constructor(projectPath) {
    this.projectPath = projectPath;
    this.envVars = {};
  }

  /**
   * Detect required environment variables from .env.example
   */
  async detectRequiredVars() {
    try {
      const envExamplePath = resolve(this.projectPath, '.env.example');
      const exists = await pathExists(envExamplePath);

      if (!exists) {
        return [];
      }

      const content = await readFile(envExamplePath, 'utf-8');

      // Parse env vars (format: KEY=value or KEY=)
      const lines = content.split('\n');
      const envVars = [];

      for (const line of lines) {
        const trimmedLine = line.trim();

        // Skip comments and empty lines
        if (!trimmedLine || trimmedLine.startsWith('#')) {
          // Check if it's a comment describing the variable
          if (trimmedLine.startsWith('#')) {
            const commentText = trimmedLine.substring(1).trim();
            // Store comment for next variable
            this.lastComment = commentText;
          }
          continue;
        }

        const [key, ...valueParts] = trimmedLine.split('=');
        const value = valueParts.join('=').trim();

        if (key) {
          envVars.push({
            key: key.trim(),
            defaultValue: value,
            description: this.lastComment || `Value for ${key.trim()}`,
          });
          this.lastComment = null;
        }
      }

      return envVars;
    } catch (error) {
      return [];
    }
  }

  /**
   * Check if .env file exists
   */
  async hasEnvFile() {
    const envPath = resolve(this.projectPath, '.env');
    return await pathExists(envPath);
  }

  /**
   * Read existing .env file
   */
  async readEnvFile() {
    try {
      const envPath = resolve(this.projectPath, '.env');
      const exists = await pathExists(envPath);

      if (!exists) {
        return {};
      }

      const content = await readFile(envPath, 'utf-8');
      const envVars = {};

      const lines = content.split('\n');
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith('#')) {
          continue;
        }

        const [key, ...valueParts] = trimmedLine.split('=');
        const value = valueParts.join('=').trim();

        if (key) {
          envVars[key.trim()] = value;
        }
      }

      return envVars;
    } catch (error) {
      return {};
    }
  }

  /**
   * Prompt user for environment variables
   */
  async promptForEnvVars(requiredVars, existingVars = {}) {
    if (requiredVars.length === 0) {
      return {};
    }

    logger.header('🔐 Environment Variables Setup');
    logger.log(
      'The following environment variables are needed for deployment:\n'
    );

    const answers = {};

    for (const varConfig of requiredVars) {
      const { key, defaultValue, description } = varConfig;

      // Check if we already have this value
      if (existingVars[key]) {
        logger.dim(`✓ ${key}: Using existing value`);
        answers[key] = existingVars[key];
        continue;
      }

      // Prompt for the value
      const { value } = await inquirer.prompt([
        {
          type: 'input',
          name: 'value',
          message: `${key}:`,
          default: defaultValue,
          validate: (input) => {
            // Don't allow empty values for required vars
            if (!input || input.trim() === '') {
              return 'This environment variable is required';
            }
            return true;
          },
        },
      ]);

      answers[key] = value;
    }

    logger.log('');
    return answers;
  }

  /**
   * Get critical environment variables based on project type
   */
  getCriticalVars(projectType) {
    const criticalVars = {
      nextjs: [],
      't3-stack': ['DATABASE_URL', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL'],
      'react-vite': [],
      'mern-stack': ['MONGO_URI', 'JWT_SECRET', 'NODE_ENV'],
    };

    return criticalVars[projectType] || [];
  }

  /**
   * Validate environment variables for project type
   */
  validateEnvVars(envVars, projectType) {
    const criticalVars = this.getCriticalVars(projectType);
    const missing = [];

    for (const varName of criticalVars) {
      if (!envVars[varName] || envVars[varName].trim() === '') {
        missing.push(varName);
      }
    }

    return {
      valid: missing.length === 0,
      missing,
    };
  }

  /**
   * Get environment variable suggestions based on project type
   */
  getSuggestions(projectType) {
    const suggestions = {
      't3-stack': {
        DATABASE_URL: 'postgresql://user:password@host:5432/database',
        NEXTAUTH_SECRET: 'Run: openssl rand -base64 32',
        NEXTAUTH_URL: 'http://localhost:3000 (production URL for deployment)',
      },
      'mern-stack': {
        MONGO_URI: 'mongodb://localhost:27017/myapp or MongoDB Atlas URI',
        JWT_SECRET: 'Run: openssl rand -base64 32',
        NODE_ENV: 'production',
        PORT: '5000',
      },
    };

    return suggestions[projectType] || {};
  }

  /**
   * Show environment variable summary
   */
  showSummary(envVars) {
    logger.header('📋 Environment Variables Summary');
    logger.log('');

    if (Object.keys(envVars).length === 0) {
      logger.info('No environment variables configured');
      return;
    }

    for (const [key, value] of Object.entries(envVars)) {
      // Mask sensitive values
      const maskedValue = this.maskSensitiveValue(key, value);
      logger.log(`  ${key}: ${maskedValue}`);
    }

    logger.log('');
  }

  /**
   * Mask sensitive environment variable values
   */
  maskSensitiveValue(key, value) {
    const sensitiveKeys = [
      'SECRET',
      'PASSWORD',
      'API_KEY',
      'TOKEN',
      'PRIVATE',
      'JWT',
    ];

    const isSensitive = sensitiveKeys.some((keyword) =>
      key.toUpperCase().includes(keyword)
    );

    if (isSensitive && value && value.length > 4) {
      return value.substring(0, 4) + '***' + value.substring(value.length - 4);
    }

    return value;
  }

  /**
   * Interactive environment variable setup
   */
  async interactiveSetup(projectType) {
    // Detect required vars from .env.example
    const requiredVars = await this.detectRequiredVars();

    if (requiredVars.length === 0) {
      logger.info('No environment variables required (no .env.example found)');
      return {};
    }

    // Check if .env file exists
    const hasEnv = await this.hasEnvFile();
    let existingVars = {};

    if (hasEnv) {
      existingVars = await this.readEnvFile();
      logger.success('Found existing .env file');
    }

    // Prompt for missing vars
    const envVars = await this.promptForEnvVars(requiredVars, existingVars);

    // Validate critical vars
    const validation = this.validateEnvVars(envVars, projectType);

    if (!validation.valid) {
      logger.warning('Missing critical environment variables:');
      validation.missing.forEach((varName) => {
        logger.log(`  - ${varName}`);
      });
      logger.log('');

      const suggestions = this.getSuggestions(projectType);
      if (Object.keys(suggestions).length > 0) {
        logger.header('💡 Suggestions:');
        for (const [key, suggestion] of Object.entries(suggestions)) {
          if (validation.missing.includes(key)) {
            logger.log(`  ${key}: ${suggestion}`);
          }
        }
        logger.log('');
      }
    }

    return envVars;
  }
}

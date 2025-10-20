import inquirer from 'inquirer';
import validator from '../utils/validator.js';

export async function backendPrompts(projectName, options = {}) {
  // If -y flag is set, use defaults
  if (options.yes) {
    return {
      projectName: projectName || 'my-api',
      stack: options.template || 'express-api',
      database: 'postgresql-prisma',
      includeAuth: true,
      includeSwagger: true,
      includeDocker: true,
      packageManager: options.packageManager || 'npm',
      git: options.git !== false,
    };
  }

  const questions = [];

  // Project name
  if (!projectName) {
    questions.push({
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      default: 'my-api',
      validate: (input) => {
        const validation = validator.validateProjectName(input);
        if (!validation.valid) {
          return `Invalid project name: ${validation.errors.join(', ')}`;
        }
        return true;
      },
    });
  }

  // Stack selection (if not provided via --template flag)
  if (!options.template) {
    questions.push({
      type: 'list',
      name: 'stack',
      message: 'Choose your backend stack:',
      choices: [
        {
          name: '⚡ Express + TypeScript (Recommended - Fast & flexible)',
          value: 'express-api',
        },
        {
          name: '🏗️  NestJS (Enterprise - Modular architecture)',
          value: 'nestjs-api',
        },
      ],
      default: 'express-api',
    });
  }

  // Database choice
  questions.push({
    type: 'list',
    name: 'database',
    message: 'Which database?',
    choices: [
      {
        name: '🐘 PostgreSQL (Recommended - Relational database)',
        value: 'postgresql',
      },
      {
        name: '🍃 MongoDB (NoSQL - Flexible schemas)',
        value: 'mongodb',
      },
      {
        name: '📦 SQLite (Local development - Zero config)',
        value: 'sqlite',
      },
      {
        name: '🚫 None (No database)',
        value: 'none',
      },
    ],
    default: 'postgresql',
  });

  // ORM/ODM choice (only if database is selected)
  questions.push({
    type: 'confirm',
    name: 'useOrm',
    message: (answers) => {
      const db = answers.database || config.database;
      if (db === 'postgresql' || db === 'sqlite') {
        return 'Use Prisma ORM? (Type-safe database access)';
      } else if (db === 'mongodb') {
        return 'Use Mongoose ODM? (Schema validation & modeling)';
      }
      return 'Use ORM/ODM?';
    },
    default: true,
    when: (answers) => {
      const db = answers.database || config.database;
      return db !== 'none';
    },
  });

  // Authentication
  questions.push({
    type: 'confirm',
    name: 'includeAuth',
    message: 'Include authentication (JWT)?',
    default: true,
  });

  // API Documentation
  questions.push({
    type: 'confirm',
    name: 'includeSwagger',
    message: 'Include API documentation (Swagger/OpenAPI)?',
    default: true,
  });

  // Docker
  questions.push({
    type: 'confirm',
    name: 'includeDocker',
    message: 'Include Docker configuration?',
    default: true,
  });

  // Package Manager
  questions.push({
    type: 'list',
    name: 'packageManager',
    message: 'Choose package manager:',
    choices: [
      { name: 'npm', value: 'npm' },
      { name: 'pnpm (faster)', value: 'pnpm' },
      { name: 'yarn', value: 'yarn' },
      { name: 'bun (fastest)', value: 'bun' },
    ],
    default: 'npm',
  });

  // Git
  questions.push({
    type: 'confirm',
    name: 'git',
    message: 'Initialize Git repository?',
    default: true,
  });

  const answers = await inquirer.prompt(questions);

  // If template was provided via flag, use it
  if (options.template) {
    answers.stack = options.template;
  }

  // If project name was provided, use it
  if (projectName) {
    answers.projectName = projectName;
  }

  // Combine database and useOrm into the format expected by the rest of the code
  if (answers.database !== 'none') {
    if (answers.database === 'postgresql') {
      answers.database = answers.useOrm
        ? 'postgresql-prisma'
        : 'postgresql-raw';
    } else if (answers.database === 'mongodb') {
      answers.database = answers.useOrm ? 'mongodb-mongoose' : 'mongodb-raw';
    } else if (answers.database === 'sqlite') {
      answers.database = answers.useOrm ? 'sqlite-prisma' : 'sqlite-raw';
    }
  }

  return answers;
}

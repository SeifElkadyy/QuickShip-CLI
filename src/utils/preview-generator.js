import logger from './logger.js';
import chalk from 'chalk';
import { confirm, isCancel } from '@clack/prompts';

/**
 * Generate project preview
 * @param {object} config - Project configuration
 * @returns {Promise<boolean>} User confirmation
 */
export async function showPreview(config) {
  const {
    projectName,
    stack,
    typescript,
    styling,
    packageManager,
    shadcn,
    git,
  } = config;

  logger.log('\n');
  logger.box('📋 Project Preview');

  // Project Structure
  logger.header('📁 Project Structure:', 'white');
  logger.log(getProjectStructure(stack, shadcn));

  // Stack Information
  logger.header('🛠️  Tech Stack:', 'white');
  logger.log(getStackInfo(stack, typescript, styling));

  // Packages
  logger.header('📦 Packages to Install:', 'white');
  logger.log(getPackageInfo(stack, shadcn));

  // Commands
  logger.header('🛠️  Commands that will run:', 'white');
  logger.log(getCommandInfo(projectName, stack, packageManager, shadcn, git));

  // Estimates
  logger.header('⏱️  Estimates:', 'white');
  logger.log(getEstimates(stack, shadcn));

  logger.log('');

  const proceed = await confirm({
    message: 'Proceed with project creation?',
    initialValue: true,
  });

  if (isCancel(proceed)) return false;
  return proceed;
}

/**
 * Get project structure based on stack
 */
function getProjectStructure(stack, shadcn) {
  const structures = {
    nextjs: `
${chalk.blue(projectName + '/')}
├── ${chalk.yellow('app/')}
│   ├── layout.tsx          ${chalk.gray('# Root layout')}
│   ├── page.tsx            ${chalk.gray('# Home page')}
│   └── globals.css         ${chalk.gray('# Global styles')}
├── ${chalk.yellow('components/')}${
      shadcn
        ? `
│   └── ui/                 ${chalk.gray('# shadcn/ui components')}`
        : ''
    }
├── ${chalk.yellow('lib/')}
│   └── utils.ts            ${chalk.gray('# Utilities')}
├── ${chalk.yellow('public/')}              ${chalk.gray('# Static assets')}
├── .env.example           ${chalk.gray('# Environment template')}${
      shadcn
        ? `
├── components.json        ${chalk.gray('# shadcn config')}`
        : ''
    }
├── next.config.ts         ${chalk.gray('# Next.js config')}
├── tailwind.config.ts     ${chalk.gray('# Tailwind config')}
├── tsconfig.json          ${chalk.gray('# TypeScript config')}
├── package.json
└── README.md`,

    t3: `
${chalk.blue(projectName + '/')}
├── ${chalk.yellow('src/')}
│   ├── app/                ${chalk.gray('# Next.js App Router')}
│   ├── server/
│   │   └── api/            ${chalk.gray('# tRPC routers')}
│   └── styles/             ${chalk.gray('# Global styles')}
├── ${chalk.yellow('prisma/')}
│   └── schema.prisma       ${chalk.gray('# Database schema')}
├── ${chalk.yellow('public/')}              ${chalk.gray('# Static assets')}
├── .env.example           ${chalk.gray('# Environment template')}
├── next.config.ts
├── tailwind.config.ts
├── package.json
└── README.md`,

    vite: `
${chalk.blue(projectName + '/')}
├── ${chalk.yellow('src/')}
│   ├── components/         ${chalk.gray('# React components')}
│   ├── pages/              ${chalk.gray('# Route pages')}
│   ├── App.tsx             ${chalk.gray('# Main app component')}
│   └── main.tsx            ${chalk.gray('# Entry point')}
├── ${chalk.yellow('public/')}              ${chalk.gray('# Static assets')}
├── index.html             ${chalk.gray('# HTML template')}
├── vite.config.ts         ${chalk.gray('# Vite config')}
├── tailwind.config.js     ${chalk.gray('# Tailwind config')}
├── tsconfig.json
├── package.json
└── README.md`,

    mern: `
${chalk.blue(projectName + '/')}
├── ${chalk.yellow('client/')}              ${chalk.gray('# React frontend')}
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.tsx
│   └── package.json
├── ${chalk.yellow('server/')}              ${chalk.gray('# Express backend')}
│   ├── models/             ${chalk.gray('# Mongoose models')}
│   ├── routes/             ${chalk.gray('# API routes')}
│   ├── controllers/        ${chalk.gray('# Controllers')}
│   ├── middleware/         ${chalk.gray('# Auth & error handling')}
│   ├── server.js           ${chalk.gray('# Express server')}
│   └── package.json
├── package.json           ${chalk.gray('# Root package.json')}
└── README.md`,
  };

  return structures[stack] || structures.nextjs;
}

/**
 * Get stack information
 */
function getStackInfo(stack, typescript, styling) {
  const stacks = {
    nextjs: [
      '  • Next.js 15+',
      '  • React 19',
      typescript ? '  • TypeScript 5+' : '  • JavaScript',
      styling === 'tailwind' ? '  • Tailwind CSS 4' : `  • ${styling}`,
      '  • ESLint + Prettier',
    ],
    t3: [
      '  • Next.js 15+',
      '  • TypeScript 5+',
      '  • Tailwind CSS 4',
      '  • tRPC (End-to-end type safety)',
      '  • Prisma (Database ORM)',
      '  • NextAuth.js (Authentication)',
    ],
    vite: [
      '  • React 18+',
      '  • Vite 7+',
      typescript ? '  • TypeScript 5+' : '  • JavaScript',
      '  • Tailwind CSS 4',
      '  • React Router 6+',
      '  • Axios',
    ],
    mern: [
      '  • MongoDB + Mongoose',
      '  • Express.js',
      '  • React 18+ + Vite 7+',
      '  • Node.js',
      '  • TypeScript 5+',
      '  • Tailwind CSS 4',
      '  • JWT Authentication',
    ],
  };

  return (stacks[stack] || stacks.nextjs).join('\n');
}

/**
 * Get package information
 */
function getPackageInfo(stack, shadcn) {
  const packages = {
    nextjs: shadcn
      ? '  Total: ~40 packages\n  • Core: next, react, typescript (3)\n  • Styling: tailwindcss, postcss (5)\n  • shadcn/ui: @radix-ui/* (30+)\n  • Dev: eslint, prettier (2)'
      : '  Total: ~25 packages\n  • Core: next, react, typescript (3)\n  • Styling: tailwindcss, postcss (5)\n  • Dev: eslint, prettier (2)',
    t3: '  Total: ~50 packages\n  • Core: next, react, typescript (3)\n  • tRPC: @trpc/*, zod (5)\n  • Database: prisma, @prisma/client (2)\n  • Auth: next-auth (1)\n  • Styling: tailwindcss (5)\n  • Dev: eslint, prettier (2)',
    vite: '  Total: ~30 packages\n  • Core: react, vite, typescript (3)\n  • Router: react-router-dom (1)\n  • HTTP: axios (1)\n  • Styling: tailwindcss, postcss (5)\n  • Dev: eslint, prettier (2)',
    mern: '  Total: ~45 packages\n  • Frontend: react, vite (20)\n  • Backend: express, mongoose (15)\n  • Auth: jsonwebtoken, bcryptjs (2)\n  • Utils: cors, dotenv (5)',
  };

  return packages[stack] || packages.nextjs;
}

/**
 * Get command information
 */
function getCommandInfo(projectName, stack, packageManager, shadcn, git) {
  const pm = packageManager || 'npm';
  const commands = [];

  if (stack === 'nextjs') {
    commands.push(
      `  1. ${chalk.cyan(`npx create-next-app@latest ${projectName}`)}`
    );
    commands.push(`  2. ${chalk.cyan(`cd ${projectName} && ${pm} install`)}`);
    if (shadcn) {
      commands.push(`  3. ${chalk.cyan('npx shadcn@latest init -d')}`);
    }
  } else if (stack === 't3') {
    commands.push(
      `  1. ${chalk.cyan(`npx create-t3-app@latest ${projectName}`)}`
    );
  } else if (stack === 'vite') {
    commands.push(
      `  1. ${chalk.cyan(`npx create-vite@latest ${projectName}`)}`
    );
    commands.push(`  2. ${chalk.cyan(`cd ${projectName} && ${pm} install`)}`);
  } else if (stack === 'mern') {
    commands.push(`  1. ${chalk.cyan(`Create MERN project structure`)}`);
    commands.push(`  2. ${chalk.cyan(`Install frontend dependencies`)}`);
    commands.push(`  3. ${chalk.cyan(`Install backend dependencies`)}`);
  }

  if (git) {
    commands.push(
      `  ${commands.length + 1}. ${chalk.cyan('git init && git commit -m "Initial commit"')}`
    );
  }

  return commands.join('\n');
}

/**
 * Get time and space estimates
 */
function getEstimates(stack, shadcn) {
  const estimates = {
    nextjs: {
      time: shadcn ? '45-60 seconds' : '30-45 seconds',
      space: shadcn ? '~350 MB' : '~250 MB',
    },
    t3: {
      time: '60-90 seconds',
      space: '~400 MB',
    },
    vite: {
      time: '20-30 seconds',
      space: '~200 MB',
    },
    mern: {
      time: '60-90 seconds',
      space: '~450 MB',
    },
  };

  const est = estimates[stack] || estimates.nextjs;
  return `  ⏱️  Time: ${est.time}\n  💾 Disk Space: ${est.space}`;
}

export default {
  showPreview,
};

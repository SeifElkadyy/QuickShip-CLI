import pkg from 'fs-extra';
const { writeFile, readJson, writeJson } = pkg;
import { join } from 'path';

class FileGenerator {
  async generateReadme(projectPath, config) {
    const readme = `# ${config.projectName}

Generated with [QuickShip](https://github.com/SeifElkadyy/QuickShip-CLI) 🚀

## Getting Started

First, run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Framework:** Next.js
- **Language:** ${config.typescript ? 'TypeScript' : 'JavaScript'}
- **Styling:** ${config.styling}
- **Linting:** ESLint
- **Formatting:** Prettier

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [QuickShip Documentation](https://github.com/SeifElkadyy/QuickShip-CLI/docs)

## Deploy

Deploy your Next.js app easily with [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
`;

    await writeFile(join(projectPath, 'README.md'), readme);
  }

  async generateGitignore(projectPath) {
    const gitignore = `# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
`;

    await writeFile(join(projectPath, '.gitignore'), gitignore);
  }

  async generateAgentsFile(projectPath, config) {
    const stackNames = {
      nextjs: 'Next.js (App Router)',
      'react-vite': 'React + Vite',
      't3-stack': 'T3 Stack (Next.js, tRPC, Prisma, NextAuth)',
      'mern-stack': 'MERN Stack (MongoDB, Express, React, Node.js)',
      'express-api': 'Express API',
      'nestjs-api': 'NestJS API',
      'expo-react-native': 'Expo React Native',
    };

    const devCommand =
      config.stack === 'nestjs-api'
        ? 'start:dev'
        : config.stack === 'expo-react-native'
          ? null
          : 'dev';

    const pm = config.packageManager || 'npm';
    const runCmd = pm === 'npm' ? 'npm run' : pm;

    const lines = [
      `# ${config.projectName}`,
      '',
      'Guidance for AI coding agents working in this repository.',
      '',
      '## Stack',
      '',
      `- **Framework:** ${stackNames[config.stack] || config.stack}`,
      `- **Language:** ${config.typescript !== false ? 'TypeScript' : 'JavaScript'}`,
      `- **Package manager:** ${pm}`,
    ];

    if (config.database && config.database !== 'none') {
      lines.push(`- **Database:** ${config.database}`);
    }
    if (config.styling) {
      lines.push(`- **Styling:** ${config.styling}`);
    }
    if (config.includeAuth) {
      lines.push('- **Auth:** JWT / Passport');
    }

    lines.push(
      '',
      '## Commands',
      '',
      devCommand
        ? `- Dev server: \`${runCmd} ${devCommand}\``
        : '- Dev server: `npx expo start`',
      '- Install deps: `' + pm + ' install`'
    );

    lines.push(
      '',
      '## Conventions',
      '',
      '- Generated with [QuickShip](https://github.com/SeifElkadyy/QuickShip-CLI).',
      '- Follow the existing file/folder structure for new code.',
      '- Keep environment secrets in `.env` / `.env.local`, never commit them.'
    );

    await writeFile(join(projectPath, 'AGENTS.md'), lines.join('\n') + '\n');
  }

  async updatePackageJson(projectPath, config) {
    try {
      const packageJsonPath = join(projectPath, 'package.json');
      const packageJson = await readJson(packageJsonPath);

      packageJson.name = config.projectName;
      packageJson.version = '0.1.0';

      await writeJson(packageJsonPath, packageJson, { spaces: 2 });
    } catch (error) {
      // If package.json doesn't exist, create a basic one
      const basicPackageJson = {
        name: config.projectName,
        version: '0.1.0',
        private: true,
        scripts: {
          dev: 'next dev',
          build: 'next build',
          start: 'next start',
          lint: 'next lint',
        },
        dependencies: {
          next: 'latest',
          react: 'latest',
          'react-dom': 'latest',
        },
        devDependencies: {},
      };

      await writeJson(join(projectPath, 'package.json'), basicPackageJson, {
        spaces: 2,
      });
    }
  }
}

export default FileGenerator;

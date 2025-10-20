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

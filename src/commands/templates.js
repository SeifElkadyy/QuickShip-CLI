import chalk from 'chalk';
import boxen from 'boxen';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { showStackComparison } from '../utils/help-system.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Templates command - List available templates with details
 * @param {object} options - Command options
 */
export async function templatesCommand(options = {}) {
  // If --compare flag, show comparison
  if (options.compare) {
    showStackComparison();
    return;
  }

  // Show detailed template list
  console.log('\n');
  console.log(
    boxen(chalk.bold.cyan('📚 Available Templates'), {
      padding: 1,
      margin: 1,
      borderStyle: 'double',
      borderColor: 'cyan',
    })
  );

  // Template details
  const templates = [
    {
      name: 'Next.js',
      emoji: '🌐',
      recommended: true,
      description: 'Full-stack React framework with server components',
      stack: ['Next.js 15+', 'React 19', 'TypeScript', 'Tailwind CSS'],
      features: [
        'App Router',
        'Server Components',
        'API Routes',
        'Image Optimization',
      ],
      bestFor: 'Full-stack web apps, marketing sites, dashboards',
      deploy: ['Vercel', 'Netlify', 'AWS'],
      popularity: 100000,
      command: 'quickship build my-app --template nextjs',
    },
    {
      name: 'T3 Stack',
      emoji: '🔥',
      recommended: false,
      description: 'Type-safe full-stack Next.js with tRPC, Prisma, NextAuth',
      stack: [
        'Next.js 15+',
        'TypeScript',
        'Tailwind CSS',
        'tRPC',
        'Prisma',
        'NextAuth.js',
      ],
      features: [
        'End-to-end type safety',
        'Database ORM',
        'Authentication',
        'tRPC API',
      ],
      bestFor: 'Apps requiring database and authentication',
      deploy: ['Vercel'],
      popularity: 50000,
      command: 'quickship build my-app --template t3',
    },
    {
      name: 'React + Vite',
      emoji: '⚛️',
      recommended: false,
      description: 'Lightning-fast React SPA development',
      stack: ['React 18+', 'Vite 7+', 'TypeScript', 'Tailwind CSS'],
      features: [
        'Blazing fast HMR',
        'React Router',
        'Axios',
        'Optimized builds',
      ],
      bestFor: 'Single-page apps, admin dashboards',
      deploy: ['Netlify', 'Vercel', 'Cloudflare Pages'],
      popularity: 75000,
      command: 'quickship build my-app --template vite',
    },
    {
      name: 'MERN Stack',
      emoji: '🗄️',
      recommended: false,
      description: 'Full-stack MongoDB + Express + React + Node.js',
      stack: ['MongoDB', 'Express.js', 'React', 'Node.js', 'TypeScript'],
      features: ['REST API', 'JWT Auth', 'MongoDB ODM', 'Monorepo structure'],
      bestFor: 'Full-stack CRUD apps, REST APIs',
      deploy: ['Railway', 'Heroku', 'DigitalOcean'],
      popularity: 80000,
      command: 'quickship build my-app --template mern',
    },
  ];

  templates.forEach((template, index) => {
    if (index > 0) {
      console.log('\n' + chalk.blue('━'.repeat(70)));
    }

    console.log(
      '\n' +
        chalk.bold(`${template.emoji} ${template.name}`) +
        (template.recommended ? chalk.yellow(' ⭐ Recommended') : '')
    );
    console.log(chalk.gray('   ' + template.description));

    console.log(chalk.bold('\n   Stack:'));
    template.stack.forEach((tech) => {
      console.log(chalk.cyan('     • ' + tech));
    });

    console.log(chalk.bold('\n   Features:'));
    template.features.forEach((feature) => {
      console.log(chalk.green('     • ' + feature));
    });

    console.log(chalk.bold('\n   Best for: ') + chalk.yellow(template.bestFor));
    console.log(
      chalk.bold('   Deploy: ') + chalk.blue(template.deploy.join(', '))
    );
    console.log(
      chalk.bold('   Popularity: ') + getPopularityBar(template.popularity)
    );

    console.log(chalk.bold('\n   Create:'));
    console.log(chalk.gray('     ' + template.command));
  });

  console.log('\n' + chalk.blue('━'.repeat(70)));

  // Footer with helpful commands
  console.log(chalk.bold('\n💡 Helpful Commands:\n'));
  console.log(
    chalk.cyan('  quickship templates --compare') +
      chalk.gray('  - Compare all templates side-by-side')
  );
  console.log(
    chalk.cyan('  quickship build') +
      chalk.gray('                 - Create a new project (interactive)')
  );
  console.log(
    chalk.cyan('  quickship --help') +
      chalk.gray('                - Show all available commands')
  );

  console.log(chalk.bold('\n📚 Documentation:'));
  console.log(
    chalk.blue('  https://github.com/SeifElkadyy/QuickShip-CLI#templates')
  );

  console.log('');
}

/**
 * Get popularity bar
 */
function getPopularityBar(count) {
  const max = 100000;
  const percentage = Math.round((count / max) * 100);
  const filled = Math.round(percentage / 5);
  const empty = 20 - filled;

  const bar = chalk.green('█'.repeat(filled)) + chalk.gray('░'.repeat(empty));
  return `${bar} ${count >= 1000 ? Math.round(count / 1000) + 'K+' : count} projects`;
}

export default templatesCommand;

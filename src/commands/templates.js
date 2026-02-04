import logger from '../utils/logger.js';
import chalk from 'chalk';
import { showStackComparison } from '../utils/help-system.js';

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
  logger.log('\n');
  logger.box('📚 Available Templates');

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
      logger.log('\n' + chalk.blue('━'.repeat(70)));
    }

    logger.log(
      '\n' +
        chalk.bold(`${template.emoji} ${template.name}`) +
        (template.recommended ? chalk.yellow(' ⭐ Recommended') : '')
    );
    logger.dim('   ' + template.description);

    logger.log(chalk.bold('\n   Stack:'));
    template.stack.forEach((tech) => {
      logger.log(chalk.cyan('     • ' + tech));
    });

    logger.log(chalk.bold('\n   Features:'));
    template.features.forEach((feature) => {
      logger.log(chalk.green('     • ' + feature));
    });

    logger.log(chalk.bold('\n   Best for: ') + chalk.yellow(template.bestFor));
    logger.log(
      chalk.bold('   Deploy: ') + chalk.blue(template.deploy.join(', '))
    );
    logger.log(
      chalk.bold('   Popularity: ') + getPopularityBar(template.popularity)
    );

    logger.log(chalk.bold('\n   Create:'));
    logger.dim('     ' + template.command);
  });

  logger.log('\n' + chalk.blue('━'.repeat(70)));

  // Footer with helpful commands
  logger.header('💡 Helpful Commands:', 'white');
  logger.log(
    chalk.cyan('  quickship templates --compare') +
      chalk.gray('  - Compare all templates side-by-side')
  );
  logger.log(
    chalk.cyan('  quickship build') +
      chalk.gray('                 - Create a new project (interactive)')
  );
  logger.log(
    chalk.cyan('  quickship --help') +
      chalk.gray('                - Show all available commands')
  );

  logger.header('📚 Documentation:', 'white');
  logger.log(
    chalk.blue('  https://github.com/SeifElkadyy/QuickShip-CLI#templates')
  );

  logger.log('');
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

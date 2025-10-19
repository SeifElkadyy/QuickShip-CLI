import chalk from 'chalk';

/**
 * Analyze project name and suggest stack
 * @param {string} projectName - Project name
 * @returns {object} Recommendations
 */
export function analyzeProjectName(projectName) {
  if (!projectName) return null;

  const name = projectName.toLowerCase();
  const recommendations = {
    stack: 'nextjs', // default
    typescript: true,
    styling: 'tailwind',
    shadcn: false,
    reason: '',
  };

  // SaaS/App patterns
  if (
    name.includes('saas') ||
    name.includes('app') ||
    name.includes('platform') ||
    name.includes('dashboard')
  ) {
    recommendations.stack = 'nextjs';
    recommendations.shadcn = true;
    recommendations.reason =
      'SaaS/App projects work great with Next.js + shadcn/ui';
  }

  // E-commerce patterns
  else if (
    name.includes('shop') ||
    name.includes('store') ||
    name.includes('ecommerce') ||
    name.includes('cart')
  ) {
    recommendations.stack = 't3';
    recommendations.shadcn = true;
    recommendations.reason =
      'E-commerce needs database & auth - T3 Stack includes Prisma + NextAuth';
  }

  // Blog/Content patterns
  else if (
    name.includes('blog') ||
    name.includes('content') ||
    name.includes('cms') ||
    name.includes('news')
  ) {
    recommendations.stack = 'nextjs';
    recommendations.shadcn = false;
    recommendations.reason =
      'Content sites benefit from Next.js SSG and SEO features';
  }

  // Portfolio/Landing patterns
  else if (
    name.includes('portfolio') ||
    name.includes('landing') ||
    name.includes('website') ||
    name.includes('marketing')
  ) {
    recommendations.stack = 'nextjs';
    recommendations.shadcn = false;
    recommendations.reason =
      'Marketing sites are perfect for Next.js with great SEO';
  }

  // Admin/Dashboard patterns
  else if (
    name.includes('admin') ||
    name.includes('panel') ||
    name.includes('console') ||
    name.includes('backoffice')
  ) {
    recommendations.stack = 'vite';
    recommendations.shadcn = false;
    recommendations.reason = 'Admin panels work well as SPAs with React + Vite';
  }

  // API/Backend patterns
  else if (
    name.includes('api') ||
    name.includes('backend') ||
    name.includes('server') ||
    name.includes('rest')
  ) {
    recommendations.stack = 'mern';
    recommendations.shadcn = false;
    recommendations.reason =
      'APIs benefit from MERN Stack with Express backend';
  }

  // Database-heavy patterns
  else if (
    name.includes('database') ||
    name.includes('data') ||
    name.includes('analytics') ||
    name.includes('crm')
  ) {
    recommendations.stack = 't3';
    recommendations.shadcn = true;
    recommendations.reason = 'Data-heavy apps need T3 Stack with Prisma ORM';
  }

  // Social/Community patterns
  else if (
    name.includes('social') ||
    name.includes('community') ||
    name.includes('forum') ||
    name.includes('chat')
  ) {
    recommendations.stack = 't3';
    recommendations.shadcn = true;
    recommendations.reason =
      'Social apps need auth & database - T3 Stack is perfect';
  }

  // Tool/Utility patterns
  else if (
    name.includes('tool') ||
    name.includes('util') ||
    name.includes('generator') ||
    name.includes('converter')
  ) {
    recommendations.stack = 'vite';
    recommendations.shadcn = false;
    recommendations.reason = 'Simple tools work great as lightweight Vite apps';
  }

  return recommendations;
}

/**
 * Show smart recommendations
 * @param {string} projectName - Project name
 * @returns {object} Recommendations or null
 */
export function showSmartRecommendations(projectName) {
  const recommendations = analyzeProjectName(projectName);

  if (!recommendations) return null;

  console.log('\n' + chalk.bold.cyan('✨ Smart Recommendations'));
  console.log(chalk.gray('Based on your project name, we recommend:\n'));

  console.log(
    chalk.bold('  Stack: ') + chalk.green(getStackName(recommendations.stack))
  );
  console.log(
    chalk.bold('  TypeScript: ') +
      chalk.green(recommendations.typescript ? 'Yes' : 'No')
  );
  console.log(chalk.bold('  Styling: ') + chalk.green('Tailwind CSS'));
  if (recommendations.shadcn) {
    console.log(chalk.bold('  UI Library: ') + chalk.green('shadcn/ui'));
  }

  console.log('\n' + chalk.yellow('💡 ' + recommendations.reason));
  console.log('');

  return recommendations;
}

/**
 * Get stack display name
 * @param {string} stack - Stack key
 * @returns {string} Display name
 */
function getStackName(stack) {
  const names = {
    nextjs: 'Next.js',
    t3: 'T3 Stack',
    vite: 'React + Vite',
    mern: 'MERN Stack',
  };
  return names[stack] || stack;
}

/**
 * Suggest package manager based on project type
 * @param {string} stack - Stack type
 * @returns {string} Recommended package manager
 */
export function suggestPackageManager(stack) {
  // T3 Stack works best with pnpm
  if (stack === 't3') return 'pnpm';

  // MERN and large projects benefit from pnpm
  if (stack === 'mern') return 'pnpm';

  // Default to npm for simplicity
  return 'npm';
}

/**
 * Get recommended features based on stack
 * @param {string} stack - Stack type
 * @returns {array} Recommended features
 */
export function getRecommendedFeatures(stack) {
  const features = {
    nextjs: [
      'TypeScript',
      'Tailwind CSS',
      'ESLint',
      'Prettier',
      'shadcn/ui (optional)',
    ],
    t3: ['TypeScript', 'Tailwind CSS', 'tRPC', 'Prisma', 'NextAuth.js'],
    vite: ['TypeScript', 'Tailwind CSS', 'React Router', 'Axios'],
    mern: ['TypeScript', 'MongoDB', 'Express', 'JWT Auth', 'Tailwind CSS'],
  };

  return features[stack] || features.nextjs;
}

export default {
  analyzeProjectName,
  showSmartRecommendations,
  suggestPackageManager,
  getRecommendedFeatures,
};

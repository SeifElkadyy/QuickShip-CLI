import inquirer from 'inquirer';
import validator from '../utils/validator.js';

export async function websitePrompts(projectName) {
  const questions = [];

  // Project name
  if (!projectName) {
    questions.push({
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      default: 'my-awesome-project',
      validate: (input) => {
        const validation = validator.validateProjectName(input);
        if (!validation.valid) {
          return `Invalid project name: ${validation.errors.join(', ')}`;
        }
        return true;
      },
    });
  }

  // Stack selection
  questions.push({
    type: 'list',
    name: 'stack',
    message: 'Choose your stack:',
    choices: [
      {
        name: 'Next.js (Recommended - Full-stack React framework)',
        value: 'nextjs',
      },
      {
        name: 'Next.js + T3 Stack (tRPC + Prisma + NextAuth)',
        value: 't3-stack',
      },
      {
        name: 'React + Vite (Fast SPA development)',
        value: 'react-vite',
      },
      {
        name: 'MERN Stack (MongoDB + Express + React + Node.js)',
        value: 'mern-stack',
      },
    ],
  });

  // TypeScript
  questions.push({
    type: 'confirm',
    name: 'typescript',
    message: 'Use TypeScript?',
    default: true,
  });

  // Styling (conditional based on stack)
  questions.push({
    type: 'list',
    name: 'styling',
    message: 'Choose styling framework:',
    choices: [
      { name: 'Tailwind CSS', value: 'tailwind' },
      { name: 'CSS Modules', value: 'css-modules' },
      { name: 'Styled Components', value: 'styled-components' },
    ],
    default: 'tailwind',
    when: (answers) => answers.stack !== 't3-stack', // T3 has Tailwind by default
  });

  // shadcn/ui option for Next.js projects
  questions.push({
    type: 'confirm',
    name: 'shadcn',
    message: 'Add shadcn/ui components?',
    default: false,
    when: (answers) =>
      (answers.stack === 'nextjs' || answers.stack === 't3-stack') &&
      answers.styling === 'tailwind',
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

  if (projectName) {
    answers.projectName = projectName;
  }

  return answers;
}

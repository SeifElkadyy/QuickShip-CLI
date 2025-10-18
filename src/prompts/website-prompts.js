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
        name: 'Next.js (Recommended)',
        value: 'nextjs',
      },
      {
        name: 'React + Vite (Coming Soon)',
        value: 'react-vite',
        disabled: true,
      },
      {
        name: 'MERN Stack (Coming Soon)',
        value: 'mern',
        disabled: true,
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

  // Styling
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

import inquirer from 'inquirer';

export async function mobilePrompts(projectName, options = {}) {
  // If -y flag is set, use defaults
  if (options.yes) {
    return {
      projectName: projectName || 'my-mobile-app',
      stack: options.template || 'expo-react-native',
      expoTemplate: 'tabs', // Default to tabs template with Expo Router
      nativewind: false, // Default to Expo's StyleSheet (official default)
      packageManager: options.packageManager || 'npm',
      git: options.git !== false,
    };
  }

  const answers = {};

  // Project name (if not provided)
  if (!projectName) {
    const { name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Project name:',
        default: 'my-mobile-app',
        validate: (input) => {
          if (!input) return 'Project name is required';
          if (!/^[a-z0-9-_]+$/i.test(input)) {
            return 'Project name can only contain letters, numbers, hyphens, and underscores';
          }
          return true;
        },
      },
    ]);
    answers.projectName = name;
  } else {
    answers.projectName = projectName;
  }

  // Stack selection
  const { stack } = await inquirer.prompt([
    {
      type: 'list',
      name: 'stack',
      message: 'Choose your mobile stack:',
      choices: [
        {
          name: 'Expo React Native (Recommended - Cross-platform mobile)',
          value: 'expo-react-native',
        },
      ],
      default: 'expo-react-native',
    },
  ]);
  answers.stack = stack;

  // Expo template selection
  const { expoTemplate } = await inquirer.prompt([
    {
      type: 'list',
      name: 'expoTemplate',
      message: 'Choose Expo template:',
      choices: [
        {
          name: 'Tabs (with Expo Router - Recommended)',
          value: 'tabs',
          short: 'Tabs',
        },
        {
          name: 'Blank (minimal template)',
          value: 'blank',
          short: 'Blank',
        },
      ],
      default: 'tabs',
    },
  ]);
  answers.expoTemplate = expoTemplate;

  // Styling choice
  const { styling } = await inquirer.prompt([
    {
      type: 'list',
      name: 'styling',
      message: 'Choose styling approach:',
      choices: [
        {
          name: "StyleSheet (Expo's default - Recommended)",
          value: 'stylesheet',
          short: 'StyleSheet',
        },
        {
          name: 'NativeWind (Tailwind CSS for React Native)',
          value: 'nativewind',
          short: 'NativeWind',
        },
      ],
      default: 'stylesheet',
    },
  ]);
  answers.nativewind = styling === 'nativewind';

  // Package manager
  const { packageManager } = await inquirer.prompt([
    {
      type: 'list',
      name: 'packageManager',
      message: 'Choose package manager:',
      choices: [
        { name: 'npm', value: 'npm' },
        { name: 'pnpm', value: 'pnpm' },
        { name: 'yarn', value: 'yarn' },
        { name: 'bun', value: 'bun' },
      ],
      default: 'npm',
    },
  ]);
  answers.packageManager = packageManager;

  // Git initialization
  const { git } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'git',
      message: 'Initialize Git repository?',
      default: true,
    },
  ]);
  answers.git = git;

  return answers;
}

import inquirer from 'inquirer';

export async function selectPlatform() {
  const { platform } = await inquirer.prompt([
    {
      type: 'list',
      name: 'platform',
      message: 'What do you want to build?',
      choices: [
        {
          name: '🌐 Website',
          value: 'website',
        },
        {
          name: '📱 Mobile App',
          value: 'mobile',
        },
        {
          name: '🧩 Browser Extension (Coming Soon)',
          value: 'extension',
          disabled: true,
        },
        {
          name: '⚡ API/Backend (Coming Soon)',
          value: 'api',
          disabled: true,
        },
      ],
    },
  ]);

  return platform;
}

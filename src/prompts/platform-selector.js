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
          name: '🔌 API / Backend',
          value: 'backend',
        },
        {
          name: '📱 Mobile App',
          value: 'mobile',
        },
      ],
    },
  ]);

  return platform;
}

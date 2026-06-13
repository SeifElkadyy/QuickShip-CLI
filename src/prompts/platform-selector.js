import { select, cancel, isCancel } from '@clack/prompts';

export async function selectPlatform() {
  const platform = await select({
    message: 'What do you want to build?',
    options: [
      {
        value: 'website',
        label: '🌐 Website',
        hint: 'Next.js, Vite, T3, MERN',
      },
      { value: 'backend', label: '🔌 API / Backend', hint: 'Express, NestJS' },
      { value: 'mobile', label: '📱 Mobile App', hint: 'Expo React Native' },
    ],
  });

  if (isCancel(platform)) {
    cancel('Cancelled.');
    process.exit(0);
  }

  return platform;
}

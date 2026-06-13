import { text, select, confirm, isCancel, cancel } from '@clack/prompts';

function handleCancel(value) {
  if (isCancel(value)) {
    cancel('Operation cancelled.');
    process.exit(0);
  }
  return value;
}

export async function mobilePrompts(projectName, options = {}) {
  if (options.yes) {
    return {
      projectName: projectName || 'my-mobile-app',
      stack: 'expo-react-native',
      expoTemplate: 'tabs',
      nativewind: false,
      packageManager: options.packageManager || 'npm',
      git: options.git !== false,
    };
  }

  let name = projectName;
  if (!name) {
    name = handleCancel(
      await text({
        message: 'Project name',
        placeholder: 'my-mobile-app',
        defaultValue: 'my-mobile-app',
        validate(v) {
          if (!v) return 'Name required';
          if (!/^[a-z0-9-_]+$/i.test(v)) return 'Letters, numbers, hyphens, underscores only';
        },
      })
    );
  }

  const expoTemplate = handleCancel(
    await select({
      message: 'Expo template',
      options: [
        {
          value: 'tabs',
          label: 'Tabs',
          hint: 'Expo Router file-based routing — recommended',
        },
        { value: 'blank', label: 'Blank', hint: 'Minimal template' },
      ],
    })
  );

  const stylingChoice = handleCancel(
    await select({
      message: 'Styling approach',
      options: [
        { value: 'stylesheet', label: 'StyleSheet', hint: "Expo's default — recommended" },
        { value: 'nativewind', label: 'NativeWind', hint: 'Tailwind CSS for React Native' },
      ],
    })
  );

  const packageManager = handleCancel(
    await select({
      message: 'Package manager',
      options: [
        { value: 'npm', label: 'npm' },
        { value: 'pnpm', label: 'pnpm' },
        { value: 'yarn', label: 'yarn' },
        { value: 'bun', label: 'bun' },
      ],
    })
  );

  const git = handleCancel(
    await confirm({ message: 'Initialize Git repository?', initialValue: true })
  );

  return {
    projectName: name,
    stack: 'expo-react-native',
    expoTemplate,
    nativewind: stylingChoice === 'nativewind',
    packageManager,
    git,
  };
}

import { text, select, confirm, isCancel, cancel, note } from '@clack/prompts';
import validator from '../utils/validator.js';
import { analyzeProjectName } from '../utils/smart-defaults.js';

function handleCancel(value) {
  if (isCancel(value)) {
    cancel('Operation cancelled.');
    process.exit(0);
  }
  return value;
}

export async function websitePrompts(projectName, options = {}) {
  if (options.yes) {
    return {
      projectName: projectName || 'my-awesome-project',
      stack: options.template || 'nextjs',
      typescript: true,
      styling: 'tailwind',
      shadcn: false,
      database: 'none',
      packageManager: options.packageManager || 'npm',
      git: options.git !== false,
    };
  }

  let name = projectName;
  if (!name) {
    name = handleCancel(
      await text({
        message: 'Project name',
        placeholder: 'my-awesome-project',
        defaultValue: 'my-awesome-project',
        validate(input) {
          const v = validator.validateProjectName(input);
          if (!v.valid) return v.errors.join(', ');
        },
      })
    );
  }

  // Smart defaults: analyze project name to pre-select best stack
  const smartDefaults = analyzeProjectName(name);
  const defaultStack = smartDefaults?.stack
    ? ({
        nextjs: 'nextjs',
        t3: 't3-stack',
        vite: 'react-vite',
        mern: 'mern-stack',
      }[smartDefaults.stack] ?? 'nextjs')
    : 'nextjs';

  if (smartDefaults?.reason) {
    note(smartDefaults.reason, '✨ Smart suggestion');
  }

  const stack = handleCancel(
    await select({
      message: 'Choose your stack',
      initialValue: defaultStack,
      options: [
        {
          value: 'nextjs',
          label: 'Next.js',
          hint: 'Recommended — full-stack React framework',
        },
        {
          value: 't3-stack',
          label: 'T3 Stack',
          hint: 'tRPC + Prisma + NextAuth',
        },
        {
          value: 'react-vite',
          label: 'React + Vite',
          hint: 'Fast SPA development',
        },
        {
          value: 'mern-stack',
          label: 'MERN Stack',
          hint: 'MongoDB + Express + React + Node.js',
        },
      ],
    })
  );

  const typescript = handleCancel(
    await confirm({
      message: 'Use TypeScript?',
      initialValue: true,
    })
  );

  let styling = 'tailwind';
  if (stack !== 't3-stack') {
    styling = handleCancel(
      await select({
        message: 'Styling framework',
        options: [
          { value: 'tailwind', label: 'Tailwind CSS', hint: 'Recommended' },
          { value: 'css-modules', label: 'CSS Modules' },
          { value: 'styled-components', label: 'Styled Components' },
        ],
      })
    );
  }

  let shadcn = false;
  if ((stack === 'nextjs' || stack === 't3-stack') && styling === 'tailwind') {
    shadcn = handleCancel(
      await confirm({
        message: 'Add shadcn/ui components?',
        initialValue: false,
      })
    );
  }

  // T3 Stack already ships with Prisma + Postgres — skip the extra question
  let database = 'none';
  if (stack !== 't3-stack') {
    const wantsDatabase = handleCancel(
      await confirm({
        message: 'Add a database?',
        initialValue: false,
      })
    );

    if (wantsDatabase) {
      database = handleCancel(
        await select({
          message: 'Which database?',
          options: [
            {
              value: 'supabase',
              label: 'Supabase',
              hint: 'Postgres + auth + storage',
            },
            { value: 'neon', label: 'Neon', hint: 'Serverless Postgres' },
            {
              value: 'mongodb',
              label: 'MongoDB',
              hint: 'NoSQL, Atlas-hosted',
            },
            {
              value: 'firebase',
              label: 'Firebase',
              hint: 'Firestore + Google Cloud',
            },
            {
              value: 'prisma',
              label: 'Prisma',
              hint: 'ORM — bring your own Postgres URL',
            },
          ],
        })
      );
    }
  }

  const packageManager = handleCancel(
    await select({
      message: 'Package manager',
      options: [
        { value: 'npm', label: 'npm' },
        { value: 'pnpm', label: 'pnpm', hint: 'faster' },
        { value: 'yarn', label: 'yarn' },
        { value: 'bun', label: 'bun', hint: 'fastest' },
      ],
    })
  );

  const git = handleCancel(
    await confirm({
      message: 'Initialize Git repository?',
      initialValue: true,
    })
  );

  return {
    projectName: name,
    stack,
    typescript,
    styling,
    shadcn,
    database,
    packageManager,
    git,
  };
}

import { text, select, confirm, isCancel, cancel } from '@clack/prompts';
import validator from '../utils/validator.js';

function handleCancel(value) {
  if (isCancel(value)) {
    cancel('Operation cancelled.');
    process.exit(0);
  }
  return value;
}

export async function backendPrompts(projectName, options = {}) {
  if (options.yes) {
    return {
      projectName: projectName || 'my-api',
      stack: options.template || 'express-api',
      database: 'postgresql-prisma',
      includeAuth: true,
      includeSwagger: true,
      includeDocker: true,
      packageManager: options.packageManager || 'npm',
      git: options.git !== false,
    };
  }

  let name = projectName;
  if (!name) {
    name = handleCancel(
      await text({
        message: 'Project name',
        placeholder: 'my-api',
        defaultValue: 'my-api',
        validate(input) {
          const v = validator.validateProjectName(input);
          if (!v.valid) return v.errors.join(', ');
        },
      })
    );
  }

  let stack = options.template;
  if (!stack) {
    stack = handleCancel(
      await select({
        message: 'Backend stack',
        options: [
          {
            value: 'express-api',
            label: 'Express + TypeScript',
            hint: 'Recommended — fast & flexible',
          },
          {
            value: 'nestjs-api',
            label: 'NestJS',
            hint: 'Enterprise — modular architecture',
          },
        ],
      })
    );
  }

  const dbBase = handleCancel(
    await select({
      message: 'Database',
      options: [
        { value: 'postgresql', label: 'PostgreSQL', hint: 'Recommended — relational' },
        { value: 'mongodb', label: 'MongoDB', hint: 'NoSQL — flexible schemas' },
        { value: 'sqlite', label: 'SQLite', hint: 'Local dev — zero config' },
        { value: 'none', label: 'None' },
      ],
    })
  );

  let database = dbBase;
  if (dbBase !== 'none') {
    const useOrm = handleCancel(
      await confirm({
        message: dbBase === 'mongodb' ? 'Use Mongoose ODM?' : 'Use Prisma ORM?',
        initialValue: true,
      })
    );
    if (dbBase === 'postgresql') database = useOrm ? 'postgresql-prisma' : 'postgresql-raw';
    else if (dbBase === 'mongodb') database = useOrm ? 'mongodb-mongoose' : 'mongodb-raw';
    else if (dbBase === 'sqlite') database = useOrm ? 'sqlite-prisma' : 'sqlite-raw';
  }

  const includeAuth = handleCancel(
    await confirm({ message: 'Include JWT authentication?', initialValue: true })
  );
  const includeSwagger = handleCancel(
    await confirm({ message: 'Include Swagger/OpenAPI docs?', initialValue: true })
  );
  const includeDocker = handleCancel(
    await confirm({ message: 'Include Docker configuration?', initialValue: true })
  );

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
    await confirm({ message: 'Initialize Git repository?', initialValue: true })
  );

  return {
    projectName: name,
    stack,
    database,
    includeAuth,
    includeSwagger,
    includeDocker,
    packageManager,
    git,
  };
}

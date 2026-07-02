import logger from '../utils/logger.js';
import { execa } from 'execa';
import Spinner from '../utils/spinner.js';
import {
  getPackageManager,
  libDir,
  writeClientFile,
  appendEnvVars,
} from '../utils/add-helpers.js';

const spinner = new Spinner();

const DB_SUPPORTED = ['nextjs', 'react-vite', 'express', 'nestjs'];

function assertSupported(name, projectType) {
  if (!DB_SUPPORTED.includes(projectType)) {
    logger.error(
      `${name} is supported for: ${DB_SUPPORTED.join(', ')} projects`
    );
    process.exit(1);
  }
}

async function install(pkgName, cwd) {
  const pm = await getPackageManager(cwd);
  const addCmd = pm === 'npm' ? 'install' : 'add';
  await execa(pm, [addCmd, pkgName], { stdio: 'pipe', cwd });
}

export async function addSupabaseDatabase(projectType, cwd = process.cwd()) {
  assertSupported('Supabase', projectType);
  spinner.start('Installing Supabase client...');

  try {
    await install('@supabase/supabase-js', cwd);
    spinner.succeed('Supabase client installed!');

    const wrote = await appendEnvVars(
      projectType,
      `# Supabase\n# Get these from: https://supabase.com/dashboard/project/_/settings/api\nSUPABASE_URL=your_supabase_project_url\nSUPABASE_ANON_KEY=your_supabase_anon_key\n`,
      cwd
    );
    if (wrote) logger.success('Environment variables added!');

    const clientContent = `import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);
`;
    const client = await writeClientFile(
      projectType,
      'supabase.ts',
      clientContent,
      cwd
    );
    if (client.written) {
      logger.success(`Created ${client.path}`);
    } else {
      logger.dim(`Skipped ${client.path} (already exists)`);
    }

    logger.success('\n✅ Supabase is now set up!\n');
    logger.info('Next steps:\n');
    logger.info('1. Create a project at: https://supabase.com/dashboard');
    logger.info('2. Add your project URL and anon key to your env file\n');
    logger.info('3. Use the client:\n');
    logger.dim(
      `   import { supabase } from '${libDir(projectType)}/supabase';\n`
    );
    logger.info(
      '📚 Documentation: https://supabase.com/docs/reference/javascript/introduction'
    );
  } catch (error) {
    spinner.fail('Failed to set up Supabase');
    throw error;
  }
}

export async function addNeon(projectType, cwd = process.cwd()) {
  assertSupported('Neon', projectType);
  spinner.start('Installing Neon client...');

  try {
    await install('@neondatabase/serverless', cwd);
    spinner.succeed('Neon client installed!');

    const wrote = await appendEnvVars(
      projectType,
      `# Neon\n# Get this from: https://console.neon.tech\nDATABASE_URL=your_neon_connection_string\n`,
      cwd
    );
    if (wrote) logger.success('Environment variables added!');

    const clientContent = `import { neon } from '@neondatabase/serverless';

export const sql = neon(process.env.DATABASE_URL!);
`;
    const client = await writeClientFile(
      projectType,
      'db.ts',
      clientContent,
      cwd
    );
    if (client.written) {
      logger.success(`Created ${client.path}`);
    } else {
      logger.dim(`Skipped ${client.path} (already exists)`);
    }

    logger.success('\n✅ Neon is now set up!\n');
    logger.info('Next steps:\n');
    logger.info('1. Create a project at: https://console.neon.tech');
    logger.info('2. Add your connection string to your env file\n');
    logger.info('3. Query your database:\n');
    logger.dim(`   import { sql } from '${libDir(projectType)}/db';`);
    logger.dim('   const rows = await sql`SELECT * FROM users`;\n');
    logger.info(
      '📚 Documentation: https://neon.tech/docs/serverless/serverless-driver'
    );
  } catch (error) {
    spinner.fail('Failed to set up Neon');
    throw error;
  }
}

export async function addMongoDatabase(projectType, cwd = process.cwd()) {
  assertSupported('MongoDB', projectType);
  spinner.start('Installing MongoDB driver...');

  try {
    await install('mongodb', cwd);
    spinner.succeed('MongoDB driver installed!');

    const wrote = await appendEnvVars(
      projectType,
      `# MongoDB\n# Get this from: https://cloud.mongodb.com\nMONGODB_URI=your_mongodb_connection_string\n`,
      cwd
    );
    if (wrote) logger.success('Environment variables added!');

    const clientContent = `import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI!);
let connected = false;

export async function getDb() {
  if (!connected) {
    await client.connect();
    connected = true;
  }
  return client.db();
}
`;
    const client = await writeClientFile(
      projectType,
      'mongodb.ts',
      clientContent,
      cwd
    );
    if (client.written) {
      logger.success(`Created ${client.path}`);
    } else {
      logger.dim(`Skipped ${client.path} (already exists)`);
    }

    logger.success('\n✅ MongoDB is now set up!\n');
    logger.info('Next steps:\n');
    logger.info('1. Create a cluster at: https://cloud.mongodb.com');
    logger.info('2. Add your connection string to your env file\n');
    logger.info('3. Use the client:\n');
    logger.dim(`   import { getDb } from '${libDir(projectType)}/mongodb';`);
    logger.dim('   const db = await getDb();\n');
    logger.info(
      '📚 Documentation: https://www.mongodb.com/docs/drivers/node/current/'
    );
  } catch (error) {
    spinner.fail('Failed to set up MongoDB');
    throw error;
  }
}

export async function addFirebase(projectType, cwd = process.cwd()) {
  assertSupported('Firebase', projectType);
  spinner.start('Installing Firebase SDK...');

  try {
    await install('firebase', cwd);
    spinner.succeed('Firebase SDK installed!');

    const wrote = await appendEnvVars(
      projectType,
      `# Firebase\n# Get these from: https://console.firebase.google.com (Project settings)\nFIREBASE_API_KEY=your_api_key\nFIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com\nFIREBASE_PROJECT_ID=your_project_id\nFIREBASE_STORAGE_BUCKET=your_project.appspot.com\nFIREBASE_MESSAGING_SENDER_ID=your_sender_id\nFIREBASE_APP_ID=your_app_id\n`,
      cwd
    );
    if (wrote) logger.success('Environment variables added!');

    const clientContent = `import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
`;
    const client = await writeClientFile(
      projectType,
      'firebase.ts',
      clientContent,
      cwd
    );
    if (client.written) {
      logger.success(`Created ${client.path}`);
    } else {
      logger.dim(`Skipped ${client.path} (already exists)`);
    }

    logger.success('\n✅ Firebase is now set up!\n');
    logger.info('Next steps:\n');
    logger.info('1. Create a project at: https://console.firebase.google.com');
    logger.info('2. Add your config values to your env file\n');
    logger.info('3. Use Firestore:\n');
    logger.dim(`   import { db } from '${libDir(projectType)}/firebase';`);
    logger.dim(
      "   import { collection, getDocs } from 'firebase/firestore';\n"
    );
    logger.info('📚 Documentation: https://firebase.google.com/docs/firestore');
  } catch (error) {
    spinner.fail('Failed to set up Firebase');
    throw error;
  }
}

/**
 * Set up Prisma with a Postgres provider (used both by `add prisma` and
 * scaffold-time database setup); does not run `prisma init` interactively
 * so it's safe to call non-interactively from the build pipeline.
 */
export async function addPrismaDatabase(projectType, cwd = process.cwd()) {
  assertSupported('Prisma', projectType);
  spinner.start('Installing Prisma...');

  try {
    const pm = await getPackageManager(cwd);
    const addCmd = pm === 'npm' ? 'install' : 'add';

    await execa(pm, [addCmd, '@prisma/client'], { stdio: 'pipe', cwd });
    await execa(pm, [addCmd, '-D', 'prisma'], { stdio: 'pipe', cwd });

    spinner.succeed('Prisma installed!');

    await execa(
      'npx',
      ['prisma', 'init', '--datasource-provider', 'postgresql'],
      {
        stdio: 'pipe',
        cwd,
      }
    );

    spinner.succeed('Prisma initialized!');

    logger.success('\n✅ Prisma is now set up!\n');
    logger.info('Next steps:\n');
    logger.info('1. Add your database URL to your env file');
    logger.info('2. Define your schema in prisma/schema.prisma');
    logger.info('3. Run: npx prisma migrate dev --name init');
    logger.info('4. Run: npx prisma generate\n');
    logger.info('📚 Documentation: https://www.prisma.io/docs');
  } catch (error) {
    spinner.fail('Failed to set up Prisma');
    throw error;
  }
}

export async function setupDatabase(
  provider,
  projectType,
  cwd = process.cwd()
) {
  switch (provider) {
    case 'supabase':
      return addSupabaseDatabase(projectType, cwd);
    case 'neon':
      return addNeon(projectType, cwd);
    case 'mongodb':
    case 'mongo':
      return addMongoDatabase(projectType, cwd);
    case 'firebase':
      return addFirebase(projectType, cwd);
    case 'prisma':
      return addPrismaDatabase(projectType, cwd);
    default:
      throw new Error(`Unknown database provider: ${provider}`);
  }
}

export default {
  addSupabaseDatabase,
  addNeon,
  addMongoDatabase,
  addFirebase,
  addPrismaDatabase,
  setupDatabase,
};

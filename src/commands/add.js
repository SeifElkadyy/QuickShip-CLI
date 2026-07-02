import logger from '../utils/logger.js';
import { execa } from 'execa';
import Spinner from '../utils/spinner.js';
import pkg from 'fs-extra';
const { pathExists, readJson, writeFile, ensureDir } = pkg;
import { join } from 'path';
import { select, isCancel, cancel } from '@clack/prompts';
import {
  getPackageManager,
  libDir,
  writeClientFile,
  appendEnvVars,
} from '../utils/add-helpers.js';
import {
  addSupabaseDatabase,
  addNeon,
  addMongoDatabase,
  addFirebase,
} from './database-providers.js';

function handleCancel(value) {
  if (isCancel(value)) {
    cancel('Operation cancelled.');
    process.exit(0);
  }
  return value;
}

const spinner = new Spinner();

export async function addCommand(feature, options) {
  try {
    // Detect project type
    const projectType = await detectProjectType();

    if (!projectType) {
      logger.error(
        'No supported project detected. Make sure you are in a Next.js, React, Express, NestJS, or Expo project directory.'
      );
      process.exit(1);
    }

    logger.info(`Detected project type: ${projectType}`);

    // Add the requested feature
    switch (feature) {
      case 'shadcn':
      case 'shadcn-ui':
      case 'ui':
        await addShadcn(projectType);
        break;

      case 'auth':
      case 'nextauth':
        await addAuth(projectType, options);
        break;

      case 'database':
      case 'db':
        await addDatabase(projectType, options);
        break;

      case 'prisma':
        await addPrisma(projectType);
        break;

      case 'stripe':
        await addStripe(projectType);
        break;

      case 'resend':
        await addResend(projectType);
        break;

      case 'sentry':
        await addSentry(projectType);
        break;

      case 'posthog':
        await addPosthog(projectType);
        break;

      case 'i18n':
        await addI18n(projectType);
        break;

      case 'vitest':
        await addVitest(projectType);
        break;

      case 'playwright':
        await addPlaywright(projectType);
        break;

      case 'trpc':
        await addTrpc(projectType);
        break;

      default:
        logger.error(
          `Unknown feature: ${feature}\n\nAvailable features:\n  - shadcn (shadcn/ui components)\n  - auth (Clerk / Supabase / NextAuth)\n  - database (Supabase / Neon / MongoDB / Firebase / Prisma)\n  - prisma (Prisma ORM directly)\n  - stripe (Stripe payments)\n  - resend (Resend transactional email)\n  - sentry (Sentry error tracking)\n  - posthog (PostHog analytics)\n  - i18n (next-intl internationalization)\n  - vitest (Vitest unit testing)\n  - playwright (Playwright e2e testing)\n  - trpc (tRPC type-safe API layer)`
        );
        process.exit(1);
    }
  } catch (error) {
    logger.error(`Failed to add ${feature}`);
    if (options.verbose) {
      console.error(error);
    }
    process.exit(1);
  }
}

async function detectProjectType() {
  const cwd = process.cwd();

  // Check if package.json exists
  const packageJsonPath = join(cwd, 'package.json');
  const exists = await pathExists(packageJsonPath);

  if (!exists) {
    return null;
  }

  const packageJson = await readJson(packageJsonPath);
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

  // Check for Next.js
  if (deps.next) {
    return 'nextjs';
  }

  // Check for NestJS
  if (deps['@nestjs/core']) {
    return 'nestjs';
  }

  // Check for Expo
  if (deps.expo) {
    return 'expo';
  }

  // Check for Express
  if (deps.express) {
    return 'express';
  }

  // Check for React + Vite
  if (deps.react && deps.vite) {
    return 'react-vite';
  }

  // Check for React (general)
  if (deps.react) {
    return 'react';
  }

  return null;
}

async function addShadcn(projectType) {
  if (projectType !== 'nextjs') {
    logger.error('shadcn/ui is only supported for Next.js projects');
    process.exit(1);
  }

  logger.info('\nInitializing shadcn/ui...');

  try {
    await execa('npx', ['shadcn@latest', 'init', '-d', '-y'], {
      stdio: 'inherit',
    });

    logger.success('\nshadcn/ui initialized successfully!');

    logger.success('\nshadcn/ui is now set up!');
    logger.info('\nNext steps:');
    logger.info('  - Add components: npx shadcn@latest add button');
    logger.info('  - Browse components: https://ui.shadcn.com');
  } catch (error) {
    spinner.fail('Failed to initialize shadcn/ui');
    throw error;
  }
}

async function addAuth(projectType, options) {
  if (projectType !== 'nextjs') {
    logger.error('Authentication is only supported for Next.js projects');
    process.exit(1);
  }

  // Determine which provider to use
  let provider = options.provider;

  // If no provider specified, ask the user
  if (!provider) {
    provider = handleCancel(
      await select({
        message: 'Which authentication provider?',
        options: [
          {
            value: 'clerk',
            label: 'Clerk',
            hint: 'Easiest — pre-built UI components',
          },
          {
            value: 'supabase',
            label: 'Supabase',
            hint: 'Auth + Database + Storage',
          },
          {
            value: 'nextauth',
            label: 'NextAuth.js',
            hint: 'Flexible auth for Next.js',
          },
        ],
      })
    );
  }

  // Call the appropriate function based on provider
  switch (provider.toLowerCase()) {
    case 'clerk':
      await addClerk();
      break;
    case 'supabase':
      await addSupabase();
      break;
    case 'nextauth':
      await addNextAuth();
      break;
    default:
      logger.error(
        `Unknown auth provider: ${provider}\n\nAvailable providers:\n  - clerk\n  - supabase\n  - nextauth`
      );
      process.exit(1);
  }
}

async function addClerk() {
  spinner.start('Installing Clerk...');

  try {
    const cwd = process.cwd();
    const pm = await getPackageManager();
    const addCmd = pm === 'npm' ? 'install' : 'add';

    // Install Clerk
    await execa(pm, [addCmd, '@clerk/nextjs'], {
      stdio: 'pipe',
      cwd,
    });

    spinner.succeed('Clerk installed successfully!');

    // Create middleware.ts
    spinner.start('Creating middleware configuration...');

    const middlewarePath = join(cwd, 'middleware.ts');
    const middlewareExists = await pathExists(middlewarePath);

    const middlewareContent = `import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/protected(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
`;

    if (middlewareExists) {
      logger.warning(
        '\nmiddleware.ts already exists. Skipping middleware creation.'
      );
      logger.info(
        'Please manually add Clerk middleware to your existing middleware.ts'
      );
    } else {
      await writeFile(middlewarePath, middlewareContent, 'utf-8');
      spinner.succeed('Middleware created!');
    }

    // Create .env.local template
    const envPath = join(cwd, '.env.local');
    const envExists = await pathExists(envPath);

    if (!envExists) {
      const envContent = `# Clerk Environment Variables
# Get these from: https://dashboard.clerk.com/

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
CLERK_SECRET_KEY=your_secret_key_here

# Optional: Customize sign-in/sign-up URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
`;
      await writeFile(envPath, envContent, 'utf-8');
      logger.success('.env.local template created!');
    }

    logger.success('\n✅ Clerk authentication is now set up!\n');
    logger.info('Next steps:\n');
    logger.info(
      '1. Get your Clerk API keys from: https://dashboard.clerk.com/'
    );
    logger.info('2. Add your keys to .env.local\n');
    logger.info('3. Wrap your app with ClerkProvider in app/layout.tsx:\n');
    logger.dim('   import { ClerkProvider } from "@clerk/nextjs";\n');
    logger.dim('   export default function RootLayout({ children }) {');
    logger.dim('     return (');
    logger.dim('       <ClerkProvider>');
    logger.dim('         <html lang="en">');
    logger.dim('           <body>{children}</body>');
    logger.dim('         </html>');
    logger.dim('       </ClerkProvider>');
    logger.dim('     );');
    logger.dim('   }\n');
    logger.info('4. Use Clerk components in your pages:\n');
    logger.dim(
      '   import { SignIn, SignUp, UserButton } from "@clerk/nextjs";\n'
    );
    logger.info(
      '5. Protect routes by updating the isProtectedRoute matcher in middleware.ts\n'
    );
    logger.info('📚 Documentation: https://clerk.com/docs/quickstarts/nextjs');
  } catch (error) {
    spinner.fail('Failed to set up Clerk');
    throw error;
  }
}

async function addSupabase() {
  spinner.start('Installing Supabase...');

  try {
    const cwd = process.cwd();
    const pm = await getPackageManager();
    const addCmd = pm === 'npm' ? 'install' : 'add';

    // Install Supabase packages
    await execa(pm, [addCmd, '@supabase/supabase-js', '@supabase/ssr'], {
      stdio: 'pipe',
      cwd,
    });

    spinner.succeed('Supabase packages installed successfully!');

    // Create utils directory
    spinner.start('Creating Supabase configuration...');
    const utilsDir = join(cwd, 'utils');
    await ensureDir(utilsDir);

    // Create Supabase client utilities
    const supabaseClientPath = join(utilsDir, 'supabase', 'client.ts');
    await ensureDir(join(utilsDir, 'supabase'));

    const clientContent = `import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
`;

    await writeFile(supabaseClientPath, clientContent, 'utf-8');

    // Create server client
    const serverClientPath = join(utilsDir, 'supabase', 'server.ts');
    const serverContent = `import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The \`setAll\` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
`;

    await writeFile(serverClientPath, serverContent, 'utf-8');

    // Create middleware
    const middlewarePath = join(cwd, 'middleware.ts');
    const middlewareExists = await pathExists(middlewarePath);

    const middlewareContent = `import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Optionally protect routes
  // if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
`;

    if (middlewareExists) {
      logger.warning(
        '\nmiddleware.ts already exists. Skipping middleware creation.'
      );
      logger.info(
        'Please manually add Supabase middleware to your existing middleware.ts'
      );
    } else {
      await writeFile(middlewarePath, middlewareContent, 'utf-8');
      spinner.succeed('Configuration files created!');
    }

    // Create .env.local template
    const envPath = join(cwd, '.env.local');
    const envExists = await pathExists(envPath);

    if (!envExists) {
      const envContent = `# Supabase Environment Variables
# Get these from: https://supabase.com/dashboard/project/_/settings/api

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
`;
      await writeFile(envPath, envContent, 'utf-8');
      logger.success('.env.local template created!');
    }

    logger.success('\n✅ Supabase is now set up!\n');
    logger.info('Next steps:\n');
    logger.info(
      '1. Create a Supabase project at: https://supabase.com/dashboard'
    );
    logger.info('2. Get your project URL and anon key from the API settings');
    logger.info('3. Add them to .env.local\n');
    logger.info('4. Use Supabase in your app:\n');
    logger.dim('   // Client Component');
    logger.dim('   import { createClient } from "@/utils/supabase/client";\n');
    logger.dim('   // Server Component');
    logger.dim('   import { createClient } from "@/utils/supabase/server";\n');
    logger.info('5. Set up authentication:\n');
    logger.dim('   const supabase = createClient();');
    logger.dim('   await supabase.auth.signUp({ email, password });\n');
    logger.info('6. Enable Row Level Security in your Supabase dashboard\n');
    logger.info('📚 Documentation: https://supabase.com/docs/guides/auth');
  } catch (error) {
    spinner.fail('Failed to set up Supabase');
    throw error;
  }
}

async function addNextAuth() {
  spinner.start('Installing NextAuth.js...');

  try {
    const pm = await getPackageManager();
    await execa(pm, [pm === 'npm' ? 'install' : 'add', 'next-auth'], {
      stdio: 'pipe',
    });

    spinner.succeed('NextAuth.js installed successfully!');

    logger.success('\nNextAuth.js is now installed!');
    logger.info('\nNext steps:');
    logger.info('  1. Create app/api/auth/[...nextauth]/route.ts');
    logger.info('  2. Configure providers in the route');
    logger.info('  3. Wrap your app with SessionProvider');
    logger.info('\n📚 Documentation: https://next-auth.js.org');
  } catch (error) {
    spinner.fail('Failed to install NextAuth.js');
    throw error;
  }
}

async function addDatabase(projectType, options = {}) {
  const supported = ['nextjs', 'react-vite', 'express', 'nestjs'];
  if (!supported.includes(projectType)) {
    logger.error(`Database is supported for: ${supported.join(', ')} projects`);
    process.exit(1);
  }

  let provider = options.provider;
  if (!provider) {
    provider = handleCancel(
      await select({
        message: 'Which database?',
        options: [
          {
            value: 'supabase',
            label: 'Supabase',
            hint: 'Postgres + auth + storage',
          },
          { value: 'neon', label: 'Neon', hint: 'Serverless Postgres' },
          { value: 'mongodb', label: 'MongoDB', hint: 'NoSQL, Atlas-hosted' },
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

  switch (provider.toLowerCase()) {
    case 'supabase':
      await addSupabaseDatabase(projectType);
      return;
    case 'neon':
      await addNeon(projectType);
      return;
    case 'mongodb':
    case 'mongo':
      await addMongoDatabase(projectType);
      return;
    case 'firebase':
      await addFirebase(projectType);
      return;
    case 'prisma':
      await addPrisma(projectType);
      return;
    default:
      logger.error(
        `Unknown database provider: ${provider}\n\nAvailable providers:\n  - supabase\n  - neon\n  - mongodb\n  - firebase\n  - prisma`
      );
      process.exit(1);
  }
}

async function addPrisma(projectType) {
  const supported = ['nextjs', 'react-vite', 'express', 'nestjs'];
  if (!supported.includes(projectType)) {
    logger.error(`Prisma is supported for: ${supported.join(', ')} projects`);
    process.exit(1);
  }

  spinner.start('Installing Prisma...');

  try {
    const pm = await getPackageManager();
    const addCmd = pm === 'npm' ? 'install' : 'add';

    await execa(pm, [addCmd, '@prisma/client'], { stdio: 'pipe' });
    await execa(pm, [addCmd, '-D', 'prisma'], { stdio: 'pipe' });

    spinner.succeed('Prisma installed successfully!');

    spinner.start('Initializing Prisma...');

    await execa('npx', ['prisma', 'init'], {
      stdio: 'inherit',
    });

    spinner.succeed('Prisma initialized!');

    logger.success('\nPrisma is now set up!');
    logger.info('\nNext steps:');
    logger.info('  1. Define your schema in prisma/schema.prisma');
    logger.info('  2. Run: npx prisma migrate dev --name init');
    logger.info('  3. Run: npx prisma generate');
    logger.info('\nDocumentation: https://www.prisma.io/docs');
  } catch (error) {
    spinner.fail('Failed to set up Prisma');
    throw error;
  }
}

const STRIPE_SUPPORTED = ['nextjs', 'react-vite', 'express', 'nestjs'];

async function addStripe(projectType) {
  if (!STRIPE_SUPPORTED.includes(projectType)) {
    logger.error(
      `Stripe is supported for: ${STRIPE_SUPPORTED.join(', ')} projects`
    );
    process.exit(1);
  }

  spinner.start('Installing Stripe...');

  try {
    const pm = await getPackageManager();
    const addCmd = pm === 'npm' ? 'install' : 'add';

    await execa(pm, [addCmd, 'stripe'], { stdio: 'pipe' });

    spinner.succeed('Stripe installed successfully!');

    const wrote = await appendEnvVars(
      projectType,
      `# Stripe\n# Get these from: https://dashboard.stripe.com/apikeys\nSTRIPE_SECRET_KEY=sk_test_your_key_here\nSTRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here\n`
    );
    if (wrote) logger.success('Environment variables added!');

    const clientContent = `import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});
`;
    const client = await writeClientFile(
      projectType,
      'stripe.ts',
      clientContent
    );
    if (client.written) {
      logger.success(`Created ${client.path}`);
    } else {
      logger.dim(`Skipped ${client.path} (already exists)`);
    }

    logger.success('\n✅ Stripe is now set up!\n');
    logger.info('Next steps:\n');
    logger.info(
      '1. Get your API keys from: https://dashboard.stripe.com/apikeys'
    );
    logger.info('2. Add your keys to your env file\n');
    logger.info('3. Use the Stripe client:\n');
    logger.dim(`   import { stripe } from '${libDir(projectType)}/stripe';\n`);
    logger.info('4. Set up webhooks: https://dashboard.stripe.com/webhooks\n');
    logger.info('📚 Documentation: https://stripe.com/docs/api');
  } catch (error) {
    spinner.fail('Failed to set up Stripe');
    throw error;
  }
}

const RESEND_SUPPORTED = ['nextjs', 'react-vite', 'express', 'nestjs'];

async function addResend(projectType) {
  if (!RESEND_SUPPORTED.includes(projectType)) {
    logger.error(
      `Resend is supported for: ${RESEND_SUPPORTED.join(', ')} projects`
    );
    process.exit(1);
  }

  spinner.start('Installing Resend...');

  try {
    const pm = await getPackageManager();
    const addCmd = pm === 'npm' ? 'install' : 'add';

    await execa(pm, [addCmd, 'resend'], { stdio: 'pipe' });

    spinner.succeed('Resend installed successfully!');

    const wrote = await appendEnvVars(
      projectType,
      `# Resend\n# Get your API key from: https://resend.com/api-keys\nRESEND_API_KEY=re_your_api_key_here\n`
    );
    if (wrote) logger.success('Environment variables added!');

    const clientContent = `import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);
`;
    const client = await writeClientFile(
      projectType,
      'resend.ts',
      clientContent
    );
    if (client.written) {
      logger.success(`Created ${client.path}`);
    } else {
      logger.dim(`Skipped ${client.path} (already exists)`);
    }

    logger.success('\n✅ Resend is now set up!\n');
    logger.info('Next steps:\n');
    logger.info('1. Get your API key from: https://resend.com/api-keys');
    logger.info('2. Add your key to your env file\n');
    logger.info('3. Send an email:\n');
    logger.dim(`   import { resend } from '${libDir(projectType)}/resend';\n`);
    logger.dim('   await resend.emails.send({');
    logger.dim("     from: 'you@yourdomain.com',");
    logger.dim("     to: 'user@example.com',");
    logger.dim("     subject: 'Hello',");
    logger.dim("     html: '<p>Hello world</p>',");
    logger.dim('   });\n');
    logger.info('📚 Documentation: https://resend.com/docs');
  } catch (error) {
    spinner.fail('Failed to set up Resend');
    throw error;
  }
}

const SENTRY_SUPPORTED = ['nextjs', 'react-vite', 'express', 'nestjs', 'expo'];

async function addSentry(projectType) {
  if (!SENTRY_SUPPORTED.includes(projectType)) {
    logger.error(
      `Sentry is supported for: ${SENTRY_SUPPORTED.join(', ')} projects`
    );
    process.exit(1);
  }

  spinner.start('Setting up Sentry...');

  try {
    if (projectType === 'nextjs') {
      spinner.stop();
      await execa('npx', ['@sentry/wizard@latest', '-i', 'nextjs'], {
        stdio: 'inherit',
      });
      logger.success('\n✅ Sentry is now set up!\n');
      logger.info(
        '📚 Documentation: https://docs.sentry.io/platforms/javascript/guides/nextjs/'
      );
      return;
    }

    const pm = await getPackageManager();
    const addCmd = pm === 'npm' ? 'install' : 'add';
    const sentryPackage =
      projectType === 'expo' ? '@sentry/react-native' : '@sentry/node';

    await execa(pm, [addCmd, sentryPackage], { stdio: 'pipe' });

    spinner.succeed('Sentry installed successfully!');

    const wrote = await appendEnvVars(
      projectType,
      `# Sentry\n# Get your DSN from: https://sentry.io/\nSENTRY_DSN=your_sentry_dsn_here\n`
    );
    if (wrote) logger.success('Environment variables added!');

    const initContent = `import * as Sentry from '${sentryPackage}';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
`;

    if (projectType === 'expo') {
      // Expo has no lib/ convention by default; write to project root instead
      const cwd = process.cwd();
      const rootPath = join(cwd, 'sentry.ts');
      if (!(await pathExists(rootPath))) {
        await writeFile(rootPath, initContent, 'utf-8');
        logger.success(`Created ${rootPath}`);
        logger.info('Import it once at your app entry point (e.g. App.tsx):');
        logger.dim("   import './sentry';\n");
      } else {
        logger.dim(`Skipped ${rootPath} (already exists)`);
      }
    } else {
      const client = await writeClientFile(
        projectType,
        'sentry.ts',
        initContent
      );
      if (client.written) {
        logger.success(`Created ${client.path}`);
        logger.info('Import it once at your app entry point:');
        logger.dim(`   import '${libDir(projectType)}/sentry';\n`);
      } else {
        logger.dim(`Skipped ${client.path} (already exists)`);
      }
    }

    logger.success('\n✅ Sentry is now set up!\n');
    logger.info('Next steps:\n');
    logger.info('1. Create a project at: https://sentry.io/');
    logger.info('2. Add your DSN to your env file\n');
    logger.info(
      `📚 Documentation: https://docs.sentry.io/platforms/javascript/guides/${projectType === 'expo' ? 'react-native' : 'node'}/`
    );
  } catch (error) {
    spinner.fail('Failed to set up Sentry');
    throw error;
  }
}

const POSTHOG_SUPPORTED = ['nextjs', 'react-vite', 'express', 'nestjs'];

async function addPosthog(projectType) {
  if (!POSTHOG_SUPPORTED.includes(projectType)) {
    logger.error(
      `PostHog is supported for: ${POSTHOG_SUPPORTED.join(', ')} projects`
    );
    process.exit(1);
  }

  const isBackend = projectType === 'express' || projectType === 'nestjs';
  const pkgName = isBackend ? 'posthog-node' : 'posthog-js';

  spinner.start('Installing PostHog...');

  try {
    const pm = await getPackageManager();
    const addCmd = pm === 'npm' ? 'install' : 'add';

    await execa(pm, [addCmd, pkgName], { stdio: 'pipe' });

    spinner.succeed('PostHog installed successfully!');

    const wrote = await appendEnvVars(
      projectType,
      isBackend
        ? `# PostHog\n# Get this from: https://app.posthog.com/project/settings\nPOSTHOG_API_KEY=your_posthog_project_api_key\nPOSTHOG_HOST=https://app.posthog.com\n`
        : `# PostHog\n# Get this from: https://app.posthog.com/project/settings\nNEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_api_key\nNEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com\n`
    );
    if (wrote) logger.success('Environment variables added!');

    const clientContent = isBackend
      ? `import { PostHog } from 'posthog-node';

export const posthog = new PostHog(process.env.POSTHOG_API_KEY!, {
  host: process.env.POSTHOG_HOST,
});
`
      : `import posthog from 'posthog-js';

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    defaults: '2026-05-30',
    person_profiles: 'identified_only',
  });
}

export { posthog };
`;
    const client = await writeClientFile(
      projectType,
      'posthog.ts',
      clientContent
    );
    if (client.written) {
      logger.success(`Created ${client.path}`);
    } else {
      logger.dim(`Skipped ${client.path} (already exists)`);
    }

    logger.success('\n✅ PostHog is now set up!\n');
    logger.info('Next steps:\n');
    logger.info(
      '1. Get your project API key from: https://app.posthog.com/project/settings'
    );
    logger.info('2. Add it to your env file\n');
    logger.info('3. Use the client:\n');
    logger.dim(
      `   import { posthog } from '${libDir(projectType)}/posthog';\n`
    );
    if (isBackend) {
      logger.info('4. Call posthog.shutdown() before your process exits\n');
    }
    logger.info('📚 Documentation: https://posthog.com/docs');
  } catch (error) {
    spinner.fail('Failed to set up PostHog');
    throw error;
  }
}

async function addI18n(projectType) {
  if (projectType !== 'nextjs') {
    logger.error('i18n is only supported for Next.js projects');
    process.exit(1);
  }

  spinner.start('Installing next-intl...');

  try {
    const pm = await getPackageManager();
    const addCmd = pm === 'npm' ? 'install' : 'add';

    await execa(pm, [addCmd, 'next-intl'], { stdio: 'pipe' });

    spinner.succeed('next-intl installed successfully!');

    const cwd = process.cwd();
    const messagesDir = join(cwd, 'messages');
    await ensureDir(messagesDir);

    const enPath = join(messagesDir, 'en.json');
    if (!(await pathExists(enPath))) {
      await writeFile(
        enPath,
        JSON.stringify({ HomePage: { title: 'Hello world!' } }, null, 2) + '\n',
        'utf-8'
      );
      logger.success(`Created ${enPath}`);
    } else {
      logger.dim(`Skipped ${enPath} (already exists)`);
    }

    const i18nDir = join(cwd, 'i18n');
    await ensureDir(i18nDir);
    const requestConfigPath = join(i18nDir, 'request.ts');
    const requestConfigContent = `import { getRequestConfig } from 'next-intl/server';

// Single-locale starter — for multiple locales, derive this from a
// [locale] route segment or cookie instead of hardcoding 'en'.
export default getRequestConfig(async () => {
  const locale = 'en';

  return {
    locale,
    messages: (await import(\`../messages/\${locale}.json\`)).default,
  };
});
`;
    if (!(await pathExists(requestConfigPath))) {
      await writeFile(requestConfigPath, requestConfigContent, 'utf-8');
      logger.success(`Created ${requestConfigPath}`);
    } else {
      logger.dim(`Skipped ${requestConfigPath} (already exists)`);
    }

    logger.success('\n✅ i18n is now set up!\n');
    logger.info('Next steps:\n');
    logger.info('1. Add the next-intl plugin in next.config.ts:\n');
    logger.dim("   import createNextIntlPlugin from 'next-intl/plugin';");
    logger.dim('   const withNextIntl = createNextIntlPlugin();');
    logger.dim('   export default withNextIntl(nextConfig);\n');
    logger.info(
      '2. Wrap app/layout.tsx children in <NextIntlClientProvider> to expose translations to Client Components\n'
    );
    logger.info('3. Add more locales under messages/ (e.g. messages/fr.json)');
    logger.info('4. Use translations in your components:\n');
    logger.dim("   import { useTranslations } from 'next-intl';");
    logger.dim("   const t = useTranslations('HomePage');\n");
    logger.info(
      '5. For multiple locales with routing, see the [locale] segment guide:\n'
    );
    logger.dim(
      '   https://next-intl.dev/docs/getting-started/app-router\n'
    );
    logger.info('📚 Documentation: https://next-intl.dev/docs');
  } catch (error) {
    spinner.fail('Failed to set up i18n');
    throw error;
  }
}

const VITEST_SUPPORTED = ['nextjs', 'react-vite', 'express', 'nestjs'];

async function addVitest(projectType) {
  if (!VITEST_SUPPORTED.includes(projectType)) {
    logger.error(
      `Vitest is supported for: ${VITEST_SUPPORTED.join(', ')} projects`
    );
    process.exit(1);
  }

  spinner.start('Installing Vitest...');

  try {
    const pm = await getPackageManager();
    const addCmd = pm === 'npm' ? 'install' : 'add';
    const devFlag = pm === 'npm' ? '--save-dev' : '-D';

    await execa(pm, [addCmd, devFlag, 'vitest'], { stdio: 'pipe' });

    spinner.succeed('Vitest installed successfully!');

    const cwd = process.cwd();

    const configContent = `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
  },
});
`;
    const configPath = join(cwd, 'vitest.config.ts');
    if (!(await pathExists(configPath))) {
      await writeFile(configPath, configContent, 'utf-8');
      logger.success(`Created ${configPath}`);
    } else {
      logger.dim(`Skipped ${configPath} (already exists)`);
    }

    const testDir = join(cwd, 'tests');
    await ensureDir(testDir);
    const examplePath = join(testDir, 'example.test.ts');
    if (!(await pathExists(examplePath))) {
      await writeFile(
        examplePath,
        `import { describe, it, expect } from 'vitest';

describe('example', () => {
  it('works', () => {
    expect(1 + 1).toBe(2);
  });
});
`,
        'utf-8'
      );
      logger.success(`Created ${examplePath}`);
    } else {
      logger.dim(`Skipped ${examplePath} (already exists)`);
    }

    logger.success('\n✅ Vitest is now set up!\n');
    logger.info('Next steps:\n');
    logger.info('1. Add a test script to package.json:\n');
    logger.dim('   "test": "vitest"\n');
    logger.info('2. Run tests: npx vitest\n');
    logger.info('📚 Documentation: https://vitest.dev/guide/');
  } catch (error) {
    spinner.fail('Failed to set up Vitest');
    throw error;
  }
}

const PLAYWRIGHT_SUPPORTED = ['nextjs', 'react-vite'];

async function addPlaywright(projectType) {
  if (!PLAYWRIGHT_SUPPORTED.includes(projectType)) {
    logger.error(
      `Playwright is supported for: ${PLAYWRIGHT_SUPPORTED.join(', ')} projects`
    );
    process.exit(1);
  }

  spinner.start('Installing Playwright...');

  try {
    const pm = await getPackageManager();
    const addCmd = pm === 'npm' ? 'install' : 'add';
    const devFlag = pm === 'npm' ? '--save-dev' : '-D';

    await execa(pm, [addCmd, devFlag, '@playwright/test'], { stdio: 'pipe' });

    spinner.succeed('Playwright installed successfully!');

    spinner.start('Installing Playwright browsers...');
    await execa('npx', ['playwright', 'install', '--with-deps', 'chromium'], {
      stdio: 'pipe',
    });
    spinner.succeed('Playwright browsers installed!');

    const cwd = process.cwd();
    const port = projectType === 'react-vite' ? 5173 : 3000;

    const configContent = `import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:${port}',
  },
});
`;
    const configPath = join(cwd, 'playwright.config.ts');
    if (!(await pathExists(configPath))) {
      await writeFile(configPath, configContent, 'utf-8');
      logger.success(`Created ${configPath}`);
    } else {
      logger.dim(`Skipped ${configPath} (already exists)`);
    }

    const e2eDir = join(cwd, 'e2e');
    await ensureDir(e2eDir);
    const examplePath = join(e2eDir, 'example.spec.ts');
    if (!(await pathExists(examplePath))) {
      await writeFile(
        examplePath,
        `import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/./);
});
`,
        'utf-8'
      );
      logger.success(`Created ${examplePath}`);
    } else {
      logger.dim(`Skipped ${examplePath} (already exists)`);
    }

    logger.success('\n✅ Playwright is now set up!\n');
    logger.info('Next steps:\n');
    logger.info('1. Start your dev server, then run: npx playwright test\n');
    logger.info('📚 Documentation: https://playwright.dev/docs/intro');
  } catch (error) {
    spinner.fail('Failed to set up Playwright');
    throw error;
  }
}

const TRPC_SUPPORTED = ['nextjs', 'react-vite'];

async function addTrpc(projectType) {
  if (!TRPC_SUPPORTED.includes(projectType)) {
    logger.error(
      `tRPC is supported for: ${TRPC_SUPPORTED.join(', ')} projects`
    );
    process.exit(1);
  }

  spinner.start('Installing tRPC...');

  try {
    const pm = await getPackageManager();
    const addCmd = pm === 'npm' ? 'install' : 'add';

    await execa(pm, [addCmd, '@trpc/server', '@trpc/client', 'zod'], {
      stdio: 'pipe',
    });

    spinner.succeed('tRPC installed successfully!');

    const routerContent = `import { initTRPC } from '@trpc/server';

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const appRouter = router({
  hello: publicProcedure.query(() => 'Hello from tRPC!'),
});

export type AppRouter = typeof appRouter;
`;
    const router = await writeClientFile(projectType, 'trpc.ts', routerContent);
    if (router.written) {
      logger.success(`Created ${router.path}`);
    } else {
      logger.dim(`Skipped ${router.path} (already exists)`);
    }

    logger.success('\n✅ tRPC is now set up!\n');
    logger.info('Next steps:\n');
    logger.info('1. Add procedures to your router:\n');
    logger.dim(`   ${libDir(projectType)}/trpc.ts\n`);
    if (projectType === 'nextjs') {
      logger.info(
        '2. Expose it via an API route (app/api/trpc/[trpc]/route.ts)'
      );
      logger.info(
        '3. Set up the client with @trpc/client or @trpc/react-query\n'
      );
    } else {
      logger.info(
        '2. Set up an HTTP adapter (@trpc/server/adapters) to serve it'
      );
      logger.info('3. Set up the client with @trpc/client\n');
    }
    logger.info('📚 Documentation: https://trpc.io/docs');
  } catch (error) {
    spinner.fail('Failed to set up tRPC');
    throw error;
  }
}

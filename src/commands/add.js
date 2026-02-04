import logger from '../utils/logger.js';
import { execa } from 'execa';
import Spinner from '../utils/spinner.js';
import pkg from 'fs-extra';
const { pathExists, readJson, writeFile, ensureDir } = pkg;
import { join } from 'path';
import inquirer from 'inquirer';

const spinner = new Spinner();

export async function addCommand(feature, options) {
  try {
    // Detect project type
    const projectType = await detectProjectType();

    if (!projectType) {
      logger.error(
        'No supported project detected. Make sure you are in a Next.js or React project directory.'
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
      case 'prisma':
        await addDatabase(projectType);
        break;

      default:
        logger.error(
          `Unknown feature: ${feature}\n\nAvailable features:\n  - shadcn (shadcn/ui components)\n  - auth (NextAuth.js)\n  - database (Prisma)`
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
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'provider',
        message: 'Which authentication provider would you like to use?',
        choices: [
          { name: 'Clerk - Easiest auth setup with UI components', value: 'clerk' },
          { name: 'Supabase - Auth + Database + Storage', value: 'supabase' },
          { name: 'NextAuth.js - Flexible auth for Next.js', value: 'nextauth' },
        ],
      },
    ]);
    provider = answers.provider;
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

    // Install Clerk
    await execa('npm', ['install', '@clerk/nextjs'], {
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
      logger.warning('\nmiddleware.ts already exists. Skipping middleware creation.');
      logger.info('Please manually add Clerk middleware to your existing middleware.ts');
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
    logger.info('1. Get your Clerk API keys from: https://dashboard.clerk.com/');
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
    logger.dim('   import { SignIn, SignUp, UserButton } from "@clerk/nextjs";\n');
    logger.info('5. Protect routes by updating the isProtectedRoute matcher in middleware.ts\n');
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

    // Install Supabase packages
    await execa('npm', ['install', '@supabase/supabase-js', '@supabase/ssr'], {
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
      logger.warning('\nmiddleware.ts already exists. Skipping middleware creation.');
      logger.info('Please manually add Supabase middleware to your existing middleware.ts');
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
    logger.info('1. Create a Supabase project at: https://supabase.com/dashboard');
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
    // Install NextAuth
    await execa('npm', ['install', 'next-auth'], {
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

async function addDatabase(projectType) {
  if (projectType !== 'nextjs' && projectType !== 'react-vite') {
    logger.error('Prisma is supported for Next.js and React projects');
    process.exit(1);
  }

  spinner.start('Installing Prisma...');

  try {
    // Install Prisma
    await execa('npm', ['install', '@prisma/client'], {
      stdio: 'pipe',
    });

    await execa('npm', ['install', '-D', 'prisma'], {
      stdio: 'pipe',
    });

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

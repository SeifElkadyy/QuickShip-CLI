// Backend template generation helpers for Express and NestJS
// This file contains all the helper methods for generating backend template files

import { join } from 'path';
import { getFallbackVersion } from '../utils/version-fetcher.js';

/**
 * Helper function to get version for a package
 * Uses cached/fallback versions for fast synchronous access
 * @param {string} packageName - Package name
 * @returns {string} - Version string with ^ prefix
 */
function v(packageName) {
  return getFallbackVersion(packageName);
}

export async function createExpressPackageJson(destinationPath, config) {
  const { writeFile } = await import('fs/promises');

  const dependencies = {
    express: v('express'),
    helmet: v('helmet'),
    cors: v('cors'),
    dotenv: v('dotenv'),
    zod: v('zod'),
  };

  const devDependencies = {
    '@types/express': v('@types/express'),
    '@types/node': v('@types/node'),
    typescript: v('typescript'),
    tsx: v('tsx'),
    jest: v('jest'),
    '@types/jest': v('@types/jest'),
    eslint: v('eslint'),
    prettier: v('prettier'),
    '@types/cors': v('@types/cors'),
  };

  // Add database-specific dependencies
  if (
    config.database === 'postgresql-prisma' ||
    config.database === 'sqlite-prisma'
  ) {
    dependencies['@prisma/client'] = v('@prisma/client');
    devDependencies.prisma = v('prisma');
  } else if (config.database === 'mongodb-mongoose') {
    dependencies.mongoose = v('mongoose');
    devDependencies['@types/mongoose'] = v('@types/mongoose');
  } else if (config.database === 'postgresql-raw') {
    dependencies.pg = v('pg');
    devDependencies['@types/pg'] = v('@types/pg');
  } else if (config.database === 'mongodb-raw') {
    dependencies.mongodb = v('mongodb');
  } else if (config.database === 'sqlite-raw') {
    dependencies['better-sqlite3'] = v('better-sqlite3');
    devDependencies['@types/better-sqlite3'] = v('@types/better-sqlite3');
  }

  // Add auth dependencies
  if (config.includeAuth) {
    dependencies.jsonwebtoken = v('jsonwebtoken');
    dependencies.bcryptjs = v('bcryptjs');
    devDependencies['@types/jsonwebtoken'] = v('@types/jsonwebtoken');
    devDependencies['@types/bcryptjs'] = v('@types/bcryptjs');
  }

  // Add Swagger dependencies
  if (config.includeSwagger) {
    dependencies['swagger-ui-express'] = v('swagger-ui-express');
    dependencies['swagger-jsdoc'] = v('swagger-jsdoc');
    devDependencies['@types/swagger-ui-express'] = v(
      '@types/swagger-ui-express'
    );
    devDependencies['@types/swagger-jsdoc'] = v('@types/swagger-jsdoc');
  }

  const packageJson = {
    name: config.projectName,
    version: '1.0.0',
    description: 'Express API built with QuickShip',
    main: 'dist/index.js',
    type: 'module',
    scripts: {
      dev: 'tsx watch src/index.ts',
      build: 'tsc',
      start: 'node dist/index.js',
      test: 'jest',
      'test:watch': 'jest --watch',
      lint: 'eslint src/**/*.ts',
      'lint:fix': 'eslint src/**/*.ts --fix',
      format: 'prettier --write "src/**/*.ts"',
    },
    keywords: ['express', 'typescript', 'api'],
    author: '',
    license: 'MIT',
    dependencies,
    devDependencies,
  };

  await writeFile(
    join(destinationPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
}

export async function createNestPackageJson(destinationPath, config) {
  const { writeFile } = await import('fs/promises');

  const dependencies = {
    '@nestjs/common': v('@nestjs/common'),
    '@nestjs/core': v('@nestjs/core'),
    '@nestjs/platform-express': v('@nestjs/platform-express'),
    '@nestjs/config': v('@nestjs/config'),
    'class-validator': v('class-validator'),
    'class-transformer': v('class-transformer'),
    'reflect-metadata': v('reflect-metadata'),
    rxjs: v('rxjs'),
  };

  const devDependencies = {
    '@nestjs/cli': v('@nestjs/cli'),
    '@nestjs/schematics': v('@nestjs/schematics'),
    '@nestjs/testing': v('@nestjs/testing'),
    '@types/express': v('@types/express'),
    '@types/node': v('@types/node'),
    '@types/jest': v('@types/jest'),
    typescript: v('typescript'),
    'ts-node': v('ts-node'),
    'ts-loader': v('ts-loader'),
    'ts-jest': v('ts-jest'),
    jest: v('jest'),
    supertest: v('supertest'),
    '@types/supertest': v('@types/supertest'),
    eslint: v('eslint'),
    prettier: v('prettier'),
  };

  // Add database dependencies
  if (
    config.database === 'postgresql-prisma' ||
    config.database === 'sqlite-prisma'
  ) {
    dependencies['@prisma/client'] = v('@prisma/client');
    devDependencies.prisma = v('prisma');
  } else if (config.database === 'mongodb-mongoose') {
    dependencies['@nestjs/mongoose'] = v('@nestjs/mongoose');
    dependencies.mongoose = v('mongoose');
  } else if (config.database === 'postgresql-raw') {
    dependencies.pg = v('pg');
    devDependencies['@types/pg'] = v('@types/pg');
  } else if (config.database === 'mongodb-raw') {
    dependencies.mongodb = v('mongodb');
  } else if (config.database === 'sqlite-raw') {
    dependencies['better-sqlite3'] = v('better-sqlite3');
    devDependencies['@types/better-sqlite3'] = v('@types/better-sqlite3');
  }

  // Add auth dependencies
  if (config.includeAuth) {
    dependencies['@nestjs/passport'] = v('@nestjs/passport');
    dependencies['@nestjs/jwt'] = v('@nestjs/jwt');
    dependencies.passport = v('passport');
    dependencies['passport-jwt'] = v('passport-jwt');
    dependencies.bcryptjs = v('bcryptjs');
    devDependencies['@types/passport-jwt'] = v('@types/passport-jwt');
    devDependencies['@types/bcryptjs'] = v('@types/bcryptjs');
  }

  // Add Swagger dependencies
  if (config.includeSwagger) {
    dependencies['@nestjs/swagger'] = v('@nestjs/swagger');
  }

  const packageJson = {
    name: config.projectName,
    version: '1.0.0',
    description: 'NestJS API built with QuickShip',
    author: '',
    private: true,
    license: 'MIT',
    scripts: {
      build: 'nest build',
      format: 'prettier --write "src/**/*.ts" "test/**/*.ts"',
      start: 'nest start',
      'start:dev': 'nest start --watch',
      'start:debug': 'nest start --debug --watch',
      'start:prod': 'node dist/main',
      lint: 'eslint "{src,apps,libs,test}/**/*.ts" --fix',
      test: 'jest',
      'test:watch': 'jest --watch',
      'test:cov': 'jest --coverage',
      'test:debug':
        'node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand',
      'test:e2e': 'jest --config ./test/jest-e2e.json',
    },
    dependencies,
    devDependencies,
    jest: {
      moduleFileExtensions: ['js', 'json', 'ts'],
      rootDir: 'src',
      testRegex: '.*\\.spec\\.ts$',
      transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
      },
      collectCoverageFrom: ['**/*.(t|j)s'],
      coverageDirectory: '../coverage',
      testEnvironment: 'node',
    },
  };

  await writeFile(
    join(destinationPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
}

export async function createExpressTsConfig(destinationPath) {
  const { writeFile } = await import('fs/promises');

  const tsConfig = {
    compilerOptions: {
      target: 'ES2022',
      module: 'ESNext',
      lib: ['ES2022'],
      moduleResolution: 'node',
      rootDir: './src',
      outDir: './dist',
      esModuleInterop: true,
      forceConsistentCasingInFileNames: true,
      strict: true,
      skipLibCheck: true,
      resolveJsonModule: true,
      declaration: true,
      declarationMap: true,
      sourceMap: true,
      removeComments: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noImplicitReturns: true,
      noFallthroughCasesInSwitch: true,
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist', 'tests'],
  };

  await writeFile(
    join(destinationPath, 'tsconfig.json'),
    JSON.stringify(tsConfig, null, 2)
  );
}

export async function createNestTsConfig(destinationPath) {
  const { writeFile } = await import('fs/promises');

  const tsConfig = {
    compilerOptions: {
      module: 'commonjs',
      declaration: true,
      removeComments: true,
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
      allowSyntheticDefaultImports: true,
      target: 'ES2021',
      sourceMap: true,
      outDir: './dist',
      baseUrl: './',
      incremental: true,
      skipLibCheck: true,
      strictNullChecks: false,
      noImplicitAny: false,
      strictBindCallApply: false,
      forceConsistentCasingInFileNames: false,
      noFallthroughCasesInSwitch: false,
    },
  };

  await writeFile(
    join(destinationPath, 'tsconfig.json'),
    JSON.stringify(tsConfig, null, 2)
  );
}

export async function createExpressIndex(destinationPath, config) {
  const { writeFile } = await import('fs/promises');

  const indexCode = `import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { config as dotenvConfig } from 'dotenv';
import { errorHandler } from './middleware/error.middleware.js';
import routes from './routes/index.js';
${config.database !== 'none' ? "import { connectDatabase } from './config/database.js';" : ''}

dotenvConfig();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const start = async () => {
  try {
${config.database !== 'none' ? '    await connectDatabase();' : ''}
    app.listen(PORT, () => {
      console.log(\`🚀 Server running on port \${PORT}\`);
      console.log(\`📚 API: http://localhost:\${PORT}/api\`);
      console.log(\`❤️  Health: http://localhost:\${PORT}/health\`);
${config.includeSwagger ? '      console.log(\`📖 Docs: http://localhost:\${PORT}/api/docs\`);' : ''}
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
`;

  await writeFile(join(destinationPath, 'src', 'index.ts'), indexCode);
}

export async function createBackendGitignore(destinationPath) {
  const { writeFile } = await import('fs/promises');

  const gitignore = `# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
coverage/
*.lcov

# Production
dist/
build/

# Environment
.env
.env.local
.env.*.local

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
pnpm-debug.log*

# OS
.DS_Store
Thumbs.db

# IDEs
.idea/
.vscode/
*.swp
*.swo
*~

# Prisma
prisma/migrations/dev.db
prisma/migrations/dev.db-journal

# Docker
docker-compose.override.yml
`;

  await writeFile(join(destinationPath, '.gitignore'), gitignore);
}

// ============================================
// EXPRESS HELPER METHODS
// ============================================

export async function createExpressConfig(destinationPath, config) {
  const { writeFile } = await import('fs/promises');

  // Environment config with validation
  const envConfigCode = `import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  ${config.database === 'postgresql-prisma' || config.database === 'sqlite' ? "DATABASE_URL: z.string().min(1, 'DATABASE_URL is required')," : ''}
  ${config.database === 'mongodb-mongoose' ? "MONGODB_URI: z.string().min(1, 'MONGODB_URI is required')," : ''}
  ${config.includeAuth ? "JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),\n  JWT_EXPIRES_IN: z.string().default('7d')," : ''}
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
`;

  await writeFile(
    join(destinationPath, 'src', 'config', 'environment.ts'),
    envConfigCode
  );
}

export async function createExpressDatabase(destinationPath, config) {
  const { writeFile } = await import('fs/promises');
  const { mkdir } = await import('fs/promises');

  if (config.database === 'postgresql-prisma' || config.database === 'sqlite') {
    // Create Prisma directory
    await mkdir(join(destinationPath, 'prisma'), { recursive: true });

    // Create Prisma schema
    const provider = config.database === 'sqlite' ? 'sqlite' : 'postgresql';
    const prismaSchema = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "${provider}"
  url      = env("DATABASE_URL")
}

${
  config.includeAuth
    ? `model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}`
    : `model Example {
  id        String   @id @default(uuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("examples")
}`
}
`;

    await writeFile(
      join(destinationPath, 'prisma', 'schema.prisma'),
      prismaSchema
    );

    // Create database connection file
    const dbConnectionCode = `import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

export async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
}
`;

    await writeFile(
      join(destinationPath, 'src', 'config', 'database.ts'),
      dbConnectionCode
    );
  } else if (config.database === 'mongodb-mongoose') {
    // Create Mongoose connection
    const mongoConnectionCode = `import mongoose from 'mongoose';
import { env } from './environment.js';

export async function connectDatabase() {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
  console.log('📪 MongoDB disconnected');
}

// Handle connection events
mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

process.on('SIGINT', async () => {
  await disconnectDatabase();
  process.exit(0);
});
`;

    await writeFile(
      join(destinationPath, 'src', 'config', 'database.ts'),
      mongoConnectionCode
    );

    // Create example Mongoose model
    const modelCode = `import mongoose from 'mongoose';

${
  config.includeAuth
    ? `const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, trim: true },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);`
    : `const exampleSchema = new mongoose.Schema({
  name: { type: String, required: true },
}, { timestamps: true });

export const Example = mongoose.model('Example', exampleSchema);`
}
`;

    await writeFile(
      join(
        destinationPath,
        'src',
        'models',
        config.includeAuth ? 'user.model.ts' : 'example.model.ts'
      ),
      modelCode
    );
  }
}

export async function createExpressMiddleware(destinationPath, config) {
  const { writeFile } = await import('fs/promises');

  // Error handling middleware
  const errorMiddlewareCode = `import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Default error
  let statusCode = 500;
  let message = 'Internal server error';
  let errors: any = undefined;

  // Operational errors
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation error';
    errors = err.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message,
    }));
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

export function notFound(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: \`Route \${req.originalUrl} not found\`,
  });
}
`;

  await writeFile(
    join(destinationPath, 'src', 'middleware', 'error.middleware.ts'),
    errorMiddlewareCode
  );

  // Auth middleware (if auth is enabled)
  if (config.includeAuth) {
    const authMiddlewareCode = `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/environment.js';
import { AppError } from './error.middleware.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AppError(401, 'No token provided');
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string; email: string };
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError(401, 'Invalid token'));
    } else {
      next(error);
    }
  }
}
`;

    await writeFile(
      join(destinationPath, 'src', 'middleware', 'auth.middleware.ts'),
      authMiddlewareCode
    );
  }
}

export async function createExpressRoutes(destinationPath, config) {
  const { writeFile } = await import('fs/promises');

  // Main routes index
  const routesIndexCode = `import { Router } from 'express';
${config.includeAuth ? "import authRoutes from './auth.routes.js';" : ''}
${config.includeAuth ? "import userRoutes from './user.routes.js';" : ''}

const router = Router();

${
  config.includeAuth
    ? `// Auth routes
router.use('/auth', authRoutes);

// User routes
router.use('/users', userRoutes);`
    : `// Example route
router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from QuickShip API!' });
});`
}

export default router;
`;

  await writeFile(
    join(destinationPath, 'src', 'routes', 'index.ts'),
    routesIndexCode
  );
}

export async function createExpressAuth(destinationPath, config) {
  const { writeFile } = await import('fs/promises');

  // Auth controller
  const authControllerCode = `import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/environment.js';
import { AppError } from '../middleware/error.middleware.js';
${config.database === 'postgresql-prisma' || config.database === 'sqlite' ? "import { prisma } from '../config/database.js';" : "import { User } from '../models/user.model.js';"}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, name } = req.body;

    // Check if user exists
    ${config.database === 'postgresql-prisma' || config.database === 'sqlite' ? `const existingUser = await prisma.user.findUnique({ where: { email } });` : `const existingUser = await User.findOne({ email });`}

    if (existingUser) {
      throw new AppError(400, 'User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    ${
      config.database === 'postgresql-prisma' || config.database === 'sqlite'
        ? `const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });`
        : `const user = await User.create({ email, password: hashedPassword, name });`
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    // Find user
    ${config.database === 'postgresql-prisma' || config.database === 'sqlite' ? `const user = await prisma.user.findUnique({ where: { email } });` : `const user = await User.findOne({ email });`}

    if (!user) {
      throw new AppError(401, 'Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AppError(401, 'Invalid credentials');
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req: any, res: Response, next: NextFunction) {
  try {
    ${
      config.database === 'postgresql-prisma' || config.database === 'sqlite'
        ? `const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, createdAt: true },
    });`
        : `const user = await User.findById(req.user.id).select('-password');`
    }

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
}
`;

  await writeFile(
    join(destinationPath, 'src', 'controllers', 'auth.controller.ts'),
    authControllerCode
  );

  // Auth validators
  const authValidatorCode = `import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
`;

  await writeFile(
    join(destinationPath, 'src', 'validators', 'auth.validator.ts'),
    authValidatorCode
  );

  // Validation middleware
  const validateMiddlewareCode = `import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export function validate(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}
`;

  await writeFile(
    join(destinationPath, 'src', 'middleware', 'validate.middleware.ts'),
    validateMiddlewareCode
  );

  // Auth routes
  const authRoutesCode = `import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', authenticate, getMe);

export default router;
`;

  await writeFile(
    join(destinationPath, 'src', 'routes', 'auth.routes.ts'),
    authRoutesCode
  );

  // User routes (example protected route)
  const userRoutesCode = `import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// All user routes require authentication
router.use(authenticate);

router.get('/', async (req, res) => {
  // Example: Get all users (add pagination, filtering in production)
  res.json({
    success: true,
    data: { users: [] },
    message: 'This is a protected route - implement your logic here',
  });
});

export default router;
`;

  await writeFile(
    join(destinationPath, 'src', 'routes', 'user.routes.ts'),
    userRoutesCode
  );
}

export async function createExpressDocker(destinationPath, config) {
  const { writeFile } = await import('fs/promises');

  // Dockerfile
  const dockerfile = `FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

EXPOSE 3000

CMD ["node", "dist/index.js"]
`;

  await writeFile(join(destinationPath, 'Dockerfile'), dockerfile);

  // docker-compose.yml
  const dbService =
    config.database === 'postgresql-prisma'
      ? `  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: ${config.projectName}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data`
      : config.database === 'mongodb-mongoose'
        ? `  mongodb:
    image: mongo:7
    environment:
      MONGO_INITDB_ROOT_USERNAME: mongo
      MONGO_INITDB_ROOT_PASSWORD: mongo
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db`
        : '';

  const dockerCompose = `version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      PORT: 3000
      ${config.database === 'postgresql-prisma' ? 'DATABASE_URL: postgresql://postgres:postgres@postgres:5432/' + config.projectName : ''}
      ${config.database === 'mongodb-mongoose' ? 'MONGODB_URI: mongodb://mongo:mongo@mongodb:27017/' + config.projectName + '?authSource=admin' : ''}
      ${config.includeAuth ? 'JWT_SECRET: your-secret-key-change-in-production' : ''}
    depends_on:
      ${config.database !== 'none' && config.database !== 'sqlite' ? '- ' + (config.database === 'postgresql-prisma' ? 'postgres' : 'mongodb') : ''}
${config.database !== 'none' && config.database !== 'sqlite' ? '\n' + dbService : ''}

${config.database !== 'none' && config.database !== 'sqlite' ? 'volumes:\n  ' + (config.database === 'postgresql-prisma' ? 'postgres_data:' : 'mongodb_data:') : ''}
`;

  await writeFile(join(destinationPath, 'docker-compose.yml'), dockerCompose);

  // .dockerignore
  const dockerignore = `node_modules
npm-debug.log
dist
.env
.git
.gitignore
README.md
.vscode
.idea
`;

  await writeFile(join(destinationPath, '.dockerignore'), dockerignore);
}

export async function createExpressSwagger(destinationPath, config) {
  const { writeFile } = await import('fs/promises');

  const swaggerCode = `import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '${config.projectName} API',
      version: '1.0.0',
      description: 'API documentation for ${config.projectName}',
    },
    servers: [
      {
        url: \`http://localhost:\${process.env.PORT || 3000}\`,
        description: 'Development server',
      },
    ],
    ${
      config.includeAuth
        ? `components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],`
        : ''
    }
  },
  apis: ['./src/routes/*.ts'],
};

const specs = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));
}
`;

  await writeFile(
    join(destinationPath, 'src', 'config', 'swagger.ts'),
    swaggerCode
  );
}

export async function createExpressEnvFiles(destinationPath, config) {
  const { writeFile } = await import('fs/promises');

  let envExample = `NODE_ENV=development
PORT=3000

`;

  if (config.database === 'postgresql-prisma') {
    envExample += `# PostgreSQL Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/${config.projectName}?schema=public"

`;
  } else if (config.database === 'sqlite') {
    envExample += `# SQLite Database
DATABASE_URL="file:./dev.db"

`;
  } else if (config.database === 'mongodb-mongoose') {
    envExample += `# MongoDB Database
MONGODB_URI="mongodb://localhost:27017/${config.projectName}"

`;
  }

  if (config.includeAuth) {
    envExample += `# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-min-32-chars-change-this"
JWT_EXPIRES_IN="7d"

`;
  }

  await writeFile(join(destinationPath, '.env.example'), envExample);
  // Also create .env file so the app works immediately
  await writeFile(join(destinationPath, '.env'), envExample);
}

export async function createExpressReadme(destinationPath, config) {
  const { writeFile } = await import('fs/promises');

  const readme = `# ${config.projectName}

Express API built with [QuickShip](https://github.com/SeifElkadyy/QuickShip-CLI)

## 🚀 Features

- ✅ Express.js with TypeScript
- ✅ ${config.database === 'postgresql-prisma' ? 'PostgreSQL with Prisma ORM' : config.database === 'mongodb-mongoose' ? 'MongoDB with Mongoose' : 'SQLite with Prisma'}
${config.includeAuth ? '- ✅ JWT Authentication' : ''}
${config.includeSwagger ? '- ✅ Swagger API Documentation' : ''}
${config.includeDocker ? '- ✅ Docker Support' : ''}
- ✅ Zod Validation
- ✅ Error Handling
- ✅ Security (Helmet, CORS)
- ✅ Testing with Jest

## 📦 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- ${config.database === 'postgresql-prisma' ? 'PostgreSQL' : config.database === 'mongodb-mongoose' ? 'MongoDB' : 'No database required (SQLite)'}

### Installation

1. Install dependencies:

\`\`\`bash
${config.packageManager} install
\`\`\`

2. Set up environment variables:

\`\`\`bash
cp .env.example .env
\`\`\`

Edit \`.env\` with your configuration.

${
  config.database === 'postgresql-prisma' || config.database === 'sqlite'
    ? `3. Run database migrations:

\`\`\`bash
npx prisma migrate dev --name init
\`\`\`

4. Generate Prisma Client:

\`\`\`bash
npx prisma generate
\`\`\`
`
    : ''
}

### Development

Start the development server:

\`\`\`bash
${config.packageManager === 'npm' ? 'npm run' : config.packageManager} dev
\`\`\`

The API will be available at \`http://localhost:3000\`

${config.includeSwagger ? '📖 **API Documentation:** http://localhost:3000/api/docs\n' : ''}

### Production Build

\`\`\`bash
${config.packageManager === 'npm' ? 'npm run' : config.packageManager} build
${config.packageManager === 'npm' ? 'npm' : config.packageManager} start
\`\`\`

${
  config.includeDocker
    ? `### Docker

Build and run with Docker:

\`\`\`bash
docker-compose up
\`\`\`
`
    : ''
}

## 🧪 Testing

Run tests:

\`\`\`bash
${config.packageManager === 'npm' ? 'npm' : config.packageManager} test
\`\`\`

## 📚 API Endpoints

### Health Check

\`\`\`
GET /health
\`\`\`

${
  config.includeAuth
    ? `### Authentication

\`\`\`
POST /api/auth/register - Register new user
POST /api/auth/login    - Login user
GET  /api/auth/me       - Get current user (protected)
\`\`\`

### Users

\`\`\`
GET /api/users          - Get all users (protected)
\`\`\`
`
    : `### Example

\`\`\`
GET /api/hello          - Hello World
\`\`\`
`
}

## 🔧 Available Scripts

- \`dev\` - Start development server
- \`build\` - Build for production
- \`start\` - Start production server
- \`test\` - Run tests
- \`lint\` - Lint code
- \`format\` - Format code with Prettier

## 📁 Project Structure

\`\`\`
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── services/       # Business logic
├── utils/          # Utility functions
├── validators/     # Request validators
└── index.ts        # Application entry point
\`\`\`

## 🚀 Deployment

Deploy to:
- Railway: \`quickship deploy --platform railway\`
- Render: \`quickship deploy --platform render\`
- Fly.io: \`quickship deploy --platform fly\`

## 📄 License

MIT

---

Built with ❤️ using [QuickShip CLI](https://github.com/SeifElkadyy/QuickShip-CLI)
`;

  await writeFile(join(destinationPath, 'README.md'), readme);
}

export async function createExpressJestConfig(destinationPath) {
  const { writeFile } = await import('fs/promises');

  const jestConfig = `export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
  ],
  coverageDirectory: 'coverage',
  verbose: true,
};
`;

  await writeFile(join(destinationPath, 'jest.config.js'), jestConfig);

  // Create example test
  const exampleTest = `describe('Example Test', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });
});
`;

  await writeFile(
    join(destinationPath, 'tests', 'example.test.ts'),
    exampleTest
  );
}

// ============================================
// NESTJS HELPER METHODS
// ============================================

export async function createNestMainFiles(destinationPath, config) {
  const { writeFile } = await import('fs/promises');

  // main.ts
  const mainCode = `import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
${config.includeSwagger ? "import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';" : ''}
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  app.enableCors();

${
  config.includeSwagger
    ? `  // Swagger setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('${config.projectName} API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);
`
    : ''
}
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(\`🚀 Server running on: http://localhost:\${port}\`);
  console.log(\`📚 API: http://localhost:\${port}/api\`);
  console.log(\`❤️  Health: http://localhost:\${port}/api/health\`);
${config.includeSwagger ? '  console.log(\`📖 Docs: http://localhost:\${port}/api/docs\`);' : ''}
}
bootstrap();
`;

  await writeFile(join(destinationPath, 'src', 'main.ts'), mainCode);

  // app.module.ts
  const appModuleCode = `import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
${config.includeAuth ? "import { AuthModule } from './auth/auth.module';" : ''}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
${config.includeAuth ? '    AuthModule,' : ''}
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
`;

  await writeFile(join(destinationPath, 'src', 'app.module.ts'), appModuleCode);

  // app.controller.ts
  const appControllerCode = `import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
${config.includeSwagger ? "import { ApiTags } from '@nestjs/swagger';" : ''}

${config.includeSwagger ? "@ApiTags('health')" : ''}
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
`;

  await writeFile(
    join(destinationPath, 'src', 'app.controller.ts'),
    appControllerCode
  );

  // app.service.ts
  const appServiceCode = `import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): string {
    return 'OK';
  }
}
`;

  await writeFile(
    join(destinationPath, 'src', 'app.service.ts'),
    appServiceCode
  );
}

export async function createNestDatabase(destinationPath, config) {
  const { writeFile } = await import('fs/promises');
  const { mkdir } = await import('fs/promises');

  if (config.database === 'postgresql-prisma' || config.database === 'sqlite') {
    // Create Prisma directory
    await mkdir(join(destinationPath, 'prisma'), { recursive: true });

    const provider = config.database === 'sqlite' ? 'sqlite' : 'postgresql';
    const prismaSchema = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "${provider}"
  url      = env("DATABASE_URL")
}

${
  config.includeAuth
    ? `model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}`
    : `model Example {
  id        String   @id @default(uuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("examples")
}`
}
`;

    await writeFile(
      join(destinationPath, 'prisma', 'schema.prisma'),
      prismaSchema
    );

    // Database module
    const databaseModuleCode = `import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
`;

    await writeFile(
      join(destinationPath, 'src', 'database', 'database.module.ts'),
      databaseModuleCode
    );

    // Prisma service
    const prismaServiceCode = `import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
    console.log('✅ Database connected successfully');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
`;

    await writeFile(
      join(destinationPath, 'src', 'database', 'prisma.service.ts'),
      prismaServiceCode
    );
  } else if (config.database === 'mongodb-mongoose') {
    // Database module with Mongoose
    const databaseModuleCode = `import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
`;

    await writeFile(
      join(destinationPath, 'src', 'database', 'database.module.ts'),
      databaseModuleCode
    );
  }
}

export async function createNestUsers(destinationPath, config) {
  const { writeFile, mkdir } = await import('fs/promises');

  // users.module.ts
  const usersModuleCode =
    config.database === 'mongodb-mongoose'
      ? `import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
`
      : `import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
`;

  await writeFile(
    join(destinationPath, 'src', 'users', 'users.module.ts'),
    usersModuleCode
  );

  // users.service.ts
  const usersServiceCode =
    config.database === 'postgresql-prisma' || config.database === 'sqlite'
      ? `import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, name: true, createdAt: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, createdAt: true },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
`
      : `import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll() {
    return this.userModel.find().select('-password').exec();
  }

  async findOne(id: string) {
    return this.userModel.findById(id).select('-password').exec();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }
}
`;

  await writeFile(
    join(destinationPath, 'src', 'users', 'users.service.ts'),
    usersServiceCode
  );

  // users.controller.ts
  const usersControllerCode = `import { Controller, Get, Param, UseGuards } from '@nestjs/common';
${config.includeSwagger ? "import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';" : ''}
${config.includeAuth ? "import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';" : ''}
import { UsersService } from './users.service';

${config.includeSwagger ? "@ApiTags('users')" : ''}
${config.includeSwagger && config.includeAuth ? '@ApiBearerAuth()' : ''}
${config.includeAuth ? '@UseGuards(JwtAuthGuard)' : ''}
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
`;

  await writeFile(
    join(destinationPath, 'src', 'users', 'users.controller.ts'),
    usersControllerCode
  );

  // If Mongoose, create schema
  if (config.database === 'mongodb-mongoose') {
    const userSchemaCode = `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  name?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
`;

    await mkdir(join(destinationPath, 'src', 'users', 'schemas'), {
      recursive: true,
    });
    await writeFile(
      join(destinationPath, 'src', 'users', 'schemas', 'user.schema.ts'),
      userSchemaCode
    );
  }
}

export async function createNestAuth(destinationPath, config) {
  const { writeFile } = await import('fs/promises');
  const { mkdir } = await import('fs/promises');

  // auth.module.ts
  const authModuleCode =
    config.database === 'mongodb-mongoose'
      ? `import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN', '7d') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
`
      : `import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN', '7d') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
`;

  await writeFile(
    join(destinationPath, 'src', 'auth', 'auth.module.ts'),
    authModuleCode
  );

  // auth.service.ts
  const authServiceCode =
    config.database === 'postgresql-prisma' || config.database === 'sqlite'
      ? `import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../database/prisma.service';
import { RegisterDto, LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
      },
    });

    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(dto.password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    };
  }

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, createdAt: true },
    });
  }
}
`
      : `import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/schemas/user.schema';
import { RegisterDto, LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.userModel.findOne({ email: dto.email });

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userModel.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
    });

    const token = this.jwtService.sign({ sub: user._id.toString(), email: user.email });

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(dto.password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ sub: user._id.toString(), email: user.email });

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    };
  }

  async getProfile(userId: string) {
    return this.userModel.findById(userId).select('-password').exec();
  }
}
`;

  await writeFile(
    join(destinationPath, 'src', 'auth', 'auth.service.ts'),
    authServiceCode
  );

  // auth.controller.ts
  const authControllerCode = `import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
${config.includeSwagger ? "import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';" : ''}
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

${config.includeSwagger ? "@ApiTags('auth')" : ''}
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  ${config.includeSwagger ? '@ApiBearerAuth()' : ''}
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return this.authService.getProfile(req.user.sub);
  }
}
`;

  await writeFile(
    join(destinationPath, 'src', 'auth', 'auth.controller.ts'),
    authControllerCode
  );

  // DTOs
  await mkdir(join(destinationPath, 'src', 'auth', 'dto'), { recursive: true });

  const registerDtoCode = `import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
${config.includeSwagger ? "import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';" : ''}

export class RegisterDto {
  ${config.includeSwagger ? '@ApiProperty()' : ''}
  @IsEmail()
  email: string;

  ${config.includeSwagger ? '@ApiProperty()' : ''}
  @IsString()
  @MinLength(8)
  password: string;

  ${config.includeSwagger ? '@ApiPropertyOptional()' : ''}
  @IsOptional()
  @IsString()
  name?: string;
}
`;

  await writeFile(
    join(destinationPath, 'src', 'auth', 'dto', 'register.dto.ts'),
    registerDtoCode
  );

  const loginDtoCode = `import { IsEmail, IsString } from 'class-validator';
${config.includeSwagger ? "import { ApiProperty } from '@nestjs/swagger';" : ''}

export class LoginDto {
  ${config.includeSwagger ? '@ApiProperty()' : ''}
  @IsEmail()
  email: string;

  ${config.includeSwagger ? '@ApiProperty()' : ''}
  @IsString()
  password: string;
}
`;

  await writeFile(
    join(destinationPath, 'src', 'auth', 'dto', 'login.dto.ts'),
    loginDtoCode
  );

  const indexDtoCode = `export * from './register.dto';
export * from './login.dto';
`;

  await writeFile(
    join(destinationPath, 'src', 'auth', 'dto', 'index.ts'),
    indexDtoCode
  );

  // JWT Strategy
  await mkdir(join(destinationPath, 'src', 'auth', 'strategies'), {
    recursive: true,
  });

  const jwtStrategyCode = `import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return { sub: payload.sub, email: payload.email };
  }
}
`;

  await writeFile(
    join(destinationPath, 'src', 'auth', 'strategies', 'jwt.strategy.ts'),
    jwtStrategyCode
  );

  // JWT Auth Guard
  await mkdir(join(destinationPath, 'src', 'auth', 'guards'), {
    recursive: true,
  });

  const jwtGuardCode = `import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
`;

  await writeFile(
    join(destinationPath, 'src', 'auth', 'guards', 'jwt-auth.guard.ts'),
    jwtGuardCode
  );
}

export async function createNestDocker(destinationPath, config) {
  const { writeFile } = await import('fs/promises');

  // Same as Express Docker
  await createExpressDocker(destinationPath, config);
}

export async function createNestEnvFiles(destinationPath, config) {
  const { writeFile } = await import('fs/promises');

  let envExample = `NODE_ENV=development
PORT=3000

`;

  if (config.database === 'postgresql-prisma') {
    envExample += `# PostgreSQL Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/${config.projectName}?schema=public"

`;
  } else if (config.database === 'sqlite') {
    envExample += `# SQLite Database
DATABASE_URL="file:./dev.db"

`;
  } else if (config.database === 'mongodb-mongoose') {
    envExample += `# MongoDB Database
MONGODB_URI="mongodb://localhost:27017/${config.projectName}"

`;
  }

  if (config.includeAuth) {
    envExample += `# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-min-32-chars-change-this"
JWT_EXPIRES_IN="7d"

`;
  }

  await writeFile(join(destinationPath, '.env.example'), envExample);
  // Also create .env file so the app works immediately
  await writeFile(join(destinationPath, '.env'), envExample);
}

export async function createNestReadme(destinationPath, config) {
  const { writeFile } = await import('fs/promises');

  const readme = `# ${config.projectName}

NestJS API built with [QuickShip](https://github.com/SeifElkadyy/QuickShip-CLI)

## 🚀 Features

- ✅ NestJS 10+ with TypeScript
- ✅ ${config.database === 'postgresql-prisma' ? 'PostgreSQL with Prisma ORM' : config.database === 'mongodb-mongoose' ? 'MongoDB with Mongoose' : 'SQLite with Prisma'}
${config.includeAuth ? '- ✅ Passport.js + JWT Authentication' : ''}
${config.includeSwagger ? '- ✅ Swagger API Documentation' : ''}
${config.includeDocker ? '- ✅ Docker Support' : ''}
- ✅ Class Validator
- ✅ Modular Architecture
- ✅ Testing with Jest

## 📦 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- ${config.database === 'postgresql-prisma' ? 'PostgreSQL' : config.database === 'mongodb-mongoose' ? 'MongoDB' : 'No database required (SQLite)'}

### Installation

1. Install dependencies:

\`\`\`bash
${config.packageManager} install
\`\`\`

2. Set up environment variables:

\`\`\`bash
cp .env.example .env
\`\`\`

Edit \`.env\` with your configuration.

${
  config.database === 'postgresql-prisma' || config.database === 'sqlite'
    ? `3. Run database migrations:

\`\`\`bash
npx prisma migrate dev --name init
\`\`\`

4. Generate Prisma Client:

\`\`\`bash
npx prisma generate
\`\`\`
`
    : ''
}

### Development

Start the development server:

\`\`\`bash
${config.packageManager === 'npm' ? 'npm run' : config.packageManager} start:dev
\`\`\`

The API will be available at \`http://localhost:3000\`

${config.includeSwagger ? '📖 **API Documentation:** http://localhost:3000/api/docs\n' : ''}

### Production Build

\`\`\`bash
${config.packageManager === 'npm' ? 'npm run' : config.packageManager} build
${config.packageManager === 'npm' ? 'npm run' : config.packageManager} start:prod
\`\`\`

${
  config.includeDocker
    ? `### Docker

Build and run with Docker:

\`\`\`bash
docker-compose up
\`\`\`
`
    : ''
}

## 🧪 Testing

Run tests:

\`\`\`bash
${config.packageManager === 'npm' ? 'npm' : config.packageManager} test
\`\`\`

## 📚 API Endpoints

### Health Check

\`\`\`
GET /health
\`\`\`

${
  config.includeAuth
    ? `### Authentication

\`\`\`
POST /api/auth/register - Register new user
POST /api/auth/login    - Login user
GET  /api/auth/me       - Get current user (protected)
\`\`\`

### Users

\`\`\`
GET /api/users          - Get all users (protected)
GET /api/users/:id      - Get user by ID (protected)
\`\`\`
`
    : `### Example

\`\`\`
GET /api/users          - Get all users
\`\`\`
`
}

## 🔧 Available Scripts

- \`start:dev\` - Start development server
- \`start:debug\` - Start in debug mode
- \`build\` - Build for production
- \`start:prod\` - Start production server
- \`test\` - Run tests
- \`lint\` - Lint code

## 📁 Project Structure

\`\`\`
src/
├── auth/           # Authentication module
├── users/          # Users module
├── database/       # Database configuration
├── common/         # Common utilities
├── app.module.ts   # Root module
└── main.ts         # Application entry point
\`\`\`

## 🚀 Deployment

Deploy to:
- Railway: \`quickship deploy --platform railway\`
- Render: \`quickship deploy --platform render\`
- Fly.io: \`quickship deploy --platform fly\`

## 📄 License

MIT

---

Built with ❤️ using [QuickShip CLI](https://github.com/SeifElkadyy/QuickShip-CLI)
`;

  await writeFile(join(destinationPath, 'README.md'), readme);
}

export async function createNestCliConfig(destinationPath) {
  const { writeFile } = await import('fs/promises');

  const nestCliConfig = {
    $schema: 'https://json.schemastore.org/nest-cli',
    collection: '@nestjs/schematics',
    sourceRoot: 'src',
    compilerOptions: {
      deleteOutDir: true,
    },
  };

  await writeFile(
    join(destinationPath, 'nest-cli.json'),
    JSON.stringify(nestCliConfig, null, 2)
  );
}

export async function createNestJestConfig(destinationPath) {
  const { writeFile } = await import('fs/promises');

  const jestConfig = `module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};
`;

  await writeFile(join(destinationPath, 'jest.config.js'), jestConfig);

  // Create example test
  const exampleTest = `import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health', () => {
    it('should return health status', () => {
      const result = appController.getHealth();
      expect(result).toHaveProperty('status', 'ok');
    });
  });
});
`;

  await writeFile(
    join(destinationPath, 'src', 'app.controller.spec.ts'),
    exampleTest
  );
}

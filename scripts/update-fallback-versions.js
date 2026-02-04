#!/usr/bin/env node

/**
 * Script to update fallback versions in version-fetcher.js
 * Run this script periodically to keep fallback versions up to date
 *
 * Usage: node scripts/update-fallback-versions.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// List of packages to check
const PACKAGES = [
  // Express dependencies
  'express',
  'helmet',
  'cors',
  'dotenv',
  'zod',
  '@types/express',
  '@types/node',
  'typescript',
  'tsx',
  'jest',
  '@types/jest',
  'eslint',
  'prettier',
  '@types/cors',

  // Database dependencies
  '@prisma/client',
  'prisma',
  'mongoose',
  '@types/mongoose',
  'pg',
  '@types/pg',
  'mongodb',
  'better-sqlite3',
  '@types/better-sqlite3',

  // Auth dependencies
  'jsonwebtoken',
  'bcryptjs',
  '@types/jsonwebtoken',
  '@types/bcryptjs',

  // Swagger dependencies
  'swagger-ui-express',
  'swagger-jsdoc',
  '@types/swagger-ui-express',
  '@types/swagger-jsdoc',

  // NestJS dependencies
  '@nestjs/common',
  '@nestjs/core',
  '@nestjs/platform-express',
  '@nestjs/config',
  'class-validator',
  'class-transformer',
  'reflect-metadata',
  'rxjs',
  '@nestjs/cli',
  '@nestjs/schematics',
  '@nestjs/testing',
  'ts-node',
  'ts-loader',
  'ts-jest',
  'supertest',
  '@types/supertest',
  '@nestjs/mongoose',
  '@nestjs/passport',
  '@nestjs/jwt',
  'passport',
  'passport-jwt',
  '@types/passport-jwt',
  '@nestjs/swagger',
];

async function fetchLatestVersion(packageName) {
  try {
    const response = await fetch(
      `https://registry.npmjs.org/${encodeURIComponent(packageName)}/latest`,
      { signal: AbortSignal.timeout(10000) }
    );

    if (!response.ok) {
      console.error(`Failed to fetch ${packageName}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.version;
  } catch (error) {
    console.error(`Error fetching ${packageName}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('Fetching latest versions from npm...\n');

  const versions = {};
  const failed = [];

  for (const pkg of PACKAGES) {
    process.stdout.write(`Fetching ${pkg}... `);
    const version = await fetchLatestVersion(pkg);

    if (version) {
      versions[pkg] = `^${version}`;
      console.log(`${version}`);
    } else {
      failed.push(pkg);
      console.log('FAILED');
    }

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log('\n--- Results ---');
  console.log(`Successfully fetched: ${Object.keys(versions).length}`);
  console.log(`Failed: ${failed.length}`);

  if (failed.length > 0) {
    console.log('\nFailed packages:');
    failed.forEach((pkg) => console.log(`  - ${pkg}`));
  }

  // Generate the FALLBACK_VERSIONS object
  console.log('\n--- FALLBACK_VERSIONS ---\n');
  console.log('const FALLBACK_VERSIONS = {');

  const categories = {
    '// Express dependencies': [
      'express',
      'helmet',
      'cors',
      'dotenv',
      'zod',
      '@types/express',
      '@types/node',
      'typescript',
      'tsx',
      'jest',
      '@types/jest',
      'eslint',
      'prettier',
      '@types/cors',
    ],
    '// Database dependencies': [
      '@prisma/client',
      'prisma',
      'mongoose',
      '@types/mongoose',
      'pg',
      '@types/pg',
      'mongodb',
      'better-sqlite3',
      '@types/better-sqlite3',
    ],
    '// Auth dependencies': [
      'jsonwebtoken',
      'bcryptjs',
      '@types/jsonwebtoken',
      '@types/bcryptjs',
    ],
    '// Swagger dependencies': [
      'swagger-ui-express',
      'swagger-jsdoc',
      '@types/swagger-ui-express',
      '@types/swagger-jsdoc',
    ],
    '// NestJS dependencies': [
      '@nestjs/common',
      '@nestjs/core',
      '@nestjs/platform-express',
      '@nestjs/config',
      'class-validator',
      'class-transformer',
      'reflect-metadata',
      'rxjs',
      '@nestjs/cli',
      '@nestjs/schematics',
      '@nestjs/testing',
      'ts-node',
      'ts-loader',
      'ts-jest',
      'supertest',
      '@types/supertest',
      '@nestjs/mongoose',
      '@nestjs/passport',
      '@nestjs/jwt',
      'passport',
      'passport-jwt',
      '@types/passport-jwt',
      '@nestjs/swagger',
    ],
  };

  for (const [comment, pkgs] of Object.entries(categories)) {
    console.log(`  ${comment}`);
    for (const pkg of pkgs) {
      if (versions[pkg]) {
        console.log(`  '${pkg}': '${versions[pkg]}',`);
      }
    }
    console.log('');
  }

  console.log('};');

  // Optionally save to a JSON file for reference
  const outputPath = join(__dirname, '../.version-cache.json');
  writeFileSync(
    outputPath,
    JSON.stringify(
      {
        updatedAt: new Date().toISOString(),
        versions,
        failed,
      },
      null,
      2
    )
  );
  console.log(`\nVersion cache saved to: ${outputPath}`);
}

main().catch(console.error);

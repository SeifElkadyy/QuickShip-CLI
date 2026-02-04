import Conf from 'conf';

// Cache configuration for package versions
const versionCache = new Conf({
  projectName: 'quickship-cli',
  configName: 'version-cache',
  schema: {
    versions: {
      type: 'object',
      default: {},
    },
    lastFetch: {
      type: 'number',
      default: 0,
    },
  },
});

// Cache duration: 6 hours in milliseconds
const CACHE_DURATION = 6 * 60 * 60 * 1000;

// Fallback versions (used when npm registry is unavailable)
// These should be updated periodically
const FALLBACK_VERSIONS = {
  // Express dependencies
  express: '^4.21.2',
  helmet: '^8.0.0',
  cors: '^2.8.5',
  dotenv: '^16.4.7',
  zod: '^3.24.1',
  '@types/express': '^5.0.0',
  '@types/node': '^22.10.5',
  typescript: '^5.7.3',
  tsx: '^4.19.2',
  jest: '^29.7.0',
  '@types/jest': '^29.5.14',
  eslint: '^9.18.0',
  prettier: '^3.4.2',
  '@types/cors': '^2.8.17',

  // Database dependencies
  '@prisma/client': '^6.2.1',
  prisma: '^6.2.1',
  mongoose: '^8.9.3',
  '@types/mongoose': '^5.11.96',
  pg: '^8.13.1',
  '@types/pg': '^8.11.10',
  mongodb: '^6.12.0',
  'better-sqlite3': '^11.8.1',
  '@types/better-sqlite3': '^7.6.12',

  // Auth dependencies
  jsonwebtoken: '^9.0.2',
  bcryptjs: '^2.4.3',
  '@types/jsonwebtoken': '^9.0.7',
  '@types/bcryptjs': '^2.4.6',

  // Swagger dependencies
  'swagger-ui-express': '^5.0.1',
  'swagger-jsdoc': '^6.2.8',
  '@types/swagger-ui-express': '^4.1.6',
  '@types/swagger-jsdoc': '^6.0.4',

  // NestJS dependencies
  '@nestjs/common': '^10.4.15',
  '@nestjs/core': '^10.4.15',
  '@nestjs/platform-express': '^10.4.15',
  '@nestjs/config': '^3.3.0',
  'class-validator': '^0.14.1',
  'class-transformer': '^0.5.1',
  'reflect-metadata': '^0.2.2',
  rxjs: '^7.8.1',
  '@nestjs/cli': '^10.0.0',
  '@nestjs/schematics': '^10.0.0',
  '@nestjs/testing': '^10.4.15',
  'ts-node': '^10.9.2',
  'ts-loader': '^9.5.1',
  'ts-jest': '^29.2.5',
  supertest: '^7.0.0',
  '@types/supertest': '^6.0.2',
  '@nestjs/mongoose': '^10.1.0',
  '@nestjs/passport': '^10.0.3',
  '@nestjs/jwt': '^10.2.0',
  passport: '^0.7.0',
  'passport-jwt': '^4.0.1',
  '@types/passport-jwt': '^4.0.1',
  '@nestjs/swagger': '^8.0.7',
};

/**
 * Fetch latest version of a package from npm registry
 * @param {string} packageName - Name of the npm package
 * @returns {Promise<string|null>} - Latest version or null if failed
 */
async function fetchPackageVersion(packageName) {
  try {
    const response = await fetch(
      `https://registry.npmjs.org/${encodeURIComponent(packageName)}/latest`,
      { signal: AbortSignal.timeout(5000) }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.version;
  } catch (error) {
    return null;
  }
}

/**
 * Fetch latest versions for multiple packages in parallel
 * @param {string[]} packageNames - Array of package names
 * @returns {Promise<Object>} - Object mapping package names to versions
 */
async function fetchMultipleVersions(packageNames) {
  const results = await Promise.allSettled(
    packageNames.map(async (name) => {
      const version = await fetchPackageVersion(name);
      return { name, version };
    })
  );

  const versions = {};
  results.forEach((result) => {
    if (result.status === 'fulfilled' && result.value.version) {
      versions[result.value.name] = `^${result.value.version}`;
    }
  });

  return versions;
}

/**
 * Get cached versions or fetch new ones if cache is stale
 * @param {string[]} packageNames - Array of package names to fetch
 * @param {Object} options - Options
 * @param {boolean} options.force - Force fetch even if cache is fresh
 * @param {boolean} options.useFallback - Use fallback versions if fetch fails
 * @returns {Promise<Object>} - Object mapping package names to versions
 */
export async function getLatestVersions(packageNames, options = {}) {
  const { force = false, useFallback = true } = options;

  const now = Date.now();
  const lastFetch = versionCache.get('lastFetch');
  const cachedVersions = versionCache.get('versions');

  // Check if cache is still valid
  if (!force && now - lastFetch < CACHE_DURATION) {
    // Return cached versions for requested packages
    const result = {};
    let allCached = true;

    for (const name of packageNames) {
      if (cachedVersions[name]) {
        result[name] = cachedVersions[name];
      } else {
        allCached = false;
      }
    }

    if (allCached) {
      return result;
    }
  }

  // Fetch fresh versions
  try {
    const freshVersions = await fetchMultipleVersions(packageNames);

    // Merge with existing cache
    const updatedCache = { ...cachedVersions, ...freshVersions };
    versionCache.set('versions', updatedCache);
    versionCache.set('lastFetch', now);

    // Return requested versions with fallbacks
    const result = {};
    for (const name of packageNames) {
      result[name] =
        freshVersions[name] ||
        cachedVersions[name] ||
        (useFallback ? FALLBACK_VERSIONS[name] : null);
    }

    return result;
  } catch (error) {
    // Return fallback versions on error
    if (useFallback) {
      const result = {};
      for (const name of packageNames) {
        result[name] = cachedVersions[name] || FALLBACK_VERSIONS[name] || null;
      }
      return result;
    }
    throw error;
  }
}

/**
 * Get version for a single package
 * @param {string} packageName - Package name
 * @param {Object} options - Options
 * @returns {Promise<string>} - Version string
 */
export async function getLatestVersion(packageName, options = {}) {
  const versions = await getLatestVersions([packageName], options);
  return versions[packageName] || FALLBACK_VERSIONS[packageName];
}

/**
 * Get fallback version for a package (synchronous)
 * Use this when you need immediate version without async
 * @param {string} packageName - Package name
 * @returns {string} - Version string
 */
export function getFallbackVersion(packageName) {
  const cachedVersions = versionCache.get('versions');
  return cachedVersions[packageName] || FALLBACK_VERSIONS[packageName];
}

/**
 * Pre-fetch and cache all common dependency versions
 * Call this during CLI initialization for better performance
 */
export async function prefetchCommonVersions() {
  const commonPackages = Object.keys(FALLBACK_VERSIONS);
  await getLatestVersions(commonPackages, { force: false });
}

/**
 * Clear the version cache
 */
export function clearVersionCache() {
  versionCache.set('versions', {});
  versionCache.set('lastFetch', 0);
}

/**
 * Get all fallback versions (for reference)
 */
export function getAllFallbackVersions() {
  return { ...FALLBACK_VERSIONS };
}

/**
 * Update fallback version for a package
 * This should be called during build/release to update defaults
 */
export function updateFallbackVersion(packageName, version) {
  FALLBACK_VERSIONS[packageName] = version;
}

export default {
  getLatestVersions,
  getLatestVersion,
  getFallbackVersion,
  prefetchCommonVersions,
  clearVersionCache,
  getAllFallbackVersions,
};

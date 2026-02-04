import Conf from 'conf';
import chalk from 'chalk';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration store for caching
const config = new Conf({
  projectName: 'quickship-cli',
  schema: {
    lastUpdateCheck: {
      type: 'number',
      default: 0,
    },
    latestVersion: {
      type: 'string',
      default: '',
    },
    dismissedVersion: {
      type: 'string',
      default: '',
    },
  },
});

// Check interval: 24 hours in milliseconds
const CHECK_INTERVAL = 24 * 60 * 60 * 1000;

/**
 * Get current CLI version from package.json
 */
export function getCurrentVersion() {
  const packageJsonPath = join(__dirname, '../../package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  return packageJson.version;
}

/**
 * Fetch latest version from npm registry
 */
async function fetchLatestVersion() {
  try {
    const response = await fetch(
      'https://registry.npmjs.org/quickship-cli/latest',
      {
        timeout: 3000, // 3 second timeout
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.version;
  } catch (error) {
    // Silently fail - don't disrupt user experience
    return null;
  }
}

/**
 * Compare semver versions
 * Returns: 1 if v1 > v2, -1 if v1 < v2, 0 if equal
 */
function compareVersions(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    if (p1 > p2) return 1;
    if (p1 < p2) return -1;
  }
  return 0;
}

/**
 * Check for updates (non-blocking)
 * Shows notification if update is available
 */
export async function checkForUpdates(options = {}) {
  const { force = false, silent = false } = options;

  try {
    const now = Date.now();
    const lastCheck = config.get('lastUpdateCheck');
    const cachedVersion = config.get('latestVersion');
    const dismissedVersion = config.get('dismissedVersion');
    const currentVersion = getCurrentVersion();

    // Check if we should skip (checked recently and not forced)
    if (!force && now - lastCheck < CHECK_INTERVAL && cachedVersion) {
      // Use cached version for comparison
      if (
        compareVersions(cachedVersion, currentVersion) > 0 &&
        cachedVersion !== dismissedVersion
      ) {
        if (!silent) {
          displayUpdateNotification(currentVersion, cachedVersion);
        }
        return { updateAvailable: true, latestVersion: cachedVersion };
      }
      return { updateAvailable: false, latestVersion: cachedVersion };
    }

    // Fetch latest version from npm
    const latestVersion = await fetchLatestVersion();

    if (!latestVersion) {
      return { updateAvailable: false, latestVersion: null };
    }

    // Update cache
    config.set('lastUpdateCheck', now);
    config.set('latestVersion', latestVersion);

    // Compare versions
    if (
      compareVersions(latestVersion, currentVersion) > 0 &&
      latestVersion !== dismissedVersion
    ) {
      if (!silent) {
        displayUpdateNotification(currentVersion, latestVersion);
      }
      return { updateAvailable: true, latestVersion };
    }

    return { updateAvailable: false, latestVersion };
  } catch (error) {
    // Silently fail - don't disrupt user experience
    return { updateAvailable: false, latestVersion: null };
  }
}

/**
 * Display update notification to user
 */
function displayUpdateNotification(currentVersion, latestVersion) {
  const message = `
${chalk.yellow('╭─────────────────────────────────────────────────────────╮')}
${chalk.yellow('│')}  ${chalk.bold('Update available!')} ${chalk.dim(currentVersion)} → ${chalk.green(latestVersion)}              ${chalk.yellow('│')}
${chalk.yellow('│')}                                                         ${chalk.yellow('│')}
${chalk.yellow('│')}  Run ${chalk.cyan('npm update -g quickship-cli')} to update         ${chalk.yellow('│')}
${chalk.yellow('│')}  Or run ${chalk.cyan('quickship update')} for guided update         ${chalk.yellow('│')}
${chalk.yellow('╰─────────────────────────────────────────────────────────╯')}
`;
  console.log(message);
}

/**
 * Dismiss update notification for a specific version
 */
export function dismissUpdate(version) {
  config.set('dismissedVersion', version);
}

/**
 * Clear update cache (useful for testing or forcing re-check)
 */
export function clearUpdateCache() {
  config.set('lastUpdateCheck', 0);
  config.set('latestVersion', '');
  config.set('dismissedVersion', '');
}

/**
 * Get update status without triggering a check
 */
export function getUpdateStatus() {
  return {
    lastCheck: config.get('lastUpdateCheck'),
    latestVersion: config.get('latestVersion'),
    dismissedVersion: config.get('dismissedVersion'),
    currentVersion: getCurrentVersion(),
  };
}

export default {
  checkForUpdates,
  dismissUpdate,
  clearUpdateCache,
  getUpdateStatus,
  getCurrentVersion,
};

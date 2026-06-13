import { cosmiconfig } from 'cosmiconfig';

const explorer = cosmiconfig('quickship', {
  searchPlaces: [
    'quickship.config.js',
    'quickship.config.cjs',
    '.quickshiprc',
    '.quickshiprc.json',
    '.quickshiprc.js',
    'package.json',
  ],
});

/**
 * Load .quickshiprc / quickship.config.js from CWD upward.
 * Returns the config object or null if none found.
 */
export async function loadProjectConfig() {
  try {
    const result = await explorer.search();
    return result?.config ?? null;
  } catch {
    return null;
  }
}

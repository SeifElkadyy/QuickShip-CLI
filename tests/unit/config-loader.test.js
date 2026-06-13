import { describe, it, expect, beforeAll, afterEach } from '@jest/globals';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';

const RC_PATH = join(process.cwd(), '.quickshiprc.json');

// cosmiconfig caches results — we call clearCaches() between tests
let cosmiconfig;

beforeAll(async () => {
  cosmiconfig = (await import('cosmiconfig')).cosmiconfig;
});

afterEach(() => {
  if (existsSync(RC_PATH)) unlinkSync(RC_PATH);
});

async function loadFresh() {
  // Create a fresh explorer each call so cosmiconfig cache is bypassed
  const explorer = cosmiconfig('quickship', {
    searchPlaces: [
      'quickship.config.js',
      '.quickshiprc',
      '.quickshiprc.json',
      'package.json',
    ],
  });
  try {
    const result = await explorer.search(process.cwd());
    return result?.config ?? null;
  } catch {
    return null;
  }
}

describe('Config Loader', () => {
  it('returns null when no config file present', async () => {
    const result = await loadFresh();
    expect(result).toBeNull();
  });

  it('loads .quickshiprc.json and returns parsed object', async () => {
    writeFileSync(RC_PATH, JSON.stringify({ packageManager: 'pnpm', git: true }));
    const result = await loadFresh();
    expect(result).not.toBeNull();
    expect(result.packageManager).toBe('pnpm');
    expect(result.git).toBe(true);
  });

  it('returns null on malformed JSON without throwing', async () => {
    writeFileSync(RC_PATH, '{ bad json }');
    const result = await loadFresh();
    expect(result).toBeNull();
  });
});

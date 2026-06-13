import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { mkdirSync, rmSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

describe('GitManager', () => {
  let GitManager;
  let testDir;

  beforeAll(async () => {
    const mod = await import('../../src/integrations/github/git-manager.js');
    GitManager = mod.default;
    testDir = join(tmpdir(), `quickship-git-test-${Date.now()}`);
    mkdirSync(testDir, { recursive: true });
  });

  afterAll(() => {
    if (existsSync(testDir)) rmSync(testDir, { recursive: true, force: true });
  });

  it('isGitInstalled returns true when git is on PATH', async () => {
    const gm = new GitManager(testDir);
    const result = await gm.isGitInstalled();
    expect(result).toBe(true);
  });

  it('isGitRepo returns false for plain directory', async () => {
    const gm = new GitManager(testDir);
    const result = await gm.isGitRepo();
    expect(result).toBe(false);
  });

  it('does NOT walk up to parent .git (isolation fix)', async () => {
    // CWD is inside QuickShip repo which has .git — manager must NOT detect it
    const gm = new GitManager(testDir);
    const result = await gm.isGitRepo();
    expect(result).toBe(false);
  });

  it('init creates .git directory', async () => {
    const gm = new GitManager(testDir);
    await gm.init();
    expect(existsSync(join(testDir, '.git'))).toBe(true);
  });

  it('isGitRepo returns true after init', async () => {
    const gm = new GitManager(testDir);
    const result = await gm.isGitRepo();
    expect(result).toBe(true);
  });

  it('init is idempotent — second call does not throw', async () => {
    const gm = new GitManager(testDir);
    await expect(gm.init()).resolves.not.toThrow();
  });
});

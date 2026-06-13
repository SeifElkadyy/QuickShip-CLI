import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { execa } from 'execa';
import { existsSync, rmSync, mkdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CLI_PATH = join(__dirname, '../../bin/index.js');
const OUT_DIR = join(__dirname, '../.test-output/scaffold');

function projectDir(name) {
  return join(OUT_DIR, name);
}

async function build(name, extraArgs = []) {
  return execa(
    'node',
    [CLI_PATH, 'build', name, '--yes', '--no-install', '--no-git', ...extraArgs],
    { cwd: OUT_DIR, env: { ...process.env, CI: '1' }, reject: false }
  );
}

describe('Scaffold Integration', () => {
  beforeAll(() => {
    if (existsSync(OUT_DIR)) rmSync(OUT_DIR, { recursive: true, force: true });
    mkdirSync(OUT_DIR, { recursive: true });
  });

  afterAll(() => {
    if (existsSync(OUT_DIR)) rmSync(OUT_DIR, { recursive: true, force: true });
  });

  describe('Next.js scaffold', () => {
    const name = 'test-nextjs';
    let buildResult;

    beforeAll(async () => {
      buildResult = await build(name, ['--template', 'nextjs']);
    }, 120_000);

    it('exits 0', () => {
      expect(buildResult.exitCode).toBe(0);
    });

    it('creates project directory', () => {
      expect(existsSync(projectDir(name))).toBe(true);
    });

    it('has package.json', () => {
      expect(existsSync(join(projectDir(name), 'package.json'))).toBe(true);
    });

    it('package.json has next dependency', () => {
      const pkg = JSON.parse(readFileSync(join(projectDir(name), 'package.json'), 'utf-8'));
      expect(pkg.dependencies).toHaveProperty('next');
    });
  });

  describe('React + Vite scaffold', () => {
    const name = 'test-vite';
    let buildResult;

    beforeAll(async () => {
      buildResult = await build(name, ['--template', 'react-vite']);
    }, 60_000);

    it('exits 0', () => {
      expect(buildResult.exitCode).toBe(0);
    });

    it('creates project directory', () => {
      expect(existsSync(projectDir(name))).toBe(true);
    });

    it('has package.json', () => {
      expect(existsSync(join(projectDir(name), 'package.json'))).toBe(true);
    });
  });

  describe('CI mode auto-detection', () => {
    it('runs non-interactively with CI=1', async () => {
      const { exitCode } = await execa(
        'node',
        [CLI_PATH, 'build', 'ci-test-project', '--template', 'nextjs', '--no-install', '--no-git'],
        { cwd: OUT_DIR, env: { ...process.env, CI: '1', GITHUB_ACTIONS: '1' }, reject: false }
      );
      expect(exitCode).toBe(0);
    }, 120_000);
  });

  describe('Input validation', () => {
    it('rejects uppercase project name with non-zero exit', async () => {
      const { exitCode, stdout, stderr } = await execa(
        'node',
        [CLI_PATH, 'build', 'MyProject', '--yes', '--no-install', '--no-git'],
        { cwd: OUT_DIR, env: { ...process.env, CI: '1' }, reject: false }
      );
      expect(exitCode).not.toBe(0);
      expect((stdout + stderr).toLowerCase()).toMatch(/invalid|uppercase|error/);
    }, 30_000);

    it('rejects path traversal with non-zero exit', async () => {
      const { exitCode } = await execa(
        'node',
        [CLI_PATH, 'build', '../evil', '--yes', '--no-install', '--no-git'],
        { cwd: OUT_DIR, env: { ...process.env, CI: '1' }, reject: false }
      );
      expect(exitCode).not.toBe(0);
    }, 30_000);

    it('rejects already-existing directory', async () => {
      mkdirSync(join(OUT_DIR, 'existing-project'), { recursive: true });
      const { exitCode } = await execa(
        'node',
        [CLI_PATH, 'build', 'existing-project', '--yes', '--no-install', '--no-git', '--template', 'nextjs'],
        { cwd: OUT_DIR, env: { ...process.env, CI: '1' }, reject: false }
      );
      expect(exitCode).not.toBe(0);
    }, 30_000);
  });
});

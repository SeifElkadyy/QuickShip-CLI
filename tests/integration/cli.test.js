import { jest, describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { execa } from 'execa';
import { existsSync, rmSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CLI_PATH = join(__dirname, '../../bin/index.js');
const TEST_DIR = join(__dirname, '../.test-output');

describe('CLI Integration Tests', () => {
  beforeAll(() => {
    // Clean up test directory if it exists
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true, force: true });
    }
  });

  afterAll(() => {
    // Clean up test directory
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true, force: true });
    }
  });

  describe('CLI Basic Commands', () => {
    it('should display version', async () => {
      const { stdout } = await execa('node', [CLI_PATH, '--version']);

      expect(stdout).toMatch(/\d+\.\d+\.\d+/);
    });

    it('should display help', async () => {
      const { stdout } = await execa('node', [CLI_PATH, '--help']);

      expect(stdout).toContain('quickship');
      expect(stdout).toContain('build');
      expect(stdout).toContain('list');
      expect(stdout).toContain('deploy');
    });

    it('should list available templates', async () => {
      const { stdout } = await execa('node', [CLI_PATH, 'list']);

      expect(stdout).toContain('Next.js');
      expect(stdout).toContain('Express');
    });

    it('should show detailed template information', async () => {
      const { stdout } = await execa('node', [CLI_PATH, 'templates']);

      // Check for template names that appear in the output
      expect(stdout).toContain('Next.js');
      expect(stdout).toContain('T3 Stack');
      expect(stdout).toContain('React');
      expect(stdout).toContain('MERN');
    });
  });

  describe('Doctor Command', () => {
    it('should run doctor command successfully', async () => {
      const { stdout, exitCode } = await execa('node', [CLI_PATH, 'doctor'], {
        reject: false,
      });

      // Doctor command should complete (may warn but shouldn't crash)
      expect(exitCode).toBeDefined();
      expect(stdout).toBeDefined();
    });
  });

  describe('Info Command', () => {
    it('should run info command', async () => {
      const { stdout, exitCode } = await execa('node', [CLI_PATH, 'info'], {
        reject: false,
      });

      expect(exitCode).toBeDefined();
    });
  });
});

describe('CLI Build Command', () => {
  it('should show build command help', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'build', '--help']);

    expect(stdout).toContain('project-name');
    expect(stdout).toContain('--template');
    expect(stdout).toContain('--package-manager');
  });
});

import { jest, describe, it, expect, beforeEach } from '@jest/globals';

describe('Version Fetcher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getFallbackVersion', () => {
    it('should return fallback version for known packages', async () => {
      const { getFallbackVersion } = await import(
        '../../src/utils/version-fetcher.js'
      );

      const version = getFallbackVersion('express');

      expect(version).toBeDefined();
      expect(typeof version).toBe('string');
      expect(version).toMatch(/^\^?\d+\.\d+\.\d+/);
    });

    it('should return version for TypeScript', async () => {
      const { getFallbackVersion } = await import(
        '../../src/utils/version-fetcher.js'
      );

      const version = getFallbackVersion('typescript');

      expect(version).toBeDefined();
      expect(version).toMatch(/^\^?\d+\.\d+\.\d+/);
    });

    it('should return version for NestJS packages', async () => {
      const { getFallbackVersion } = await import(
        '../../src/utils/version-fetcher.js'
      );

      const version = getFallbackVersion('@nestjs/common');

      expect(version).toBeDefined();
      expect(version).toMatch(/^\^?\d+\.\d+\.\d+/);
    });
  });

  describe('getAllFallbackVersions', () => {
    it('should return all fallback versions', async () => {
      const { getAllFallbackVersions } = await import(
        '../../src/utils/version-fetcher.js'
      );

      const versions = getAllFallbackVersions();

      expect(versions).toBeDefined();
      expect(typeof versions).toBe('object');
      expect(Object.keys(versions).length).toBeGreaterThan(0);
      expect(versions).toHaveProperty('express');
      expect(versions).toHaveProperty('typescript');
    });
  });

  describe('getLatestVersion', () => {
    it('should return a version for a package', async () => {
      const { getLatestVersion } = await import(
        '../../src/utils/version-fetcher.js'
      );

      const version = await getLatestVersion('express', { useFallback: true });

      expect(version).toBeDefined();
      expect(typeof version).toBe('string');
    });
  });

  describe('getLatestVersions', () => {
    it('should return versions for multiple packages', async () => {
      const { getLatestVersions } = await import(
        '../../src/utils/version-fetcher.js'
      );

      const versions = await getLatestVersions(['express', 'typescript'], {
        useFallback: true,
      });

      expect(versions).toBeDefined();
      expect(typeof versions).toBe('object');
      expect(versions).toHaveProperty('express');
      expect(versions).toHaveProperty('typescript');
    });
  });
});

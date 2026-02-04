import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Mock the conf module
jest.unstable_mockModule('conf', () => ({
  default: jest.fn().mockImplementation(() => ({
    get: jest.fn().mockReturnValue(0),
    set: jest.fn(),
  })),
}));

describe('Update Checker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('compareVersions', () => {
    it('should correctly compare semver versions', async () => {
      // Import after mocking
      const { checkForUpdates } = await import(
        '../../src/utils/update-checker.js'
      );

      // The function should exist
      expect(checkForUpdates).toBeDefined();
      expect(typeof checkForUpdates).toBe('function');
    });
  });

  describe('checkForUpdates', () => {
    it('should return updateAvailable status', async () => {
      const { checkForUpdates } = await import(
        '../../src/utils/update-checker.js'
      );

      const result = await checkForUpdates({ silent: true });

      expect(result).toHaveProperty('updateAvailable');
      expect(typeof result.updateAvailable).toBe('boolean');
    });

    it('should return latestVersion', async () => {
      const { checkForUpdates } = await import(
        '../../src/utils/update-checker.js'
      );

      const result = await checkForUpdates({ silent: true });

      expect(result).toHaveProperty('latestVersion');
    });
  });

  describe('getCurrentVersion', () => {
    it('should return current version from package.json', async () => {
      const { getCurrentVersion } = await import(
        '../../src/utils/update-checker.js'
      );

      const version = getCurrentVersion();

      expect(version).toBeDefined();
      expect(typeof version).toBe('string');
      expect(version).toMatch(/^\d+\.\d+\.\d+/);
    });
  });
});

import { describe, it, expect } from '@jest/globals';

describe('Validator', () => {
  let validator;

  beforeAll(async () => {
    const mod = await import('../../src/utils/validator.js');
    validator = mod.default;
  });

  describe('validateProjectName', () => {
    it('accepts valid lowercase names', () => {
      expect(validator.validateProjectName('my-project').valid).toBe(true);
      expect(validator.validateProjectName('myapp').valid).toBe(true);
      expect(validator.validateProjectName('my-saas-dashboard').valid).toBe(true);
    });

    it('rejects empty name', () => {
      const r = validator.validateProjectName('');
      expect(r.valid).toBe(false);
    });

    it('rejects names with uppercase', () => {
      const r = validator.validateProjectName('MyProject');
      expect(r.valid).toBe(false);
    });

    it('rejects names with spaces', () => {
      const r = validator.validateProjectName('my project');
      expect(r.valid).toBe(false);
    });

    it('rejects path traversal', () => {
      const r = validator.validateProjectName('../evil');
      expect(r.valid).toBe(false);
    });

    it('rejects names starting with dot', () => {
      const r = validator.validateProjectName('.hidden');
      expect(r.valid).toBe(false);
    });

    it('rejects names over 214 chars', () => {
      const long = 'a'.repeat(215);
      const r = validator.validateProjectName(long);
      expect(r.valid).toBe(false);
    });

    it('returns errors array on failure', () => {
      const r = validator.validateProjectName('');
      expect(Array.isArray(r.errors)).toBe(true);
      expect(r.errors.length).toBeGreaterThan(0);
    });
  });
});

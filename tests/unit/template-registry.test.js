import { jest, describe, it, expect, beforeEach } from '@jest/globals';

describe('Template Registry', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTemplates', () => {
    it('should return templates grouped by category', async () => {
      const { getAllTemplates } = await import(
        '../../src/core/template-registry.js'
      );

      const templates = await getAllTemplates({ includeRemote: false });

      expect(templates).toBeDefined();
      expect(typeof templates).toBe('object');
      expect(templates).toHaveProperty('website');
      expect(templates).toHaveProperty('backend');
    });

    it('should include built-in templates', async () => {
      const { getAllTemplates } = await import(
        '../../src/core/template-registry.js'
      );

      const templates = await getAllTemplates({ includeRemote: false });

      expect(templates.website).toHaveProperty('nextjs-typescript-tailwind');
      expect(templates.backend).toHaveProperty('express-api');
    });
  });

  describe('getTemplatesByCategory', () => {
    it('should return templates for website category', async () => {
      const { getTemplatesByCategory } = await import(
        '../../src/core/template-registry.js'
      );

      const templates = await getTemplatesByCategory('website');

      expect(templates).toBeDefined();
      expect(templates).toHaveProperty('nextjs-typescript-tailwind');
    });

    it('should return templates for backend category', async () => {
      const { getTemplatesByCategory } = await import(
        '../../src/core/template-registry.js'
      );

      const templates = await getTemplatesByCategory('backend');

      expect(templates).toBeDefined();
      expect(templates).toHaveProperty('express-api');
      expect(templates).toHaveProperty('nestjs-api');
    });

    it('should return empty object for unknown category', async () => {
      const { getTemplatesByCategory } = await import(
        '../../src/core/template-registry.js'
      );

      const templates = await getTemplatesByCategory('unknown');

      expect(templates).toEqual({});
    });
  });

  describe('getTemplate', () => {
    it('should return specific template by name', async () => {
      const { getTemplate } = await import(
        '../../src/core/template-registry.js'
      );

      const template = await getTemplate('express-api');

      expect(template).toBeDefined();
      expect(template).toHaveProperty('description');
    });

    it('should return null for unknown template', async () => {
      const { getTemplate } = await import(
        '../../src/core/template-registry.js'
      );

      const template = await getTemplate('non-existent-template');

      expect(template).toBeNull();
    });
  });

  describe('validateTemplate', () => {
    it('should validate valid template', async () => {
      const { validateTemplate } = await import(
        '../../src/core/template-registry.js'
      );

      const result = validateTemplate({
        name: 'test-template',
        description: 'A test template',
        category: 'website',
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject template without name', async () => {
      const { validateTemplate } = await import(
        '../../src/core/template-registry.js'
      );

      const result = validateTemplate({
        description: 'A test template',
        category: 'website',
      });

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject template with invalid category', async () => {
      const { validateTemplate } = await import(
        '../../src/core/template-registry.js'
      );

      const result = validateTemplate({
        name: 'test-template',
        description: 'A test template',
        category: 'invalid',
      });

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('getTemplateStats', () => {
    it('should return template statistics', async () => {
      const { getTemplateStats } = await import(
        '../../src/core/template-registry.js'
      );

      const stats = await getTemplateStats();

      expect(stats).toBeDefined();
      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('byCategory');
      expect(stats).toHaveProperty('recommended');
      expect(stats.total).toBeGreaterThan(0);
    });
  });

  describe('Custom Templates', () => {
    it('should add and retrieve custom template', async () => {
      const { addCustomTemplate, getCustomTemplates, removeCustomTemplate } =
        await import('../../src/core/template-registry.js');

      const customTemplate = {
        name: 'my-custom-template',
        description: 'My custom template',
        category: 'custom',
        repo: 'user/repo',
      };

      addCustomTemplate('my-custom-template', customTemplate);

      const templates = getCustomTemplates();
      expect(templates).toHaveProperty('my-custom-template');

      // Cleanup
      removeCustomTemplate('my-custom-template');
    });

    it('should remove custom template', async () => {
      const { addCustomTemplate, removeCustomTemplate, getCustomTemplates } =
        await import('../../src/core/template-registry.js');

      addCustomTemplate('temp-template', {
        name: 'temp-template',
        description: 'Temporary',
        category: 'custom',
      });

      const removed = removeCustomTemplate('temp-template');
      expect(removed).toBe(true);

      const templates = getCustomTemplates();
      expect(templates).not.toHaveProperty('temp-template');
    });
  });
});

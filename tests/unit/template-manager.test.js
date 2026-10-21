import { describe, it, expect } from '@jest/globals';
import TemplateManager from '../../src/core/template-manager.js';

describe('TemplateManager.determineTemplate', () => {
  const tm = new TemplateManager();

  it('resolves aliases to built-in templates', () => {
    expect(tm.determineTemplate({ stack: 'nextjs' })).toBe(
      'nextjs-typescript-tailwind'
    );
    expect(tm.determineTemplate({ stack: 'expo' })).toBe('expo-react-native');
  });

  it('passes built-in template names through', () => {
    expect(tm.determineTemplate({ stack: 'express-api' })).toBe('express-api');
    expect(tm.determineTemplate({ stack: 'react-vite' })).toBe('react-vite');
  });

  // Regression: unknown names used to silently scaffold Next.js
  it('throws on unknown templates instead of falling back to Next.js', () => {
    expect(() => tm.determineTemplate({ stack: 'sveltekit' })).toThrow(
      /Unknown template: sveltekit/
    );
  });
});

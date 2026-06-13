import { describe, it, expect } from '@jest/globals';

describe('Smart Defaults', () => {
  let analyzeProjectName;

  beforeAll(async () => {
    const mod = await import('../../src/utils/smart-defaults.js');
    analyzeProjectName = mod.analyzeProjectName;
  });

  it('returns null for empty name', () => {
    expect(analyzeProjectName('')).toBeNull();
    expect(analyzeProjectName(null)).toBeNull();
  });

  it('saas/app/platform/dashboard → nextjs + shadcn', () => {
    // 'admin-platform' excluded — 'admin' hits the admin/vite rule first (correct behavior)
    for (const name of ['my-saas', 'cool-app', 'my-platform', 'ops-dashboard']) {
      const r = analyzeProjectName(name);
      expect(r.stack).toBe('nextjs');
      expect(r.shadcn).toBe(true);
    }
  });

  it('shop/store/ecommerce/cart → t3', () => {
    for (const name of ['my-shop', 'cool-store', 'ecommerce-app', 'cart-app']) {
      const r = analyzeProjectName(name);
      expect(r.stack).toBe('t3');
    }
  });

  it('api/backend/server → mern', () => {
    for (const name of ['my-api', 'cool-backend', 'my-server']) {
      const r = analyzeProjectName(name);
      expect(r.stack).toBe('mern');
    }
  });

  it('admin/panel/console → vite', () => {
    for (const name of ['my-admin', 'control-panel', 'ops-console']) {
      const r = analyzeProjectName(name);
      expect(r.stack).toBe('vite');
    }
  });

  it('unknown name → nextjs default', () => {
    const r = analyzeProjectName('my-project');
    expect(r.stack).toBe('nextjs');
  });

  it('always returns typescript: true', () => {
    const r = analyzeProjectName('anything');
    expect(r.typescript).toBe(true);
  });

  it('always returns a reason string', () => {
    const r = analyzeProjectName('my-saas');
    expect(typeof r.reason).toBe('string');
    expect(r.reason.length).toBeGreaterThan(0);
  });
});

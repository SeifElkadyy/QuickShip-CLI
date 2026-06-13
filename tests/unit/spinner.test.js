import { describe, it, expect } from '@jest/globals';

describe('Spinner (no-op)', () => {
  let Spinner;

  beforeAll(async () => {
    const mod = await import('../../src/utils/spinner.js');
    Spinner = mod.default;
  });

  it('all methods return this (chainable)', () => {
    const s = new Spinner();
    expect(s.start()).toBe(s);
    expect(s.succeed()).toBe(s);
    expect(s.fail()).toBe(s);
    expect(s.update()).toBe(s);
    expect(s.stop()).toBe(s);
    expect(s.info()).toBe(s);
  });

  it('produces zero stdout output', () => {
    const writes = [];
    const orig = process.stdout.write.bind(process.stdout);
    process.stdout.write = (...args) => { writes.push(args[0]); return true; };
    const s = new Spinner();
    s.start('x').succeed('y').fail('z').update('a').stop().info('b');
    process.stdout.write = orig;
    expect(writes).toHaveLength(0);
  });
});

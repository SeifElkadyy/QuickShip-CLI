import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';

describe('Logger', () => {
  let logger;
  let consoleSpy;

  beforeAll(async () => {
    const mod = await import('../../src/utils/logger.js');
    logger = mod.default;
  });

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('success calls console.log', () => {
    logger.success('done');
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });

  it('error calls console.log', () => {
    logger.error('fail');
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });

  it('info calls console.log', () => {
    logger.info('note');
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });

  it('warning calls console.log', () => {
    logger.warning('warn');
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });

  it('box calls console.log', () => {
    logger.box('message', 'title');
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });

  it('divider calls console.log', () => {
    logger.divider();
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });

  it('showAsciiLogo calls console.log', () => {
    logger.showAsciiLogo();
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
});

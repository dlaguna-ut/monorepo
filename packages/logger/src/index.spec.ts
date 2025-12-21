import { logger } from './index.js';

describe('Logger', () => {
  it('should be defined', () => {
    expect(logger).toBeDefined();
  });

  it('should have log methods', () => {
    expect(logger.info).toBeDefined();
    expect(logger.error).toBeDefined();
    expect(logger.warn).toBeDefined();
    expect(typeof logger.info).toBe('function');
  });

  it('should log without throwing', () => {
    // We can't easily check console output without mocking, 
    // but we can ensure it doesn't crash.
    expect(() => logger.info('Test info message')).not.toThrow();
  });
});

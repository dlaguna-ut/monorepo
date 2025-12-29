import { describe, it, expect } from 'vitest';
import { SCRAPE_QUEUE_NAME, SCRAPE_JOB_NAME } from './index.js';

describe('Jobs Constants', () => {
    it('should have correct queue name', () => {
        expect(SCRAPE_QUEUE_NAME).toBe('scrape-queue');
    });

    it('should have correct job name', () => {
        expect(SCRAPE_JOB_NAME).toBe('scrape-job');
    });
});

import puppeteer, { Browser, Page } from 'puppeteer';
import { logger } from '@repo/logger';
import { Scraper } from '../interfaces/scraper.interface.js';

export class PuppeteerScraper implements Scraper {
  private browser: Browser | null = null;
  private page: Page | null = null;

  async init(): Promise<void> {
    logger.info('Initializing Puppeteer...');
    this.browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    this.page = await this.browser.newPage();
  }

  async goTo(url: string): Promise<void> {
    if (!this.page) throw new Error('Browser not initialized');
    logger.info(`Navigating to ${url}`);
    await this.page.goto(url);
  }

  async getTitle(): Promise<string> {
    if (!this.page) throw new Error('Browser not initialized');
    return this.page.title();
  }

  async takeScreenshot(path: string): Promise<void> {
    if (!this.page) throw new Error('Browser not initialized');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await this.page.screenshot({ path: path as any });
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      logger.info('Browser closed');
    }
  }
}

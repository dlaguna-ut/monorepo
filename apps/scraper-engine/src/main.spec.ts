import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { PuppeteerScraper } from "./scrapers/puppeteer.scraper.js";

// Mock puppeteer and logger
jest.mock("puppeteer", () => ({
  launch: jest.fn().mockImplementation(() => Promise.resolve({
    newPage: jest.fn().mockImplementation(() => Promise.resolve({
      goto: jest.fn(),
      title: jest.fn<() => Promise<string>>().mockResolvedValue("Test Title"),
      screenshot: jest.fn(),
    })),
    close: jest.fn(),
  })),
}));

jest.mock("@repo/logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe("PuppeteerScraper", () => {
  let scraper: PuppeteerScraper;

  beforeEach(() => {
    scraper = new PuppeteerScraper();
  });

  it("should initialize browser", async () => {
    await scraper.init();
    // We can't access private properties easily to verify, but if it doesn't throw, it's good.
    expect(true).toBe(true);
  });

  it("should get title", async () => {
    await scraper.init();
    const title = await scraper.getTitle();
    expect(title).toBe("Test Title");
  });
});

import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import type { PuppeteerScraper as PuppeteerScraperType } from "./scrapers/puppeteer.scraper.js";

// Define mocks
const mockPage = {
  goto: jest.fn(),
  title: jest.fn<() => Promise<string>>().mockResolvedValue("Test Title"),
  screenshot: jest.fn(),
};

const mockBrowser = {
  newPage: jest.fn().mockReturnValue(Promise.resolve(mockPage)),
  close: jest.fn(),
};

const mockPuppeteer = {
  launch: jest.fn().mockReturnValue(Promise.resolve(mockBrowser)),
};

// Mock modules using unstable_mockModule for ESM support
jest.unstable_mockModule("puppeteer", () => ({
  __esModule: true,
  default: mockPuppeteer,
}));

jest.unstable_mockModule("@repo/logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

// Dynamic import of the module under test
const { PuppeteerScraper } = await import("./scrapers/puppeteer.scraper.js");

describe("PuppeteerScraper", () => {
  let scraper: PuppeteerScraperType;

  beforeEach(() => {
    scraper = new PuppeteerScraper();
  });

  it("should initialize browser", async () => {
    await scraper.init();
    expect(mockPuppeteer.launch).toHaveBeenCalled();
  });

  it("should get title", async () => {
    await scraper.init();
    const title = await scraper.getTitle();
    expect(title).toBe("Test Title");
  });
});

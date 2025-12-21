export interface Scraper {
  init(): Promise<void>;
  goTo(url: string): Promise<void>;
  getTitle(): Promise<string>;
  takeScreenshot(path: string): Promise<void>;
  close(): Promise<void>;
}

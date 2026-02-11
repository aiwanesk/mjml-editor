import puppeteer, { Browser } from "puppeteer";

export class PuppeteerScreenshotService {
  private static instance: PuppeteerScreenshotService;
  private browser: Browser | null = null;

  static getInstance(): PuppeteerScreenshotService {
    if (!PuppeteerScreenshotService.instance) {
      PuppeteerScreenshotService.instance = new PuppeteerScreenshotService();
    }
    return PuppeteerScreenshotService.instance;
  }

  private async getBrowser(): Promise<Browser> {
    if (!this.browser || !this.browser.connected) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    }
    return this.browser;
  }

  async takeScreenshot(html: string, width = 600): Promise<Buffer> {
    const browser = await this.getBrowser();
    const page = await browser.newPage();

    try {
      await page.setViewport({ width, height: 800 });
      await page.setContent(html, { waitUntil: "networkidle0" });

      // Wait for images to load
      await page.evaluate(() => {
        return Promise.all(
          Array.from(document.images)
            .filter((img) => !img.complete)
            .map(
              (img) =>
                new Promise((resolve) => {
                  img.addEventListener("load", resolve);
                  img.addEventListener("error", resolve);
                })
            )
        );
      });

      const screenshot = await page.screenshot({
        fullPage: true,
        type: "png",
      });

      return Buffer.from(screenshot);
    } finally {
      await page.close();
    }
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

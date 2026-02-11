import { v4 as uuidv4 } from "uuid";
import { FileStorageService } from "./FileStorageService.js";
import { PuppeteerScreenshotService } from "./PuppeteerScreenshotService.js";

export class ThumbnailService {
  private fileStorage = new FileStorageService();

  async generateThumbnail(html: string): Promise<string> {
    const screenshotService = PuppeteerScreenshotService.getInstance();
    const screenshot = await screenshotService.takeScreenshot(html);

    // Dynamic import to avoid startup crash on Node < 18.17
    const { default: sharp } = await import("sharp");

    const thumbnail = await sharp(screenshot)
      .resize(400, 600, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toBuffer();

    const filename = `${uuidv4()}.webp`;
    return this.fileStorage.saveThumbnail(filename, thumbnail);
  }
}

import fs from "fs";
import path from "path";
import { config } from "../../config.js";

export class FileStorageService {
  saveUpload(filename: string, buffer: Buffer): string {
    const filePath = path.join(config.uploadDir, filename);
    fs.writeFileSync(filePath, buffer);
    return `/uploads/${filename}`;
  }

  saveThumbnail(filename: string, buffer: Buffer): string {
    const filePath = path.join(config.thumbnailDir, filename);
    fs.writeFileSync(filePath, buffer);
    return `/thumbnails/${filename}`;
  }

  deleteFile(relativePath: string): void {
    const rootDir = path.resolve(config.uploadDir, "..");
    const filePath = path.join(rootDir, relativePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

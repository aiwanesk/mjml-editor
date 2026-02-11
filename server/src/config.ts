import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

export const config = {
  port: parseInt(process.env.PORT || "3001", 10),
  databasePath: path.resolve(rootDir, process.env.DATABASE_PATH || "./data/templates.db"),
  uploadDir: path.resolve(rootDir, process.env.UPLOAD_DIR || "./uploads"),
  thumbnailDir: path.resolve(rootDir, process.env.THUMBNAIL_DIR || "./thumbnails"),
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
};

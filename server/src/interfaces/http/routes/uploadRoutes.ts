import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { FileStorageService } from "../../../infrastructure/services/FileStorageService.js";

const upload = multer({ storage: multer.memoryStorage() });
const fileStorage = new FileStorageService();

export const uploadRoutes = Router();

uploadRoutes.post("/", upload.single("file"), (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ message: "Fichier requis" });
      return;
    }

    const ext = path.extname(file.originalname) || ".jpg";
    const filename = `${uuidv4()}${ext}`;
    const url = fileStorage.saveUpload(filename, file.buffer);

    res.json({ url });
  } catch (err) {
    next(err);
  }
});

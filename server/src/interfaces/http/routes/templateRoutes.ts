import { Router } from "express";
import multer from "multer";
import { TemplateController } from "../controllers/TemplateController.js";

const upload = multer({ storage: multer.memoryStorage() });
const controller = new TemplateController();

export const templateRoutes = Router();

templateRoutes.post("/upload", upload.single("file"), (req, res, next) => controller.upload(req, res, next));
templateRoutes.post("/", (req, res, next) => controller.createFromJson(req, res, next));
templateRoutes.get("/", (req, res, next) => controller.list(req, res, next));
templateRoutes.get("/:id", (req, res, next) => controller.getById(req, res, next));
templateRoutes.put("/:id", (req, res, next) => controller.save(req, res, next));
templateRoutes.delete("/:id", (req, res, next) => controller.delete(req, res, next));
templateRoutes.get("/:id/versions", (req, res, next) => controller.getVersions(req, res, next));

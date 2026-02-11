import { Router } from "express";
import { ExportController } from "../controllers/ExportController.js";

const controller = new ExportController();

export const exportRoutes = Router();

exportRoutes.get("/:id/html", (req, res, next) => controller.exportHtml(req, res, next));
exportRoutes.get("/:id/png", (req, res, next) => controller.exportPng(req, res, next));

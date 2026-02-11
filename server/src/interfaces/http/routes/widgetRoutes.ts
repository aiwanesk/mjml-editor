import { Router, Request, Response } from "express";
import { InMemoryWidgetRepository } from "../../../infrastructure/repositories/InMemoryWidgetRepository.js";

const widgetRepo = new InMemoryWidgetRepository();

export const widgetRoutes = Router();

widgetRoutes.get("/", (_req: Request, res: Response) => {
  const categories = widgetRepo.getAllCategories();
  res.json(categories);
});

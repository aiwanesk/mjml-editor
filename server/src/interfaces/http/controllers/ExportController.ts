import { Request, Response, NextFunction } from "express";
import { SqliteTemplateRepository } from "../../../infrastructure/repositories/SqliteTemplateRepository.js";
import { MjmlCompilerService } from "../../../infrastructure/services/MjmlCompilerService.js";

const repo = new SqliteTemplateRepository();
const compiler = new MjmlCompilerService();

export class ExportController {
  async exportHtml(req: Request, res: Response, next: NextFunction) {
    try {
      const template = await repo.findById(req.params.id);
      if (!template) {
        res.status(404).json({ message: "Template non trouvé" });
        return;
      }

      const { html } = compiler.compile(template.mjmlJson);

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${template.name}.html"`
      );
      res.send(html);
    } catch (err) {
      next(err);
    }
  }

  async exportPng(req: Request, res: Response, next: NextFunction) {
    try {
      const template = await repo.findById(req.params.id);
      if (!template) {
        res.status(404).json({ message: "Template non trouvé" });
        return;
      }

      const { html } = compiler.compile(template.mjmlJson);

      // Dynamic import to avoid loading puppeteer if not needed
      const { PuppeteerScreenshotService } = await import(
        "../../../infrastructure/services/PuppeteerScreenshotService.js"
      );
      const screenshotService = PuppeteerScreenshotService.getInstance();
      const pngBuffer = await screenshotService.takeScreenshot(html);

      res.setHeader("Content-Type", "image/png");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${template.name}.png"`
      );
      res.send(pngBuffer);
    } catch (err) {
      next(err);
    }
  }
}

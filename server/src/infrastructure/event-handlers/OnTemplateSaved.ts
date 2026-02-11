import { eventBus } from "../../domain/shared/EventBus.js";
import { SqliteTemplateRepository } from "../repositories/SqliteTemplateRepository.js";
import { MjmlCompilerService } from "../services/MjmlCompilerService.js";
import { ThumbnailService } from "../services/ThumbnailService.js";
import { Template } from "../../domain/template/Template.js";

const repo = new SqliteTemplateRepository();
const compiler = new MjmlCompilerService();
const thumbnailService = new ThumbnailService();

export function registerTemplateSavedHandler() {
  eventBus.subscribe("template.saved", async (event) => {
    const { templateId } = event.payload as { templateId: string };

    try {
      const template = await repo.findById(templateId);
      if (!template) return;

      const { html } = compiler.compile(template.mjmlJson);
      const thumbnailPath = await thumbnailService.generateThumbnail(html);

      const updated = new Template({
        ...template.toPlain(),
        thumbnailPath,
      });
      await repo.update(updated);

      console.log(`Thumbnail generated for template ${templateId}`);
    } catch (err) {
      console.error(`Failed to generate thumbnail for ${templateId}:`, err);
    }
  });

  eventBus.subscribe("template.created", async (event) => {
    const { templateId } = event.payload as { templateId: string };

    try {
      const template = await repo.findById(templateId);
      if (!template) return;

      const { html } = compiler.compile(template.mjmlJson);
      const thumbnailPath = await thumbnailService.generateThumbnail(html);

      const updated = new Template({
        ...template.toPlain(),
        thumbnailPath,
      });
      await repo.update(updated);

      console.log(`Thumbnail generated for new template ${templateId}`);
    } catch (err) {
      console.error(`Failed to generate thumbnail for ${templateId}:`, err);
    }
  });
}

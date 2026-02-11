import { v4 as uuidv4 } from "uuid";
import { Template } from "../../../domain/template/Template.js";
import { ITemplateRepository } from "../../../domain/template/ITemplateRepository.js";
import { SqliteTemplateRepository } from "../../../infrastructure/repositories/SqliteTemplateRepository.js";
import { MjmlNode } from "../../../domain/template/TemplateContent.js";
import { eventBus } from "../../../domain/shared/EventBus.js";
import { TemplateSaved } from "../../../domain/template/events.js";

interface SaveInput {
  templateId: string;
  mjmlJson: MjmlNode;
  name?: string;
}

export class SaveTemplateCommand {
  constructor(private readonly repo: SqliteTemplateRepository) {}

  async execute(input: SaveInput): Promise<Template> {
    const existing = await this.repo.findById(input.templateId);
    if (!existing) {
      throw new Error("Template non trouvé");
    }

    const newVersion = existing.currentVersion + 1;

    // Save version snapshot
    await this.repo.saveVersion(
      input.templateId,
      existing.currentVersion,
      JSON.stringify(existing.mjmlJson),
      uuidv4()
    );

    const updated = new Template({
      id: existing.id,
      name: input.name || existing.name,
      mjmlJson: input.mjmlJson,
      thumbnailPath: existing.thumbnailPath,
      currentVersion: newVersion,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    await this.repo.update(updated);

    await eventBus.publish(
      new TemplateSaved({ templateId: input.templateId, version: newVersion })
    );

    return updated;
  }
}

import { ITemplateRepository } from "../../../domain/template/ITemplateRepository.js";
import { eventBus } from "../../../domain/shared/EventBus.js";
import { TemplateDeleted } from "../../../domain/template/events.js";

export class DeleteTemplateCommand {
  constructor(private readonly repo: ITemplateRepository) {}

  async execute(id: string): Promise<void> {
    const template = await this.repo.findById(id);
    if (!template) {
      throw new Error("Template non trouvé");
    }
    await this.repo.delete(id);
    await eventBus.publish(new TemplateDeleted({ templateId: id }));
  }
}

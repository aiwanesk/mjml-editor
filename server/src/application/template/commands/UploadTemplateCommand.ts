import { v4 as uuidv4 } from "uuid";
import { Template } from "../../../domain/template/Template.js";
import { ITemplateRepository } from "../../../domain/template/ITemplateRepository.js";
import { MjmlCompilerService } from "../../../infrastructure/services/MjmlCompilerService.js";
import { eventBus } from "../../../domain/shared/EventBus.js";
import { TemplateCreated } from "../../../domain/template/events.js";
import { MjmlNode } from "../../../domain/template/TemplateContent.js";

interface UploadInput {
  name: string;
  mjmlContent: string;
}

export class UploadTemplateCommand {
  constructor(
    private readonly repo: ITemplateRepository,
    private readonly compiler: MjmlCompilerService
  ) {}

  async execute(input: UploadInput): Promise<Template> {
    const ast = this.compiler.parseMjmlToAst(input.mjmlContent);
    const now = new Date();
    const id = uuidv4();

    const template = new Template({
      id,
      name: input.name,
      mjmlJson: ast,
      thumbnailPath: null,
      currentVersion: 1,
      createdAt: now,
      updatedAt: now,
    });

    await this.repo.save(template);

    await eventBus.publish(
      new TemplateCreated({ templateId: id, name: input.name })
    );

    return template;
  }

  async executeFromJson(input: { name: string; mjmlJson: MjmlNode }): Promise<Template> {
    const now = new Date();
    const id = uuidv4();

    const template = new Template({
      id,
      name: input.name,
      mjmlJson: input.mjmlJson,
      thumbnailPath: null,
      currentVersion: 1,
      createdAt: now,
      updatedAt: now,
    });

    await this.repo.save(template);

    await eventBus.publish(
      new TemplateCreated({ templateId: id, name: input.name })
    );

    return template;
  }
}

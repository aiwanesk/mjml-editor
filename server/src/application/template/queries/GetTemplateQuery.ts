import { ITemplateRepository } from "../../../domain/template/ITemplateRepository.js";
import { Template } from "../../../domain/template/Template.js";

export class GetTemplateQuery {
  constructor(private readonly repo: ITemplateRepository) {}

  async execute(id: string): Promise<Template | null> {
    return this.repo.findById(id);
  }
}

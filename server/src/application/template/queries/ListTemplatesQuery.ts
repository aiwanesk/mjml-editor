import { ITemplateRepository } from "../../../domain/template/ITemplateRepository.js";
import { Template } from "../../../domain/template/Template.js";

export class ListTemplatesQuery {
  constructor(private readonly repo: ITemplateRepository) {}

  async execute(): Promise<Template[]> {
    return this.repo.findAll();
  }
}

import { SqliteTemplateRepository } from "../../../infrastructure/repositories/SqliteTemplateRepository.js";

export class GetTemplateVersionsQuery {
  constructor(private readonly repo: SqliteTemplateRepository) {}

  async execute(templateId: string) {
    return this.repo.getVersions(templateId);
  }
}

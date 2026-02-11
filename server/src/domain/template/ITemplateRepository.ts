import { Template } from "./Template.js";

export interface ITemplateRepository {
  save(template: Template): Promise<void>;
  findById(id: string): Promise<Template | null>;
  findAll(): Promise<Template[]>;
  delete(id: string): Promise<void>;
  update(template: Template): Promise<void>;
}

import { eq } from "drizzle-orm";
import { db } from "../database/db.js";
import { templates, templateVersions } from "../database/schema.js";
import { ITemplateRepository } from "../../domain/template/ITemplateRepository.js";
import { Template, TemplateProps } from "../../domain/template/Template.js";

export class SqliteTemplateRepository implements ITemplateRepository {
  async save(template: Template): Promise<void> {
    const props = template.toPlain();
    await db.insert(templates).values({
      id: props.id,
      name: props.name,
      mjmlJson: JSON.stringify(props.mjmlJson),
      thumbnailPath: props.thumbnailPath,
      currentVersion: props.currentVersion,
      createdAt: props.createdAt.toISOString(),
      updatedAt: props.updatedAt.toISOString(),
    });
  }

  async findById(id: string): Promise<Template | null> {
    const rows = await db.select().from(templates).where(eq(templates.id, id));
    if (rows.length === 0) return null;
    return this.rowToTemplate(rows[0]);
  }

  async findAll(): Promise<Template[]> {
    const rows = await db.select().from(templates);
    return rows.map((r) => this.rowToTemplate(r));
  }

  async delete(id: string): Promise<void> {
    await db.delete(templates).where(eq(templates.id, id));
  }

  async update(template: Template): Promise<void> {
    const props = template.toPlain();
    await db
      .update(templates)
      .set({
        name: props.name,
        mjmlJson: JSON.stringify(props.mjmlJson),
        thumbnailPath: props.thumbnailPath,
        currentVersion: props.currentVersion,
        updatedAt: props.updatedAt.toISOString(),
      })
      .where(eq(templates.id, props.id));
  }

  async saveVersion(templateId: string, version: number, mjmlJson: string, id: string): Promise<void> {
    await db.insert(templateVersions).values({
      id,
      templateId,
      version,
      mjmlJson,
      createdAt: new Date().toISOString(),
    });
  }

  async getVersions(templateId: string) {
    return db
      .select()
      .from(templateVersions)
      .where(eq(templateVersions.templateId, templateId));
  }

  private rowToTemplate(row: typeof templates.$inferSelect): Template {
    const props: TemplateProps = {
      id: row.id,
      name: row.name,
      mjmlJson: JSON.parse(row.mjmlJson),
      thumbnailPath: row.thumbnailPath,
      currentVersion: row.currentVersion,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    };
    return new Template(props);
  }
}

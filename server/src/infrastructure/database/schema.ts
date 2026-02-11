import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const templates = sqliteTable("templates", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  mjmlJson: text("mjml_json").notNull(),
  thumbnailPath: text("thumbnail_path"),
  currentVersion: integer("current_version").notNull().default(1),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const templateVersions = sqliteTable("template_versions", {
  id: text("id").primaryKey(),
  templateId: text("template_id")
    .notNull()
    .references(() => templates.id, { onDelete: "cascade" }),
  version: integer("version").notNull(),
  mjmlJson: text("mjml_json").notNull(),
  createdAt: text("created_at").notNull(),
});

import { Request, Response, NextFunction } from "express";
import { SqliteTemplateRepository } from "../../../infrastructure/repositories/SqliteTemplateRepository.js";
import { MjmlCompilerService } from "../../../infrastructure/services/MjmlCompilerService.js";
import { UploadTemplateCommand } from "../../../application/template/commands/UploadTemplateCommand.js";
import { DeleteTemplateCommand } from "../../../application/template/commands/DeleteTemplateCommand.js";
import { SaveTemplateCommand } from "../../../application/template/commands/SaveTemplateCommand.js";
import { ListTemplatesQuery } from "../../../application/template/queries/ListTemplatesQuery.js";
import { GetTemplateQuery } from "../../../application/template/queries/GetTemplateQuery.js";
import { GetTemplateVersionsQuery } from "../../../application/template/queries/GetTemplateVersionsQuery.js";

const repo = new SqliteTemplateRepository();
const compiler = new MjmlCompilerService();
const uploadCmd = new UploadTemplateCommand(repo, compiler);
const deleteCmd = new DeleteTemplateCommand(repo);
const saveCmd = new SaveTemplateCommand(repo);
const listQuery = new ListTemplatesQuery(repo);
const getQuery = new GetTemplateQuery(repo);
const versionsQuery = new GetTemplateVersionsQuery(repo);

function serializeTemplate(t: { toPlain: () => Record<string, unknown> }) {
  const plain = t.toPlain();
  return {
    ...plain,
    createdAt: (plain.createdAt as Date).toISOString(),
    updatedAt: (plain.updatedAt as Date).toISOString(),
  };
}

export class TemplateController {
  async upload(req: Request, res: Response, next: NextFunction) {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ message: "Fichier MJML requis" });
        return;
      }
      const content = file.buffer.toString("utf-8");
      const name = req.body.name || file.originalname.replace(/\.mjml$/, "");

      const template = await uploadCmd.execute({ name, mjmlContent: content });
      res.status(201).json(serializeTemplate(template));
    } catch (err) {
      next(err);
    }
  }

  async createFromJson(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, mjmlJson } = req.body;
      if (!name || !mjmlJson) {
        res.status(400).json({ message: "Nom et contenu MJML requis" });
        return;
      }
      const template = await uploadCmd.executeFromJson({ name, mjmlJson });
      res.status(201).json(serializeTemplate(template));
    } catch (err) {
      next(err);
    }
  }

  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const templates = await listQuery.execute();
      res.json(templates.map(serializeTemplate));
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const template = await getQuery.execute(req.params.id);
      if (!template) {
        res.status(404).json({ message: "Template non trouvé" });
        return;
      }
      res.json(serializeTemplate(template));
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await deleteCmd.execute(req.params.id);
      res.json({ message: "Template supprimé" });
    } catch (err) {
      next(err);
    }
  }

  async save(req: Request, res: Response, next: NextFunction) {
    try {
      const { mjmlJson, name } = req.body;
      if (!mjmlJson) {
        res.status(400).json({ message: "Contenu MJML requis" });
        return;
      }
      const template = await saveCmd.execute({
        templateId: req.params.id,
        mjmlJson,
        name,
      });
      res.json(serializeTemplate(template));
    } catch (err) {
      next(err);
    }
  }

  async getVersions(req: Request, res: Response, next: NextFunction) {
    try {
      const versions = await versionsQuery.execute(req.params.id);
      res.json(versions);
    } catch (err) {
      next(err);
    }
  }
}

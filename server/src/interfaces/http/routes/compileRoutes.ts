import { Router, Request, Response, NextFunction } from "express";
import { MjmlCompilerService } from "../../../infrastructure/services/MjmlCompilerService.js";

const compiler = new MjmlCompilerService();

export const compileRoutes = Router();

compileRoutes.post("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mjmlJson } = req.body;
    if (!mjmlJson) {
      res.status(400).json({ message: "Contenu MJML JSON requis" });
      return;
    }
    const result = compiler.compile(mjmlJson);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

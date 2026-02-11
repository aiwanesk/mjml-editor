import { api } from "./api";
import type { MjmlNode } from "@/types/mjml";

export const compileApi = {
  compile: (mjmlJson: MjmlNode) =>
    api.post<{ html: string; errors: unknown[] }>("/compile", { mjmlJson }),
};

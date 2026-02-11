import type { MjmlNode } from "./mjml";

export interface Template {
  id: string;
  name: string;
  mjmlJson: MjmlNode;
  thumbnailPath: string | null;
  currentVersion: number;
  createdAt: string;
  updatedAt: string;
}

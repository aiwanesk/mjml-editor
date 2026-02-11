import { ValueObject } from "../shared/ValueObject.js";
import { MjmlNode } from "./TemplateContent.js";

interface TemplateVersionProps {
  id: string;
  templateId: string;
  version: number;
  mjmlJson: MjmlNode;
  createdAt: Date;
}

export class TemplateVersion extends ValueObject<TemplateVersionProps> {
  get id() { return this.value.id; }
  get templateId() { return this.value.templateId; }
  get version() { return this.value.version; }
  get mjmlJson() { return this.value.mjmlJson; }
  get createdAt() { return this.value.createdAt; }
}

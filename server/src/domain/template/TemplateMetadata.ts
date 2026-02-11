import { ValueObject } from "../shared/ValueObject.js";

interface TemplateMetadataProps {
  name: string;
  currentVersion: number;
  thumbnailPath: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class TemplateMetadata extends ValueObject<TemplateMetadataProps> {
  get name() { return this.value.name; }
  get currentVersion() { return this.value.currentVersion; }
  get thumbnailPath() { return this.value.thumbnailPath; }
  get createdAt() { return this.value.createdAt; }
  get updatedAt() { return this.value.updatedAt; }
}

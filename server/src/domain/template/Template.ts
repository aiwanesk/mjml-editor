import { Entity } from "../shared/Entity.js";
import { TemplateContent, MjmlNode } from "./TemplateContent.js";
import { TemplateMetadata } from "./TemplateMetadata.js";

export interface TemplateProps {
  id: string;
  name: string;
  mjmlJson: MjmlNode;
  thumbnailPath: string | null;
  currentVersion: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Template extends Entity<string> {
  public readonly content: TemplateContent;
  public readonly metadata: TemplateMetadata;

  constructor(private readonly props: TemplateProps) {
    super(props.id);
    this.content = new TemplateContent(props.mjmlJson);
    this.metadata = new TemplateMetadata({
      name: props.name,
      currentVersion: props.currentVersion,
      thumbnailPath: props.thumbnailPath,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
  }

  get name() { return this.props.name; }
  get mjmlJson() { return this.props.mjmlJson; }
  get thumbnailPath() { return this.props.thumbnailPath; }
  get currentVersion() { return this.props.currentVersion; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  toPlain(): TemplateProps {
    return { ...this.props };
  }
}

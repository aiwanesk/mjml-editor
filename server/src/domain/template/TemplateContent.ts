import { ValueObject } from "../shared/ValueObject.js";

export interface MjmlNode {
  tagName: string;
  attributes?: Record<string, string>;
  children?: MjmlNode[];
  content?: string;
  "data-node-id"?: string;
}

export class TemplateContent extends ValueObject<MjmlNode> {
  static fromJson(json: string): TemplateContent {
    return new TemplateContent(JSON.parse(json));
  }

  toJson(): string {
    return JSON.stringify(this.value);
  }
}

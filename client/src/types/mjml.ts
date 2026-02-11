export interface MjmlNode {
  tagName: string;
  attributes?: Record<string, string>;
  children?: MjmlNode[];
  content?: string;
  "data-node-id"?: string;
}

import type { MjmlNode } from "@/types/mjml";

let counter = 0;

export function generateNodeId(): string {
  return `node-${Date.now()}-${++counter}`;
}

export function assignNodeIds(node: MjmlNode): MjmlNode {
  const newNode: MjmlNode = {
    ...node,
    "data-node-id": node["data-node-id"] || generateNodeId(),
  };
  if (node.children) {
    newNode.children = node.children.map(assignNodeIds);
  }
  return newNode;
}

export function stripNodeIds(node: MjmlNode): MjmlNode {
  const { "data-node-id": _, ...rest } = node;
  const newNode: MjmlNode = { ...rest };
  if (node.children) {
    newNode.children = node.children.map(stripNodeIds);
  }
  return newNode;
}

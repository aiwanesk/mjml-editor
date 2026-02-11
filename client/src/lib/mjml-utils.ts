import type { MjmlNode } from "@/types/mjml";

export function findNodeById(root: MjmlNode, nodeId: string): MjmlNode | null {
  if (root["data-node-id"] === nodeId) return root;
  if (root.children) {
    for (const child of root.children) {
      const found = findNodeById(child, nodeId);
      if (found) return found;
    }
  }
  return null;
}

export function findParentNode(root: MjmlNode, nodeId: string): MjmlNode | null {
  if (root.children) {
    for (const child of root.children) {
      if (child["data-node-id"] === nodeId) return root;
      const found = findParentNode(child, nodeId);
      if (found) return found;
    }
  }
  return null;
}

export function updateNodeById(
  root: MjmlNode,
  nodeId: string,
  updater: (node: MjmlNode) => MjmlNode
): MjmlNode {
  if (root["data-node-id"] === nodeId) return updater(root);
  if (root.children) {
    return {
      ...root,
      children: root.children.map((child) => updateNodeById(child, nodeId, updater)),
    };
  }
  return root;
}

export function removeNodeById(root: MjmlNode, nodeId: string): MjmlNode {
  if (root.children) {
    return {
      ...root,
      children: root.children
        .filter((child) => child["data-node-id"] !== nodeId)
        .map((child) => removeNodeById(child, nodeId)),
    };
  }
  return root;
}

export function insertNodeAt(
  root: MjmlNode,
  parentId: string,
  index: number,
  newNode: MjmlNode
): MjmlNode {
  if (root["data-node-id"] === parentId) {
    const children = [...(root.children || [])];
    children.splice(index, 0, newNode);
    return { ...root, children };
  }
  if (root.children) {
    return {
      ...root,
      children: root.children.map((child) =>
        insertNodeAt(child, parentId, index, newNode)
      ),
    };
  }
  return root;
}

export function moveNode(
  root: MjmlNode,
  nodeId: string,
  newParentId: string,
  newIndex: number
): MjmlNode {
  const node = findNodeById(root, nodeId);
  if (!node) return root;
  const withoutNode = removeNodeById(root, nodeId);
  return insertNodeAt(withoutNode, newParentId, newIndex, node);
}

export function getBodyNode(root: MjmlNode): MjmlNode | null {
  if (root.tagName === "mj-body") return root;
  if (root.children) {
    for (const child of root.children) {
      const found = getBodyNode(child);
      if (found) return found;
    }
  }
  return null;
}

export function getEditableTagNames(): string[] {
  return [
    "mj-text",
    "mj-image",
    "mj-button",
    "mj-divider",
    "mj-spacer",
    "mj-social",
    "mj-section",
    "mj-column",
  ];
}

export interface EditableField {
  nodeId: string;
  tagName: string;
  node: MjmlNode;
  path: string[];
}

export function collectEditableNodes(
  root: MjmlNode,
  path: string[] = []
): EditableField[] {
  const editable = getEditableTagNames();
  const results: EditableField[] = [];

  if (root["data-node-id"] && editable.includes(root.tagName)) {
    results.push({
      nodeId: root["data-node-id"],
      tagName: root.tagName,
      node: root,
      path,
    });
  }

  if (root.children) {
    let sectionIndex = 0;
    let colIndex = 0;
    let contentIndex = 0;
    for (const child of root.children) {
      let label: string;
      if (child.tagName === "mj-section") {
        sectionIndex++;
        label = `Section ${sectionIndex}`;
      } else if (child.tagName === "mj-column") {
        colIndex++;
        label = `Colonne ${colIndex}`;
      } else {
        contentIndex++;
        label = TAG_DISPLAY_NAMES[child.tagName] || child.tagName;
      }
      results.push(...collectEditableNodes(child, [...path, label]));
    }
  }

  return results;
}

const TAG_DISPLAY_NAMES: Record<string, string> = {
  "mj-text": "Texte",
  "mj-image": "Image",
  "mj-button": "Bouton",
  "mj-divider": "Séparateur",
  "mj-spacer": "Espacement",
  "mj-social": "Réseaux sociaux",
  "mj-section": "Section",
  "mj-column": "Colonne",
};

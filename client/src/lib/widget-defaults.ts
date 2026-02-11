import type { MjmlNode } from "@/types/mjml";
import type { Widget } from "@/types/widget";
import { generateNodeId } from "./node-id";

function withId(node: MjmlNode): MjmlNode {
  return {
    ...node,
    "data-node-id": generateNodeId(),
    children: node.children?.map(withId),
  };
}

export const widgetDefaults: Widget[] = [
  {
    id: "text",
    name: "Texte",
    category: "Contenu",
    icon: "Type",
    defaultNode: {
      tagName: "mj-text",
      attributes: { "font-size": "16px", color: "#333333", "line-height": "1.5" },
      content: "Votre texte ici",
    },
  },
  {
    id: "image",
    name: "Image",
    category: "Contenu",
    icon: "Image",
    defaultNode: {
      tagName: "mj-image",
      attributes: {
        src: "https://via.placeholder.com/600x200",
        alt: "Image",
        width: "600px",
      },
    },
  },
  {
    id: "button",
    name: "Bouton",
    category: "Contenu",
    icon: "MousePointer",
    defaultNode: {
      tagName: "mj-button",
      attributes: {
        "background-color": "#6366f1",
        color: "#ffffff",
        "font-size": "16px",
        "border-radius": "6px",
        href: "#",
      },
      content: "Cliquez ici",
    },
  },
  {
    id: "divider",
    name: "Séparateur",
    category: "Contenu",
    icon: "Minus",
    defaultNode: {
      tagName: "mj-divider",
      attributes: {
        "border-color": "#e5e7eb",
        "border-width": "1px",
      },
    },
  },
  {
    id: "spacer",
    name: "Espacement",
    category: "Contenu",
    icon: "MoveVertical",
    defaultNode: {
      tagName: "mj-spacer",
      attributes: { height: "30px" },
    },
  },
  {
    id: "social",
    name: "Réseaux sociaux",
    category: "Contenu",
    icon: "Share2",
    defaultNode: {
      tagName: "mj-social",
      attributes: { "font-size": "15px", "icon-size": "30px", mode: "horizontal" },
      children: [
        {
          tagName: "mj-social-element",
          attributes: { name: "facebook", href: "#" },
          content: "Facebook",
        },
        {
          tagName: "mj-social-element",
          attributes: { name: "twitter", href: "#" },
          content: "Twitter",
        },
      ],
    },
  },
  {
    id: "section",
    name: "Section",
    category: "Structure",
    icon: "LayoutTemplate",
    defaultNode: {
      tagName: "mj-section",
      attributes: { "background-color": "#ffffff" },
      children: [
        {
          tagName: "mj-column",
          children: [
            {
              tagName: "mj-text",
              content: "Nouvelle section",
            },
          ],
        },
      ],
    },
  },
  {
    id: "2-columns",
    name: "2 Colonnes",
    category: "Structure",
    icon: "Columns2",
    defaultNode: {
      tagName: "mj-section",
      attributes: { "background-color": "#ffffff" },
      children: [
        {
          tagName: "mj-column",
          children: [
            { tagName: "mj-text", content: "Colonne 1" },
          ],
        },
        {
          tagName: "mj-column",
          children: [
            { tagName: "mj-text", content: "Colonne 2" },
          ],
        },
      ],
    },
  },
  {
    id: "3-columns",
    name: "3 Colonnes",
    category: "Structure",
    icon: "Columns3",
    defaultNode: {
      tagName: "mj-section",
      attributes: { "background-color": "#ffffff" },
      children: [
        {
          tagName: "mj-column",
          children: [
            { tagName: "mj-text", content: "Col. 1" },
          ],
        },
        {
          tagName: "mj-column",
          children: [
            { tagName: "mj-text", content: "Col. 2" },
          ],
        },
        {
          tagName: "mj-column",
          children: [
            { tagName: "mj-text", content: "Col. 3" },
          ],
        },
      ],
    },
  },
];

export function createWidgetNode(widgetId: string): MjmlNode | null {
  const widget = widgetDefaults.find((w) => w.id === widgetId);
  if (!widget) return null;
  return withId(JSON.parse(JSON.stringify(widget.defaultNode)));
}

export function getWidgetCategories() {
  const categories = new Map<string, Widget[]>();
  for (const w of widgetDefaults) {
    const list = categories.get(w.category) || [];
    list.push(w);
    categories.set(w.category, list);
  }
  return Array.from(categories.entries()).map(([name, widgets]) => ({
    name,
    widgets,
  }));
}

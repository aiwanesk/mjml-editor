import mjml2html from "mjml";
import { MjmlNode } from "../../domain/template/TemplateContent.js";

// Tags that support css-class in MJML
const CSS_CLASS_TAGS = new Set([
  "mj-section", "mj-column", "mj-text", "mj-image", "mj-button",
  "mj-divider", "mj-spacer", "mj-social", "mj-social-element",
  "mj-navbar", "mj-navbar-link", "mj-hero", "mj-wrapper",
]);

const NODE_ID_PREFIX = "__nid_";

function nodeToMjml(node: MjmlNode): string {
  const tag = node.tagName;

  // Build attributes, injecting node-id via css-class
  const attrParts: string[] = [];
  const nodeId = node["data-node-id"];

  if (node.attributes) {
    for (const [k, v] of Object.entries(node.attributes)) {
      if (k === "data-node-id") continue;
      attrParts.push(`${k}="${v}"`);
    }
  }

  // Inject data-node-id through css-class so MJML passes it to the HTML output
  if (nodeId && CSS_CLASS_TAGS.has(tag)) {
    const existing = node.attributes?.["css-class"] || "";
    const marker = `${NODE_ID_PREFIX}${nodeId}`;
    const cssClass = existing ? `${existing} ${marker}` : marker;
    // Remove any previous css-class from attrParts
    const filtered = attrParts.filter((a) => !a.startsWith("css-class="));
    filtered.push(`css-class="${cssClass}"`);
    attrParts.length = 0;
    attrParts.push(...filtered);
  }

  const attrs = attrParts.join(" ");
  const openTag = attrs ? `<${tag} ${attrs}>` : `<${tag}>`;
  const closeTag = `</${tag}>`;

  if (node.content && (!node.children || node.children.length === 0)) {
    return `${openTag}${node.content}${closeTag}`;
  }

  const childrenStr = node.children
    ? node.children.map((c) => nodeToMjml(c)).join("\n")
    : "";

  return `${openTag}\n${childrenStr}\n${closeTag}`;
}

/**
 * Post-process compiled HTML: convert css-class markers (__nid_xxx)
 * into real data-node-id="xxx" attributes on the DOM elements.
 */
function injectDataNodeIds(html: string): string {
  // Find every class="..." that contains our __nid_ marker and extract the node-id.
  // Node IDs look like "node-1234567890-1", so we capture exactly that pattern.
  return html.replace(
    /class="([^"]*)"/g,
    (fullMatch, classValue: string) => {
      const markerRe = /__nid_(node-[\d]+-[\d]+)/g;
      const match = markerRe.exec(classValue);
      if (!match) return fullMatch;

      const nodeId = match[1];
      // Strip all __nid_* tokens from the class list
      const cleanClass = classValue.replace(/__nid_node-[\d]+-[\d]+/g, "").replace(/\s{2,}/g, " ").trim();
      const classAttr = cleanClass ? `class="${cleanClass}"` : "";
      const dataAttr = `data-node-id="${nodeId}"`;
      return classAttr ? `${classAttr} ${dataAttr}` : dataAttr;
    }
  );
}

export class MjmlCompilerService {
  compile(ast: MjmlNode): { html: string; errors: unknown[] } {
    const mjmlString = nodeToMjml(ast);
    const result = mjml2html(mjmlString, { validationLevel: "soft" });
    const html = injectDataNodeIds(result.html);
    return { html, errors: result.errors || [] };
  }

  parseMjmlToAst(mjmlString: string): MjmlNode {
    // Parse MJML XML string into our AST format
    const ast = this.parseXml(mjmlString.trim());
    return ast;
  }

  private parseXml(xml: string): MjmlNode {
    // Simple MJML XML parser
    xml = xml.trim();

    // Match opening tag
    const openTagMatch = xml.match(/^<(\w[\w-]*)((?:\s+[\w-]+(?:="[^"]*")?)*)\s*\/?>/);
    if (!openTagMatch) {
      throw new Error("Invalid MJML: could not parse opening tag");
    }

    const tagName = openTagMatch[1];
    const attrString = openTagMatch[2];
    const isSelfClosing = xml[openTagMatch[0].length - 2] === "/";

    // Parse attributes
    const attributes: Record<string, string> = {};
    const attrRegex = /([\w-]+)="([^"]*)"/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(attrString)) !== null) {
      attributes[attrMatch[1]] = attrMatch[2];
    }

    if (isSelfClosing) {
      return {
        tagName,
        attributes: Object.keys(attributes).length > 0 ? attributes : undefined,
      };
    }

    // Find closing tag
    const closeTag = `</${tagName}>`;
    const closeIdx = xml.lastIndexOf(closeTag);
    if (closeIdx === -1) {
      throw new Error(`Invalid MJML: missing closing tag for ${tagName}`);
    }

    const innerContent = xml.substring(openTagMatch[0].length, closeIdx).trim();

    // Check if inner content contains child tags
    if (innerContent.startsWith("<")) {
      const children = this.parseChildren(innerContent);
      return {
        tagName,
        attributes: Object.keys(attributes).length > 0 ? attributes : undefined,
        children: children.length > 0 ? children : undefined,
      };
    }

    // It's text content
    return {
      tagName,
      attributes: Object.keys(attributes).length > 0 ? attributes : undefined,
      content: innerContent || undefined,
    };
  }

  private parseChildren(content: string): MjmlNode[] {
    const children: MjmlNode[] = [];
    let remaining = content.trim();

    while (remaining.length > 0) {
      remaining = remaining.trim();
      if (!remaining.startsWith("<")) break;

      // Handle comments
      if (remaining.startsWith("<!--")) {
        const commentEnd = remaining.indexOf("-->");
        if (commentEnd !== -1) {
          remaining = remaining.substring(commentEnd + 3).trim();
          continue;
        }
      }

      // Get tag name
      const tagMatch = remaining.match(/^<(\w[\w-]*)/);
      if (!tagMatch) break;

      const tag = tagMatch[1];

      // Check for self-closing
      const selfCloseMatch = remaining.match(new RegExp(`^<${tag}(?:\\s+[\\w-]+(?:="[^"]*")?)*\\s*\\/>`));
      if (selfCloseMatch) {
        children.push(this.parseXml(selfCloseMatch[0]));
        remaining = remaining.substring(selfCloseMatch[0].length).trim();
        continue;
      }

      // Find matching closing tag, accounting for nesting
      let depth = 0;
      let searchIdx = 0;
      let endIdx = -1;

      while (searchIdx < remaining.length) {
        const nextOpen = remaining.indexOf(`<${tag}`, searchIdx + 1);
        const nextClose = remaining.indexOf(`</${tag}>`, searchIdx);

        if (nextClose === -1) break;

        if (nextOpen !== -1 && nextOpen < nextClose) {
          // Check if it's a self-closing tag
          const afterOpen = remaining.substring(nextOpen);
          const selfCloseCheck = afterOpen.match(new RegExp(`^<${tag}(?:\\s+[\\w-]+(?:="[^"]*")?)*\\s*\\/>`));
          if (selfCloseCheck) {
            searchIdx = nextOpen + selfCloseCheck[0].length;
            continue;
          }
          depth++;
          searchIdx = nextOpen + 1;
        } else {
          if (depth === 0) {
            endIdx = nextClose + `</${tag}>`.length;
            break;
          }
          depth--;
          searchIdx = nextClose + 1;
        }
      }

      if (endIdx === -1) {
        // Try to recover - just take everything
        endIdx = remaining.length;
      }

      const childXml = remaining.substring(0, endIdx);
      children.push(this.parseXml(childXml));
      remaining = remaining.substring(endIdx).trim();
    }

    return children;
  }
}

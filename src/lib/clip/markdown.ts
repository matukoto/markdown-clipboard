import type { ClipBlock, ClipDocument, InlineNode } from "./types";

export function renderMarkdown(document: ClipDocument): string {
  return document.blocks
    .map((block) => renderBlock(block))
    .join("\n\n")
    .trim();
}

function renderBlock(block: ClipBlock): string {
  if (block.type === "heading") {
    return `${"#".repeat(block.level)} ${renderInlineNodes(block.children).trim()}`;
  }

  if (block.type === "paragraph") {
    return renderInlineNodes(block.children).trim();
  }

  if (block.type === "list") {
    return block.items
      .map((item, index) => {
        const marker = block.ordered ? `${index + 1}.` : "-";
        return `${marker} ${renderInlineNodes(item).trim()}`;
      })
      .join("\n");
  }

  return `![${block.alt}](${block.src})`;
}

function renderInlineNodes(nodes: InlineNode[]): string {
  return nodes
    .map((node) => {
      if (node.type === "text") {
        return node.text;
      }

      if (node.type === "link") {
        return `[${node.text}](${node.href})`;
      }

      return `![${node.alt}](${node.src})`;
    })
    .join("");
}

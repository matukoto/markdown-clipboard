import { collapseWhitespace, normalizeText } from "./text";
import type {
  ClipBlock,
  ClipContentOptions,
  ClipDocument,
  ClipMetadata,
  InlineNode,
} from "./types";

const ROOT_SELECTORS = [
  "article",
  "main",
  "[role='main']",
  ".post-content",
  ".entry-content",
  ".article-body",
];

const NOISE_SELECTOR =
  "nav, header, footer, aside, script, style, noscript, form, button, iframe, template, [hidden], [aria-hidden='true'], .ad, .ads, .advertisement, .breadcrumb, .share, .social";

const BLOCK_TAGS = new Set([
  "article",
  "blockquote",
  "body",
  "div",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "li",
  "main",
  "ol",
  "p",
  "section",
  "ul",
]);

export function extractClipDocument(
  document: Document,
  metadata: ClipMetadata,
  options: ClipContentOptions = {
    includeLinks: true,
    includeImages: true,
  }
): ClipDocument {
  const primaryRoot = selectRoot(document);
  const primaryBlocks = extractBlocksFromRoot(
    primaryRoot,
    metadata.url,
    options
  );

  if (primaryBlocks.length > 0) {
    return {
      metadata,
      blocks: primaryBlocks,
    };
  }

  return {
    metadata,
    blocks: extractBlocksFromRoot(document.body, metadata.url, options),
  };
}

function selectRoot(document: Document): HTMLElement {
  const candidates = ROOT_SELECTORS.map((selector) =>
    document.querySelector(selector)
  )
    .filter((element): element is HTMLElement => element instanceof HTMLElement)
    .filter((element) => normalizeText(element.textContent ?? "").length > 0);

  if (candidates.length === 0) {
    return document.body;
  }

  return candidates.sort((left, right) => {
    return (
      normalizeText(right.textContent ?? "").length -
      normalizeText(left.textContent ?? "").length
    );
  })[0];
}

function extractBlocksFromRoot(
  root: HTMLElement,
  baseUrl: string,
  options: ClipContentOptions
): ClipBlock[] {
  const preparedRoot = root.cloneNode(true) as HTMLElement;
  preparedRoot.querySelectorAll(NOISE_SELECTOR).forEach((node) => {
    node.remove();
  });

  return Array.from(preparedRoot.childNodes).flatMap((node) =>
    extractBlocks(node, baseUrl, options)
  );
}

function extractBlocks(
  node: Node,
  baseUrl: string,
  options: ClipContentOptions
): ClipBlock[] {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = normalizeText(node.textContent ?? "");

    if (text === "") {
      return [];
    }

    return [
      {
        type: "paragraph",
        children: [{ type: "text", text }],
      },
    ];
  }

  if (!(node instanceof HTMLElement)) {
    return [];
  }

  const tagName = node.tagName.toLowerCase();

  if (
    tagName === "h1" ||
    tagName === "h2" ||
    tagName === "h3" ||
    tagName === "h4" ||
    tagName === "h5" ||
    tagName === "h6"
  ) {
    const children = extractInlineNodes(node, baseUrl, options);

    if (children.length === 0) {
      return [];
    }

    return [
      {
        type: "heading",
        level: Number(tagName.slice(1)) as 1 | 2 | 3 | 4 | 5 | 6,
        children,
      },
    ];
  }

  if (tagName === "p") {
    const children = extractInlineNodes(node, baseUrl, options);

    if (children.length === 0) {
      return [];
    }

    return [
      {
        type: "paragraph",
        children,
      },
    ];
  }

  if (tagName === "ul" || tagName === "ol") {
    const items = Array.from(node.children)
      .filter((child) => child instanceof HTMLLIElement)
      .map((item) => extractListItem(item, baseUrl, options))
      .filter((item) => item.length > 0);

    if (items.length === 0) {
      return [];
    }

    return [
      {
        type: "list",
        ordered: tagName === "ol",
        items,
      },
    ];
  }

  if (tagName === "img") {
    if (!options.includeImages) {
      return [];
    }

    const src = node.getAttribute("src");

    if (src === null || src === "") {
      return [];
    }

    return [
      {
        type: "image",
        alt: normalizeText(node.getAttribute("alt") ?? ""),
        src: resolveUrl(src, baseUrl),
      },
    ];
  }

  if (hasBlockChildren(node)) {
    return Array.from(node.childNodes).flatMap((child) =>
      extractBlocks(child, baseUrl, options)
    );
  }

  const children = extractInlineNodes(node, baseUrl, options);

  if (children.length === 0) {
    return [];
  }

  return [
    {
      type: "paragraph",
      children,
    },
  ];
}

function hasBlockChildren(element: HTMLElement): boolean {
  return Array.from(element.children).some((child) =>
    BLOCK_TAGS.has(child.tagName.toLowerCase())
  );
}

function extractListItem(
  item: HTMLLIElement,
  baseUrl: string,
  options: ClipContentOptions
): InlineNode[] {
  const clone = item.cloneNode(true) as HTMLLIElement;
  clone.querySelectorAll("ul, ol").forEach((node) => {
    node.remove();
  });
  return extractInlineNodes(clone, baseUrl, options);
}

function extractInlineNodes(
  node: Node,
  baseUrl: string,
  options: ClipContentOptions
): InlineNode[] {
  const collected = collectInlineNodes(node, baseUrl, options);
  const merged: InlineNode[] = [];

  for (const entry of collected) {
    if (entry.type === "text") {
      const text = collapseWhitespace(entry.text);

      if (text === "") {
        continue;
      }

      const previous = merged.at(-1);

      if (previous?.type === "text") {
        previous.text += text;
        continue;
      }

      merged.push({ type: "text", text });
      continue;
    }

    merged.push(entry);
  }

  const first = merged[0];

  if (first?.type === "text") {
    first.text = first.text.trimStart();
  }

  const last = merged.at(-1);

  if (last?.type === "text") {
    last.text = last.text.trimEnd();
  }

  return merged.filter((entry) => entry.type !== "text" || entry.text !== "");
}

function collectInlineNodes(
  node: Node,
  baseUrl: string,
  options: ClipContentOptions
): InlineNode[] {
  if (node.nodeType === Node.TEXT_NODE) {
    return [
      {
        type: "text",
        text: node.textContent ?? "",
      },
    ];
  }

  if (!(node instanceof HTMLElement)) {
    return [];
  }

  if (node.matches(NOISE_SELECTOR)) {
    return [];
  }

  const tagName = node.tagName.toLowerCase();

  if (tagName === "a") {
    const href = node.getAttribute("href");

    if (href === null || href === "") {
      return Array.from(node.childNodes).flatMap((child) =>
        collectInlineNodes(child, baseUrl, options)
      );
    }

    if (!options.includeLinks) {
      return Array.from(node.childNodes).flatMap((child) =>
        collectInlineNodes(child, baseUrl, options)
      );
    }

    return [
      {
        type: "link",
        text: normalizeText(node.textContent ?? href) || href,
        href: resolveUrl(href, baseUrl),
      },
    ];
  }

  if (tagName === "img") {
    if (!options.includeImages) {
      return [];
    }

    const src = node.getAttribute("src");

    if (src === null || src === "") {
      return [];
    }

    return [
      {
        type: "image",
        alt: normalizeText(node.getAttribute("alt") ?? ""),
        src: resolveUrl(src, baseUrl),
      },
    ];
  }

  if (tagName === "br") {
    return [{ type: "text", text: " " }];
  }

  return Array.from(node.childNodes).flatMap((child) =>
    collectInlineNodes(child, baseUrl, options)
  );
}

function resolveUrl(value: string, baseUrl: string): string {
  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return value;
  }
}

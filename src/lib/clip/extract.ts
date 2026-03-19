import { Readability } from "@mozilla/readability";

import { normalizeText } from "./text";
import type { ClipContentOptions, ExtractedContent } from "./types";

const NOISE_SELECTOR =
  "nav, header, footer, aside, script, style, noscript, form, button, iframe, template, [hidden], [aria-hidden='true'], .ad, .ads, .advertisement, .breadcrumb, .share, .social";

const DEFAULT_EXTRACT_OPTIONS: ClipContentOptions = {
  includeLinks: true,
  includeImages: true,
};

export function extractReadableContent(
  document: Document,
  baseUrl: string,
  options: ClipContentOptions = DEFAULT_EXTRACT_OPTIONS
): ExtractedContent {
  const clonedDocument = document.cloneNode(true) as Document;
  setBaseUrl(clonedDocument, baseUrl);
  stripObviousNoise(clonedDocument);
  const article = new Readability(clonedDocument).parse();

  if (article === null) {
    return emptyExtractedContent();
  }

  if (article.content === null || article.content === undefined) {
    return emptyExtractedContent();
  }

  const extractedDocument = document.implementation.createHTMLDocument(
    article.title || document.title
  );
  extractedDocument.body.innerHTML = article.content;
  prependTitleHeading(extractedDocument.body, article.title || document.title);
  postProcessExtractedContent(extractedDocument.body, baseUrl, options);

  const contentHtml = extractedDocument.body.innerHTML.trim();
  const textContent = normalizeText(extractedDocument.body.textContent ?? "");

  if (contentHtml === "" || textContent === "") {
    return emptyExtractedContent();
  }

  return {
    title: normalizeText(article.title || document.title),
    contentHtml,
    textContent,
  };
}

function postProcessExtractedContent(
  root: HTMLElement,
  baseUrl: string,
  options: ClipContentOptions
): void {
  root.querySelectorAll("a").forEach((anchor) => {
    const href = anchor.getAttribute("href");

    if (href === null || href === "") {
      if (!options.includeLinks) {
        unwrapElement(anchor);
      }
      return;
    }

    if (!options.includeLinks) {
      unwrapElement(anchor);
      return;
    }

    anchor.setAttribute("href", resolveUrl(href, baseUrl));
  });

  root.querySelectorAll("img").forEach((image) => {
    if (!options.includeImages) {
      image.remove();
      return;
    }

    const src = image.getAttribute("src");

    if (src === null || src === "") {
      image.remove();
      return;
    }

    image.setAttribute("src", resolveUrl(src, baseUrl));
  });

  root.querySelectorAll("script, style, noscript").forEach((element) => {
    element.remove();
  });
}

function unwrapElement(element: Element): void {
  element.replaceWith(...Array.from(element.childNodes));
}

function setBaseUrl(document: Document, baseUrl: string): void {
  let base = document.querySelector("base");

  if (!(base instanceof HTMLBaseElement)) {
    base = document.createElement("base");
    document.head.prepend(base);
  }

  base.setAttribute("href", baseUrl);
}

function stripObviousNoise(document: Document): void {
  document.querySelectorAll(NOISE_SELECTOR).forEach((element) => {
    element.remove();
  });
}

function prependTitleHeading(root: HTMLElement, title: string): void {
  const normalizedTitle = normalizeText(title);

  if (normalizedTitle === "") {
    return;
  }

  const existingHeading = root.querySelector("h1, h2");

  if (existingHeading?.textContent !== undefined) {
    const headingText = normalizeText(existingHeading.textContent);

    if (headingText === normalizedTitle) {
      return;
    }
  }

  const heading = root.ownerDocument.createElement("h1");
  heading.textContent = normalizedTitle;
  root.prepend(heading);
}

function emptyExtractedContent(): ExtractedContent {
  return {
    title: "",
    contentHtml: "",
    textContent: "",
  };
}

function resolveUrl(value: string, baseUrl: string): string {
  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return value;
  }
}

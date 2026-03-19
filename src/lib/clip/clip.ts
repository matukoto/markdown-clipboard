import { extractReadableContent } from "./extract";
import { renderMarkdown } from "./markdown";
import { normalizeText } from "./text";
import type { ClipContentOptions, ClipMetadata, ClipResult } from "./types";

interface CreateClipMetadataInput {
  title: string;
  url: string;
  clippedAt?: string;
}

export function createClipMetadata({
  title,
  url,
  clippedAt = new Date().toISOString(),
}: CreateClipMetadataInput): ClipMetadata {
  const normalizedTitle = normalizeText(title);

  return {
    title: normalizedTitle === "" ? "Untitled page" : normalizedTitle,
    url,
    clippedAt,
  };
}

export function clipPage(
  document: Document,
  url: string,
  options: ClipContentOptions,
  clippedAt?: string
): ClipResult {
  const extractedContent = extractReadableContent(document, url, options);
  const metadata = createClipMetadata({
    title: extractedContent.title || document.title,
    url,
    clippedAt,
  });

  return {
    metadata,
    contentHtml: extractedContent.contentHtml,
    textContent: extractedContent.textContent,
    markdown: renderMarkdown(extractedContent.contentHtml),
  };
}

import { extractClipDocument } from "./extract";
import { renderMarkdown } from "./markdown";
import { normalizeText } from "./text";
import type { ClipMetadata, ClipResult } from "./types";

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
  clippedAt?: string
): ClipResult {
  const metadata = createClipMetadata({
    title: document.title,
    url,
    clippedAt,
  });
  const clipDocument = extractClipDocument(document, metadata);

  return {
    ...clipDocument,
    markdown: renderMarkdown(clipDocument),
  };
}

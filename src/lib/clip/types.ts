export interface ClipMetadata {
  title: string;
  url: string;
  clippedAt: string;
}

export interface ClipContentOptions {
  includeLinks: boolean;
  includeImages: boolean;
}

export interface ExtractedContent {
  title: string;
  contentHtml: string;
  textContent: string;
}

export interface ClipDocument {
  metadata: ClipMetadata;
  contentHtml: string;
  textContent: string;
}

export interface ClipResult extends ClipDocument {
  markdown: string;
}

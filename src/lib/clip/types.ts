export interface ClipMetadata {
  title: string;
  url: string;
  clippedAt: string;
}

export interface ClipContentOptions {
  includeLinks: boolean;
  includeImages: boolean;
}

export type InlineNode =
  | {
      type: "text";
      text: string;
    }
  | {
      type: "link";
      text: string;
      href: string;
    }
  | {
      type: "image";
      alt: string;
      src: string;
    };

export type ClipBlock =
  | {
      type: "heading";
      level: 1 | 2 | 3 | 4 | 5 | 6;
      children: InlineNode[];
    }
  | {
      type: "paragraph";
      children: InlineNode[];
    }
  | {
      type: "list";
      ordered: boolean;
      items: InlineNode[][];
    }
  | {
      type: "image";
      alt: string;
      src: string;
    };

export interface ClipDocument {
  metadata: ClipMetadata;
  blocks: ClipBlock[];
}

export interface ClipResult extends ClipDocument {
  markdown: string;
}

import { describe, expect, it } from "vitest";

import { renderClipOutput } from "./output";
import type { ClipResult } from "./types";

const clipResult: ClipResult = {
  metadata: {
    title: "Markdown Web Clipper",
    url: "https://example.com/posts/clipper",
    clippedAt: "2026-03-19T00:00:00.000Z",
  },
  blocks: [],
  markdown: "# Markdown Web Clipper\n\nSave the current page as Markdown.",
};

describe("renderClipOutput の振る舞い", () => {
  it("デフォルトでは冒頭に元 URL を付与する", () => {
    expect(renderClipOutput(clipResult)).toBe(
      [
        "Source: https://example.com/posts/clipper",
        "# Markdown Web Clipper\n\nSave the current page as Markdown.",
      ].join("\n\n")
    );
  });

  it("ノート向けの出力ではクリップ日時も含められる", () => {
    expect(renderClipOutput(clipResult, { includeClippedAt: true })).toBe(
      [
        "Source: https://example.com/posts/clipper\nClipped at: 2026-03-19T00:00:00.000Z",
        "# Markdown Web Clipper\n\nSave the current page as Markdown.",
      ].join("\n\n")
    );
  });
});

import { describe, expect, it } from "vitest";

import { clipPage, createClipMetadata } from "./clip";
import { DEFAULT_CLIP_CONTENT_OPTIONS } from "./settings";

describe("createClipMetadata の振る舞い", () => {
  it("空のタイトルを安定したフォールバック値に正規化する", () => {
    expect(
      createClipMetadata({
        title: " \n ",
        url: "https://example.com/posts/clipper",
        clippedAt: "2026-03-19T00:00:00.000Z",
      })
    ).toEqual({
      title: "Untitled page",
      url: "https://example.com/posts/clipper",
      clippedAt: "2026-03-19T00:00:00.000Z",
    });
  });
});

describe("clipPage の振る舞い", () => {
  it("現在の document から Markdown を組み立てる", () => {
    document.title = "Markdown Web Clipper";
    document.body.innerHTML = `
      <main>
        <article>
          <h1>Markdown Web Clipper</h1>
          <p>Save the current page as Markdown.</p>
        </article>
      </main>
    `;

    expect(
      clipPage(
        document,
        "https://example.com/posts/clipper",
        DEFAULT_CLIP_CONTENT_OPTIONS,
        "2026-03-19T00:00:00.000Z"
      )
    ).toEqual({
      metadata: {
        title: "Markdown Web Clipper",
        url: "https://example.com/posts/clipper",
        clippedAt: "2026-03-19T00:00:00.000Z",
      },
      blocks: [
        {
          type: "heading",
          level: 1,
          children: [{ type: "text", text: "Markdown Web Clipper" }],
        },
        {
          type: "paragraph",
          children: [
            { type: "text", text: "Save the current page as Markdown." },
          ],
        },
      ],
      markdown: "# Markdown Web Clipper\n\nSave the current page as Markdown.",
    });
  });
});

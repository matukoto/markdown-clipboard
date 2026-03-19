import { describe, expect, it } from "vitest";

import { clipPage, createClipMetadata } from "./clip";

describe("createClipMetadata", () => {
  it("normalizes blank titles to a stable fallback", () => {
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

describe("clipPage", () => {
  it("builds markdown from the current document", () => {
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

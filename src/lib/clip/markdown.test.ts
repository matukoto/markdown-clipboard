import { describe, expect, it } from "vitest";

import { renderMarkdown } from "./markdown";
import type { ClipDocument } from "./types";

describe("renderMarkdown", () => {
  it("renders headings, paragraphs, lists, links, and images", () => {
    const document: ClipDocument = {
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
            { type: "text", text: "Read the " },
            {
              type: "link",
              text: "documentation",
              href: "https://example.com/docs",
            },
            { type: "text", text: " before you start." },
          ],
        },
        {
          type: "list",
          ordered: false,
          items: [
            [{ type: "text", text: "Fast setup" }],
            [{ type: "text", text: "Local-only processing" }],
          ],
        },
        {
          type: "image",
          alt: "Architecture diagram",
          src: "https://example.com/diagram.png",
        },
      ],
    };

    expect(renderMarkdown(document)).toBe(
      [
        "# Markdown Web Clipper",
        "Read the [documentation](https://example.com/docs) before you start.",
        "- Fast setup\n- Local-only processing",
        "![Architecture diagram](https://example.com/diagram.png)",
      ].join("\n\n")
    );
  });
});

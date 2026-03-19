import { describe, expect, it } from "vitest";

import { extractClipDocument } from "./extract";
import type { ClipMetadata } from "./types";

const metadata: ClipMetadata = {
  title: "Markdown Web Clipper",
  url: "https://example.com/posts/clipper",
  clippedAt: "2026-03-19T00:00:00.000Z",
};

describe("extractClipDocument の振る舞い", () => {
  it("記事のメインコンテンツから意味的なブロックを抽出する", () => {
    document.body.innerHTML = `
      <header>Site header</header>
      <main>
        <article>
          <h1>Markdown Web Clipper</h1>
          <p>
            Read the
            <a href="https://example.com/docs">documentation</a>
            before you start.
          </p>
          <ul>
            <li>Fast setup</li>
            <li>Local-only processing</li>
          </ul>
          <img src="https://example.com/diagram.png" alt="Architecture diagram">
        </article>
      </main>
      <footer>Site footer</footer>
    `;

    expect(extractClipDocument(document, metadata)).toEqual({
      metadata,
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
    });
  });

  it("リンクと画像の相対 URL をページ URL 基準で絶対化する", () => {
    document.body.innerHTML = `
      <main>
        <article>
          <p>
            Read the
            <a href="/docs/getting-started">documentation</a>
            before you start.
          </p>
          <img src="./assets/diagram.png" alt="Architecture diagram">
        </article>
      </main>
    `;

    expect(extractClipDocument(document, metadata)).toEqual({
      metadata,
      blocks: [
        {
          type: "paragraph",
          children: [
            { type: "text", text: "Read the " },
            {
              type: "link",
              text: "documentation",
              href: "https://example.com/docs/getting-started",
            },
            { type: "text", text: " before you start." },
          ],
        },
        {
          type: "image",
          alt: "Architecture diagram",
          src: "https://example.com/posts/assets/diagram.png",
        },
      ],
    });
  });

  it("意味的なコンテナがない場合は body の本文へフォールバックする", () => {
    document.body.innerHTML = `
      <div>
        <p>Clip this content instead.</p>
      </div>
    `;

    expect(extractClipDocument(document, metadata)).toEqual({
      metadata,
      blocks: [
        {
          type: "paragraph",
          children: [{ type: "text", text: "Clip this content instead." }],
        },
      ],
    });
  });
});

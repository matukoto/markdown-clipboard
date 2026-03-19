import { describe, expect, it } from "vitest";

import { extractReadableContent } from "./extract";
import { DEFAULT_CLIP_CONTENT_OPTIONS } from "./settings";

describe("extractReadableContent の振る舞い", () => {
  it("Readability で本文らしい領域を抽出し、ノイズを落とす", () => {
    document.title = "Markdown Web Clipper";
    document.body.innerHTML = `
      <header>Site header</header>
      <main>
        <article>
          <h1>Markdown Web Clipper</h1>
          <p>Read the <a href="https://example.com/docs">documentation</a>.</p>
          <ul>
            <li>Fast setup</li>
            <li>Local-only processing</li>
          </ul>
        </article>
      </main>
      <footer>Site footer</footer>
    `;

    const result = extractReadableContent(
      document,
      "https://example.com/posts/clipper",
      {
        includeLinks: true,
        includeImages: true,
      }
    );

    expect(result.title).toBe("Markdown Web Clipper");
    expect(result.contentHtml).toContain("<h1>Markdown Web Clipper</h1>");
    expect(result.contentHtml).toContain('href="https://example.com/docs"');
    expect(result.contentHtml).toContain("<li>Fast setup</li>");
    expect(result.contentHtml).not.toContain("Site header");
    expect(result.contentHtml).not.toContain("Site footer");
    expect(result.textContent).toContain("Local-only processing");
  });

  it("リンクと画像の相対 URL をページ URL 基準で絶対化する", () => {
    document.title = "Markdown Web Clipper";
    document.body.innerHTML = `
      <main>
        <article>
          <p>Read the <a href="/docs/getting-started">documentation</a>.</p>
          <img src="./assets/diagram.png" alt="Architecture diagram">
        </article>
      </main>
    `;

    const result = extractReadableContent(
      document,
      "https://example.com/posts/clipper",
      {
        includeLinks: true,
        includeImages: true,
      }
    );

    expect(result.contentHtml).toContain(
      'href="https://example.com/docs/getting-started"'
    );
    expect(result.contentHtml).toContain(
      'src="https://example.com/posts/assets/diagram.png"'
    );
  });

  it("設定でリンクと画像を外した場合は HTML からも除外する", () => {
    document.title = "Markdown Web Clipper";
    document.body.innerHTML = `
      <main>
        <article>
          <p>Read the <a href="/docs">documentation</a>.</p>
          <img src="/diagram.png" alt="diagram">
        </article>
      </main>
    `;

    const result = extractReadableContent(
      document,
      "https://example.com/posts/clipper",
      DEFAULT_CLIP_CONTENT_OPTIONS
    );

    expect(result.contentHtml).toContain("Read the documentation.");
    expect(result.contentHtml).not.toContain("<a ");
    expect(result.contentHtml).not.toContain("<img");
  });

  it("Readability が本文を見つけられないときは空を返す", () => {
    document.title = "Empty";
    document.body.innerHTML = "<main><article></article></main>";

    expect(
      extractReadableContent(document, "https://example.com/posts/clipper", {
        includeLinks: true,
        includeImages: true,
      })
    ).toEqual({
      title: "",
      contentHtml: "",
      textContent: "",
    });
  });
});

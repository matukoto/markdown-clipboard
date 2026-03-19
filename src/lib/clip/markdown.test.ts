import { describe, expect, it } from "vitest";

import { renderMarkdown } from "./markdown";

describe("renderMarkdown の振る舞い", () => {
  it("Turndown で HTML を Markdown に変換する", () => {
    const contentHtml = `
      <article>
        <h1>Markdown Web Clipper</h1>
        <p>Read the <a href="https://example.com/docs">documentation</a>.</p>
        <ul>
          <li>Fast setup</li>
          <li>Local-only processing</li>
        </ul>
        <img src="https://example.com/diagram.png" alt="Architecture diagram">
      </article>
    `;

    expect(renderMarkdown(contentHtml)).toBe(
      [
        "# Markdown Web Clipper",
        "Read the [documentation](https://example.com/docs).",
        "- Fast setup\n- Local-only processing",
        "![Architecture diagram](https://example.com/diagram.png)",
      ].join("\n\n")
    );
  });

  it("空の HTML では空文字を返す", () => {
    expect(renderMarkdown("")).toBe("");
  });
});

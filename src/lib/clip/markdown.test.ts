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

  it("table 要素を GFM 形式の表として変換する", () => {
    const contentHtml = `
      <table>
        <thead>
          <tr><th>Feature</th><th>Status</th></tr>
        </thead>
        <tbody>
          <tr><td>Table output</td><td>Enabled</td></tr>
          <tr><td>Task list</td><td>Planned</td></tr>
        </tbody>
      </table>
    `;

    expect(renderMarkdown(contentHtml)).toBe(
      [
        "| Feature | Status |",
        "| --- | --- |",
        "| Table output | Enabled |",
        "| Task list | Planned |",
      ].join("\n")
    );
  });

  it("表の前後にある本文も崩さずに出力する", () => {
    const contentHtml = `
      <article>
        <p>Before table</p>
        <table>
          <thead>
            <tr><th>Name</th><th>Role</th></tr>
          </thead>
          <tbody>
            <tr><td>Alice</td><td>Maintainer</td></tr>
          </tbody>
        </table>
        <p>After table</p>
      </article>
    `;

    expect(renderMarkdown(contentHtml)).toBe(`Before table

| Name | Role |
| --- | --- |
| Alice | Maintainer |

After table`);
  });
});

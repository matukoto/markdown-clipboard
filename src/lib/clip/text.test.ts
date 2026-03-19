import { describe, expect, it } from "vitest";

import { collapseWhitespace, normalizeText } from "./text";

describe("collapseWhitespace の振る舞い", () => {
  it("前後を削らずに連続する空白を 1 つにまとめる", () => {
    expect(collapseWhitespace("  Hello\t\tworld\n")).toBe(" Hello world ");
  });
});

describe("normalizeText の振る舞い", () => {
  it("混在した空白を単一のスペースに正規化する", () => {
    expect(normalizeText("  Hello\t\tworld\nfrom\r\nclipper  ")).toBe(
      "Hello world from clipper"
    );
  });

  it("空白だけの入力では空文字を返す", () => {
    expect(normalizeText(" \n\t ")).toBe("");
  });
});

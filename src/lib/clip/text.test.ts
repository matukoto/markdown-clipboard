import { describe, expect, it } from "vitest";

import { collapseWhitespace, normalizeText } from "./text";

describe("collapseWhitespace", () => {
  it("collapses repeated whitespace without trimming edges", () => {
    expect(collapseWhitespace("  Hello\t\tworld\n")).toBe(" Hello world ");
  });
});

describe("normalizeText", () => {
  it("collapses mixed whitespace into single spaces", () => {
    expect(normalizeText("  Hello\t\tworld\nfrom\r\nclipper  ")).toBe(
      "Hello world from clipper"
    );
  });

  it("returns an empty string for whitespace-only input", () => {
    expect(normalizeText(" \n\t ")).toBe("");
  });
});

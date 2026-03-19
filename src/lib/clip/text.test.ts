import { describe, expect, it } from "vitest";

import { normalizeText } from "./text";

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

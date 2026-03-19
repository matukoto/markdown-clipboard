import { describe, expect, it } from "vitest";

import config from "../../wxt.config";

const isPromise = (value: unknown): value is Promise<unknown> => {
  return typeof value === "object" && value !== null && "then" in value;
};

describe("wxt.config.ts", () => {
  it("拡張機能側でクリップボードへ書き込めるように clipboardWrite 権限を含む", () => {
    const manifest = config.manifest;

    if (
      manifest === undefined ||
      typeof manifest === "function" ||
      isPromise(manifest)
    ) {
      throw new Error("manifest is not a static object");
    }

    expect(manifest.permissions).toContain("clipboardWrite");
  });
});

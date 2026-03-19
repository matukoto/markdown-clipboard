import { beforeEach, describe, expect, it, vi } from "vitest";

import { DEFAULT_CLIP_CONTENT_OPTIONS } from "./settings";

const STORAGE_KEY = "clip-content-options";

describe("clip settings", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("保存値の型が不正ならデフォルト設定へフォールバックする", async () => {
    const getMock = vi.fn(async () => ({
      [STORAGE_KEY]: {
        includeLinks: "yes",
        includeImages: 1,
      },
    }));

    (globalThis as { browser?: unknown }).browser = {
      storage: {
        local: {
          get: getMock,
          set: vi.fn(),
        },
      },
    };

    const { getClipContentOptions } = await import("./settings");

    await expect(getClipContentOptions()).resolves.toEqual(
      DEFAULT_CLIP_CONTENT_OPTIONS
    );
  });

  it("保存値が部分的に正しければ不足分だけデフォルトで補う", async () => {
    const getMock = vi.fn(async () => ({
      [STORAGE_KEY]: {
        includeLinks: true,
      },
    }));

    (globalThis as { browser?: unknown }).browser = {
      storage: {
        local: {
          get: getMock,
          set: vi.fn(),
        },
      },
    };

    const { getClipContentOptions } = await import("./settings");

    await expect(getClipContentOptions()).resolves.toEqual({
      includeLinks: true,
      includeImages: false,
    });
  });
});

import { describe, expect, it } from "vitest";

import {
  CLIP_ACTIVE_TAB_MESSAGE,
  CLIP_PAGE_MESSAGE,
  isClipActiveTabRequest,
  isClipPageRequest,
} from "./messages";

describe("message type guards", () => {
  it("クリップ要求メッセージだけを受け入れる", () => {
    expect(isClipPageRequest({ type: CLIP_PAGE_MESSAGE })).toBe(true);
    expect(isClipPageRequest({ type: CLIP_ACTIVE_TAB_MESSAGE })).toBe(false);
    expect(isClipPageRequest({ type: 123 })).toBe(false);
    expect(isClipPageRequest({})).toBe(false);
    expect(isClipPageRequest(null)).toBe(false);
  });

  it("アクティブタブのクリップ要求だけを受け入れる", () => {
    expect(isClipActiveTabRequest({ type: CLIP_ACTIVE_TAB_MESSAGE })).toBe(
      true
    );
    expect(isClipActiveTabRequest({ type: CLIP_PAGE_MESSAGE })).toBe(false);
    expect(isClipActiveTabRequest({ type: 123 })).toBe(false);
    expect(isClipActiveTabRequest("clip-active-tab")).toBe(false);
  });
});

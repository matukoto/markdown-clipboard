import { isLiteralOf, isObjectOf } from "unknownutil";

import type { ClipResult } from "./types";

export const CLIP_ACTIVE_TAB_MESSAGE = "clip-active-tab";
export const CLIP_PAGE_MESSAGE = "clip-page-as-markdown";

export interface ClipActiveTabRequest {
  type: typeof CLIP_ACTIVE_TAB_MESSAGE;
}

export interface ClipPageRequest {
  type: typeof CLIP_PAGE_MESSAGE;
}

const isClipActiveTabRequestMessage = isObjectOf({
  type: isLiteralOf(CLIP_ACTIVE_TAB_MESSAGE),
});

const isClipPageRequestMessage = isObjectOf({
  type: isLiteralOf(CLIP_PAGE_MESSAGE),
});

export function isClipActiveTabRequest(
  value: unknown
): value is ClipActiveTabRequest {
  return isClipActiveTabRequestMessage(value);
}

export function isClipPageRequest(value: unknown): value is ClipPageRequest {
  return isClipPageRequestMessage(value);
}

export type ClipResponse =
  | {
      success: true;
      result: ClipResult;
    }
  | {
      success: false;
      error: string;
    };

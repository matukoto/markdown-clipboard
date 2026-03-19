import type { ClipResult } from "./types";

export const CLIP_ACTIVE_TAB_MESSAGE = "clip-active-tab";
export const CLIP_PAGE_MESSAGE = "clip-page-as-markdown";

export interface ClipActiveTabRequest {
  type: typeof CLIP_ACTIVE_TAB_MESSAGE;
}

export interface ClipPageRequest {
  type: typeof CLIP_PAGE_MESSAGE;
}

export function isClipActiveTabRequest(
  value: unknown
): value is ClipActiveTabRequest {
  return hasMessageType(value, CLIP_ACTIVE_TAB_MESSAGE);
}

export function isClipPageRequest(value: unknown): value is ClipPageRequest {
  return hasMessageType(value, CLIP_PAGE_MESSAGE);
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

function hasMessageType(value: unknown, expectedType: string): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    value.type === expectedType
  );
}

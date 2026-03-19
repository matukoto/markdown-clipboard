import type { ClipResult } from "./types";

export const CLIP_ACTIVE_TAB_MESSAGE = "clip-active-tab";
export const CLIP_PAGE_MESSAGE = "clip-page-as-markdown";

export interface ClipActiveTabRequest {
  type: typeof CLIP_ACTIVE_TAB_MESSAGE;
}

export interface ClipPageRequest {
  type: typeof CLIP_PAGE_MESSAGE;
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

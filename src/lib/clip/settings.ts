import { isBoolean, isObjectOf, isPartialOf } from "unknownutil";

import type { ClipContentOptions } from "./types";

export const DEFAULT_CLIP_CONTENT_OPTIONS: ClipContentOptions = {
  includeLinks: false,
  includeImages: false,
};

const isClipContentOptions = isObjectOf({
  includeLinks: isBoolean,
  includeImages: isBoolean,
});

const isPartialClipContentOptions = isPartialOf(isClipContentOptions);

export function resolveClipContentOptions(
  value: Partial<ClipContentOptions> | undefined
): ClipContentOptions {
  return {
    includeLinks:
      value?.includeLinks ?? DEFAULT_CLIP_CONTENT_OPTIONS.includeLinks,
    includeImages:
      value?.includeImages ?? DEFAULT_CLIP_CONTENT_OPTIONS.includeImages,
  };
}

const STORAGE_KEY = "clip-content-options";

export async function getClipContentOptions(): Promise<ClipContentOptions> {
  const result = await browser.storage.local.get(STORAGE_KEY);
  const storedValue = result[STORAGE_KEY];
  return resolveClipContentOptions(
    isPartialClipContentOptions(storedValue) ? storedValue : undefined
  );
}

export async function setClipContentOptions(
  options: Partial<ClipContentOptions>
): Promise<ClipContentOptions> {
  const next = resolveClipContentOptions(options);
  await browser.storage.local.set({
    [STORAGE_KEY]: next,
  });
  return next;
}

import { clipPage } from "../lib/clip/clip";
import { writeTextToClipboard } from "../lib/clip/clipboard";
import {
  CLIP_PAGE_MESSAGE,
  type ClipResponse,
  isClipPageRequest,
} from "../lib/clip/messages";
import { renderClipOutput } from "../lib/clip/output";
import { getClipContentOptions } from "../lib/clip/settings";

async function handleClipPageRequest(): Promise<ClipResponse> {
  try {
    const options = await getClipContentOptions();
    const result = clipPage(document, window.location.href, options);

    if (result.markdown === "") {
      throw new Error("No clip-friendly content was found on this page.");
    }

    await writeTextToClipboard(renderClipOutput(result));

    return {
      success: true,
      result,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to clip the current page.",
    };
  }
}

export default defineContentScript({
  matches: ["http://*/*", "https://*/*"],
  main() {
    browser.runtime.onMessage.addListener((message: unknown) => {
      if (!isClipPageRequest(message)) {
        return undefined;
      }

      if (message.type !== CLIP_PAGE_MESSAGE) {
        return undefined;
      }

      return handleClipPageRequest();
    });
  },
});

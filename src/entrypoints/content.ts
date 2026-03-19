import { isInstanceOf } from "unknownutil";

import { clipPage } from "../lib/clip/clip";
import { writeTextToClipboard } from "../lib/clip/clipboard";
import { type ClipResponse, isClipPageRequest } from "../lib/clip/messages";
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
      error: isInstanceOf(Error)(error)
        ? error.message
        : "Failed to clip the current page.",
    };
  }
}

export default defineContentScript({
  matches: ["http://*/*", "https://*/*"],
  main() {
    browser.runtime.onMessage.addListener(
      (message: unknown, _sender, sendResponse) => {
        if (!isClipPageRequest(message)) {
          return undefined;
        }

        void handleClipPageRequest().then((response) => {
          sendResponse(response);
        });

        return true;
      }
    );
  },
});

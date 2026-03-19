import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CLIP_PAGE_MESSAGE, type ClipResponse } from "../lib/clip/messages";

type RuntimeMessageListener = (message: unknown) => unknown;

describe("content entrypoint", () => {
  let runtimeMessageListener: RuntimeMessageListener | undefined;
  const writeTextToClipboardMock = vi.fn<(text: string) => Promise<void>>(
    async (_text: string) => undefined
  );

  beforeEach(async () => {
    vi.resetModules();
    runtimeMessageListener = undefined;
    writeTextToClipboardMock.mockReset();

    vi.doMock("../lib/clip/clipboard", () => {
      return {
        writeTextToClipboard: writeTextToClipboardMock,
      };
    });

    (
      globalThis as unknown as {
        defineContentScript: (entry: { main: () => void }) => unknown;
      }
    ).defineContentScript = (entry: { main: () => void }) => {
      entry.main();
      return {};
    };

    (globalThis as unknown as { browser: unknown }).browser = {
      runtime: {
        onMessage: {
          addListener: (listener: RuntimeMessageListener) => {
            runtimeMessageListener = listener;
          },
        },
      },
    };

    await import("./content");
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.doUnmock("../lib/clip/clipboard");
  });

  it("クリップ要求で Markdown を生成してクリップボードへ書き込む", async () => {
    if (runtimeMessageListener === undefined) {
      throw new Error("runtime message listener is not registered");
    }

    document.title = "Markdown Web Clipper";
    document.body.innerHTML = `
      <main>
        <article>
          <h1>Markdown Web Clipper</h1>
          <p>Save the current page as Markdown.</p>
        </article>
      </main>
    `;

    const response = (await runtimeMessageListener({
      type: CLIP_PAGE_MESSAGE,
    })) as ClipResponse;
    const clipboardText = writeTextToClipboardMock.mock.calls.at(-1)?.[0];

    expect(response.success).toBe(true);
    expect(writeTextToClipboardMock).toHaveBeenCalledTimes(1);
    expect(clipboardText).toContain("Source: ");
    expect(clipboardText).toContain("# Markdown Web Clipper");
  });

  it("抽出結果が空なら失敗レスポンスを返す", async () => {
    if (runtimeMessageListener === undefined) {
      throw new Error("runtime message listener is not registered");
    }

    document.title = "Empty";
    document.body.innerHTML = "<main><article></article></main>";

    const response = (await runtimeMessageListener({
      type: CLIP_PAGE_MESSAGE,
    })) as ClipResponse;

    expect(response).toEqual({
      success: false,
      error: "No clip-friendly content was found on this page.",
    });
    expect(writeTextToClipboardMock).not.toHaveBeenCalled();
  });
});

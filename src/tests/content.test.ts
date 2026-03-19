import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CLIP_PAGE_MESSAGE, type ClipResponse } from "../lib/clip/messages";

type SendResponse = (response: ClipResponse) => void;
type RuntimeMessageListener = (
  message: unknown,
  sender: unknown,
  sendResponse: SendResponse
) => boolean | undefined;

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

    vi.doMock("../lib/clip/settings", () => {
      return {
        getClipContentOptions: async () => ({
          includeLinks: false,
          includeImages: false,
        }),
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
      storage: {
        local: {
          get: async () => ({}),
          set: async () => undefined,
        },
      },
    };

    await import("../entrypoints/content");
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.doUnmock("../lib/clip/clipboard");
    vi.doUnmock("../lib/clip/settings");
  });

  const dispatchRuntimeMessage = async (message: unknown) => {
    if (runtimeMessageListener === undefined) {
      throw new Error("runtime message listener is not registered");
    }

    const listener = runtimeMessageListener;
    let keepChannelOpen: boolean | undefined;
    const response = await new Promise<ClipResponse | undefined>((resolve) => {
      keepChannelOpen = listener(message, undefined, (response) => {
        resolve(response);
      });

      if (keepChannelOpen !== true) {
        resolve(undefined);
      }
    });

    return { keepChannelOpen, response };
  };

  it("クリップ要求で Markdown を生成してクリップボードへ書き込む", async () => {
    document.title = "Markdown Web Clipper";
    document.body.innerHTML = `
      <main>
        <article>
          <h1>Markdown Web Clipper</h1>
          <p>Save the current page as Markdown.</p>
        </article>
      </main>
    `;

    const { keepChannelOpen, response } = await dispatchRuntimeMessage({
      type: CLIP_PAGE_MESSAGE,
    });
    const clipboardText = writeTextToClipboardMock.mock.calls.at(-1)?.[0];

    expect(keepChannelOpen).toBe(true);
    expect(response?.success).toBe(true);
    expect(writeTextToClipboardMock).toHaveBeenCalledTimes(1);
    expect(clipboardText).toContain("Source: ");
    expect(clipboardText).toContain("# Markdown Web Clipper");
  });

  it("設定でリンクと画像を無効にした場合はプレーンテキスト寄りで出力する", async () => {
    document.title = "Markdown Web Clipper";
    document.body.innerHTML = `
      <main>
        <article>
          <p>Read the <a href="/docs">documentation</a>.</p>
          <img src="/diagram.png" alt="diagram">
        </article>
      </main>
    `;

    const { keepChannelOpen, response } = await dispatchRuntimeMessage({
      type: CLIP_PAGE_MESSAGE,
    });
    const clipboardText = writeTextToClipboardMock.mock.calls.at(-1)?.[0] ?? "";

    expect(keepChannelOpen).toBe(true);
    expect(response?.success).toBe(true);
    expect(clipboardText).toContain("Read the documentation.");
    expect(clipboardText).not.toContain("[documentation](");
    expect(clipboardText).not.toContain("![diagram](");
  });

  it("抽出結果が空なら失敗レスポンスを返す", async () => {
    document.title = "Empty";
    document.body.innerHTML = "<main><article></article></main>";

    const { keepChannelOpen, response } = await dispatchRuntimeMessage({
      type: CLIP_PAGE_MESSAGE,
    });

    expect(keepChannelOpen).toBe(true);
    expect(response).toEqual({
      success: false,
      error: "No clip-friendly content was found on this page.",
    });
    expect(writeTextToClipboardMock).not.toHaveBeenCalled();
  });
});

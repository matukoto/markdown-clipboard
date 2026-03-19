import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  CLIP_ACTIVE_TAB_MESSAGE,
  CLIP_PAGE_MESSAGE,
  type ClipResponse,
} from "../lib/clip/messages";

type RuntimeMessageListener = (message: unknown) => unknown;
type CommandListener = (command: string) => void;
type ActionClickListener = () => void;

describe("background entrypoint", () => {
  let runtimeMessageListener: RuntimeMessageListener | undefined;
  let commandListener: CommandListener | undefined;
  let actionClickListener: ActionClickListener | undefined;

  const setBadgeBackgroundColor = vi.fn(async () => undefined);
  const setBadgeText = vi.fn(async () => undefined);
  const tabsQuery = vi.fn(async () => [{ id: 123 }]);
  const tabsSendMessage = vi.fn(async (): Promise<ClipResponse> => {
    return {
      success: true,
      result: {
        metadata: {
          title: "Title",
          url: "https://example.com",
          clippedAt: "2026-03-19T00:00:00.000Z",
        },
        contentHtml: "<h1>Title</h1>",
        textContent: "Title",
        markdown: "# Title",
      },
    };
  });

  beforeEach(async () => {
    vi.useFakeTimers();
    vi.resetModules();
    runtimeMessageListener = undefined;
    commandListener = undefined;

    (
      globalThis as unknown as {
        defineBackground: (main: () => void) => unknown;
      }
    ).defineBackground = (main: () => void) => {
      main();
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
      commands: {
        onCommand: {
          addListener: (listener: CommandListener) => {
            commandListener = listener;
          },
        },
      },
      tabs: {
        query: tabsQuery,
        sendMessage: tabsSendMessage,
      },
      action: {
        onClicked: {
          addListener: (listener: ActionClickListener) => {
            actionClickListener = listener;
          },
        },
        setBadgeBackgroundColor,
        setBadgeText,
      },
    };

    await import("../entrypoints/background");
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("クリップ要求を受けると active tab の内容を処理して成功バッジを出す", async () => {
    if (runtimeMessageListener === undefined) {
      throw new Error("runtime message listener is not registered");
    }

    const response = (await runtimeMessageListener({
      type: CLIP_ACTIVE_TAB_MESSAGE,
    })) as ClipResponse;

    expect(tabsQuery).toHaveBeenCalledWith({
      active: true,
      currentWindow: true,
    });
    expect(tabsSendMessage).toHaveBeenCalledWith(123, {
      type: CLIP_PAGE_MESSAGE,
    });
    expect(response.success).toBe(true);
    expect(setBadgeBackgroundColor).toHaveBeenCalledWith({ color: "#16a34a" });
    expect(setBadgeText).toHaveBeenCalledWith({ text: "✓" });

    await vi.advanceTimersByTimeAsync(3000);
    expect(setBadgeText).toHaveBeenLastCalledWith({ text: "" });
  });

  it("キーボードコマンドでも同じ処理を呼び出す", async () => {
    if (commandListener === undefined) {
      throw new Error("command listener is not registered");
    }

    commandListener(CLIP_ACTIVE_TAB_MESSAGE);
    await vi.runAllTimersAsync();

    expect(tabsQuery).toHaveBeenCalledWith({
      active: true,
      currentWindow: true,
    });
    expect(tabsSendMessage).toHaveBeenCalledWith(123, {
      type: CLIP_PAGE_MESSAGE,
    });
  });

  it("拡張機能アイコンのクリックでも同じ処理を呼び出す", async () => {
    if (actionClickListener === undefined) {
      throw new Error("action click listener is not registered");
    }

    actionClickListener();
    await vi.runAllTimersAsync();

    expect(tabsQuery).toHaveBeenCalledWith({
      active: true,
      currentWindow: true,
    });
    expect(tabsSendMessage).toHaveBeenCalledWith(123, {
      type: CLIP_PAGE_MESSAGE,
    });
  });

  it("content script との通信に失敗したら失敗バッジを返す", async () => {
    if (runtimeMessageListener === undefined) {
      throw new Error("runtime message listener is not registered");
    }

    tabsSendMessage.mockImplementationOnce(async () => {
      throw new Error(
        "Cannot establish connection. Receiving end does not exist."
      );
    });

    const response = (await runtimeMessageListener({
      type: CLIP_ACTIVE_TAB_MESSAGE,
    })) as ClipResponse;

    expect(response).toEqual({
      success: false,
      error: "Cannot establish connection. Receiving end does not exist.",
    });
    expect(setBadgeBackgroundColor).toHaveBeenCalledWith({ color: "#dc2626" });
    expect(setBadgeText).toHaveBeenCalledWith({ text: "✕" });
  });
});

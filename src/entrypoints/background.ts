import {
  CLIP_ACTIVE_TAB_MESSAGE,
  CLIP_PAGE_MESSAGE,
  type ClipResponse,
  isClipActiveTabRequest,
} from "../lib/clip/messages";

const BADGE_RESET_DELAY_MS = 3000;
let badgeResetTimeoutId: ReturnType<typeof setTimeout> | undefined;

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message: unknown) => {
    if (!isClipActiveTabRequest(message)) {
      return undefined;
    }

    return clipActiveTab();
  });

  browser.commands.onCommand.addListener((command) => {
    if (command !== CLIP_ACTIVE_TAB_MESSAGE) {
      return;
    }

    void clipActiveTab();
  });

  browser.action.onClicked.addListener(() => {
    void clipActiveTab();
  });

  browser.runtime.onInstalled.addListener(() => {
    browser.contextMenus.create({
      id: "open-options",
      title: "設定を開く",
      contexts: ["action"],
    });
  });

  browser.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === "open-options") {
      void browser.runtime.openOptionsPage();
    }
  });
});

async function clipActiveTab(): Promise<ClipResponse> {
  try {
    const tabId = await getActiveTabId();
    const response = (await browser.tabs.sendMessage(tabId, {
      type: CLIP_PAGE_MESSAGE,
    })) as ClipResponse;

    if (response.success) {
      await setBadge("✓", "#16a34a");
      return response;
    }

    await setBadge("✕", "#dc2626");
    return response;
  } catch (error) {
    await setBadge("✕", "#dc2626");

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to clip the active tab.",
    };
  }
}

async function getActiveTabId(): Promise<number> {
  const [activeTab] = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (activeTab?.id === undefined) {
    throw new Error("No active tab is available to clip.");
  }

  return activeTab.id;
}

async function setBadge(text: string, color: string): Promise<void> {
  await browser.action.setBadgeBackgroundColor({ color });
  await browser.action.setBadgeText({ text });

  if (badgeResetTimeoutId !== undefined) {
    clearTimeout(badgeResetTimeoutId);
  }

  badgeResetTimeoutId = setTimeout(() => {
    badgeResetTimeoutId = undefined;
    void browser.action.setBadgeText({ text: "" });
  }, BADGE_RESET_DELAY_MS);
}

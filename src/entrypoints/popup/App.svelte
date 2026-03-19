<script lang="ts">
  import { onMount } from "svelte";
  import {
    CLIP_ACTIVE_TAB_MESSAGE,
    type ClipResponse,
  } from "../../lib/clip/messages";
  import { renderClipOutput } from "../../lib/clip/output";
  import {
    getClipContentOptions,
    setClipContentOptions,
  } from "../../lib/clip/settings";

  let isLoading = $state(false);
  let copiedTitle = $state("");
  let copiedUrl = $state("");
  let markdownPreview = "";
  let preview = $state("");
  let errorMessage = $state("");
  let includeLinks = $state(false);
  let includeImages = $state(false);
  let isSettingsLoading = $state(true);

  async function clipActiveTab() {
    isLoading = true;
    errorMessage = "";

    try {
      const response = (await browser.runtime.sendMessage({
        type: CLIP_ACTIVE_TAB_MESSAGE,
      })) as ClipResponse;

      if (!response.success) {
        copiedTitle = "";
        copiedUrl = "";
        markdownPreview = "";
        preview = "";
        errorMessage = response.error;
        return;
      }

      copiedTitle = response.result.metadata.title;
      copiedUrl = response.result.metadata.url;
      markdownPreview = renderClipOutput(response.result);
      preview = markdownPreview.split("\n").slice(0, 8).join("\n");
    } catch (error) {
      copiedTitle = "";
      copiedUrl = "";
      markdownPreview = "";
      preview = "";
      errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to contact the background script.";
    } finally {
      isLoading = false;
    }
  }

  onMount(async () => {
    try {
      const options = await getClipContentOptions();
      includeLinks = options.includeLinks;
      includeImages = options.includeImages;
    } catch (error) {
      errorMessage =
        error instanceof Error
          ? error.message
          : "設定の読み込みに失敗しました。";
    } finally {
      isSettingsLoading = false;
    }
  });

  async function saveSettings() {
    errorMessage = "";

    try {
      const next = await setClipContentOptions({
        includeLinks,
        includeImages,
      });
      includeLinks = next.includeLinks;
      includeImages = next.includeImages;
    } catch (error) {
      errorMessage =
        error instanceof Error ? error.message : "設定の保存に失敗しました。";
    }
  }

  function handleIncludeLinksChange(event: Event) {
    includeLinks = (event.currentTarget as HTMLInputElement).checked;
    void saveSettings();
  }

  function handleIncludeImagesChange(event: Event) {
    includeImages = (event.currentTarget as HTMLInputElement).checked;
    void saveSettings();
  }
</script>

<main class="popup">
  <header class="hero">
    <p class="eyebrow">Markdown Web Clipper</p>
    <h1>現在のページをMarkdownとしてコピー</h1>
    <p class="description">
      アクティブタブの本文を抽出し、Markdownとしてクリップボードにコピーします。
    </p>
  </header>

  <section class="settings" aria-label="クリップ設定">
    <p class="settings-title">コピー設定</p>
    <label class="toggle">
      <input
        type="checkbox"
        checked={includeLinks}
        onchange={handleIncludeLinksChange}
        disabled={isSettingsLoading}
      >
      <span>リンクを含める</span>
    </label>
    <label class="toggle">
      <input
        type="checkbox"
        checked={includeImages}
        onchange={handleIncludeImagesChange}
        disabled={isSettingsLoading}
      >
      <span>画像を含める</span>
    </label>
  </section>

  <button
    class="primary"
    type="button"
    onclick={clipActiveTab}
    disabled={isLoading}
  >
    {#if isLoading}
      コピー中…
    {:else}
      現在のページをコピー
    {/if}
  </button>

  <p class="shortcut">ショートカット: Cmd/Ctrl + Shift + Y</p>

  {#if errorMessage !== ""}
    <p class="status error">{errorMessage}</p>
  {/if}

  {#if copiedTitle !== ""}
    <section class="result">
      <p class="status success">コピーしました。</p>
      <h2>{copiedTitle}</h2>
      <p class="url">{copiedUrl}</p>
      <pre>{preview}</pre>
    </section>
  {/if}
</main>

<style>
  .popup {
    width: 360px;
    display: grid;
    gap: 1rem;
  }

  .hero {
    display: grid;
    gap: 0.5rem;
  }

  .eyebrow {
    margin: 0;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #2563eb;
  }

  h1,
  h2 {
    margin: 0;
    color: #0f172a;
  }

  h1 {
    font-size: 1.5rem;
    line-height: 1.3;
  }

  h2 {
    font-size: 1rem;
    line-height: 1.4;
  }

  .description,
  .shortcut,
  .status,
  .url,
  .settings-title {
    margin: 0;
  }

  .description,
  .shortcut,
  .url,
  .settings-title {
    color: #475569;
  }

  .settings {
    display: grid;
    gap: 0.65rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.875rem;
    padding: 0.8rem 0.9rem;
    background: #f8fafc;
  }

  .settings-title {
    font-size: 0.85rem;
    font-weight: 600;
  }

  .toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #0f172a;
    font-size: 0.9rem;
  }

  .toggle input {
    width: 1rem;
    height: 1rem;
    accent-color: #2563eb;
  }

  .primary {
    width: 100%;
    border: none;
    border-radius: 0.875rem;
    padding: 0.9rem 1rem;
    background: #2563eb;
    color: white;
  }

  .primary:hover:enabled {
    background: #1d4ed8;
  }

  .primary:disabled {
    cursor: wait;
    background: #93c5fd;
  }

  .shortcut {
    font-size: 0.85rem;
  }

  .status {
    border-radius: 0.75rem;
    padding: 0.75rem 0.9rem;
    font-size: 0.9rem;
  }

  .status.success {
    background: #dcfce7;
    color: #166534;
  }

  .status.error {
    background: #fee2e2;
    color: #991b1b;
  }

  .result {
    display: grid;
    gap: 0.75rem;
    border: 1px solid #dbeafe;
    border-radius: 1rem;
    padding: 1rem;
    background: #f8fafc;
  }

  .url {
    font-size: 0.85rem;
    word-break: break-word;
  }

  pre {
    margin: 0;
    max-height: 180px;
    overflow: auto;
    border-radius: 0.75rem;
    padding: 0.9rem;
    background: #0f172a;
    color: #e2e8f0;
    font-size: 0.8rem;
    white-space: pre-wrap;
    word-break: break-word;
  }
</style>

<script lang="ts">
  import {
    CLIP_ACTIVE_TAB_MESSAGE,
    type ClipResponse,
  } from "../../lib/clip/messages";
  import { renderClipOutput } from "../../lib/clip/output";

  let isLoading = false;
  let copiedTitle = "";
  let copiedUrl = "";
  let markdownPreview = "";
  let preview = "";
  let errorMessage = "";

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
</script>

<main class="popup">
  <header class="hero">
    <p class="eyebrow">Markdown Web Clipper</p>
    <h1>Copy the current page as Markdown</h1>
    <p class="description">
      Extract the main content from the active tab and copy a Markdown version
      to your clipboard.
    </p>
  </header>

  <button
    class="primary"
    type="button"
    on:click={clipActiveTab}
    disabled={isLoading}
  >
    {#if isLoading}
      Copying…
    {:else}
      Copy current page
    {/if}
  </button>

  <p class="shortcut">Shortcut: Cmd/Ctrl + Shift + Y</p>

  {#if errorMessage !== ""}
    <p class="status error">{errorMessage}</p>
  {/if}

  {#if copiedTitle !== ""}
    <section class="result">
      <p class="status success">Copied successfully.</p>
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
  .url {
    margin: 0;
  }

  .description,
  .shortcut,
  .url {
    color: #475569;
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

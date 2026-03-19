<script lang="ts">
  import { onMount } from "svelte";
  import { isInstanceOf } from "unknownutil";
  import {
    getClipContentOptions,
    setClipContentOptions,
  } from "../../lib/clip/settings";

  let includeLinks = $state(false);
  let includeImages = $state(false);
  let isLoading = $state(true);
  let statusMessage = $state("");
  let errorMessage = $state("");

  onMount(async () => {
    try {
      const options = await getClipContentOptions();
      includeLinks = options.includeLinks;
      includeImages = options.includeImages;
    } catch (error) {
      errorMessage = isInstanceOf(Error)(error)
        ? error.message
        : "設定の読み込みに失敗しました。";
    } finally {
      isLoading = false;
    }
  });

  async function saveSettings() {
    statusMessage = "";
    errorMessage = "";

    try {
      const next = await setClipContentOptions({
        includeLinks,
        includeImages,
      });
      includeLinks = next.includeLinks;
      includeImages = next.includeImages;
      statusMessage = "設定を保存しました。";
    } catch (error) {
      errorMessage = isInstanceOf(Error)(error)
        ? error.message
        : "設定の保存に失敗しました。";
    }
  }

  function handleIncludeLinksChange(event: Event) {
    if (!isInstanceOf(HTMLInputElement)(event.currentTarget)) return;
    includeLinks = event.currentTarget.checked;
    void saveSettings();
  }

  function handleIncludeImagesChange(event: Event) {
    if (!isInstanceOf(HTMLInputElement)(event.currentTarget)) return;
    includeImages = event.currentTarget.checked;
    void saveSettings();
  }
</script>

<main class="page">
  <header class="hero">
    <p class="eyebrow">Markdown Web Clipper</p>
    <h1>設定</h1>
    <p class="description">
      拡張機能アイコンのクリック、またはショートカットで現在のページを Markdown
      としてコピーします。この画面ではクリップ時の出力設定を変更できます。
    </p>
  </header>

  <section class="card" aria-label="クリップ設定">
    <h2>コピー設定</h2>

    <label class="toggle">
      <input
        type="checkbox"
        checked={includeLinks}
        onchange={handleIncludeLinksChange}
        disabled={isLoading}
      >
      <span>リンクを Markdown リンクとして残す</span>
    </label>

    <label class="toggle">
      <input
        type="checkbox"
        checked={includeImages}
        onchange={handleIncludeImagesChange}
        disabled={isLoading}
      >
      <span>画像を Markdown 画像として残す</span>
    </label>

    <p class="hint">
      どちらもオフにすると、リンクや画像はできるだけ本文テキスト寄りの出力になります。
    </p>
  </section>

  <section class="card" aria-label="使い方">
    <h2>使い方</h2>
    <ul>
      <li>
        ツールバーの拡張機能アイコンをクリックすると、現在のページをそのままコピーします。
      </li>
      <li>ショートカットは <code>Cmd/Ctrl + Shift + Y</code> です。</li>
      <li>コピー結果には先頭に <code>Source: URL</code> が付きます。</li>
    </ul>
  </section>

  {#if statusMessage !== ""}
    <p class="status success">{statusMessage}</p>
  {/if}

  {#if errorMessage !== ""}
    <p class="status error">{errorMessage}</p>
  {/if}
</main>

<style>
  .page {
    max-width: 720px;
    margin: 0 auto;
    display: grid;
    gap: 1rem;
  }

  .hero,
  .card {
    display: grid;
    gap: 0.75rem;
  }

  .eyebrow,
  .description,
  .hint,
  .status {
    margin: 0;
  }

  .eyebrow {
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
    font-size: 2rem;
    line-height: 1.2;
  }

  h2 {
    font-size: 1.05rem;
  }

  .description,
  .hint,
  li {
    color: #475569;
  }

  .card {
    border: 1px solid #e2e8f0;
    border-radius: 1rem;
    padding: 1rem;
    background: white;
  }

  .toggle {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    color: #0f172a;
  }

  .toggle input {
    width: 1rem;
    height: 1rem;
    accent-color: #2563eb;
  }

  ul {
    margin: 0;
    padding-left: 1.2rem;
    display: grid;
    gap: 0.5rem;
  }

  .status {
    border-radius: 0.75rem;
    padding: 0.75rem 0.9rem;
    font-size: 0.95rem;
  }

  .status.success {
    background: #dcfce7;
    color: #166534;
  }

  .status.error {
    background: #fee2e2;
    color: #991b1b;
  }
</style>

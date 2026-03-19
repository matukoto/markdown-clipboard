# markdown-clipboard

ブラウザで開いているページを Markdown としてクリップボードへコピーする拡張機能です。

## 特長

- 現在のタブを Markdown に変換してコピー
- ツールバーアイコン、ショートカット、コマンドから実行可能
- 設定ページでリンク・画像の扱いを切り替え可能
- 失敗時はバッジで状態を表示

## 使い方

1. 拡張機能をインストールする
2. コピーしたいページを開く
3. ツールバーアイコンをクリックするか、`Cmd/Ctrl + Shift + Y` を押す
4. 変換結果がクリップボードに入る

コピーされるテキストは `Source: URL` で始まります。

## 設定

拡張機能のオプションページで次を切り替えられます。

- リンクを Markdown リンクとして残す
- 画像を Markdown 画像として残す

両方をオフにすると、リンクや画像はできるだけ本文テキストに寄せて変換します。

## 開発

```bash
pnpm install
pnpm dev
```

## スクリプト

- `pnpm dev` - 開発起動
- `pnpm dev:firefox` - Firefox 向け開発起動
- `pnpm build` - ビルド
- `pnpm build:firefox` - Firefox 向けビルド
- `pnpm zip` - 配布用 zip を作成
- `pnpm lint` - 静的チェック
- `pnpm check` - Svelte/TypeScript チェック
- `pnpm test` - テスト実行

## 技術情報

- WXT + Svelte 5
- TypeScript
- Turndown / turndown-plugin-gfm
- Mozilla Readability

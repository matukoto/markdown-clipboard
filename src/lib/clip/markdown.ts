import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

export function renderMarkdown(contentHtml: string): string {
  if (contentHtml.trim() === "") {
    return "";
  }

  const turndownService = new TurndownService({
    headingStyle: "atx",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
  });
  turndownService.use(gfm);

  return turndownService
    .turndown(contentHtml)
    .replace(/^- {3}/gm, "- ")
    .replace(/^(\d+\.) {3}/gm, "$1 ")
    .trim();
}

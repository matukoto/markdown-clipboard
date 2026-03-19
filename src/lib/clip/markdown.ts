import TurndownService from "turndown";

export function renderMarkdown(contentHtml: string): string {
  if (contentHtml.trim() === "") {
    return "";
  }

  const turndownService = new TurndownService({
    headingStyle: "atx",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
  });

  return turndownService
    .turndown(contentHtml)
    .replace(/^- {3}/gm, "- ")
    .replace(/^(\d+\.) {3}/gm, "$1 ")
    .trim();
}

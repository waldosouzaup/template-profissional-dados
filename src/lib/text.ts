// Plain-text helpers shared by blog cards and the post page.
import { safeUrl } from "./url.ts";

export const stripInlineMarkdown = (text: string) => text.replace(/\*\*|__|\*|`/g, "");

export const readingMinutes = (markdown?: string) =>
  markdown ? Math.max(1, Math.ceil(markdown.trim().split(/\s+/).length / 200)) : 1;

// Anchor id for a heading; the table of contents builds the same ids from the raw Markdown.
export const headingId = (text: string) => text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

// Images written as ![alt](src "title") in a post, in reading order. The lightbox also links to each
// src ("Abrir original"), so addresses that are not web or relative ones are left out.
export const extractMarkdownImages = (markdown?: string) =>
  Array.from((markdown ?? "").matchAll(/!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+["'][^"']*["'])?\s*\)/g), (m) => ({
    alt: m[1].trim(),
    src: m[2],
  })).filter((image) => safeUrl(image.src));

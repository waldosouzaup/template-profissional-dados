// Plain-text helpers shared by blog cards and the post page.

export const stripInlineMarkdown = (text: string) => text.replace(/\*\*|__|\*|`/g, "");

export const readingMinutes = (markdown?: string) =>
  markdown ? Math.max(1, Math.ceil(markdown.trim().split(/\s+/).length / 200)) : 1;

// Images written as ![alt](src "title") in a post, in reading order.
export const extractMarkdownImages = (markdown?: string) =>
  Array.from((markdown ?? "").matchAll(/!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+["'][^"']*["'])?\s*\)/g), (m) => ({
    alt: m[1].trim(),
    src: m[2],
  }));

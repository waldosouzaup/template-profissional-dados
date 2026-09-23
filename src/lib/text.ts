// Plain-text helpers shared by blog cards and the post page.

export const stripInlineMarkdown = (text: string) => text.replace(/\*\*|__|\*|`/g, "");

export const readingMinutes = (markdown?: string) =>
  markdown ? Math.max(1, Math.ceil(markdown.trim().split(/\s+/).length / 200)) : 1;

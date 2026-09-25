import { describe, expect, it } from "vitest";
import { safeUrl } from "@/lib/url";
import { extractMarkdownImages } from "@/lib/text";

describe("safeUrl: só links web, e-mail, telefone ou do próprio site", () => {
  it.each([
    "javascript:alert(1)",
    "JaVaScRiPt:alert(1)",
    "  javascript:alert(1)",
    "java\tscript:alert(1)",
    "java\nscript:alert(1)",
    "\u0001javascript:alert(1)",
    "vbscript:msgbox(1)",
    "data:text/html,<script>alert(1)</script>",
    "file:///etc/passwd",
  ])("recusa %j", (url) => {
    expect(safeUrl(url)).toBeUndefined();
  });

  it.each([
    "https://github.com/waldosouzaup",
    "http://example.com/cv.pdf",
    "mailto:eu@example.com",
    "tel:+5561999990000",
    "/projects/rifa-online",
    "#contato",
    "//cdn.example.com/a.png",
    "cv.pdf",
  ])("aceita %j como foi digitado", (url) => {
    expect(safeUrl(url)).toBe(url);
  });

  it("vazio ou ausente não vira link", () => {
    expect(safeUrl("")).toBeUndefined();
    expect(safeUrl("   ")).toBeUndefined();
    expect(safeUrl(null)).toBeUndefined();
    expect(safeUrl(undefined)).toBeUndefined();
  });

  it("imagens do Markdown com endereço perigoso não entram no lightbox", () => {
    const images = extractMarkdownImages("![ok](https://example.com/a.png)\n\n![x](javascript:alert(1))\n\n![rel](/b.png)");
    expect(images).toEqual([
      { alt: "ok", src: "https://example.com/a.png" },
      { alt: "rel", src: "/b.png" },
    ]);
  });
});

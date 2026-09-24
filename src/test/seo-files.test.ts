import { describe, expect, it } from "vitest";
import { buildProjectRedirects, buildSitemap, buildTrailEntries } from "../../scripts/seo-files.js";

describe("sitemap", () => {
  it("usa o domínio canônico sem www e lastmod quando informado", () => {
    const xml = buildSitemap([
      { path: "/" },
      { path: "/projects/rifa-online", lastmod: "2026-09-20T10:00:00+00:00" },
    ]);
    expect(xml).toContain("<loc>https://waldoeller.com/</loc>");
    expect(xml).toContain("<loc>https://waldoeller.com/projects/rifa-online</loc>");
    expect(xml).toContain("<lastmod>2026-09-20T10:00:00+00:00</lastmod>");
    expect(xml).not.toContain("www.waldoeller.com");
    expect(xml.match(/<lastmod>/g)).toHaveLength(1);
  });

  it("codifica caracteres especiais do caminho", () => {
    expect(buildSitemap([{ path: "/blog/dia-0830-revisão-geral" }])).toContain("<loc>https://waldoeller.com/blog/dia-0830-revis%C3%A3o-geral</loc>");
  });
});

describe("redirecionamentos de projetos", () => {
  it("gera 301 do UUID e dos slugs antigos para o slug atual", () => {
    const rules = buildProjectRedirects([
      { id: "77ecb037-a884-40b3-b997-28033b474c4a", slug: "rifa-online", previous_slugs: ["rifa-uplinux"] },
    ]);
    expect(rules).toBe(
      "/projects/77ecb037-a884-40b3-b997-28033b474c4a /projects/rifa-online 301\n" +
      "/projects/rifa-uplinux /projects/rifa-online 301\n",
    );
  });
});

describe("trilhas no sitemap", () => {
  it("uma URL por trilha com artigos, com a data do artigo mais recente", () => {
    const entries = buildTrailEntries(
      [{ id: "linux", slug: "linux-essentials-30-dias" }, { id: "vazia", slug: "vazia" }],
      [
        { trail_id: "linux", created_at: "2026-05-01T00:00:00Z" },
        { trail_id: "linux", created_at: "2026-05-09T00:00:00Z" },
        { trail_id: null, created_at: "2026-06-01T00:00:00Z" },
      ],
    );
    expect(entries).toEqual([{ path: "/blog/trilha/linux-essentials-30-dias", lastmod: "2026-05-09T00:00:00Z" }]);
  });
});

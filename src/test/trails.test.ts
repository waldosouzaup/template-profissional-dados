import { describe, expect, it } from "vitest";
import { stepLabel, summarizeTrails, trailNeighbors, trailPosts } from "@/lib/trails";

const post = (id: string, trail_id: string | null, trail_position: number | null, created_at: string, extra = {}) => ({
  id, title: id, trail_id, trail_position, created_at, ...extra,
});

const posts = [
  post("d3", "linux", 3, "2026-05-03T00:00:00Z"),
  post("d1", "linux", 1, "2026-05-01T00:00:00Z", { image_url: "https://example.com/d1.png", markdown: Array(400).fill("x").join(" ") }),
  post("extra", "linux", null, "2026-05-02T00:00:00Z"),
  post("d2", "linux", 2, "2026-05-09T00:00:00Z", { markdown: "curto" }),
  post("prd", "ia", 1, "2026-04-14T00:00:00Z"),
  post("solto", null, null, "2026-05-20T00:00:00Z"),
];

describe("Ordem de estudo das trilhas", () => {
  it("ordena pela posição; artigos sem posição vão para o fim, por data", () => {
    expect(trailPosts(posts, "linux").map((p) => p.id)).toEqual(["d1", "d2", "d3", "extra"]);
  });

  it("rótulo da etapa com dois dígitos", () => {
    expect(stepLabel(5)).toBe("Etapa 05");
    expect(stepLabel(12)).toBe("Etapa 12");
    expect(stepLabel(null)).toBeUndefined();
  });

  it("anterior, próximo e o que vem depois na trilha", () => {
    const ordered = trailPosts(posts, "linux");
    const middle = trailNeighbors(ordered, "d2");
    expect(middle.previous?.id).toBe("d1");
    expect(middle.next?.id).toBe("d3");
    expect(middle.upNext.map((p) => p.id)).toEqual(["d3", "extra", "d1"]);

    const first = trailNeighbors(ordered, "d1");
    expect(first.previous).toBeUndefined();
    expect(first.upNext.map((p) => p.id)).toEqual(["d2", "d3", "extra"]);

    // No fim da trilha, completa com os artigos anteriores mais próximos.
    const last = trailNeighbors(ordered, "extra");
    expect(last.next).toBeUndefined();
    expect(last.upNext.map((p) => p.id)).toEqual(["d3", "d2", "d1"]);
  });

  it("resume as trilhas com artigos: quantidade, capa, tempo de leitura e primeiro artigo", () => {
    const trails = [
      { id: "ia", name: "IA", slug: "ia", display_order: 1 },
      { id: "vazia", name: "Vazia", slug: "vazia", display_order: 2 },
      { id: "linux", name: "Linux", slug: "linux", display_order: 3, image_url: "" },
    ];
    const summaries = summarizeTrails(trails, posts);
    expect(summaries.map((s) => s.trail.id)).toEqual(["ia", "linux"]);
    const linux = summaries[1];
    expect(linux.posts.map((p) => p.id)).toEqual(["d1", "d2", "d3", "extra"]);
    // Sem capa própria, usa a capa do primeiro artigo que tiver uma.
    expect(linux.cover).toBe("https://example.com/d1.png");
    expect(linux.minutes).toBe(2 + 1 + 1 + 1);
    expect(linux.lastPublished).toBe("2026-05-09T00:00:00Z");
  });

  it("a capa própria da trilha tem prioridade", () => {
    const [summary] = summarizeTrails([{ id: "linux", name: "Linux", slug: "linux", display_order: 0, image_url: "https://example.com/trilha.png" }], posts);
    expect(summary.cover).toBe("https://example.com/trilha.png");
  });
});

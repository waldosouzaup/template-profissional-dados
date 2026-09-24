import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import Blog from "@/pages/Blog";
import BlogTrail from "@/pages/BlogTrail";

const s = vi.hoisted(() => {
  const step = (n: number, extra = {}) => ({
    id: `d${n}`, slug: `dia-0${n}`, title: `Dia 0${n}/30`, trail_id: "linux", trail_position: n,
    image_url: "", markdown: "texto", created_at: `2026-05-0${n}T12:00:00.000Z`, ...extra,
  });
  return {
    trails: [
      { id: "ia", name: "IA", slug: "ia", description: "Documentos e agentes.", display_order: 1, image_url: "https://example.com/ia.png" },
      { id: "vazia", name: "Sem artigos", slug: "sem-artigos", display_order: 2 },
      { id: "linux", name: "Linux Essentials 30 dias", slug: "linux-essentials-30-dias", description: "Um desafio diário rumo à certificação.", display_order: 3 },
    ],
    posts: [
      step(3),
      step(1, { image_url: "https://example.com/dia-01.png" }),
      step(2),
      { id: "prd", slug: "o-que-e-um-prd", title: "O que é um PRD?", trail_id: "ia", trail_position: 1, created_at: "2026-04-14T12:00:00.000Z" },
    ] as Record<string, unknown>[],
  };
});
vi.mock("@/hooks/useBlogTrails", () => ({ useBlogTrails: () => ({ data: s.trails, isLoading: false }) }));
vi.mock("@/hooks/useContents", async () => {
  const { trailPosts } = await import("@/lib/trails");
  return {
    useContents: () => ({ data: s.posts, isLoading: false }),
    useTrailPosts: (trailId?: string) => ({ data: trailId ? trailPosts(s.posts as never[], trailId) : [], isLoading: false }),
  };
});

beforeAll(() => { window.scrollTo = vi.fn(); });
afterEach(cleanup);

const renderAt = (path: string) => render(
  <MemoryRouter initialEntries={[path]}>
    <Routes>
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/trilha/:slug" element={<BlogTrail />} />
    </Routes>
  </MemoryRouter>,
);

describe("/blog: trilhas de estudo", () => {
  it("mostra um card por trilha com artigos, na ordem definida no admin", () => {
    renderAt("/blog");
    const grid = screen.getByRole("region", { name: "Trilhas de estudo" });
    const cards = within(grid).getAllByRole("link");
    expect(cards.map((c) => c.getAttribute("href"))).toEqual(["/blog/trilha/ia", "/blog/trilha/linux-essentials-30-dias"]);
    cards.forEach((c) => expect(c).toHaveClass("media-card"));
    expect(screen.queryByText("Sem artigos")).not.toBeInTheDocument();
  });

  it("o card da trilha mostra nome, descrição, quantidade de artigos e capa", () => {
    renderAt("/blog");
    const linux = screen.getByRole("link", { name: /Linux Essentials 30 dias/ });
    expect(within(linux).getByRole("heading", { name: "Linux Essentials 30 dias" })).toBeInTheDocument();
    expect(within(linux).getByText("Um desafio diário rumo à certificação.")).toBeInTheDocument();
    expect(within(linux).getByText("3 artigos")).toBeInTheDocument();
    expect(within(linux).getByText("Ver trilha")).toBeInTheDocument();
    // Sem capa própria, usa a do primeiro artigo.
    expect(within(linux).getByRole("img")).toHaveAttribute("src", "https://example.com/dia-01.png");
    const [ia] = within(screen.getByRole("region", { name: "Trilhas de estudo" })).getAllByRole("link");
    expect(within(ia).getByText("1 artigo")).toBeInTheDocument();
    expect(within(ia).getByRole("img")).toHaveAttribute("src", "https://example.com/ia.png");
  });

  it("artigos fora de uma trilha continuam acessíveis em Outros artigos", () => {
    s.posts.push({ id: "solto", slug: "artigo-solto", title: "Artigo solto", trail_id: null, created_at: "2026-05-20T12:00:00.000Z" });
    renderAt("/blog");
    const section = screen.getByRole("region", { name: "Outros artigos" });
    expect(within(section).getByRole("link")).toHaveAttribute("href", "/blog/artigo-solto");
    s.posts.pop();
  });

  it("sem artigos soltos, não mostra a seção Outros artigos", () => {
    renderAt("/blog");
    expect(screen.queryByRole("region", { name: "Outros artigos" })).not.toBeInTheDocument();
  });
});

describe("/blog/trilha/:slug", () => {
  it("mostra a trilha com os artigos na ordem de estudo", () => {
    renderAt("/blog/trilha/linux-essentials-30-dias");
    expect(screen.getByRole("heading", { level: 1, name: "Linux Essentials 30 dias" })).toBeInTheDocument();
    expect(screen.getByText("Um desafio diário rumo à certificação.")).toBeInTheDocument();
    expect(screen.getByText("3 artigos")).toBeInTheDocument();
    const list = screen.getByRole("list");
    const cards = within(list).getAllByRole("link");
    expect(cards.map((c) => c.getAttribute("href"))).toEqual(["/blog/dia-01", "/blog/dia-02", "/blog/dia-03"]);
    expect(cards.map((c) => within(c).getByText(/^Etapa/).textContent)).toEqual(["Etapa 01", "Etapa 02", "Etapa 03"]);
  });

  it("volta para o blog e convida a começar pela primeira etapa", () => {
    renderAt("/blog/trilha/linux-essentials-30-dias");
    expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute("href", "/blog");
    expect(screen.getByRole("link", { name: "Começar pela etapa 01" })).toHaveAttribute("href", "/blog/dia-01");
  });

  it("publica canonical e a lista ordenada nos dados estruturados", async () => {
    renderAt("/blog/trilha/linux-essentials-30-dias");
    await waitFor(() => expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute("href", "https://waldoeller.com/blog/trilha/linux-essentials-30-dias"));
    const data = JSON.parse(document.getElementById("seo-jsonld")!.textContent!);
    expect(data["@type"]).toBe("CollectionPage");
    expect(data.mainEntity.itemListElement.map((i: { position: number; url: string }) => [i.position, i.url])).toEqual([
      [1, "https://waldoeller.com/blog/dia-01"],
      [2, "https://waldoeller.com/blog/dia-02"],
      [3, "https://waldoeller.com/blog/dia-03"],
    ]);
  });

  it("trilha inexistente mostra não encontrada sem indexação", async () => {
    renderAt("/blog/trilha/nao-existe");
    expect(screen.getByRole("heading", { name: "Trilha não encontrada" })).toBeInTheDocument();
    await waitFor(() => expect(document.querySelector('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow"));
  });
});

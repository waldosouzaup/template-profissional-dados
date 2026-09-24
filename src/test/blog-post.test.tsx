import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import BlogPost from "@/pages/BlogPost";

const s = vi.hoisted(() => {
  const post = {
    id: "5b0c2a4e-9d1f-4c52-8a57-0f6a2d9c1e11", slug: "dia-01-comecando-do-zero", title: "Dia 01/30 - Começando do zero com Linux",
    description: "Instalei, abri o terminal e já entendi uma coisa: **aqui tudo é comando**.",
    markdown: `${Array(450).fill("palavra").join(" ")}\n\n## Primeiro passo\n\ntexto\n\n## Segundo passo\n\ntexto`,
    category: "Linux", image_url: "https://example.com/capa.png", created_at: "2026-05-02T12:00:00.000Z",
    trail_id: "linux" as string | null, trail_position: 2,
  };
  const step = (n: number) => ({
    id: `d${n}`, slug: `dia-0${n}`, title: `Dia 0${n}/30`, image_url: "", trail_id: "linux", trail_position: n,
    created_at: `2026-05-0${n}T12:00:00.000Z`,
  });
  return {
    post: post as typeof post | null,
    trailPosts: [step(1), post, step(3), step(4)],
    trails: [{ id: "linux", name: "Linux Essentials 30 dias", slug: "linux-essentials-30-dias", display_order: 1 }],
    profile: { id: "p", full_name: "Waldo Eller", current_focus: "Cloud/DevOps", avatar_url: "https://example.com/eu.jpg", bio_summary: "Profissional de TI com foco em Linux." },
  };
});
vi.mock("@/hooks/useContents", () => ({
  useContent: () => ({ data: s.post, isLoading: false }),
  useContents: () => ({ data: s.post ? s.trailPosts : [], isLoading: false }),
  useTrailPosts: (trailId?: string) => ({ data: trailId === "linux" ? s.trailPosts : [], isLoading: false }),
}));
vi.mock("@/hooks/useBlogTrails", () => ({ useBlogTrails: () => ({ data: s.trails, isLoading: false }) }));
vi.mock("@/hooks/useProfile", () => ({ useProfiles: () => ({ data: [s.profile], isLoading: false }) }));

const writeText = vi.fn().mockResolvedValue(undefined);
beforeAll(() => {
  window.scrollTo = vi.fn();
  Object.assign(navigator, { clipboard: { writeText } });
});
afterEach(cleanup);

const renderPost = () => render(<MemoryRouter><BlogPost /></MemoryRouter>);

describe("Página do post", () => {
  it("abre com volta à trilha, etapa, data, tempo de leitura, título e autor", () => {
    renderPost();
    expect(screen.getByRole("link", { name: "Linux Essentials 30 dias" })).toHaveAttribute("href", "/blog/trilha/linux-essentials-30-dias");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Dia 01/30 - Começando do zero com Linux");
    expect(screen.getByText("Etapa 02 de 04")).toBeInTheDocument();
    expect(document.querySelector("time")).toHaveAttribute("dateTime", "2026-05-02T12:00:00.000Z");
    expect(screen.getByText("3 min de leitura")).toBeInTheDocument();
    expect(screen.getByText("Cloud/DevOps")).toBeInTheDocument();
    expect(screen.getByText("Instalei, abri o terminal e já entendi uma coisa: aqui tudo é comando.")).toBeInTheDocument();
  });

  it("mostra a capa na proporção natural, sem faixas laterais", () => {
    renderPost();
    const cover = screen.getByRole("img", { name: "Dia 01/30 - Começando do zero com Linux" });
    expect(cover.className).not.toMatch(/object-contain|max-h-/);
    expect(cover.className).toMatch(/h-auto/);
  });

  it("mantém o texto do artigo numa largura confortável de leitura", () => {
    renderPost();
    expect(document.querySelector("article")).toHaveClass("max-w-3xl");
  });

  it("o índice do artigo usa a barra de rolagem com as cores do projeto", () => {
    renderPost();
    expect(screen.getByRole("navigation", { name: "Neste artigo" })).toHaveClass("scrollbar-themed");
  });

  it("copia o link do post e confirma", async () => {
    renderPost();
    fireEvent.click(screen.getByRole("button", { name: "Copiar link" }));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith(window.location.href));
    expect(await screen.findByText("Link copiado")).toBeInTheDocument();
  });

  it("leva ao artigo anterior e ao próximo da trilha", () => {
    renderPost();
    const nav = screen.getByRole("navigation", { name: "Navegação da trilha" });
    expect(within(nav).getByRole("link", { name: /Anterior/ })).toHaveAttribute("href", "/blog/dia-01");
    expect(within(nav).getByRole("link", { name: /Próximo/ })).toHaveAttribute("href", "/blog/dia-03");
  });

  it("continue na trilha: os próximos artigos no card padrão do site, com a etapa", () => {
    renderPost();
    const section = screen.getByRole("region", { name: "Linux Essentials 30 dias" });
    const cards = within(section).getAllByRole("link", { name: /Ler artigo/ });
    expect(cards.map((c) => c.getAttribute("href"))).toEqual(["/blog/dia-03", "/blog/dia-04", "/blog/dia-01"]);
    cards.forEach((c) => expect(c).toHaveClass("media-card"));
    expect(within(cards[0]).getByText("Etapa 03")).toBeInTheDocument();
    expect(within(section).getByRole("link", { name: "Ver trilha completa →" })).toHaveAttribute("href", "/blog/trilha/linux-essentials-30-dias");
  });

  it("a lateral lista as trilhas de estudo com a quantidade de artigos", () => {
    renderPost();
    expect(screen.getByRole("link", { name: /^Linux Essentials 30 dias\s*4$/ })).toHaveAttribute("href", "/blog/trilha/linux-essentials-30-dias");
  });

  it("os dados estruturados indicam a trilha e a posição do artigo", async () => {
    renderPost();
    await waitFor(() => expect(document.getElementById("seo-jsonld")).not.toBeNull());
    const data = JSON.parse(document.getElementById("seo-jsonld")!.textContent!);
    expect(data.isPartOf).toEqual({ "@type": "CollectionPage", name: "Linux Essentials 30 dias", url: "https://waldoeller.com/blog/trilha/linux-essentials-30-dias" });
    expect(data.position).toBe(2);
  });

  it("artigo sem trilha volta para Trilhas e não mostra navegação de trilha", () => {
    const original = s.post;
    s.post = { ...original!, trail_id: null };
    renderPost();
    expect(screen.getByRole("link", { name: "Trilhas" })).toHaveAttribute("href", "/blog");
    expect(screen.getByRole("link", { name: "Voltar às Trilhas" })).toHaveAttribute("href", "/blog");
    expect(screen.queryByText(/\bBlog\b/)).not.toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "Navegação da trilha" })).not.toBeInTheDocument();
    expect(screen.queryByText(/Etapa \d/)).not.toBeInTheDocument();
    s.post = original;
  });

  it("post inexistente mostra não encontrado sem indexação", async () => {
    const original = s.post;
    s.post = null;
    renderPost();
    expect(screen.getByRole("heading", { name: "Artigo não encontrado" })).toBeInTheDocument();
    await waitFor(() => expect(document.querySelector('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow"));
    s.post = original;
  });
});

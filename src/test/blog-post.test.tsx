import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import BlogPost from "@/pages/BlogPost";

const s = vi.hoisted(() => {
  const post = {
    id: "5b0c2a4e-9d1f-4c52-8a57-0f6a2d9c1e11", slug: "dia-01-comecando-do-zero", title: "Dia 01/30 - Começando do zero com Linux",
    description: "Instalei, abri o terminal e já entendi uma coisa: **aqui tudo é comando**.",
    markdown: `${Array(450).fill("palavra").join(" ")}\n\n## Primeiro passo\n\ntexto\n\n## Segundo passo\n\ntexto`,
    category: "Linux", image_url: "https://example.com/capa.png", created_at: "2026-05-01T12:00:00.000Z",
  };
  return {
    post: post as typeof post | null,
    related: [
      { id: "r1", slug: "dia-02", title: "Dia 02/30", category: "Linux", image_url: "", created_at: "2026-05-02T12:00:00.000Z" },
      { id: "r2", slug: "dia-03", title: "Dia 03/30", category: "Linux", image_url: "", created_at: "2026-05-03T12:00:00.000Z" },
    ],
    profile: { id: "p", full_name: "Waldo Eller", current_focus: "Cloud/DevOps", avatar_url: "https://example.com/eu.jpg", bio_summary: "Profissional de TI com foco em Linux." },
  };
});
vi.mock("@/hooks/useContents", () => ({
  useContent: () => ({ data: s.post, isLoading: false }),
  useContents: () => ({ data: s.post ? [s.post, ...s.related] : [], isLoading: false }),
  useRelatedContents: () => ({ data: s.related, isLoading: false }),
}));
vi.mock("@/hooks/useProfile", () => ({ useProfiles: () => ({ data: [s.profile], isLoading: false }) }));

const writeText = vi.fn().mockResolvedValue(undefined);
beforeAll(() => {
  window.scrollTo = vi.fn();
  Object.assign(navigator, { clipboard: { writeText } });
});
afterEach(cleanup);

const renderPost = () => render(<MemoryRouter><BlogPost /></MemoryRouter>);

describe("Página do post", () => {
  it("abre com volta ao blog, tema, data, tempo de leitura, título e autor", () => {
    renderPost();
    expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute("href", "/blog");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Dia 01/30 - Começando do zero com Linux");
    expect(screen.getAllByText("Linux")[0]).toBeInTheDocument();
    expect(document.querySelector("time")).toHaveAttribute("dateTime", "2026-05-01T12:00:00.000Z");
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

  it("artigos relacionados usam o card padrão do site", () => {
    renderPost();
    const cards = screen.getAllByRole("link", { name: /Ler artigo/ });
    expect(cards.map((c) => c.getAttribute("href"))).toEqual(["/blog/dia-02", "/blog/dia-03"]);
    cards.forEach((c) => expect(c).toHaveClass("media-card"));
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

import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import BlogPost from "@/pages/BlogPost";

const post = vi.hoisted(() => ({
  id: "5b0c2a4e-9d1f-4c52-8a57-0f6a2d9c1e11", slug: "dia-07", title: "Dia 07/30", description: "Ajuda na linha de comando",
  created_at: "2026-05-07T12:00:00.000Z", image_url: "", trail_id: null,
  markdown: [
    "O comando `man` abre o manual do sistema.",
    "",
    "```bash",
    "man ls",
    "```",
    "",
    "| Tecla | Ação |",
    "| --- | --- |",
    "| `Espaço` ou `Page Down` | Avança uma página |",
    "",
    "Repositório: https://github.com/waldosouzaup/um-endereco-muito-longo-que-nao-cabe-na-tela-do-celular",
  ].join("\n"),
}));
vi.mock("@/hooks/useContents", () => ({
  useContent: () => ({ data: post, isLoading: false }),
  useContents: () => ({ data: [post], isLoading: false }),
  useTrailPosts: () => ({ data: [], isLoading: false }),
}));
vi.mock("@/hooks/useBlogTrails", () => ({ useBlogTrails: () => ({ data: [], isLoading: false }) }));
vi.mock("@/hooks/useProfile", () => ({ useProfiles: () => ({ data: [], isLoading: false }) }));

beforeAll(() => { window.scrollTo = vi.fn(); });
afterEach(cleanup);

const renderPost = () => {
  render(<MemoryRouter><BlogPost /></MemoryRouter>);
  return document.querySelector("article")!;
};

describe("Conteúdo do post no celular", () => {
  it("código inline fica no meio da frase, sem virar bloco", () => {
    const article = renderPost();
    const paragraph = within(article).getByText(/abre o manual do sistema/);
    expect(paragraph.tagName).toBe("P");
    const inline = within(paragraph).getByText("man");
    expect(inline.tagName).toBe("CODE");
    expect(paragraph.querySelector("pre, button")).toBeNull();
  });

  it("bloco de código mantém a linguagem, o botão Copiar e a rolagem interna", () => {
    const article = renderPost();
    expect(within(article).getAllByRole("button", { name: /Copiar/ })).toHaveLength(1);
    expect(within(article).getByText("bash")).toBeInTheDocument();
    const pre = article.querySelector("pre")!;
    expect(pre).toHaveTextContent("man ls");
    expect(pre).toHaveClass("overflow-x-auto");
  });

  it("tabela rola dentro do próprio contêiner, e o código nas células é inline", () => {
    const article = renderPost();
    const table = within(article).getByRole("table");
    expect(table.parentElement).toHaveClass("overflow-x-auto");
    const cell = within(table).getByRole("cell", { name: "Espaço ou Page Down" });
    expect(cell.querySelectorAll("code")).toHaveLength(2);
    expect(cell.querySelector("pre, button")).toBeNull();
  });

  it("endereços longos quebram a linha em vez de alargar a página", () => {
    const article = renderPost();
    expect(article).toHaveClass("break-words");
  });
});

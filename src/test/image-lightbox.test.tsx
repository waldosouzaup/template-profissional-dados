import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import BlogPost from "@/pages/BlogPost";

const post = vi.hoisted(() => ({
  id: "5b0c2a4e-9d1f-4c52-8a57-0f6a2d9c1e11", slug: "dia-05", title: "Dia 05/30", category: "Linux",
  description: "Linha de comando", created_at: "2026-05-05T12:00:00.000Z", image_url: "",
  markdown: [
    "Abrindo o terminal:",
    "",
    "![Terminal com o comando ls](https://example.com/terminal.png)",
    "",
    "Depois, o manual:",
    "",
    "![Página do man](https://example.com/man.png)",
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

const renderPost = () => render(<MemoryRouter><BlogPost /></MemoryRouter>);
const openFirst = () => {
  fireEvent.click(screen.getByRole("button", { name: "Ampliar imagem: Terminal com o comando ls" }));
  return screen.getByRole("dialog", { name: "Imagem ampliada" });
};

describe("Lightbox das imagens do post", () => {
  it("abre a imagem clicada em tela cheia com legenda e contador", () => {
    renderPost();
    const lightbox = openFirst();
    expect(within(lightbox).getByRole("img", { name: "Terminal com o comando ls" })).toHaveAttribute("src", "https://example.com/terminal.png");
    expect(within(lightbox).getByText("Terminal com o comando ls", { selector: "p" })).toBeInTheDocument();
    expect(within(lightbox).getByText("1 / 2")).toBeInTheDocument();
  });

  it("navega entre as imagens do post pelos botões e pelas setas do teclado", () => {
    renderPost();
    const lightbox = openFirst();
    fireEvent.click(within(lightbox).getByRole("button", { name: "Próxima imagem" }));
    expect(within(lightbox).getByRole("img", { name: "Página do man" })).toBeInTheDocument();
    expect(within(lightbox).getByText("2 / 2")).toBeInTheDocument();
    fireEvent.keyDown(lightbox, { key: "ArrowLeft" });
    expect(within(lightbox).getByRole("img", { name: "Terminal com o comando ls" })).toBeInTheDocument();
  });

  it("amplia para ver detalhes e volta ao tamanho inteiro", () => {
    renderPost();
    const lightbox = openFirst();
    const image = within(lightbox).getByRole("img", { name: "Terminal com o comando ls" });
    expect(image).toHaveAttribute("data-zoomed", "false");
    fireEvent.click(within(lightbox).getByRole("button", { name: "Ampliar" }));
    expect(image).toHaveAttribute("data-zoomed", "true");
    fireEvent.click(within(lightbox).getByRole("button", { name: "Reduzir" }));
    expect(image).toHaveAttribute("data-zoomed", "false");
  });

  it("oferece a imagem original em nova aba", () => {
    renderPost();
    const lightbox = openFirst();
    const original = within(lightbox).getByRole("link", { name: "Abrir original" });
    expect(original).toHaveAttribute("href", "https://example.com/terminal.png");
    expect(original).toHaveAttribute("target", "_blank");
  });

  it("fecha com Esc", () => {
    renderPost();
    const lightbox = openFirst();
    fireEvent.keyDown(lightbox, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Imagem ampliada" })).not.toBeInTheDocument();
  });
});

import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import PostCard from "@/components/portfolio/PostCard";
import Blog from "@/pages/Blog";
import type { Content } from "@/types/database";

const post: Content = {
  id: "5b0c2a4e-9d1f-4c52-8a57-0f6a2d9c1e11",
  slug: "dia-08-revisao-geral",
  title: "Dia 08/30 - Revisão Geral",
  description: "A proposta foi uma **revisão estratégica e profunda** do tópico.",
  markdown: Array(450).fill("palavra").join(" "),
  category: "Linux",
  image_url: "https://example.com/capa.png",
  created_at: "2026-05-09T12:00:00.000Z",
};

const state = vi.hoisted(() => ({ contents: [] as Content[] }));
vi.mock("@/hooks/useContents", () => ({ useContents: () => ({ data: state.contents, isLoading: false }) }));

beforeAll(() => { window.scrollTo = vi.fn(); });
afterEach(cleanup);

describe("Card de post do blog", () => {
  it("aponta para o slug e mostra tema, título, data e tempo de leitura", () => {
    render(<MemoryRouter><PostCard post={post} /></MemoryRouter>);
    const card = screen.getByRole("link");
    expect(card).toHaveAttribute("href", "/blog/dia-08-revisao-geral");
    expect(within(card).getByText("Linux")).toBeInTheDocument();
    expect(within(card).getByRole("heading", { name: "Dia 08/30 - Revisão Geral" })).toBeInTheDocument();
    expect(within(card).getByText("09 mai 2026")).toBeInTheDocument();
    expect(within(card).getByText("3 min de leitura")).toBeInTheDocument();
    expect(within(card).getByText("Ler artigo")).toBeInTheDocument();
  });

  it("mostra o resumo sem marcação Markdown", () => {
    render(<MemoryRouter><PostCard post={post} /></MemoryRouter>);
    expect(screen.getByText("A proposta foi uma revisão estratégica e profunda do tópico.")).toBeInTheDocument();
  });

  it("usa o id quando o post não tem slug", () => {
    render(<MemoryRouter><PostCard post={{ ...post, slug: undefined }} /></MemoryRouter>);
    expect(screen.getByRole("link")).toHaveAttribute("href", `/blog/${post.id}`);
  });

  it("a página do blog usa o mesmo card para cada post", () => {
    state.contents = [post, { ...post, id: "7c1d3b5f-0e2a-4d63-9b68-1a7b3e0d2f22", slug: "o-que-e-um-prd", title: "O que é um PRD?", category: "IA" }];
    render(<MemoryRouter><Blog /></MemoryRouter>);
    const links = screen.getAllByRole("link", { name: /Ler artigo/ });
    expect(links.map((a) => a.getAttribute("href"))).toEqual(["/blog/dia-08-revisao-geral", "/blog/o-que-e-um-prd"]);
    links.forEach((a) => expect(a).toHaveClass("media-card"));
  });
});

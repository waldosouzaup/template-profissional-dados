import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import ProjectDetail from "@/pages/ProjectDetail";

const s = vi.hoisted(() => {
  const base = {
    tags: [] as string[], premises: [], strategy: [], insights: [], results: [], nextSteps: [], stats: [], galleryImages: [] as string[],
    businessProblemImage: "", contextImage: "", premisesImage: "", strategyImage: "", resultsImage: "", nextStepsImage: "",
    demoUrl: "", githubUrl: "", link: "", coverImage: "", shortDescription: "", description: "", businessProblem: "", content: "",
  };
  const project = {
    ...base,
    id: "p1", slug: "trip-friends", title: "Trip Friends", category: "IA",
    shortDescription: "Sistema de reservas com **automação** de ponta a ponta.",
    description: "O grupo precisava divulgar roteiros e gerenciar clientes.",
    businessProblem: "O grupo precisava divulgar roteiros e gerenciar clientes.",
    content: [
      "## 1. Problema de Negócio", "", "O cadastro usa `supabase` como banco.", "",
      "| Etapa | Ferramenta |", "| --- | --- |", "| Reserva | `n8n` |", "",
      "![Painel administrativo](https://example.com/painel.png)", "",
      "## 2. Solução", "", "```bash", "npm run build", "```",
    ].join("\n"),
    coverImage: "https://example.com/capa.png",
    tags: ["Supabase", "InfinityPay", "Resend"],
    demoUrl: "https://trip.example.com", githubUrl: "https://github.com/waldo/trip", link: "https://trip.example.com",
    premises: ["Fluxo totalmente automatizado"], results: ["Organiza informações: Resultado"],
    stats: [{ label: "Resultado", value: "Organiza informações" }],
    businessProblemImage: "https://example.com/problema.png", strategyImage: "https://example.com/estrategia.png",
    galleryImages: ["https://example.com/galeria-1.png"],
  };
  const other = (id: string, category: string) => ({ ...base, id, slug: id, title: `Projeto ${id}`, category });
  return {
    project: project as typeof project,
    projects: [project, other("o1", "IA"), other("o2", "Web"), other("o3", "IA"), other("o4", "Dados")],
    profile: { id: "p", full_name: "Waldo Eller", current_focus: "Cloud/DevOps", avatar_url: "https://example.com/eu.jpg", bio_summary: "Profissional de TI." },
  };
});
vi.mock("@/hooks/useProjects", () => ({
  useProject: () => ({ data: s.project, isLoading: false }),
  useProjects: () => ({ data: s.projects, isLoading: false }),
}));
vi.mock("@/hooks/useProfile", () => ({ useProfiles: () => ({ data: [s.profile], isLoading: false }) }));

beforeAll(() => {
  window.scrollTo = vi.fn();
  Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
});
afterEach(cleanup);

const renderPage = () => render(
  <MemoryRouter initialEntries={["/projects/trip-friends"]}>
    <Routes><Route path="/projects/:idOrSlug" element={<ProjectDetail />} /></Routes>
  </MemoryRouter>,
);

describe("Página de projeto no padrão do post", () => {
  it("topo: volta ao portfólio, categoria, tempo de leitura, título e resumo", () => {
    renderPage();
    expect(screen.getByRole("link", { name: "Portfólio" })).toHaveAttribute("href", "/projects");
    const header = screen.getByRole("banner", { name: "Trip Friends" });
    expect(within(header).getByText("IA")).toBeInTheDocument();
    expect(within(header).getByText(/min de leitura$/)).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Trip Friends");
    expect(within(header).getByText("Sistema de reservas com automação de ponta a ponta.")).toBeInTheDocument();
  });

  it("topo: tecnologias e os links do projeto (também no celular)", () => {
    renderPage();
    const tech = screen.getByRole("list", { name: "Tecnologias" });
    expect(within(tech).getAllByRole("listitem").map((li) => li.textContent)).toEqual(["Supabase", "InfinityPay", "Resend"]);
    const header = screen.getByRole("banner", { name: "Trip Friends" });
    const demo = within(header).getByRole("link", { name: /Ver projeto online/ });
    expect(demo).toHaveAttribute("href", "https://trip.example.com");
    expect(demo).toHaveAttribute("target", "_blank");
    expect(within(header).getByRole("link", { name: /Ver código/ })).toHaveAttribute("href", "https://github.com/waldo/trip");
  });

  it("capa na proporção natural, sem título por cima", () => {
    renderPage();
    const cover = screen.getByRole("img", { name: "Trip Friends" });
    expect(cover.className).toMatch(/h-auto/);
    expect(cover.className).not.toMatch(/object-contain|max-h-/);
    expect(cover.closest("figure")!.querySelector("h1")).toBeNull();
  });

  it("texto com a mesma leitura do post: índice, código inline, tabela rolável e código com Copiar", () => {
    renderPage();
    expect(screen.getByRole("navigation", { name: "Neste projeto" })).toHaveClass("scrollbar-themed");
    const article = document.querySelector("article")!;
    expect(article).toHaveClass("max-w-3xl", "break-words");
    expect(within(article).getByText("supabase").tagName).toBe("CODE");
    expect(within(article).getByRole("table").parentElement).toHaveClass("overflow-x-auto");
    expect(within(article).getByText("bash")).toBeInTheDocument();
    expect(within(article).getByRole("button", { name: /Copiar/ })).toBeInTheDocument();
  });

  it("imagens do texto abrem ampliadas", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: "Ampliar imagem: Painel administrativo" }));
    expect(screen.getByRole("dialog", { name: "Imagem ampliada" })).toBeInTheDocument();
  });

  it("mostra as imagens das seções e da galeria, com legenda, ampliáveis", () => {
    renderPage();
    const images = screen.getByRole("region", { name: "Imagens do projeto" });
    expect(within(images).getAllByRole("figure").map((f) => f.textContent)).toEqual(["Problema de negócio", "Estratégia", "Galeria"]);
    fireEvent.click(within(images).getByRole("button", { name: "Ampliar imagem: Estratégia" }));
    const lightbox = screen.getByRole("dialog", { name: "Imagem ampliada" });
    expect(within(lightbox).getByRole("img", { name: "Estratégia" })).toHaveAttribute("src", "https://example.com/estrategia.png");
    expect(within(lightbox).getByText("2 / 3")).toBeInTheDocument();
  });

  it("não mostra mais as listas antigas nem as métricas repetidas", () => {
    renderPage();
    for (const text of ["Premissas", "Métricas", "Fluxo totalmente automatizado", "Organiza informações"]) {
      expect(screen.queryByText(text)).not.toBeInTheDocument();
    }
  });

  it("lateral: índice, links, autor e compartilhar", () => {
    renderPage();
    const aside = screen.getByRole("complementary");
    expect(within(aside).getByRole("link", { name: /Ver projeto online/ })).toHaveAttribute("href", "https://trip.example.com");
    expect(within(aside).getByText("Profissional de TI.")).toBeInTheDocument();
    expect(within(aside).getByRole("button", { name: "Copiar link" })).toBeInTheDocument();
  });

  it("outros projetos: primeiro os da mesma categoria, no card padrão", () => {
    renderPage();
    const related = screen.getByRole("region", { name: "Outros projetos" });
    const cards = within(related).getAllByRole("link", { name: /Ver projeto/ }).filter((a) => a.classList.contains("media-card"));
    expect(cards.map((a) => a.getAttribute("href"))).toEqual(["/projects/o1", "/projects/o3", "/projects/o2"]);
    expect(within(related).getByRole("link", { name: "Ver todos os projetos" })).toHaveAttribute("href", "/projects");
  });

  it("o convite de contato usa a cor do tema", () => {
    renderPage();
    const cta = screen.getByRole("link", { name: "Entrar em contato" });
    expect(cta).toHaveAttribute("href", "/contact");
    expect(cta).toHaveClass("bg-primary");
    expect(cta.getAttribute("style") ?? "").not.toMatch(/142/);
  });

  it("projeto sem texto em Markdown mostra o problema de negócio no lugar", () => {
    const original = s.project;
    s.project = { ...original, content: "" };
    renderPage();
    expect(within(document.querySelector("article")!).getByText("O grupo precisava divulgar roteiros e gerenciar clientes.")).toBeInTheDocument();
    s.project = original;
  });

  it("sem demo e sem código, o topo não mostra os botões", () => {
    const original = s.project;
    s.project = { ...original, demoUrl: "#", githubUrl: "", link: "#" };
    renderPage();
    expect(screen.queryByRole("link", { name: /Ver projeto online/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Ver código/ })).not.toBeInTheDocument();
    s.project = original;
  });

  it("imagens que não carregam somem, em vez de deixar caixas vazias", () => {
    renderPage();
    const images = screen.getByRole("region", { name: "Imagens do projeto" });
    fireEvent.error(images.querySelector('img[src="https://example.com/estrategia.png"]')!);
    expect(within(images).getAllByRole("figure").map((f) => f.textContent)).toEqual(["Problema de negócio", "Galeria"]);
    fireEvent.error(images.querySelector('img[src="https://example.com/problema.png"]')!);
    fireEvent.error(images.querySelector('img[src="https://example.com/galeria-1.png"]')!);
    expect(screen.queryByRole("region", { name: "Imagens do projeto" })).not.toBeInTheDocument();
  });

  it("títulos '#' do texto viram h2: a página tem um único h1, o do projeto", () => {
    const original = s.project;
    s.project = { ...original, content: "# Visão geral\n\nTexto.\n\n## Detalhes\n\nMais texto." };
    renderPage();
    expect(screen.getAllByRole("heading", { level: 1 }).map((h) => h.textContent)).toEqual(["Trip Friends"]);
    expect(screen.getByRole("heading", { level: 2, name: "Visão geral" })).toBeInTheDocument();
    s.project = original;
  });

  it("títulos com negrito aparecem limpos no índice e o link leva ao título", () => {
    const original = s.project;
    s.project = { ...original, content: "## **Comitês** de campanha\n\nTexto.\n\n## Grandes `eventos`\n\nMais." };
    renderPage();
    const toc = screen.getByRole("navigation", { name: "Neste projeto" });
    const links = within(toc).getAllByRole("link");
    expect(links.map((a) => a.textContent)).toEqual(["Comitês de campanha", "Grandes eventos"]);
    for (const link of links) {
      const id = link.getAttribute("href")!.slice(1);
      expect(id).not.toBe("");
      expect(document.getElementById(id)).toHaveTextContent(link.textContent!);
    }
    s.project = original;
  });
});

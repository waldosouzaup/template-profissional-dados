import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import About from "@/pages/About";

const data = vi.hoisted(() => ({
  profile: { id: "p", full_name: "Waldo Eller", about_title: "Dados que viram decisões", bio_detailed: "Trabalho com **infraestrutura Linux** há 20 anos." },
  education: [{ id: "e1", title: "Análise e Desenvolvimento de Sistemas", institution: "UNIP", period: "2020", display_order: 1 }],
  experiences: [{ id: "x1", type: "profissional", icon_type: "briefcase", title: "IT Support", institution: "High Speed", period: "2022 - 2024", display_order: 1 }],
  books: [{ id: "b1", title: "Storytelling com Dados", author: "Cole Knaflic" }],
  courses: [{ id: "c1", title: "LPI Linux Essentials", period: "2026", topics: [] }],
}));
vi.mock("@/hooks/useProfile", () => ({ useProfiles: () => ({ data: [data.profile], isLoading: false }) }));
vi.mock("@/hooks/useEducation", () => ({ useEducationList: () => ({ data: data.education, isLoading: false }) }));
vi.mock("@/hooks/useExperiences", () => ({ useExperiences: () => ({ data: data.experiences, isLoading: false }) }));
vi.mock("@/hooks/useBooks", () => ({ useBooks: () => ({ data: data.books, isLoading: false }) }));
vi.mock("@/hooks/useCourses", () => ({ useCourses: () => ({ data: data.courses, isLoading: false }) }));

beforeAll(() => { window.scrollTo = vi.fn(); });
afterEach(cleanup);

const renderAbout = () => render(<MemoryRouter><About /></MemoryRouter>);

describe("Página Sobre pública", () => {
  it("abre com o título definido no admin e a apresentação", () => {
    renderAbout();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Dados que viram decisões");
    expect(screen.getByText("infraestrutura Linux").tagName).toBe("STRONG");
  });

  it("segue a estrutura: Formação, Experiências, Livros e Cursos Complementares", () => {
    renderAbout();
    const sections = ["Formação Acadêmica", "Experiências Profissionais", "Livros", "Cursos Complementares"];
    const headings = screen.getAllByRole("heading").map((h) => h.textContent?.trim()).filter((t) => sections.includes(t!));
    expect(headings).toEqual(sections);
  });

  it("todas as seções usam o mesmo nível de cabeçalho", () => {
    renderAbout();
    for (const title of ["Formação Acadêmica", "Experiências Profissionais", "Livros", "Cursos Complementares"]) {
      expect(screen.getByRole("heading", { level: 2, name: title })).toBeInTheDocument();
    }
  });

  it("mostra período e instituição de formação e experiência", () => {
    renderAbout();
    expect(screen.getByRole("heading", { level: 3, name: "Análise e Desenvolvimento de Sistemas" })).toBeInTheDocument();
    expect(screen.getByText("UNIP")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "IT Support" })).toBeInTheDocument();
    expect(screen.getByText("2022 - 2024")).toBeInTheDocument();
  });

  it("não exibe mais a Jornada", () => {
    renderAbout();
    expect(screen.queryByRole("heading", { name: "Minha Jornada" })).not.toBeInTheDocument();
  });
});

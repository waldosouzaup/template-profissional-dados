import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SkillsSection from "@/components/portfolio/SkillsSection";
import CertificationsSection from "@/components/portfolio/CertificationsSection";
import { HOME_SECTION_DEFAULTS, TECHNOLOGY_CATEGORIES } from "@/lib/home-sections";

const state = vi.hoisted(() => ({
  technologies: { data: [], isLoading: false, isError: false },
  courses: { data: [], isLoading: false, isError: false },
  profiles: { data: [] },
}));
vi.mock("@/hooks/useTechnologies", () => ({ useTechnologies: () => state.technologies }));
vi.mock("@/hooks/useCourses", () => ({ useCourses: () => state.courses }));
vi.mock("@/hooks/useProfile", () => ({ useProfiles: () => state.profiles }));

afterEach(cleanup);
beforeEach(() => {
  state.technologies = { data: [], isLoading: false, isError: false };
  state.courses = { data: [], isLoading: false, isError: false };
  state.profiles = { data: [] };
});

describe("Seções da Home", () => {
  it("mantém as descrições e as quatro categorias mesmo sem cadastros", () => {
    render(<><SkillsSection /><CertificationsSection /></>);
    expect(screen.getByText(HOME_SECTION_DEFAULTS.skills_description)).toBeInTheDocument();
    expect(screen.getByText(HOME_SECTION_DEFAULTS.certifications_description)).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 3 }).map((node) => node.textContent)).toEqual([...TECHNOLOGY_CATEGORIES]);
    expect(screen.getByText("Nenhuma certificação publicada no momento.")).toBeInTheDocument();
  });

  it("agrupa pela categoria salva e preserva tecnologias antigas sem categoria", () => {
    state.technologies.data = [
      { id: "1", title: "Spark", category: TECHNOLOGY_CATEGORIES[0], items: ["PySpark"] },
      { id: "2", title: "Airflow", category: TECHNOLOGY_CATEGORIES[1] },
      { id: "3", title: "Docker", category: TECHNOLOGY_CATEGORIES[2] },
      { id: "4", title: "Excel" },
    ];
    render(<SkillsSection />);
    ["Spark", "Airflow", "Docker", "Excel"].forEach((title, index) => {
      const group = screen.getByRole("heading", { name: TECHNOLOGY_CATEGORIES[index] }).parentElement!;
      expect(within(group).getByRole("heading", { name: title })).toBeInTheDocument();
    });
  });

  it("usa os títulos e descrições configurados no perfil", () => {
    state.profiles.data = [{ skills_title: "Minha stack", skills_description: "Ferramentas de trabalho", certifications_title: "Credenciais", certifications_description: "Aprendizado contínuo" }];
    render(<><SkillsSection /><CertificationsSection /></>);
    expect(screen.getByRole("heading", { name: "Minha stack" })).toBeInTheDocument();
    expect(screen.getByText("Ferramentas de trabalho")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Credenciais" })).toBeInTheDocument();
    expect(screen.getByText("Aprendizado contínuo")).toBeInTheDocument();
  });

  it("publica apenas os cursos selecionados e mostra o link do certificado", () => {
    state.courses.data = [
      { id: "1", title: "Certificação Cloud", show_on_home: true, certificate_url: "https://example.com/certificate.png", topics: ["Cloud"] },
      { id: "2", title: "Curso oculto", show_on_home: false },
      { id: "3", title: "Curso antigo" },
      { id: "4", title: "Certificação sem imagem", show_on_home: true },
    ];
    render(<CertificationsSection />);
    expect(screen.getByRole("heading", { name: "Certificação Cloud" })).toBeInTheDocument();
    expect(screen.queryByText("Curso oculto")).not.toBeInTheDocument();
    expect(screen.queryByText("Curso antigo")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ver certificado: Certificação Cloud" })).toHaveAttribute("href", "https://example.com/certificate.png");
    expect(screen.getByRole("heading", { name: "Certificação sem imagem" })).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("diferencia carregamento, falhas e listas vazias", () => {
    state.technologies.isLoading = true;
    state.courses.isError = true;
    render(<><SkillsSection /><CertificationsSection /></>);
    expect(screen.getByRole("status")).toHaveTextContent("Carregando tecnologias");
    expect(screen.getByRole("alert")).toHaveTextContent("Não foi possível carregar as certificações.");
    expect(screen.queryByText("Nenhuma certificação publicada no momento.")).not.toBeInTheDocument();
  });
});

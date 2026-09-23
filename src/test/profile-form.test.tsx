import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import ProfileForm from "@/pages/admin/ProfileForm";

const mocks = vi.hoisted(() => ({
  updateProfile: vi.fn(),
  profile: { id: "profile", full_name: "Waldo Eller", phone: "(31) 9 8844-7394", hero_title: "Infraestrutura Linux e", stat_1_number: "+15" },
}));
vi.mock("@/hooks/useProfile", () => ({
  useProfiles: () => ({ data: [mocks.profile], isLoading: false, updateProfile: mocks.updateProfile, isUpdating: false }),
}));
vi.mock("@/hooks/useTechnologies", () => ({ useTechnologies: () => ({ data: [], isLoading: false }) }));
vi.mock("@/hooks/useCourses", () => ({ useCourses: () => ({ data: [], isLoading: false }) }));
vi.mock("@/components/admin/ImageUpload", () => ({ ImageUpload: () => null }));

beforeAll(() => { Element.prototype.scrollIntoView = vi.fn(); });
beforeEach(() => vi.clearAllMocks());
afterEach(cleanup);

const renderForm = () => render(<MemoryRouter><ProfileForm /></MemoryRouter>);

describe("Página Perfil (Home) no admin", () => {
  it("organiza o formulário em grupos e seções hierárquicas", () => {
    renderForm();
    expect(screen.getByRole("heading", { level: 1, name: "Perfil (Home)" })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual([
      "Identidade", "Página inicial", "Contato",
    ]);
    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual([
      "Perfil", "Marca", "Destaque (Hero)", "Skills & Tecnologias", "Certificações", "Dados de contato", "Formulário de contato",
    ]);
  });

  it("todos os campos de texto têm rótulo associado", () => {
    renderForm();
    for (const label of [
      "Nome completo", "Localização", "Ícone da navbar (fallback)",
      "Título principal", "Foco atual (destaque em verde)", "Bio resumida", "Link do CV (PDF)",
      "Título de Skills", "Descrição de Skills", "Título de Certificações", "Descrição de Certificações",
      "Telefone", "E-mail", "Chave de acesso Web3Forms",
    ]) {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    }
  });

  it("não mostra mais os campos de estatísticas e frase do Hero, que saíram do site", () => {
    renderForm();
    expect(screen.queryByText(/Estatística/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Efeito de Risco/)).not.toBeInTheDocument();
  });

  it("o índice lateral aponta para cada seção existente", () => {
    renderForm();
    const index = screen.getByRole("navigation", { name: "Seções do perfil" });
    const links = within(index).getAllByRole("link");
    expect(links).toHaveLength(7);
    for (const link of links) {
      expect(document.getElementById(link.getAttribute("href")!.slice(1))).not.toBeNull();
    }
    fireEvent.click(links[2]);
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  });

  it("salva os campos editados sem apagar os dados antigos do perfil", async () => {
    renderForm();
    fireEvent.change(screen.getByLabelText("Telefone"), { target: { value: "(61) 9 9999-0000" } });
    fireEvent.change(screen.getByLabelText("Título principal"), { target: { value: "Cloud & DevOps" } });
    fireEvent.click(screen.getByRole("button", { name: "Salvar Alterações" }));
    await waitFor(() => expect(mocks.updateProfile).toHaveBeenCalledWith(expect.objectContaining({
      id: "profile", phone: "(61) 9 9999-0000", hero_title: "Cloud & DevOps", stat_1_number: "+15",
    })));
  });
});

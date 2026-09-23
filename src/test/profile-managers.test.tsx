import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import ProfileForm from "@/pages/admin/ProfileForm";

const mocks = vi.hoisted(() => ({
  updateProfile: vi.fn(),
  // Stable reference: the real query cache returns the same object between renders.
  profile: { id: "profile", full_name: "Waldo" },
  createTechnology: vi.fn(), updateTechnology: vi.fn(), deleteTechnology: vi.fn(),
  createCourse: vi.fn(), updateCourse: vi.fn(), deleteCourse: vi.fn(),
  technologies: [
    { id: "t1", title: "Azure", category: "Cloud & Big Data", icon: "azure", color: "text-primary", items: [] },
    { id: "t2", title: "Python", category: "Background & Outros", icon: "python", color: "text-primary", items: [] },
  ],
  courses: [
    { id: "c1", title: "LPI Linux Essentials", period: "2026", show_on_home: false, topics: [] },
    { id: "c2", title: "AWS Cloud Practitioner", period: "2025", show_on_home: true, topics: [] },
  ],
}));
vi.mock("@/hooks/useProfile", () => ({
  useProfiles: () => ({ data: [mocks.profile], isLoading: false, updateProfile: mocks.updateProfile, isUpdating: false }),
}));
vi.mock("@/hooks/useTechnologies", () => ({
  useTechnologies: () => ({
    data: mocks.technologies, isLoading: false,
    createTechnology: mocks.createTechnology, updateTechnology: mocks.updateTechnology, deleteTechnology: mocks.deleteTechnology,
  }),
}));
vi.mock("@/hooks/useCourses", () => ({
  useCourses: () => ({
    data: mocks.courses, isLoading: false,
    createCourse: mocks.createCourse, updateCourse: mocks.updateCourse, deleteCourse: mocks.deleteCourse,
  }),
}));
vi.mock("@/components/admin/ImageUpload", () => ({ ImageUpload: () => null }));

beforeAll(() => { Element.prototype.scrollIntoView = vi.fn(); });
beforeEach(() => vi.clearAllMocks());
afterEach(cleanup);

const renderProfile = () => render(<MemoryRouter><ProfileForm /></MemoryRouter>);
const section = (id: string) => within(document.getElementById(id)!);

describe("Skills dentro do Perfil (Home)", () => {
  it("lista as skills agrupadas por categoria", () => {
    renderProfile();
    const cloud = section("skills").getByRole("heading", { name: /Cloud & Big Data/ }).parentElement!;
    expect(within(cloud).getByText("Azure")).toBeInTheDocument();
    const outros = section("skills").getByRole("heading", { name: /Background & Outros/ }).parentElement!;
    expect(within(outros).getByText("Python")).toBeInTheDocument();
  });

  it("cadastra uma skill pela janela sem salvar o perfil", async () => {
    renderProfile();
    fireEvent.click(screen.getByRole("button", { name: "Adicionar skill" }));
    const dialog = screen.getByRole("dialog", { name: "Nova skill" });
    fireEvent.change(within(dialog).getByLabelText("Título"), { target: { value: "Kubernetes" } });
    fireEvent.change(within(dialog).getByLabelText("Categoria na Home"), { target: { value: "Qualidade, DevOps & IA" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Salvar" }));
    await waitFor(() => expect(mocks.createTechnology).toHaveBeenCalledWith(expect.objectContaining({ title: "Kubernetes", category: "Qualidade, DevOps & IA" })));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(mocks.updateProfile).not.toHaveBeenCalled();
  });

  it("edita uma skill existente", async () => {
    renderProfile();
    fireEvent.click(screen.getByRole("button", { name: "Editar Azure" }));
    const dialog = screen.getByRole("dialog", { name: "Editar skill" });
    expect(within(dialog).getByLabelText("Título")).toHaveValue("Azure");
    fireEvent.change(within(dialog).getByLabelText("Título"), { target: { value: "Microsoft Azure" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Salvar" }));
    await waitFor(() => expect(mocks.updateTechnology).toHaveBeenCalledWith(expect.objectContaining({ id: "t1", title: "Microsoft Azure" })));
  });

  it("exclui uma skill só depois de confirmar", async () => {
    renderProfile();
    fireEvent.click(screen.getByRole("button", { name: "Excluir Azure" }));
    expect(mocks.deleteTechnology).not.toHaveBeenCalled();
    fireEvent.click(within(screen.getByRole("alertdialog")).getByRole("button", { name: "Excluir" }));
    await waitFor(() => expect(mocks.deleteTechnology).toHaveBeenCalledWith("t1"));
  });
});

describe("Certificações dentro do Perfil (Home)", () => {
  it("mostra todos os cursos e liga um deles na Home", async () => {
    renderProfile();
    const lpi = screen.getByRole("switch", { name: "Exibir LPI Linux Essentials na Home" });
    expect(lpi).not.toBeChecked();
    expect(screen.getByRole("switch", { name: "Exibir AWS Cloud Practitioner na Home" })).toBeChecked();
    fireEvent.click(lpi);
    await waitFor(() => expect(mocks.updateCourse).toHaveBeenCalledWith(expect.objectContaining({ id: "c1", show_on_home: true })));
    expect(mocks.updateProfile).not.toHaveBeenCalled();
  });

  it("cadastra uma certificação já marcada para a Home", async () => {
    renderProfile();
    fireEvent.click(screen.getByRole("button", { name: "Adicionar certificação" }));
    const dialog = screen.getByRole("dialog", { name: "Nova certificação" });
    expect(within(dialog).getByRole("checkbox", { name: "Exibir em Certificações na Home" })).toBeChecked();
    fireEvent.change(within(dialog).getByLabelText("Título"), { target: { value: "CKA" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Salvar" }));
    await waitFor(() => expect(mocks.createCourse).toHaveBeenCalledWith(expect.objectContaining({ title: "CKA", show_on_home: true })));
    expect(mocks.updateProfile).not.toHaveBeenCalled();
  });

  it("avisa que excluir a certificação também a remove da página Sobre", async () => {
    renderProfile();
    fireEvent.click(screen.getByRole("button", { name: "Excluir AWS Cloud Practitioner" }));
    const confirm = screen.getByRole("alertdialog");
    expect(confirm).toHaveTextContent("página Sobre");
    fireEvent.click(within(confirm).getByRole("button", { name: "Excluir" }));
    await waitFor(() => expect(mocks.deleteCourse).toHaveBeenCalledWith("c2"));
  });
});

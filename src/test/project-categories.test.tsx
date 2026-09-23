import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AdminProjectForm from "@/pages/admin/ProjectForm";
import ProjectsGallery from "@/pages/ProjectsGallery";

type Category = { id: string; name: string; icon: string; display_order: number };
const s = vi.hoisted(() => ({
  categories: [] as Category[],
  createCategory: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
  updateProject: vi.fn(),
  project: {
    id: "p1", slug: "painel", title: "Painel", category: "Dados", tags: [], stack: [], galleryImages: [],
    premises: [], strategy: [], insights: [], results: [], nextSteps: [],
  },
  projects: [
    { id: "a", slug: "a", title: "Projeto Dados", category: "Dados", tags: [], coverImage: "" },
    { id: "b", slug: "b", title: "Projeto SaaS", category: "SaaS", tags: [], coverImage: "" },
  ],
}));
const baseCategories = (): Category[] => [
  { id: "c1", name: "Dados", icon: "Database", display_order: 1 },
  { id: "c2", name: "Web", icon: "Globe", display_order: 2 },
  { id: "c3", name: "SaaS", icon: "FolderOpen", display_order: 100 },
  { id: "c4", name: "Vazia", icon: "Cloud", display_order: 101 },
];

vi.mock("@/hooks/useProjectCategories", () => ({
  useProjectCategories: () => ({
    data: s.categories, isLoading: false,
    createCategory: s.createCategory, updateCategory: s.updateCategory, deleteCategory: s.deleteCategory,
  }),
}));
vi.mock("@/hooks/useProjects", () => ({
  useProjects: () => ({ data: s.projects, isLoading: false, createProject: vi.fn(), updateProject: s.updateProject }),
  useProject: () => ({ data: s.project, isLoading: false }),
}));
vi.mock("@/hooks/useStorage", () => ({ useStorage: () => ({ uploadImage: vi.fn(), isUploading: false }) }));

beforeEach(() => {
  vi.clearAllMocks();
  s.categories = baseCategories();
  s.createCategory.mockImplementation(async (c: Omit<Category, "id">) => {
    const created = { ...c, id: "new" };
    s.categories = [...s.categories, created];
    return created;
  });
  s.updateCategory.mockImplementation(async (c: Category) => c);
});
afterEach(cleanup);

const renderForm = () => render(
  <MemoryRouter initialEntries={["/admin/projects/p1"]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Routes><Route path="/admin/projects/:id" element={<AdminProjectForm />} /></Routes>
  </MemoryRouter>,
);
const categorySelect = () => screen.getByLabelText("Categoria*") as HTMLSelectElement;
const openManager = () => {
  fireEvent.click(screen.getByRole("button", { name: "Gerenciar categorias" }));
  return screen.getByRole("dialog", { name: "Categorias de projeto" });
};

describe("Categorias no Editar Projeto", () => {
  it("lista as categorias cadastradas no banco", () => {
    renderForm();
    const options = within(categorySelect()).getAllByRole("option").map((o) => o.textContent);
    expect(options).toEqual(["Selecione uma categoria", "Dados", "Web", "SaaS", "Vazia"]);
    expect(categorySelect()).toHaveValue("Dados");
  });

  it("adiciona uma categoria nova e já a seleciona no projeto", async () => {
    renderForm();
    const dialog = openManager();
    fireEvent.change(within(dialog).getByLabelText("Nova categoria"), { target: { value: "Automação" } });
    fireEvent.change(within(dialog).getByLabelText("Ícone da nova categoria"), { target: { value: "Workflow" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Adicionar" }));
    await waitFor(() => expect(s.createCategory).toHaveBeenCalledWith({ name: "Automação", icon: "Workflow", display_order: 102 }));
    await waitFor(() => expect(categorySelect()).toHaveValue("Automação"));
  });

  it("renomeia a categoria do projeto e o formulário acompanha", async () => {
    renderForm();
    const dialog = openManager();
    fireEvent.change(within(dialog).getByLabelText("Nome da categoria Dados"), { target: { value: "Dados & BI" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Salvar Dados" }));
    await waitFor(() => expect(s.updateCategory).toHaveBeenCalledWith(expect.objectContaining({ id: "c1", name: "Dados & BI" })));
    s.categories = s.categories.map((c) => (c.id === "c1" ? { ...c, name: "Dados & BI" } : c));
    fireEvent.click(within(dialog).getByRole("button", { name: "Concluir" }));
    await waitFor(() => expect(categorySelect()).toHaveValue("Dados & BI"));
  });

  it("explica quando a categoria não pode ser excluída por estar em uso", async () => {
    s.deleteCategory.mockRejectedValue({ code: "23001" });
    renderForm();
    const dialog = openManager();
    fireEvent.click(within(dialog).getByRole("button", { name: "Excluir Web" }));
    fireEvent.click(within(screen.getByRole("alertdialog")).getByRole("button", { name: "Excluir" }));
    expect(await within(dialog).findByRole("alert")).toHaveTextContent("“Web” tem projetos vinculados");
  });
});

describe("Galeria de projetos", () => {
  it("mostra abas só das categorias com projetos e filtra por elas", () => {
    render(<MemoryRouter><ProjectsGallery /></MemoryRouter>);
    const tabs = screen.getAllByRole("button").map((b) => b.textContent?.trim());
    expect(tabs).toEqual(["Todos", "Dados", "SaaS"]);
    fireEvent.click(screen.getByRole("button", { name: "SaaS" }));
    expect(screen.getByRole("heading", { name: "Projeto SaaS" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Projeto Dados" })).not.toBeInTheDocument();
  });
});

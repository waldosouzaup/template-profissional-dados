import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AdminProjectForm from "@/pages/admin/ProjectForm";

const mocks = vi.hoisted(() => ({
  createProject: vi.fn(), updateProject: vi.fn(),
  existing: { id: "p1", slug: "rifa-online", title: "Rifa Online", category: "ia", tags: [], stack: [], galleryImages: [], premises: [], strategy: [], insights: [], results: [], nextSteps: [] },
}));
vi.mock("@/hooks/useProjectCategories", () => ({
  useProjectCategories: () => ({
    data: [{ id: "c1", name: "Dados", icon: "Database", display_order: 1 }, { id: "c3", name: "IA", icon: "Brain", display_order: 3 }],
    isLoading: false,
  }),
}));
vi.mock("@/hooks/useProjects", () => ({
  useProjects: () => ({ createProject: mocks.createProject, updateProject: mocks.updateProject }),
  useProject: (id?: string) => ({ data: id ? mocks.existing : undefined, isLoading: false }),
}));
vi.mock("@/components/admin/ImageUpload", () => ({ ImageUpload: () => null }));

afterEach(cleanup);
beforeEach(() => vi.clearAllMocks());

const renderForm = (path: string) => render(
  <MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Routes>
      <Route path="/admin/projects/new" element={<AdminProjectForm />} />
      <Route path="/admin/projects/:id" element={<AdminProjectForm />} />
      <Route path="*" element={<p>Salvo</p>} />
    </Routes>
  </MemoryRouter>,
);

describe("Slug no formulário de projetos", () => {
  it("sugere o slug a partir do título em um projeto novo e o envia ao salvar", async () => {
    renderForm("/admin/projects/new");
    fireEvent.change(screen.getByPlaceholderText("Ex: NoCode Match"), { target: { value: "Painel de Vendas 2.0" } });
    expect(screen.getByLabelText("URL amigável (slug)")).toHaveValue("painel-de-vendas-2-0");
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "Dados" } });
    fireEvent.click(screen.getAllByRole("button", { name: "Criar Projeto" })[0]);
    await waitFor(() => expect(mocks.createProject).toHaveBeenCalledWith(expect.objectContaining({ slug: "painel-de-vendas-2-0" })));
  });

  it("para de sugerir depois que o slug é editado manualmente", () => {
    renderForm("/admin/projects/new");
    fireEvent.change(screen.getByLabelText("URL amigável (slug)"), { target: { value: "meu-slug" } });
    fireEvent.change(screen.getByPlaceholderText("Ex: NoCode Match"), { target: { value: "Outro Título" } });
    expect(screen.getByLabelText("URL amigável (slug)")).toHaveValue("meu-slug");
  });

  it("mantém o slug de um projeto existente quando o título muda", async () => {
    renderForm("/admin/projects/p1");
    await waitFor(() => expect(screen.getByLabelText("URL amigável (slug)")).toHaveValue("rifa-online"));
    fireEvent.change(screen.getByPlaceholderText("Ex: NoCode Match"), { target: { value: "Rifa Online 2" } });
    expect(screen.getByLabelText("URL amigável (slug)")).toHaveValue("rifa-online");
  });
});

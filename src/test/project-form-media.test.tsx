import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AdminProjectForm from "@/pages/admin/ProjectForm";

const SECTION_IMAGES = ["Img: Business Problem", "Img: Context", "Img: Premises", "Img: Strategy", "Img: Results", "Img: Next Steps"];

const mocks = vi.hoisted(() => ({
  updateProject: vi.fn(),
  project: {
    id: "p1", slug: "rifa-online", title: "Rifa Online", category: "IA", tags: [], stack: [], galleryImages: [],
    premises: [], strategy: [], insights: [], nextSteps: [],
    results: ["+15%: Eficiência", "-30%: Custos", "2x: Velocidade", "99%: Uptime", "Entrega no prazo"],
    stats: [{ value: "+15%", label: "Eficiência" }],
    contextImage: "https://example.com/context.png",
  },
}));
vi.mock("@/hooks/useProjects", () => ({
  useProjects: () => ({ createProject: vi.fn(), updateProject: mocks.updateProject }),
  useProject: () => ({ data: mocks.project, isLoading: false }),
}));
vi.mock("@/hooks/useStorage", () => ({ useStorage: () => ({ uploadImage: vi.fn(), isUploading: false }) }));

beforeEach(() => vi.clearAllMocks());
afterEach(cleanup);

const renderEdit = () => render(
  <MemoryRouter initialEntries={["/admin/projects/p1"]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Routes>
      <Route path="/admin/projects/:id" element={<AdminProjectForm />} />
      <Route path="*" element={<p>Salvo</p>} />
    </Routes>
  </MemoryRouter>,
);

describe("Editar projeto: imagens das seções", () => {
  it("não tem mais a seção Métricas Visuais", () => {
    renderEdit();
    expect(screen.queryByRole("heading", { name: "Métricas Visuais" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Adicionar Métrica/ })).not.toBeInTheDocument();
  });

  it("agrupa as seis imagens das seções com upload, sem campo de URL", () => {
    renderEdit();
    const section = screen.getByRole("region", { name: "Imagens das Seções" });
    for (const label of SECTION_IMAGES) expect(within(section).getByText(label)).toBeInTheDocument();
    expect(within(section).queryByPlaceholderText("Ou cole a URL da imagem aqui...")).not.toBeInTheDocument();
    expect(within(section).getAllByText("Clique para fazer upload")).toHaveLength(5);
    expect(within(section).getByAltText("Img: Context")).toHaveAttribute("src", "https://example.com/context.png");
  });

  it("avisa quando a imagem salva não carrega", () => {
    renderEdit();
    const section = screen.getByRole("region", { name: "Imagens das Seções" });
    fireEvent.error(within(section).getByAltText("Img: Context"));
    expect(within(section).getByText("Imagem não encontrada")).toBeInTheDocument();
    expect(within(section).getAllByRole("button", { name: "Trocar imagem" }).length).toBeGreaterThan(0);
  });

  it("a capa continua aceitando upload ou URL", () => {
    renderEdit();
    expect(screen.getAllByPlaceholderText("Ou cole a URL da imagem aqui...")).toHaveLength(1);
  });

  it("salvar preserva os resultados existentes do projeto", async () => {
    renderEdit();
    fireEvent.click(screen.getAllByRole("button", { name: "Salvar Alterações" })[0]);
    await waitFor(() => expect(mocks.updateProject).toHaveBeenCalledWith(expect.objectContaining({
      id: "p1", results: mocks.project.results,
    })));
  });
});

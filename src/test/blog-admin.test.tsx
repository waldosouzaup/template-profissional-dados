import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ContentsDashboard from "@/pages/admin/ContentsDashboard";
import ContentForm from "@/pages/admin/ContentForm";

const s = vi.hoisted(() => ({
  trails: [
    { id: "ia", name: "IA", slug: "ia", description: "", display_order: 1, image_url: null },
    { id: "linux", name: "Linux Essentials 30 dias", slug: "linux-essentials-30-dias", description: "Desafio diário.", display_order: 2, image_url: null },
  ],
  posts: [
    { id: "d1", title: "Dia 01/30", slug: "dia-01", trail_id: "linux", trail_position: 1 },
    { id: "d2", title: "Dia 02/30", slug: "dia-02", trail_id: "linux", trail_position: 2 },
    { id: "prd", title: "O que é um PRD?", slug: "prd", trail_id: "ia", trail_position: 1 },
  ] as Record<string, unknown>[],
  editing: null as Record<string, unknown> | null,
  createTrail: vi.fn(),
  updateTrail: vi.fn(),
  deleteTrail: vi.fn(),
  createContent: vi.fn(),
  updateContent: vi.fn(),
}));
vi.mock("@/hooks/useBlogTrails", () => ({
  useBlogTrails: () => ({
    data: s.trails, isLoading: false, isSaving: false,
    createTrail: s.createTrail, updateTrail: s.updateTrail, deleteTrail: s.deleteTrail,
  }),
}));
vi.mock("@/hooks/useContents", () => ({
  useContents: () => ({
    data: s.posts, isLoading: false, createContent: s.createContent, updateContent: s.updateContent, deleteContent: vi.fn(),
  }),
  useContent: () => ({ data: s.editing, isLoading: false }),
}));
vi.mock("@/hooks/useStorage", () => ({ useStorage: () => ({ uploadImage: vi.fn(), isUploading: false }) }));

beforeEach(() => {
  vi.clearAllMocks();
  s.editing = null;
});
afterEach(cleanup);

const renderAt = (path: string) => render(
  <MemoryRouter initialEntries={[path]}>
    <Routes>
      <Route path="/admin/contents" element={<ContentsDashboard />} />
      <Route path="/admin/contents/new" element={<ContentForm />} />
      <Route path="/admin/contents/:id" element={<ContentForm />} />
    </Routes>
  </MemoryRouter>,
);

describe("Admin: trilhas de estudo", () => {
  it("lista as trilhas com endereço e quantidade de artigos", () => {
    renderAt("/admin/contents");
    expect(screen.getByRole("heading", { level: 1, name: "Trilhas" })).toBeInTheDocument();
    expect(screen.getByText("/blog/trilha/linux-essentials-30-dias · 2 artigos")).toBeInTheDocument();
    expect(screen.getByText("/blog/trilha/ia · 1 artigo")).toBeInTheDocument();
  });

  it("a tabela de artigos mostra a trilha e a etapa de cada um", () => {
    renderAt("/admin/contents");
    const row = screen.getByRole("cell", { name: "Dia 02/30" }).closest("tr")!;
    expect(within(row).getByText("Linux Essentials 30 dias")).toBeInTheDocument();
    expect(within(row).getByText("Etapa 02")).toBeInTheDocument();
  });

  it("cria uma trilha com endereço gerado a partir do nome, no fim da ordem", async () => {
    s.createTrail.mockResolvedValue({});
    renderAt("/admin/contents");
    fireEvent.click(screen.getByRole("button", { name: /Nova trilha/ }));
    const dialog = screen.getByRole("dialog", { name: "Nova trilha de estudo" });
    fireEvent.change(within(dialog).getByLabelText("Nome da trilha"), { target: { value: "Docker do Zero" } });
    expect(within(dialog).getByText("docker-do-zero")).toBeInTheDocument();
    fireEvent.change(within(dialog).getByLabelText("Descrição"), { target: { value: "Containers na prática." } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Salvar" }));
    await waitFor(() => expect(s.createTrail).toHaveBeenCalledWith({
      name: "Docker do Zero", slug: "docker-do-zero", description: "Containers na prática.", image_url: null, display_order: 3,
    }));
  });

  it("edita uma trilha mantendo o endereço atual", async () => {
    s.updateTrail.mockResolvedValue({});
    renderAt("/admin/contents");
    fireEvent.click(screen.getByRole("button", { name: "Editar Linux Essentials 30 dias" }));
    const dialog = screen.getByRole("dialog", { name: "Editar trilha de estudo" });
    fireEvent.change(within(dialog).getByLabelText("Nome da trilha"), { target: { value: "Linux Essentials (LPI 010)" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Salvar" }));
    await waitFor(() => expect(s.updateTrail).toHaveBeenCalledWith(expect.objectContaining({
      id: "linux", name: "Linux Essentials (LPI 010)", slug: "linux-essentials-30-dias",
    })));
  });

  it("explica quando a trilha não pode ser excluída por ter artigos", async () => {
    s.deleteTrail.mockRejectedValue({ code: "23001", message: "restrict" });
    renderAt("/admin/contents");
    fireEvent.click(screen.getByRole("button", { name: "Excluir IA" }));
    fireEvent.click(screen.getByRole("button", { name: "Excluir" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("“IA” tem artigos vinculados. Mova esses artigos para outra trilha antes de excluir.");
  });
});

describe("Admin: artigo dentro de uma trilha", () => {
  const trailSelect = () => screen.getByLabelText("Trilha de estudo") as HTMLSelectElement;
  const position = () => screen.getByLabelText("Posição na trilha") as HTMLInputElement;

  it("novo artigo: escolher a trilha sugere a próxima posição livre", async () => {
    s.createContent.mockResolvedValue({});
    renderAt("/admin/contents/new");
    expect(position()).toBeDisabled();
    fireEvent.change(trailSelect(), { target: { value: "linux" } });
    expect(position()).toHaveValue(3);
    fireEvent.change(screen.getByPlaceholderText("Título do post"), { target: { value: "Dia 03/30 - Permissões" } });
    fireEvent.click(screen.getByRole("button", { name: "Salvar Conteúdo" }));
    await waitFor(() => expect(s.createContent).toHaveBeenCalledWith(expect.objectContaining({
      title: "Dia 03/30 - Permissões", slug: "dia-03-30-permissoes", trail_id: "linux", trail_position: 3,
    })));
  });

  it("editar: mantém a posição, e trocar de trilha coloca o artigo no fim da nova", async () => {
    s.editing = s.posts[0];
    s.updateContent.mockResolvedValue({});
    renderAt("/admin/contents/d1");
    await waitFor(() => expect(trailSelect()).toHaveValue("linux"));
    expect(position()).toHaveValue(1);
    fireEvent.change(trailSelect(), { target: { value: "ia" } });
    expect(position()).toHaveValue(2);
    fireEvent.change(trailSelect(), { target: { value: "linux" } });
    expect(position()).toHaveValue(1);
    fireEvent.change(position(), { target: { value: "5" } });
    fireEvent.click(screen.getByRole("button", { name: "Salvar Conteúdo" }));
    await waitFor(() => expect(s.updateContent).toHaveBeenCalledWith(expect.objectContaining({ id: "d1", trail_id: "linux", trail_position: 5 })));
  });

  it("sem trilha: salva o artigo fora de qualquer trilha", async () => {
    s.editing = s.posts[1];
    s.updateContent.mockResolvedValue({});
    renderAt("/admin/contents/d2");
    await waitFor(() => expect(trailSelect()).toHaveValue("linux"));
    fireEvent.change(trailSelect(), { target: { value: "" } });
    expect(position()).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Salvar Conteúdo" }));
    await waitFor(() => expect(s.updateContent).toHaveBeenCalledWith(expect.objectContaining({ id: "d2", trail_id: null, trail_position: null })));
  });
});

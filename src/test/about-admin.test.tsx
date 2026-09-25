import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import AboutAdmin from "@/pages/admin/AboutAdmin";
import { legacyAboutRoutes } from "@/pages/admin/about-sections";
import AdminLayout from "@/components/admin/AdminLayout";

const m = vi.hoisted(() => ({
  profile: { id: "p", full_name: "Waldo", about_title: "Título atual", bio_detailed: "Apresentação atual", phone: "123" },
  education: [{ id: "e1", title: "ADS", institution: "UNIP", period: "2020", display_order: 1 }],
  experiences: [{ id: "x1", type: "profissional", icon_type: "briefcase", title: "IT Support", institution: "High Speed", period: "2022 - 2024", display_order: 1 }],
  books: [{ id: "b1", title: "Storytelling com Dados", author: "Cole Knaflic" }],
  courses: [{ id: "c1", title: "LPI Linux Essentials", period: "2026", show_on_home: false, topics: [] }],
  booksLoading: false,
  updateProfile: vi.fn(),
  createEducation: vi.fn(), updateEducation: vi.fn(), deleteEducation: vi.fn(),
  createExperience: vi.fn(), updateExperience: vi.fn(), deleteExperience: vi.fn(),
  createBook: vi.fn(), updateBook: vi.fn(), deleteBook: vi.fn(),
  createCourse: vi.fn(), updateCourse: vi.fn(), deleteCourse: vi.fn(),
}));
vi.mock("@/hooks/useProfile", () => ({ useProfiles: () => ({ data: [m.profile], isLoading: false, updateProfile: m.updateProfile, isUpdating: false }) }));
vi.mock("@/hooks/useEducation", () => ({ useEducationList: () => ({ data: m.education, isLoading: false, createEducation: m.createEducation, updateEducation: m.updateEducation, deleteEducation: m.deleteEducation }) }));
vi.mock("@/hooks/useExperiences", () => ({ useExperiences: () => ({ data: m.experiences, isLoading: false, createExperience: m.createExperience, updateExperience: m.updateExperience, deleteExperience: m.deleteExperience }) }));
vi.mock("@/hooks/useBooks", () => ({ useBooks: () => ({ data: m.booksLoading ? undefined : m.books, isLoading: m.booksLoading, createBook: m.createBook, updateBook: m.updateBook, deleteBook: m.deleteBook }) }));
vi.mock("@/hooks/useCourses", () => ({ useCourses: () => ({ data: m.courses, isLoading: false, createCourse: m.createCourse, updateCourse: m.updateCourse, deleteCourse: m.deleteCourse }) }));
vi.mock("@/components/admin/ImageUpload", () => ({ ImageUpload: () => null }));
vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: async () => ({ data: { session: { user: { id: "admin", app_metadata: { role: "admin" } } } } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signOut: async () => {},
    },
  },
}));

beforeAll(() => { Element.prototype.scrollIntoView = vi.fn(); });
beforeEach(() => { vi.clearAllMocks(); m.booksLoading = false; });
afterEach(cleanup);

const LocationProbe = () => {
  const { pathname, hash } = useLocation();
  return <p data-testid="location">{pathname + hash}</p>;
};

const renderAdmin = (path: string) => render(
  <MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Routes>
      <Route path="/admin" element={<><AdminLayout /><LocationProbe /></>}>
        <Route path="about" element={<AboutAdmin />} />
        {legacyAboutRoutes()}
      </Route>
    </Routes>
  </MemoryRouter>,
);
const section = (id: string) => within(document.getElementById(id)!);

describe("Admin Sobre: página única na ordem da página pública", () => {
  it("apresenta as seções na mesma ordem da página Sobre", async () => {
    renderAdmin("/admin/about");
    expect(await screen.findByRole("heading", { level: 1, name: "Sobre" })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual([
      "Título e apresentação", "Formação Acadêmica", "Experiências Profissionais", "Livros", "Cursos Complementares",
    ]);
    const index = screen.getByRole("navigation", { name: "Seções da página Sobre" });
    expect(within(index).getAllByRole("link").map((a) => a.textContent)).toEqual([
      "Título e apresentação", "Formação Acadêmica", "Experiências Profissionais", "Livros", "Cursos Complementares",
    ]);
  });

  it("salva título e apresentação sem apagar o resto do perfil", async () => {
    renderAdmin("/admin/about");
    fireEvent.change(await screen.findByLabelText("Título da página"), { target: { value: "Novo título" } });
    fireEvent.change(screen.getByLabelText("Apresentação"), { target: { value: "Nova apresentação" } });
    fireEvent.click(screen.getByRole("button", { name: "Salvar título e apresentação" }));
    await waitFor(() => expect(m.updateProfile).toHaveBeenCalledWith(expect.objectContaining({
      id: "p", about_title: "Novo título", bio_detailed: "Nova apresentação", phone: "123",
    })));
  });

  it("cadastra formação acadêmica pela janela", async () => {
    renderAdmin("/admin/about");
    await screen.findByRole("heading", { level: 1, name: "Sobre" });
    expect(section("formacao").getByText("ADS")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Adicionar formação" }));
    const dialog = screen.getByRole("dialog", { name: "Nova formação" });
    fireEvent.change(within(dialog).getByLabelText("Curso"), { target: { value: "Engenharia de Dados" } });
    fireEvent.change(within(dialog).getByLabelText("Instituição"), { target: { value: "USP" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Salvar" }));
    await waitFor(() => expect(m.createEducation).toHaveBeenCalledWith(expect.objectContaining({ title: "Engenharia de Dados", institution: "USP" })));
  });

  it("edita e exclui experiências profissionais", async () => {
    renderAdmin("/admin/about");
    fireEvent.click(await screen.findByRole("button", { name: "Editar IT Support" }));
    const dialog = screen.getByRole("dialog", { name: "Editar experiência" });
    expect(within(dialog).getByLabelText("Empresa / Instituição")).toHaveValue("High Speed");
    fireEvent.change(within(dialog).getByLabelText("Cargo"), { target: { value: "IT Support N2" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Salvar" }));
    await waitFor(() => expect(m.updateExperience).toHaveBeenCalledWith(expect.objectContaining({ id: "x1", title: "IT Support N2" })));

    fireEvent.click(screen.getByRole("button", { name: "Excluir IT Support" }));
    fireEvent.click(within(screen.getByRole("alertdialog")).getByRole("button", { name: "Excluir" }));
    await waitFor(() => expect(m.deleteExperience).toHaveBeenCalledWith("x1"));
  });

  it("cadastra livros pela janela", async () => {
    renderAdmin("/admin/about");
    await screen.findByRole("heading", { level: 1, name: "Sobre" });
    expect(section("livros").getByText("Storytelling com Dados")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Adicionar livro" }));
    const dialog = screen.getByRole("dialog", { name: "Novo livro" });
    fireEvent.change(within(dialog).getByLabelText("Título"), { target: { value: "Clean Code" } });
    fireEvent.change(within(dialog).getByLabelText("Autor"), { target: { value: "Robert C. Martin" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Salvar" }));
    await waitFor(() => expect(m.createBook).toHaveBeenCalledWith(expect.objectContaining({ title: "Clean Code", author: "Robert C. Martin" })));
  });

  it("cursos complementares nascem fora da Home, mas podem ser destacados", async () => {
    renderAdmin("/admin/about");
    fireEvent.click(await screen.findByRole("button", { name: "Adicionar curso" }));
    const dialog = screen.getByRole("dialog", { name: "Novo curso" });
    expect(within(dialog).getByRole("checkbox", { name: "Exibir em Certificações na Home" })).not.toBeChecked();
    fireEvent.change(within(dialog).getByLabelText("Título"), { target: { value: "Docker Essentials" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Salvar" }));
    await waitFor(() => expect(m.createCourse).toHaveBeenCalledWith(expect.objectContaining({ title: "Docker Essentials", show_on_home: false })));
    expect(section("cursos").getByRole("switch", { name: "Exibir LPI Linux Essentials na Home" })).toBeInTheDocument();
  });

  it.each([
    ["/admin/education", "/admin/about#formacao"],
    ["/admin/experiences/x1", "/admin/about#experiencias"],
    ["/admin/books/new", "/admin/about#livros"],
    ["/admin/courses", "/admin/about#cursos"],
    ["/admin/journey", "/admin/about"],
  ])("a rota antiga %s leva a %s", async (from, to) => {
    renderAdmin(from);
    await waitFor(() => expect(screen.getByTestId("location")).toHaveTextContent(new RegExp(`^${to}$`)));
  });

  it("rola até a seção do link antigo só depois de as listas carregarem", async () => {
    m.booksLoading = true;
    const view = renderAdmin("/admin/books");
    await screen.findByRole("heading", { level: 1, name: "Sobre" });
    const scrolledTo = () => vi.mocked(Element.prototype.scrollIntoView).mock.contexts.map((el) => (el as Element).id);
    expect(scrolledTo()).not.toContain("livros");
    m.booksLoading = false;
    view.rerender(
      <MemoryRouter initialEntries={["/admin/books"]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/admin" element={<><AdminLayout /><LocationProbe /></>}>
            <Route path="about" element={<AboutAdmin />} />
            {legacyAboutRoutes()}
          </Route>
        </Routes>
      </MemoryRouter>,
    );
    await waitFor(() => expect(scrolledTo()).toContain("livros"));
  });

  it("o menu segue a ordem definida para o painel", async () => {
    renderAdmin("/admin/about");
    const nav = await screen.findByRole("navigation", { name: "Menu do painel" });
    expect(within(nav).getAllByRole("link").map((a) => a.textContent)).toEqual([
      "Perfil (Home)", "Sobre", "Projetos", "Trilhas", "Páginas Custom.", "Configurações",
    ]);
  });
});

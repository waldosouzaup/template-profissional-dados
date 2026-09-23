import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SkillForm from "@/components/admin/SkillForm";
import CourseEditor from "@/components/admin/CourseEditor";
import ProfileForm from "@/pages/admin/ProfileForm";
import { TECHNOLOGY_CATEGORIES } from "@/lib/home-sections";

const mocks = vi.hoisted(() => ({
  updateTechnology: vi.fn(), updateCourse: vi.fn(), updateProfile: vi.fn(),
  technology: { id: "tech", title: "Spark", icon: "Zap", color: "text-primary" },
  course: { id: "course", title: "Cloud", show_on_home: false },
  profile: { id: "profile", full_name: "Perfil" },
}));
vi.mock("@/hooks/useTechnologies", () => ({
  useTechnology: () => ({ data: mocks.technology }),
  useTechnologies: () => ({ updateTechnology: mocks.updateTechnology }),
}));
vi.mock("@/hooks/useCourses", () => ({
  useCourse: () => ({ data: mocks.course }),
  useCourses: () => ({ updateCourse: mocks.updateCourse }),
}));
vi.mock("@/hooks/useProfile", () => ({
  useProfiles: () => ({ data: [mocks.profile], updateProfile: mocks.updateProfile }),
}));
vi.mock("@/components/admin/ImageUpload", () => ({ ImageUpload: () => null }));

afterEach(cleanup);
beforeEach(() => vi.clearAllMocks());
const renderForm = (path: string, route: string, component: React.ReactNode) => render(
  <MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Routes><Route path={route} element={component} /><Route path="*" element={<p>Salvo</p>} /></Routes>
  </MemoryRouter>,
);

describe("Edição da Home pelo painel", () => {
  it("salva a categoria selecionada para uma skill existente", async () => {
    const onDone = vi.fn();
    render(<SkillForm technology={mocks.technology as never} onDone={onDone} onCancel={vi.fn()} />);
    const select = screen.getByLabelText("Categoria na Home");
    expect(select).toHaveValue("Background & Outros");
    expect(screen.getAllByRole("option")).toHaveLength(4);
    fireEvent.change(select, { target: { value: TECHNOLOGY_CATEGORIES[0] } });
    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));
    await waitFor(() => expect(mocks.updateTechnology).toHaveBeenCalledWith(expect.objectContaining({ id: "tech", category: "Cloud & Big Data" })));
    expect(onDone).toHaveBeenCalled();
  });

  it("salva a escolha de destacar uma certificação na Home", async () => {
    render(<CourseEditor course={mocks.course as never} onDone={vi.fn()} onCancel={vi.fn()} />);
    const checkbox = screen.getByRole("checkbox", { name: "Exibir em Certificações na Home" });
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));
    await waitFor(() => expect(mocks.updateCourse).toHaveBeenCalledWith(expect.objectContaining({ id: "course", show_on_home: true })));
  });

  it("salva os textos das duas seções no perfil", async () => {
    renderForm("/admin/profiles", "/admin/profiles", <ProfileForm />);
    fireEvent.change(screen.getByLabelText("Título de Skills"), { target: { value: "Minha stack" } });
    fireEvent.change(screen.getByLabelText("Descrição de Skills"), { target: { value: "Ferramentas" } });
    fireEvent.change(screen.getByLabelText("Título de Certificações"), { target: { value: "Credenciais" } });
    fireEvent.change(screen.getByLabelText("Descrição de Certificações"), { target: { value: "Aprendizado" } });
    fireEvent.click(screen.getByRole("button", { name: "Salvar Alterações" }));
    await waitFor(() => expect(mocks.updateProfile).toHaveBeenCalledWith(expect.objectContaining({
      id: "profile", skills_title: "Minha stack", skills_description: "Ferramentas",
      certifications_title: "Credenciais", certifications_description: "Aprendizado",
    })));
  });
});

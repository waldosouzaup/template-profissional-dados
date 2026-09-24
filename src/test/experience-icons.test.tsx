import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ExperienceEditor from "@/components/admin/ExperienceEditor";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import { EXPERIENCE_ICONS, suggestExperienceIcon } from "@/lib/experience-icons";
import type { Experience } from "@/types/database";

const s = vi.hoisted(() => ({ createExperience: vi.fn(), updateExperience: vi.fn() }));
vi.mock("@/hooks/useExperiences", () => ({
  useExperiences: () => ({ createExperience: s.createExperience, updateExperience: s.updateExperience, isCreating: false, isUpdating: false }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  s.createExperience.mockResolvedValue({});
  s.updateExperience.mockResolvedValue({});
});
afterEach(cleanup);

const experience = (extra: Partial<Experience>): Experience => ({
  id: "x1", type: "profissional", icon_type: "rocket", title: "IT Support", institution: "High Speed Delivery",
  period: "2022 - 2024", display_order: 1, ...extra,
});

describe("Ícones por cargo", () => {
  it("sugere o ícone pelo nome do cargo", () => {
    expect(suggestExperienceIcon("Colaborador técnico - Linux e DevOps")).toBe("devops");
    expect(suggestExperienceIcon("IT Support")).toBe("suporte");
    expect(suggestExperienceIcon("Técnico de Suporte")).toBe("suporte");
    expect(suggestExperienceIcon("Help Desk")).toBe("helpdesk");
    expect(suggestExperienceIcon("Técnico em Informática")).toBe("tecnico");
    expect(suggestExperienceIcon("Analista de Infraestrutura")).toBe("infraestrutura");
    expect(suggestExperienceIcon("Engenheiro de Dados")).toBe("dados");
    expect(suggestExperienceIcon("Analista de Redes")).toBe("redes");
    expect(suggestExperienceIcon("Gerente de TI")).toBe("gestao");
    expect(suggestExperienceIcon("Estagiário")).toBeUndefined();
  });

  it("mantém os três ícones antigos para o que já está salvo", () => {
    expect(EXPERIENCE_ICONS.map((i) => i.value)).toEqual(expect.arrayContaining(["briefcase", "rocket", "award"]));
  });
});

describe("Página Sobre: linha do tempo", () => {
  it("mostra o ícone escolhido para cada cargo, e a maleta para valores desconhecidos", () => {
    render(<ExperienceSection items={[
      experience({ id: "a", icon_type: "devops", title: "DevOps" }),
      experience({ id: "b", icon_type: "headset-inexistente", title: "Outro" }),
    ]} />);
    const [devops, unknown] = screen.getAllByRole("listitem");
    expect(devops.querySelector("svg")).toHaveClass("lucide-infinity");
    expect(unknown.querySelector("svg")).toHaveClass("lucide-briefcase");
  });
});

describe("Admin: escolha do ícone da experiência", () => {
  const radio = (name: string) => screen.getByRole("radio", { name }) as HTMLInputElement;

  it("mostra a grade de ícones com o nome de cada cargo", () => {
    render(<ExperienceEditor onDone={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByRole("radiogroup", { name: "Ícone do cargo" })).toBeInTheDocument();
    for (const name of ["DevOps", "Suporte técnico", "Help Desk / Service Desk", "Técnico em informática", "Cloud", "Redes"]) {
      expect(radio(name)).toBeInTheDocument();
    }
  });

  it("nova experiência: o cargo digitado já marca o ícone sugerido, e a escolha manual prevalece", async () => {
    render(<ExperienceEditor onDone={vi.fn()} onCancel={vi.fn()} />);
    fireEvent.change(screen.getByLabelText("Cargo"), { target: { value: "DevOps Engineer" } });
    expect(radio("DevOps")).toBeChecked();

    fireEvent.click(radio("Cloud"));
    fireEvent.change(screen.getByLabelText("Cargo"), { target: { value: "DevOps e Cloud Engineer" } });
    expect(radio("Cloud")).toBeChecked();

    fireEvent.change(screen.getByLabelText("Empresa / Instituição"), { target: { value: "UP Linux" } });
    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));
    await waitFor(() => expect(s.createExperience).toHaveBeenCalledWith(expect.objectContaining({ title: "DevOps e Cloud Engineer", icon_type: "cloud" })));
  });

  it("experiência existente: mantém o ícone salvo e oferece a sugestão pelo cargo", async () => {
    render(<ExperienceEditor experience={experience({ title: "Help Desk", icon_type: "rocket" })} onDone={vi.fn()} onCancel={vi.fn()} />);
    expect(radio("Projeto (foguete)")).toBeChecked();
    expect(screen.getByText(/Sugestão para este cargo/)).toHaveTextContent("Help Desk / Service Desk");
    fireEvent.click(screen.getByRole("button", { name: "Usar sugestão" }));
    expect(radio("Help Desk / Service Desk")).toBeChecked();
    expect(screen.queryByRole("button", { name: "Usar sugestão" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));
    await waitFor(() => expect(s.updateExperience).toHaveBeenCalledWith(expect.objectContaining({ id: "x1", icon_type: "helpdesk" })));
  });
});

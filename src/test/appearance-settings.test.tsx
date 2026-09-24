import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AppearanceSettings from "@/components/admin/AppearanceSettings";

const s = vi.hoisted(() => ({
  profile: { id: "p", full_name: "Waldo Eller", theme: "dark", primary_color: "142 71% 45%", theme_preset: "padrao" } as Record<string, unknown>,
  updateProfile: vi.fn(),
}));
vi.mock("@/hooks/useProfile", () => ({
  useProfiles: () => ({ data: [s.profile], updateProfile: s.updateProfile, isUpdating: false }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  s.updateProfile.mockResolvedValue({});
});
afterEach(cleanup);

const version = (name: string) => within(screen.getByRole("radiogroup", { name: "Versão" })).getByRole("radio", { name: new RegExp(`^${name}`) });

describe("Admin: aparência do portfólio", () => {
  it("mostra as quatro versões com a atual marcada", () => {
    render(<AppearanceSettings />);
    const options = within(screen.getByRole("radiogroup", { name: "Versão" })).getAllByRole("radio");
    expect(options).toHaveLength(4);
    expect(version("Padrão")).toBeChecked();
    expect(version("Obsidiana")).not.toBeChecked();
  });

  it("escolher uma versão premium passa a usar a cor dela e salva versão, modo e cor", async () => {
    render(<AppearanceSettings />);
    fireEvent.click(version("Obsidiana"));
    expect(screen.getByRole("button", { name: "Cor do tema" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("radio", { name: "Claro" }));
    fireEvent.click(screen.getByRole("button", { name: "Salvar aparência" }));
    await waitFor(() => expect(s.updateProfile).toHaveBeenCalledWith(expect.objectContaining({
      id: "p", theme_preset: "obsidiana", theme: "light", primary_color: "",
    })));
  });

  it("dá para trocar a cor de destaque da versão por uma das cores fixas", async () => {
    s.profile = { ...s.profile, theme_preset: "meia-noite", primary_color: "" };
    render(<AppearanceSettings />);
    expect(version("Meia-noite")).toBeChecked();
    expect(screen.getByRole("button", { name: "Cor do tema" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "Laranja" }));
    expect(screen.getByRole("button", { name: "Laranja" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "Salvar aparência" }));
    await waitFor(() => expect(s.updateProfile).toHaveBeenCalledWith(expect.objectContaining({ theme_preset: "meia-noite", primary_color: "24 98% 50%" })));
  });

  it("cada versão mostra uma prévia com a fonte dos títulos dela", () => {
    render(<AppearanceSettings />);
    const preview = version("Meia-noite").closest("label")!.querySelector("[data-theme-preview]") as HTMLElement;
    expect(preview.style.fontFamily).toContain("Red Hat Display");
  });
});

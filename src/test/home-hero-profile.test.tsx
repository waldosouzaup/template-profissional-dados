import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import ProfileCard from "@/components/portfolio/ProfileCard";
import HeroSection from "@/components/portfolio/HeroSection";

const state = vi.hoisted(() => ({
  profile: {
    id: "p", full_name: "Waldo Eller", hero_title: "Infraestrutura Linux e", current_focus: "Cloud/DevOps",
    bio_summary: "Atualmente desenvolvo projetos em Linux.", cv_url: "https://drive.google.com/file/d/cv/view" as string | undefined,
  },
}));
vi.mock("@/hooks/useProfile", () => ({ useProfiles: () => ({ data: [state.profile], isLoading: false }) }));
afterEach(() => { cleanup(); state.profile.cv_url = "https://drive.google.com/file/d/cv/view"; });

describe("Card de perfil da Home", () => {
  it("tem o botão Baixar currículo logo abaixo do card", () => {
    render(<ProfileCard />);
    const card = screen.getByRole("heading", { name: "Waldo Eller" }).closest(".profile-card")!;
    const cv = screen.getByRole("link", { name: "Baixar currículo" });
    expect(cv).toHaveAttribute("href", "https://drive.google.com/file/d/cv/view");
    expect(cv).toHaveAttribute("target", "_blank");
    expect(card.contains(cv)).toBe(false);
    expect(card.compareDocumentPosition(cv) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("não mostra o botão quando não há currículo cadastrado", () => {
    state.profile.cv_url = undefined;
    render(<ProfileCard />);
    expect(screen.queryByRole("link", { name: "Baixar currículo" })).not.toBeInTheDocument();
  });
});

describe("Hero da Home", () => {
  it("não tem mais os botões CV, Contato, Sobre e Blog", () => {
    render(<MemoryRouter><HeroSection /></MemoryRouter>);
    expect(screen.getByText("Atualmente desenvolvo projetos em Linux.")).toBeInTheDocument();
    for (const name of ["CV", "Contato", "Sobre", "Blog"]) {
      expect(screen.queryByRole("link", { name })).not.toBeInTheDocument();
    }
  });
});

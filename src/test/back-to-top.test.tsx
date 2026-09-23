import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import BackToTop from "@/components/BackToTop";

const scrollPage = (y: number) => act(() => {
  Object.defineProperty(window, "scrollY", { value: y, configurable: true });
  window.dispatchEvent(new Event("scroll"));
});

const mockReducedMotion = (reduce: boolean) => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: reduce && query === "(prefers-reduced-motion: reduce)",
    media: query, addEventListener: vi.fn(), removeEventListener: vi.fn(),
  }));
};

const renderAt = (path: string) => render(<MemoryRouter initialEntries={[path]}><BackToTop /></MemoryRouter>);

beforeEach(() => {
  window.scrollTo = vi.fn();
  mockReducedMotion(false);
  scrollPage(0);
});
afterEach(cleanup);

describe("Botão voltar ao topo", () => {
  it("fica oculto no topo da página", () => {
    renderAt("/");
    expect(screen.queryByRole("button", { name: "Voltar ao topo" })).not.toBeInTheDocument();
  });

  it("aparece depois de rolar e leva suavemente ao topo", () => {
    renderAt("/");
    scrollPage(600);
    fireEvent.click(screen.getByRole("button", { name: "Voltar ao topo" }));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("some de novo ao voltar para perto do topo", () => {
    renderAt("/");
    scrollPage(600);
    scrollPage(100);
    expect(screen.queryByRole("button", { name: "Voltar ao topo" })).not.toBeInTheDocument();
  });

  it("rola sem animação para quem prefere movimento reduzido", () => {
    mockReducedMotion(true);
    renderAt("/");
    scrollPage(600);
    fireEvent.click(screen.getByRole("button", { name: "Voltar ao topo" }));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "auto" });
  });

  it("não aparece no painel administrativo", () => {
    renderAt("/admin/projects/new");
    scrollPage(600);
    expect(screen.queryByRole("button", { name: "Voltar ao topo" })).not.toBeInTheDocument();
  });
});

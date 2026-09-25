import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import TrackingTags from "@/components/TrackingTags";

vi.mock("@/hooks/useProfile", () => ({
  useProfiles: () => ({
    data: [{ tracking_tags: '<script src="https://www.googletagmanager.com/gtag/js?id=G-TESTE"></script><meta name="teste-rastreio" content="1">' }],
  }),
}));

afterEach(cleanup);

const tags = () => document.querySelectorAll('[data-dynamic-tracking-tag="true"]');

const GoTo = ({ path }: { path: string }) => {
  const navigate = useNavigate();
  return <button onClick={() => navigate(path)}>ir</button>;
};

const renderAt = (path: string, next = "/") =>
  render(
    <MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <TrackingTags />
      <GoTo path={next} />
    </MemoryRouter>,
  );

describe("Tags de rastreamento", () => {
  it("são injetadas nas páginas públicas", () => {
    renderAt("/blog");
    expect(document.head.querySelector('script[src*="googletagmanager"]')).toHaveAttribute("data-dynamic-tracking-tag", "true");
    expect(tags()).toHaveLength(2);
  });

  it("nunca rodam no painel admin, onde fica a sessão de login", () => {
    renderAt("/admin/settings");
    expect(tags()).toHaveLength(0);
    cleanup();
    renderAt("/admin");
    expect(tags()).toHaveLength(0);
  });

  it("saem da página ao entrar no painel", () => {
    renderAt("/", "/admin/login");
    expect(tags()).toHaveLength(2);
    fireEvent.click(screen.getByRole("button", { name: "ir" }));
    expect(tags()).toHaveLength(0);
  });

  it("uma rota pública que só começa com 'admin' continua com as tags", () => {
    renderAt("/administracao");
    expect(tags()).toHaveLength(2);
  });
});

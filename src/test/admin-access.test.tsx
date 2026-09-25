import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AdminLayout from "@/components/admin/AdminLayout";

const m = vi.hoisted(() => ({
  session: null as null | { user: { id: string; app_metadata?: Record<string, unknown> } },
  signOut: vi.fn(async () => {}),
  toastError: vi.fn(),
}));
vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: async () => ({ data: { session: m.session } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signOut: m.signOut,
    },
  },
}));
vi.mock("sonner", () => ({ toast: { error: m.toastError, success: vi.fn() } }));

beforeEach(() => vi.clearAllMocks());
afterEach(cleanup);

const renderAdmin = () =>
  render(
    <MemoryRouter initialEntries={["/admin"]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/admin/login" element={<p>Tela de login</p>} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<p>Painel aberto</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

describe("Acesso ao painel admin", () => {
  it("sem sessão vai para o login", async () => {
    m.session = null;
    renderAdmin();
    expect(await screen.findByText("Tela de login")).toBeInTheDocument();
    expect(m.signOut).not.toHaveBeenCalled();
  });

  it("conta logada sem o papel de admin é desconectada e volta ao login", async () => {
    m.session = { user: { id: "intruso", app_metadata: { provider: "email" } } };
    renderAdmin();
    expect(await screen.findByText("Tela de login")).toBeInTheDocument();
    expect(m.signOut).toHaveBeenCalledTimes(1);
    expect(m.toastError).toHaveBeenCalledWith("Esta conta não tem acesso ao painel.");
    expect(screen.queryByText("Painel aberto")).not.toBeInTheDocument();
  });

  it("a conta administradora entra no painel", async () => {
    m.session = { user: { id: "admin", app_metadata: { role: "admin" } } };
    renderAdmin();
    expect(await screen.findByText("Painel aberto")).toBeInTheDocument();
    await waitFor(() => expect(m.signOut).not.toHaveBeenCalled());
  });
});

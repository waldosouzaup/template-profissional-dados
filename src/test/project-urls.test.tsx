import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import ProjectCard from "@/components/portfolio/ProjectCard";
import ProjectDetail from "@/pages/ProjectDetail";
import { useProject } from "@/hooks/useProjects";
import type { Project } from "@/types/project";

const ID = "77ecb037-a884-40b3-b997-28033b474c4a";
const row = {
  id: ID, slug: "rifa-online", previous_slugs: ["rifa-online-uplinux"],
  title: "Rifa Online", category: "ia", description: "Saas Rifa Online", technologies: [], is_published: true,
};

// In-memory stand-in for the projects table: supports the filters useProject relies on.
vi.mock("@/lib/supabase", () => {
  const rows = () => [row];
  const builder = (filters: ((r: typeof row) => boolean)[] = []) => ({
    select: () => builder(filters),
    eq: (col: keyof typeof row, val: string) => builder([...filters, (r) => r[col] === val]),
    contains: (col: "previous_slugs", vals: string[]) => builder([...filters, (r) => vals.every((v) => r[col].includes(v))]),
    maybeSingle: async () => ({ data: rows().find((r) => filters.every((f) => f(r))) ?? null, error: null }),
  });
  return { supabase: { from: () => builder() } };
});

beforeAll(() => { window.scrollTo = vi.fn(); });
afterEach(cleanup);

const project = { id: ID, slug: "rifa-online", title: "Rifa Online", category: "ia", tags: [], shortDescription: "" } as unknown as Project;

const LocationProbe = () => <p data-testid="path">{useLocation().pathname}</p>;

const renderDetail = (path: string) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/projects/:idOrSlug" element={<><ProjectDetail /><LocationProbe /></>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("URLs amigáveis de projetos", () => {
  it("o card aponta para o slug do projeto", () => {
    render(<MemoryRouter><ProjectCard project={project} /></MemoryRouter>);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/projects/rifa-online");
  });

  it("redireciona a URL antiga por UUID para o slug", async () => {
    renderDetail(`/projects/${ID}`);
    await waitFor(() => expect(screen.getByTestId("path")).toHaveTextContent(/^\/projects\/rifa-online$/));
  });

  it("redireciona um slug anterior para o slug atual", async () => {
    renderDetail("/projects/rifa-online-uplinux");
    await waitFor(() => expect(screen.getByTestId("path")).toHaveTextContent(/^\/projects\/rifa-online$/));
  });

  it("usa o slug no canonical", async () => {
    renderDetail("/projects/rifa-online");
    await waitFor(() =>
      expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute("href", "https://waldoeller.com/projects/rifa-online"),
    );
  });

  it("mostra página não encontrada para slug inexistente", async () => {
    renderDetail("/projects/nao-existe");
    expect(await screen.findByText("Projeto não encontrado")).toBeInTheDocument();
    await waitFor(() => expect(document.querySelector('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow"));
  });

  it("useProject encontra por id, slug e slug anterior", async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const wrapper = ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;
    for (const key of [ID, "rifa-online", "rifa-online-uplinux"]) {
      const { result } = renderHook(() => useProject(key), { wrapper });
      await waitFor(() => expect(result.current.data?.slug).toBe("rifa-online"));
    }
    const { result } = renderHook(() => useProject("nao-existe"), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeNull();
  });
});

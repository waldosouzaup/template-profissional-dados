import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import Navbar from "@/components/portfolio/Navbar";

vi.mock("@/hooks/useProfile", () => ({ useProfiles: () => ({ data: [{ id: "p", full_name: "Waldo" }], isLoading: false }) }));
vi.mock("@/hooks/useCustomPages", () => ({ useCustomPages: () => ({ data: [], isLoading: false }) }));
afterEach(cleanup);

describe("Barra de navegação do site", () => {
  it("segue a ordem Início, Sobre, Portfólio, Blog, Contato", () => {
    render(<MemoryRouter><Navbar /></MemoryRouter>);
    const labels = ["Início", "Sobre", "Portfólio", "Blog", "Contato"];
    const order = screen.getAllByRole("link").map((a) => a.textContent?.trim()).filter((t) => labels.includes(t!));
    expect([...new Set(order)]).toEqual(labels);
  });
});

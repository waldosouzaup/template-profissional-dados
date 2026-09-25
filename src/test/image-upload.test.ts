import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MAX_IMAGE_BYTES, imageUploadError } from "@/lib/image-upload";
import { useStorage } from "@/hooks/useStorage";

const m = vi.hoisted(() => ({
  upload: vi.fn(async () => ({ data: {}, error: null })),
  getPublicUrl: vi.fn((path: string) => ({ data: { publicUrl: `https://cdn.example.com/${path}` } })),
  toastError: vi.fn(),
}));
vi.mock("@/lib/supabase", () => ({
  supabase: { storage: { from: () => ({ upload: m.upload, getPublicUrl: m.getPublicUrl }) } },
}));
vi.mock("sonner", () => ({ toast: { error: m.toastError, success: vi.fn() } }));

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

const file = (name: string, type: string, size = 10) => new File([new Uint8Array(size)], name, { type });

describe("Upload de imagens do painel", () => {
  it("aceita os formatos de imagem do bucket e recusa o resto", () => {
    expect(imageUploadError(file("foto.png", "image/png"))).toBeNull();
    expect(imageUploadError(file("foto.jpg", "image/jpeg"))).toBeNull();
    expect(imageUploadError(file("icone.ico", "image/x-icon"))).toBeNull();
    expect(imageUploadError(file("logo.svg", "image/svg+xml"))).toMatch(/Formato não suportado/);
    expect(imageUploadError(file("pagina.html", "text/html"))).toMatch(/Formato não suportado/);
    expect(imageUploadError(file("sem-tipo", ""))).toMatch(/Formato não suportado/);
  });

  it("recusa imagens acima de 5 MB", () => {
    expect(imageUploadError(file("grande.png", "image/png", MAX_IMAGE_BYTES))).toBeNull();
    expect(imageUploadError(file("grande.png", "image/png", MAX_IMAGE_BYTES + 1))).toMatch(/5 MB/);
  });

  it("arquivo recusado nem chega ao Storage", async () => {
    const { result } = renderHook(() => useStorage());
    let url: string | null = "";
    await act(async () => { url = await result.current.uploadImage(file("logo.svg", "image/svg+xml"), "portfolio", "projects"); });
    expect(url).toBeNull();
    expect(m.upload).not.toHaveBeenCalled();
    expect(m.toastError).toHaveBeenCalledWith(expect.stringMatching(/Formato não suportado/));
  });

  it("o nome salvo é aleatório e a extensão vem do tipo, não do nome enviado", async () => {
    const { result } = renderHook(() => useStorage());
    let url: string | null = null;
    await act(async () => { url = await result.current.uploadImage(file("pagina.html", "image/png"), "portfolio", "projects"); });
    const [path] = m.upload.mock.calls[0] as unknown as [string];
    expect(path).toMatch(/^projects\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.png$/);
    expect(url).toBe(`https://cdn.example.com/${path}`);
  });
});

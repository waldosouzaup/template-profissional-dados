import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import SEOHead from "@/components/SEOHead";

afterEach(() => {
  cleanup();
  document.head.innerHTML = "";
});

const head = (selector: string) => document.head.querySelector(selector);

describe("SEOHead", () => {
  it("troca de página sem herdar canonical, imagem e descrição da anterior", async () => {
    const { rerender } = render(
      <SEOHead title="Dia 05/30" description="Linha de comando" canonical="https://waldoeller.com/blog/dia-05" ogImage="https://example.com/capa.png" />,
    );
    await waitFor(() => expect(head('link[rel="canonical"]')).toHaveAttribute("href", "https://waldoeller.com/blog/dia-05"));
    expect(head('meta[property="og:image"]')).toHaveAttribute("content", "https://example.com/capa.png");
    expect(head('meta[property="twitter:card"]')).toHaveAttribute("content", "summary_large_image");

    rerender(<SEOHead title="Artigo não encontrado" noindex />);
    await waitFor(() => expect(document.title).toBe("Artigo não encontrado | Waldo Eller"));
    expect(head('link[rel="canonical"]')).toBeNull();
    expect(head('meta[property="og:url"]')).toBeNull();
    expect(head('meta[property="og:image"]')).toBeNull();
    expect(head('meta[property="twitter:image"]')).toBeNull();
    expect(head('meta[name="description"]')).toBeNull();
    expect(head('meta[property="twitter:card"]')).toHaveAttribute("content", "summary");
    expect(head('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
  });

  it("reaproveita as tags que vieram prontas do servidor, sem duplicar", async () => {
    document.head.insertAdjacentHTML(
      "beforeend",
      '<link rel="canonical" href="https://waldoeller.com/blog" /><script type="application/ld+json" id="seo-jsonld">{"@type":"Blog"}</script>',
    );
    render(<SEOHead title="Blog" canonical="https://waldoeller.com/blog/trilha/ia" jsonLd={{ "@type": "CollectionPage" }} />);
    await waitFor(() => expect(head('link[rel="canonical"]')).toHaveAttribute("href", "https://waldoeller.com/blog/trilha/ia"));
    expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(document.head.querySelectorAll("#seo-jsonld")).toHaveLength(1);
    expect(JSON.parse(head("#seo-jsonld")!.textContent!)).toEqual({ "@type": "CollectionPage" });
  });
});

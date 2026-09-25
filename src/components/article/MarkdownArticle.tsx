import { isValidElement, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ZoomIn } from "lucide-react";
import { CodeBlock } from "@/components/article/CodeBlock";
import ImageLightbox, { type LightboxImage } from "@/components/blog/ImageLightbox";
import { extractMarkdownImages, headingId } from "@/lib/text";

// Long-form Markdown with the site's reading typography: anchored headings, copyable code,
// scrollable tables and images that open in a lightbox. Shared by blog posts and project pages.
// Plain text of a rendered heading, including text inside **bold**, `code` or links, for its anchor id.
const nodeText = (node: React.ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (isValidElement<{ children?: React.ReactNode }>(node)) return nodeText(node.props.children);
  return "";
};

export default function MarkdownArticle({ markdown }: { markdown: string }) {
  const contentImages = useMemo(() => extractMarkdownImages(markdown), [markdown]);
  const [lightbox, setLightbox] = useState<{ images: LightboxImage[]; index: number } | null>(null);

  const openImage = (src: string, alt: string) => {
    const index = contentImages.findIndex((image) => image.src === src);
    setLightbox(index >= 0 ? { images: contentImages, index } : { images: [{ src, alt }], index: 0 });
  };

  return (
    <>
    <article className="
      prose dark:prose-invert max-w-3xl break-words

      /* Headings */
      prose-headings:font-light prose-headings:tracking-tight
      prose-h1:text-5xl prose-h1:text-foreground prose-h1:mt-0 prose-h1:mb-10 prose-h1:leading-[1.05]
      prose-h2:text-3xl prose-h2:text-foreground prose-h2:mt-20 prose-h2:mb-6 prose-h2:pb-5 prose-h2:border-b prose-h2:border-border
      prose-h3:text-xl prose-h3:text-foreground/75 prose-h3:mt-14 prose-h3:mb-4
      prose-h4:text-base prose-h4:text-foreground/60 prose-h4:mt-10 prose-h4:mb-3 prose-h4:tracking-wide

      /* Body text */
      prose-p:text-foreground/75 prose-p:leading-[1.9] prose-p:text-[17px] prose-p:my-6

      /* Links */
      prose-a:text-primary prose-a:no-underline prose-a:border-b prose-a:border-primary/20
      hover:prose-a:text-primary/80 hover:prose-a:border-primary/60 prose-a:transition-colors prose-a:pb-px

      /* Strong / em */
      prose-strong:text-foreground prose-strong:font-medium
      prose-em:text-foreground/60 prose-em:not-italic prose-em:font-light

      /* Blockquote */
      prose-blockquote:border-l-[3px] prose-blockquote:border-primary/30
      prose-blockquote:pl-7 prose-blockquote:not-italic
      prose-blockquote:text-foreground/60 prose-blockquote:text-[16px]
      prose-blockquote:my-12 prose-blockquote:leading-[1.9]

      /* Lists */
      prose-li:text-foreground/75 prose-li:leading-[1.85] prose-li:text-[16px] prose-li:my-2
      prose-ul:my-8 prose-ol:my-8

      /* HR */
      prose-hr:border-border prose-hr:my-16

      /* Images */
      prose-img:rounded-2xl prose-img:border prose-img:border-border prose-img:shadow-2xl prose-img:my-12

      /* Inline code */
      prose-code:text-primary prose-code:bg-primary/5 prose-code:px-2
      prose-code:py-0.5 prose-code:rounded prose-code:text-[14px] prose-code:font-mono
      prose-code:before:content-none prose-code:after:content-none

      /* Tables */
      prose-table:text-sm prose-table:border-collapse
      prose-th:text-foreground/60 prose-th:font-medium prose-th:tracking-wide
      prose-th:border-b prose-th:border-border prose-th:pb-3 prose-th:text-left
      prose-td:text-foreground/50 prose-td:border-b prose-td:border-border/50 prose-td:py-3
    ">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // The page title is the only h1; a "#" in the text becomes an h2 that keeps its larger size.
          h1: ({ children }: { children?: React.ReactNode }) => {
            return (
              <h2 id={headingId(nodeText(children))} className="not-prose mt-16 mb-8 scroll-mt-24 text-4xl font-light leading-[1.05] tracking-tight text-foreground sm:text-5xl">
                {children}
              </h2>
            );
          },
          h2: ({ children, ...props }: any) => {
            const text = nodeText(children);
            const id = headingId(text);
            return <h2 id={id} className="text-3xl font-light text-foreground/90 mt-20 mb-6 pb-5 border-b border-foreground/[0.06] scroll-mt-24" {...props}>{children}</h2>;
          },
          h3: ({ children, ...props }: any) => {
            const text = nodeText(children);
            const sectionKeywords = ["Problema", "Contexto", "Estratégia", "Resultados", "Solução", "Objetivo", "Tecnologias", "Arquitetura", "Conclusão", "Próximos Passos", "Impacto", "Insights"];
            const isSectionLabel = sectionKeywords.includes(text.trim());
            const id = headingId(text);

            if (isSectionLabel) {
              return <h3 id={id} className="!text-[10px] !font-bold !tracking-[0.25em] !uppercase !text-foreground/25 !mt-16 !mb-4 !leading-none uppercase scroll-mt-24" {...props}>{children}</h3>;
            }
            return <h3 id={id} className="text-xl font-light text-foreground/75 mt-14 mb-4 scroll-mt-24" {...props}>{children}</h3>;
          },
          // Fenced blocks arrive as <pre><code class="language-x">. react-markdown v10 no longer
          // flags inline code, so blocks are rendered here and `code` only ever sees inline code.
          pre: ({ children }: any) => (
            <CodeBlock className={children?.props?.className}>{children?.props?.children}</CodeBlock>
          ),
          code: ({ className, children }: any) => <code className={className}>{children}</code>,
          // Wide tables scroll inside their own box instead of widening the page on phones
          table: ({ children }: { children?: React.ReactNode }) => (
            <div className="scrollbar-themed my-8 overflow-x-auto">
              <table className="!my-0">{children}</table>
            </div>
          ),
          p: ({ children, ...props }: any) => {
            const text = typeof children === "string" ? children : Array.isArray(children) ? children.map((c: any) => (typeof c === "string" ? c : "")).join("") : "";
            const sectionKeywords = ["Problema", "Contexto", "Estratégia", "Resultados", "Solução", "Objetivo", "Tecnologias", "Arquitetura", "Conclusão", "Próximos Passos", "Impacto", "Insights"];

            if (sectionKeywords.includes(text.trim()) && text.trim().length < 30) {
              return <p className="!text-[10px] !font-bold !tracking-[0.25em] !uppercase !text-foreground/25 !mt-16 !mb-4 !leading-none">{children}</p>;
            }
            return <p {...props}>{children}</p>;
          },
          img: ({ src, alt }: any) => (
            <button
              type="button"
              onClick={() => openImage(src, alt || "")}
              aria-label={`Ampliar imagem${alt ? `: ${alt}` : ""}`}
              className="group relative my-12 block w-full cursor-zoom-in rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
            >
              <img src={src} alt={alt || ""} loading="lazy" className="!my-0 w-full transition-opacity group-hover:opacity-90" />
              <span className="pointer-events-none absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/75 text-foreground opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <ZoomIn className="h-4 w-4" aria-hidden="true" />
              </span>
            </button>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </article>

      <ImageLightbox
        images={lightbox?.images ?? []}
        index={lightbox?.index ?? null}
        onIndexChange={(index) => setLightbox((current) => (current ? { ...current, index } : current))}
        onClose={() => setLightbox(null)}
      />
    </>
  );
}

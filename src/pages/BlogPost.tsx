import { useEffect, useRef, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Copy, 
  Check, 
  ChevronRight,
  Clock,
  Share2,
  FolderOpen
} from "lucide-react";
import { useContent } from "@/hooks/useContents";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import remarkGfm from "remark-gfm";
import SEOHead from "@/components/SEOHead";

/* ─────────────────────────────────────────────
   SCROLL PROGRESS BAR
 ───────────────────────────────────────────── */
const ScrollProgress = () => {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      setPct((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 w-full h-[2px] z-50 bg-white/5">
      <div
        className="h-full bg-primary/60 transition-all duration-75"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

/* ─────────────────────────────────────────────
   COPY-CODE BLOCK
 ───────────────────────────────────────────── */
const CodeBlock = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  const [copied, setCopied] = useState(false);
  const text = String(children ?? "");
  const lang = className?.replace("language-", "") ?? "code";

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-8 group">
      <div className="flex items-center justify-between px-5 py-2.5 bg-white/[0.04] border border-white/8 rounded-t-xl">
        <span className="text-[10px] font-mono tracking-widest uppercase text-white/30">
          {lang}
        </span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-white/70 transition-colors"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>
      <pre className="bg-[#0d0d0d] border border-t-0 border-white/8 rounded-b-xl p-6 overflow-x-auto">
        <code className={`text-sm font-mono text-white/70 leading-relaxed ${className ?? ""}`}>
          {text}
        </code>
      </pre>
    </div>
  );
};

/* ─────────────────────────────────────────────
   TABLE OF CONTENTS
 ───────────────────────────────────────────── */
const TableOfContents = ({ markdown }: { markdown: string }) => {
  const headings = useMemo(() => {
    const lines = markdown.split("\n");
    const result: { level: number; text: string; id: string }[] = [];
    for (const line of lines) {
      const match = line.match(/^(#{2,3})\s+(.+)/);
      if (match) {
        const text = match[2].trim();
        const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
        result.push({ level: match[1].length, text, id });
      }
    }
    return result;
  }, [markdown]);

  if (headings.length < 2) return null;

  return (
    <div className="py-8 border-t border-white/[0.06]">
      <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/20 mb-4">Neste Artigo</p>
      <nav className="space-y-2">
        {headings.map((h, i) => (
          <a
            key={i}
            href={`#${h.id}`}
            className={`block text-[13px] leading-snug transition-colors hover:text-white/80 ${
              h.level === 2 ? "text-white/45 font-medium" : "text-white/25 pl-3"
            }`}
          >
            {h.text}
          </a>
        ))}
      </nav>
    </div>
  );
};

/** Estimate reading time from markdown text */
const estimateReadingTime = (text?: string): number => {
  if (!text) return 1;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

const BlogPost = () => {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const { data: post, isLoading } = useContent(idOrSlug);
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [idOrSlug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border border-white/10 rounded-full border-t-white/40 animate-spin" />
          <p className="text-[11px] tracking-[0.3em] uppercase text-white/25">Carregando Post</p>
        </div>
      </div>
    );
  }

  if (!post) return null;

  const readingTime = estimateReadingTime(post.markdown);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-white/20 pt-16">
      <SEOHead
        title={post.title}
        description={post.description || `Leia "${post.title}" no blog de Waldo Eller.`}
        canonical={`https://waldoeller.com/blog/${post.slug || post.id}`}
        ogImage={post.image_url}
        ogType="article"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          datePublished: post.created_at,
          url: `https://waldoeller.com/blog/${post.slug || post.id}`,
          author: {
            "@type": "Person",
            name: "Waldo Eller",
            url: "https://waldoeller.com/about",
          },
          publisher: {
            "@type": "Person",
            name: "Waldo Eller",
          },
          ...(post.image_url && { image: post.image_url }),
          wordCount: post.markdown?.split(/\s+/).length,
          timeRequired: `PT${readingTime}M`,
        }}
      />
      <ScrollProgress />

      {/* HERO */}
      <section className="pt-24 pb-10 px-8 sm:px-12 lg:px-20 max-w-[1400px] mx-auto animate-[fadeInUp_0.6s_ease-out_both]">
        {post.image_url && (
          <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-16 border border-white/[0.06] shadow-2xl">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
          </div>
        )}

        <div className="flex flex-col max-w-4xl">
          <div className="flex flex-wrap items-center gap-6 mb-8 text-[10px] font-bold tracking-[0.25em] uppercase text-white/30">
            {post.category && (
              <span className="text-primary border border-primary/20 bg-primary/5 px-3 py-1.5 rounded-sm">
                {post.category}
              </span>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              {post.created_at ? format(new Date(post.created_at), "dd 'de' MMMM, yyyy", { locale: ptBR }) : "--"}
            </div>
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5" />
              Waldo Eller
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              {readingTime} min de leitura
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-light tracking-tight text-white leading-[1.05] mb-8">
            {post.title}
          </h1>

          <p className="text-xl text-white/40 font-light leading-relaxed max-w-2xl border-l-[3px] border-primary/30 pl-8 mb-8">
            {post.description}
          </p>

          {post.drive_folder_url && (
            <div>
              <a 
                href={post.drive_folder_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:border-primary/40 rounded-full text-sm font-medium transition-all"
              >
                <FolderOpen className="w-4 h-4" />
                Ver Arquivos
              </a>
            </div>
          )}
        </div>
      </section>

      {/* CONTENT */}
      <div className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-20 pb-40">
        <div className="lg:grid lg:grid-cols-[1fr_300px] gap-20">
          <main className="min-w-0">
            <div ref={articleRef}>
              <article className="
                prose prose-invert max-w-none

                /* Headings */
                prose-headings:font-light prose-headings:tracking-tight
                prose-h1:text-5xl prose-h1:text-white/95 prose-h1:mt-0 prose-h1:mb-10 prose-h1:leading-[1.05]
                prose-h2:text-3xl prose-h2:text-white/90 prose-h2:mt-20 prose-h2:mb-6 prose-h2:pb-5 prose-h2:border-b prose-h2:border-white/[0.06]
                prose-h3:text-xl prose-h3:text-white/75 prose-h3:mt-14 prose-h3:mb-4
                prose-h4:text-base prose-h4:text-white/60 prose-h4:mt-10 prose-h4:mb-3 prose-h4:tracking-wide

                /* Body text */
                prose-p:text-white/55 prose-p:leading-[2] prose-p:text-[16px] prose-p:my-6

                /* Links */
                prose-a:text-white/70 prose-a:no-underline prose-a:border-b prose-a:border-white/20
                hover:prose-a:text-white hover:prose-a:border-white/60 prose-a:transition-colors prose-a:pb-px

                /* Strong / em */
                prose-strong:text-white/85 prose-strong:font-medium
                prose-em:text-white/60 prose-em:not-italic prose-em:font-light

                /* Blockquote */
                prose-blockquote:border-l-[3px] prose-blockquote:border-white/15
                prose-blockquote:pl-7 prose-blockquote:not-italic
                prose-blockquote:text-white/40 prose-blockquote:text-[15px]
                prose-blockquote:my-12 prose-blockquote:leading-[2]

                /* Lists */
                prose-li:text-white/55 prose-li:leading-[1.9] prose-li:text-[15px] prose-li:my-2
                prose-ul:my-8 prose-ol:my-8

                /* HR */
                prose-hr:border-white/[0.05] prose-hr:my-16

                /* Images */
                prose-img:rounded-2xl prose-img:border prose-img:border-white/[0.06] prose-img:shadow-2xl prose-img:my-12

                /* Inline code */
                prose-code:text-emerald-400/80 prose-code:bg-emerald-950/30 prose-code:px-2
                prose-code:py-0.5 prose-code:rounded prose-code:text-[13px] prose-code:font-mono
                prose-code:before:content-none prose-code:after:content-none

                /* Tables */
                prose-table:text-sm prose-table:border-collapse
                prose-th:text-white/40 prose-th:font-medium prose-th:tracking-wide
                prose-th:border-b prose-th:border-white/[0.08] prose-th:pb-3 prose-th:text-left
                prose-td:text-white/50 prose-td:border-b prose-td:border-white/[0.04] prose-td:py-3
              ">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h2: ({ children, ...props }: any) => {
                      const text = typeof children === "string" ? children : Array.isArray(children) ? children.map((c: any) => (typeof c === "string" ? c : "")).join("") : "";
                      const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
                      return <h2 id={id} className="text-3xl font-light text-white/90 mt-20 mb-6 pb-5 border-b border-white/[0.06] scroll-mt-24" {...props}>{children}</h2>;
                    },
                    h3: ({ children, ...props }: any) => {
                      const text = typeof children === "string" ? children : Array.isArray(children) ? children.map((c: any) => (typeof c === "string" ? c : "")).join("") : "";
                      const sectionKeywords = ["Problema", "Contexto", "Estratégia", "Resultados", "Solução", "Objetivo", "Tecnologias", "Arquitetura", "Conclusão", "Próximos Passos", "Impacto", "Insights"];
                      const isSectionLabel = sectionKeywords.includes(text.trim());
                      const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
                      
                      if (isSectionLabel) {
                        return <h3 id={id} className="!text-[10px] !font-bold !tracking-[0.25em] !uppercase !text-white/25 !mt-16 !mb-4 !leading-none uppercase scroll-mt-24" {...props}>{children}</h3>;
                      }
                      return <h3 id={id} className="text-xl font-light text-white/75 mt-14 mb-4 scroll-mt-24" {...props}>{children}</h3>;
                    },
                    pre: ({ children }: any) => (
                      <CodeBlock>{(children as any)?.props?.children}</CodeBlock>
                    ),
                    code: ({ inline, className, children }: any) =>
                      inline ? (
                        <code className={className}>{children}</code>
                      ) : (
                        <CodeBlock className={className}>{children}</CodeBlock>
                      ),
                    p: ({ children, ...props }: any) => {
                      const text = typeof children === "string" ? children : Array.isArray(children) ? children.map((c: any) => (typeof c === "string" ? c : "")).join("") : "";
                      const sectionKeywords = ["Problema", "Contexto", "Estratégia", "Resultados", "Solução", "Objetivo", "Tecnologias", "Arquitetura", "Conclusão", "Próximos Passos", "Impacto", "Insights"];
                      
                      if (sectionKeywords.includes(text.trim()) && text.trim().length < 30) {
                        return <p className="!text-[10px] !font-bold !tracking-[0.25em] !uppercase !text-white/25 !mt-16 !mb-4 !leading-none">{children}</p>;
                      }
                      return <p {...props}>{children}</p>;
                    },
                    img: ({ src, alt, ...props }: any) => (
                      <img src={src} alt={alt || ""} loading="lazy" {...props} />
                    ),
                  }}
                >
                  {post.markdown || ""}
                </ReactMarkdown>
              </article>
            </div>
          </main>

          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-0">
              {/* Table of Contents */}
              {post.markdown && <TableOfContents markdown={post.markdown} />}

              <div className="py-8 border-t border-white/[0.06]">
                <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/20 mb-4">Sobre o Autor</p>
                <p className="text-sm text-white/40 leading-relaxed mb-6">
                  Analista de Dados | BI | Gosto de transformar dados em insights que ajudam negócios a tomar decisões melhores.
                </p>
                <Link to="/about" className="text-[10px] font-bold tracking-widest uppercase text-primary hover:text-primary/80 transition-colors">
                  Ver Perfil Completo →
                </Link>
              </div>

              <div className="py-8 border-t border-white/[0.06]">
                <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/20 mb-4">Compartilhar</p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      const url = encodeURIComponent(window.location.href);
                      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
                    }}
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
                    aria-label="Compartilhar no LinkedIn"
                  >
                    <span className="text-xs">Li</span>
                  </button>
                  <button 
                    onClick={() => {
                      const url = encodeURIComponent(window.location.href);
                      const text = encodeURIComponent(post.title);
                      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
                    }}
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
                    aria-label="Compartilhar no Twitter"
                  >
                    <span className="text-xs">Tw</span>
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                    }}
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
                    aria-label="Copiar link"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
      
      {/* FOOTER CTA */}
      <footer className="border-t border-white/[0.05] py-20 px-8 sm:px-12 lg:px-20 max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-8">
        <div>
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/20 mb-2">Continue lendo</p>
          <p className="text-2xl font-light text-white/70">Explore outros insights no blog.</p>
        </div>
        <Link
          to="/blog"
          className="px-8 py-3 border border-white/15 rounded-full text-sm text-white/60 hover:border-white/40 hover:text-white transition-colors"
        >
          Voltar ao Blog
        </Link>
      </footer>
    </div>
  );
};

export default BlogPost;

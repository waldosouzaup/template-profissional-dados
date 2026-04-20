import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Copy,
  Check,
  ChevronRight,
} from "lucide-react";
import { projectCategories } from "@/types/project";
import { useProject } from "@/hooks/useProjects";

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
        className="h-full bg-white/60 transition-all duration-75"
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
   INLINE BADGE
───────────────────────────────────────────── */
const Badge = ({ label }: { label: string }) => (
  <span className="inline-block px-3 py-1 text-[11px] font-medium tracking-wide border border-white/10 rounded-full text-white/50 bg-white/[0.03] hover:border-white/20 hover:text-white/70 transition-colors">
    {label}
  </span>
);

/* ─────────────────────────────────────────────
   LIST SECTION BLOCK
───────────────────────────────────────────── */
const ListBlock = ({
  title,
  items,
}: {
  title: string;
  items: string[];
}) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="py-8 border-t border-white/[0.06]">
      <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/25 mb-5">
        {title}
      </p>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 group">
            <div className="w-1 h-1 rounded-full bg-white/20 mt-2 shrink-0 group-hover:bg-white/50 transition-colors" />
            <span className="text-[13px] text-white/50 leading-relaxed group-hover:text-white/75 transition-colors">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

/* ─────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────── */
const StatCard = ({ value, label }: { value: string; label: string }) => (
  <div className="py-6 border-t border-white/[0.06]">
    <p className="text-3xl font-light text-white tracking-tight">{value}</p>
    <p className="text-[11px] tracking-widest uppercase text-white/30 mt-1">
      {label}
    </p>
  </div>
);

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading } = useProject(id);
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  /* Loading */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border border-white/10 rounded-full border-t-white/40 animate-spin" />
          <p className="text-[11px] tracking-[0.3em] uppercase text-white/25">
            Carregando
          </p>
        </div>
      </div>
    );
  }

  if (!project) return null;

  const categoryInfo = projectCategories[project.category];
  const hasStats = project.stats && project.stats.length > 0;
  const hasPremises = project.premises && project.premises.length > 0;
  const hasStrategy = project.strategy && project.strategy.length > 0;
  const hasResults = project.results && project.results.length > 0;
  const hasNextSteps = project.nextSteps && project.nextSteps.length > 0;
  const hasGallery = project.galleryImages && project.galleryImages.length > 0;
  const hasSidebar =
    project.tags?.length > 0 ||
    hasStats ||
    hasPremises ||
    hasStrategy ||
    hasResults ||
    hasNextSteps;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-white/20">
      <ScrollProgress />

      {/* ── TOP NAV ── */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-5 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.04]">
        <Link
          to="/projects"
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white/80 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Projetos
        </Link>

        {/* Category pill */}
        <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/25 hidden sm:block">
          {categoryInfo?.label || project.category}
        </span>

        {/* CTA links */}
        <div className="flex items-center gap-4">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white/80 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">Código</span>
            </a>
          )}
          {project.link && project.link !== "#" && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm px-4 py-1.5 border border-white/15 rounded-full text-white/60 hover:border-white/40 hover:text-white transition-colors"
            >
              Demo
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="pt-28 pb-0 px-8 sm:px-12 lg:px-20 max-w-[1400px] mx-auto">
        {/* Cover image — full bleed with overlay */}
        {project.coverImage && (
          <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-20 border border-white/[0.06]">
            <img
              src={project.coverImage}
              alt={project.title}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
            {/* Title overlay on image */}
            <div className="absolute bottom-0 left-0 right-0 px-10 pb-10">
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/40 mb-3">
                {categoryInfo?.label || project.category}
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-[1.05]">
                {project.title}
              </h1>
            </div>
          </div>
        )}

        {/* No image: title alone */}
        {!project.coverImage && (
          <div className="mb-20 pt-8">
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/30 mb-4">
              {categoryInfo?.label || project.category}
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-light tracking-tight text-white leading-[1.05] max-w-3xl">
              {project.title}
            </h1>
          </div>
        )}
      </section>

      {/* ── BODY: ARTICLE + SIDEBAR ── */}
      <div className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-20 pb-40">
        <div className={`flex gap-20 ${hasSidebar ? "lg:grid lg:grid-cols-[1fr_300px]" : ""}`}>

          {/* ── LEFT: MAIN CONTENT ── */}
          <main className="min-w-0">

            {/* ── DEEP DIVE (Markdown only) ── */}
            {project.content && project.content.trim() !== "" ? (
              <div ref={articleRef}>
                <article
                  className="
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
                  "
                >
                    <ReactMarkdown
                      components={{
                        h2: ({ children, ...props }: any) => (
                          <h2 className="text-3xl font-light text-white/90 mt-20 mb-6 pb-5 border-b border-white/[0.06]" {...props}>{children}</h2>
                        ),
                        h3: ({ children, ...props }: any) => {
                          // Allow the specific section titles to reuse our aesthetic label styling
                          const text = typeof children === "string" ? children : Array.isArray(children) ? children.map((c: any) => (typeof c === "string" ? c : "")).join("") : "";
                          const sectionKeywords = ["Problema", "Contexto", "Estratégia", "Resultados", "Solução", "Objetivo", "Tecnologias", "Arquitetura", "Conclusão", "Próximos Passos", "Impacto"];
                          const isSectionLabel = sectionKeywords.includes(text.trim());
                          
                          if (isSectionLabel) {
                            return <h3 className="!text-[10px] !font-bold !tracking-[0.25em] !uppercase !text-white/25 !mt-16 !mb-4 !leading-none uppercase" {...props}>{children}</h3>;
                          }
                          return <h3 className="text-xl font-light text-white/75 mt-14 mb-4" {...props}>{children}</h3>;
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
                        /* Smart paragraph parsing logic combined into the h3 override above, keep basic p here */
                        p: ({ children, ...props }: any) => {
                          const text = typeof children === "string" ? children : Array.isArray(children) ? children.map((c: any) => (typeof c === "string" ? c : "")).join("") : "";
                          const sectionKeywords = ["Problema", "Contexto", "Estratégia", "Resultados", "Solução", "Objetivo", "Tecnologias", "Arquitetura", "Conclusão", "Próximos Passos", "Impacto"];
                          
                          // Also handle if those words are just written as plain paragraphs
                          if (sectionKeywords.includes(text.trim()) && text.trim().length < 30) {
                            return <p className="!text-[10px] !font-bold !tracking-[0.25em] !uppercase !text-white/25 !mt-16 !mb-4 !leading-none">{children}</p>;
                          }
                          return <p {...props}>{children}</p>;
                        },
                      }}
                    >
                      {project.content}
                    </ReactMarkdown>
                </article>
              </div>
            ) : (
              <div className="py-24 text-center border border-white/[0.04] rounded-2xl">
                <p className="text-sm text-white/25 mb-4">
                  Este projeto ainda não possui conteúdo detalhado.
                </p>
                <Link
                  to="/projects"
                  className="text-sm text-white/40 hover:text-white/70 transition-colors underline underline-offset-4"
                >
                  Ver outros projetos
                </Link>
              </div>
            )}
          </main>

          {/* ── RIGHT: SIDEBAR ── */}
          {hasSidebar && (
            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-0">

                {/* Card: problem / solution / result */}
                {(project.cardProblem ||
                  project.cardSolution ||
                  project.cardResult) && (
                  <div className="mb-4 p-6 border border-white/[0.06] rounded-xl space-y-5 bg-white/[0.015]">
                    {project.cardProblem && (
                      <div>
                        <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-white/25 mb-1.5">
                          Problema
                        </p>
                        <p className="text-[13px] text-white/55 leading-relaxed">
                          {project.cardProblem}
                        </p>
                      </div>
                    )}
                    {project.cardSolution && (
                      <div>
                        <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-white/25 mb-1.5">
                          Solução
                        </p>
                        <p className="text-[13px] text-white/55 leading-relaxed">
                          {project.cardSolution}
                        </p>
                      </div>
                    )}
                    {project.cardResult && (
                      <div>
                        <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-white/25 mb-1.5">
                          Resultado
                        </p>
                        <p className="text-[13px] text-white/55 leading-relaxed">
                          {project.cardResult}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Stats / Results */}
                {hasStats && (
                  <div className="border-t border-white/[0.06] py-6 mb-2 space-y-5">
                    <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/25">
                      Métricas
                    </p>
                    {project.stats!.map((s, i) => (
                      <div key={i}>
                        <p className="text-lg font-light text-white/90 leading-tight">
                          {s.value}
                        </p>
                        <p className="text-[11px] text-white/30 mt-0.5 leading-snug">
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Technologies */}
                {project.tags && project.tags.length > 0 && (
                  <div className="py-6 border-t border-white/[0.06]">
                    <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/25 mb-4">
                      Tecnologias
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((t) => (
                        <Badge key={t} label={t} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Premises */}
                <ListBlock title="Premissas" items={project.premises} />

                {/* Strategy */}
                <ListBlock title="Estratégia" items={project.strategy} />

                {/* Results */}
                <ListBlock title="Resultados" items={project.results} />

                {/* Next Steps */}
                <ListBlock title="Próximos Passos" items={project.nextSteps} />

                {/* Links */}
                <div className="pt-6 border-t border-white/[0.06] space-y-3">
                  {project.link && project.link !== "#" && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full px-5 py-3.5 border border-white/10 rounded-xl text-sm text-white/55 hover:border-white/30 hover:text-white/80 transition-colors group"
                    >
                      Ver Demo
                      <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full px-5 py-3.5 border border-white/[0.06] rounded-xl text-sm text-white/35 hover:border-white/15 hover:text-white/60 transition-colors group"
                    >
                      Ver Código
                      <Github className="w-3.5 h-3.5 opacity-40 group-hover:opacity-80 transition-opacity" />
                    </a>
                  )}
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* ── FOOTER CTA ── */}
      <footer className="border-t border-white/[0.05] py-24 px-8 sm:px-12 lg:px-20 max-w-[1400px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
        <div>
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/20 mb-2">
            Próximo passo
          </p>
          <p className="text-2xl font-light text-white/70">
            Vamos conversar sobre o seu projeto.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/#contact"
            className="group relative px-8 py-3.5 rounded-full text-sm font-medium transition-all duration-500 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, hsl(142 71% 45%) 0%, hsl(142 60% 35%) 100%)',
              color: 'hsl(0 0% 4%)',
              boxShadow: '0 0 25px hsl(142 71% 45% / 0.25), 0 4px 15px hsl(0 0% 0% / 0.3)',
            }}
          >
            Entrar em contato
          </Link>
          <Link
            to="/projects"
            className="px-7 py-3 text-sm text-white/30 hover:text-white/60 transition-colors"
          >
            Ver mais projetos →
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default ProjectDetail;
import { useEffect, useRef, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, ArrowRight, Calendar, Copy, Check, Clock, FolderOpen, Linkedin, Link2, ZoomIn } from "lucide-react";
import { SiX } from "react-icons/si";
import { useContent, useContents, useTrailPosts } from "@/hooks/useContents";
import { useBlogTrails } from "@/hooks/useBlogTrails";
import { useProfiles } from "@/hooks/useProfile";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import remarkGfm from "remark-gfm";
import SEOHead from "@/components/SEOHead";
import PostCard from "@/components/portfolio/PostCard";
import { extractMarkdownImages, readingMinutes, stripInlineMarkdown } from "@/lib/text";
import ImageLightbox, { type LightboxImage } from "@/components/blog/ImageLightbox";
import { summarizeTrails, trailNeighbors, trailPath, trailStep } from "@/lib/trails";
import type { BlogTrail, Content } from "@/types/database";
import profilePhoto from "@/assets/profile-photo.jpg";

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
    <div className="fixed top-0 left-0 w-full h-[2px] z-50 bg-foreground/5">
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
      <div className="flex items-center justify-between px-5 py-2.5 bg-foreground/[0.04] border border-foreground/8 rounded-t-xl">
        <span className="text-[10px] font-mono tracking-widest uppercase text-foreground/30">
          {lang}
        </span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-[11px] text-foreground/30 hover:text-foreground/70 transition-colors"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>
      <pre className="bg-card border border-t-0 border-foreground/8 rounded-b-xl p-6 overflow-x-auto">
        <code className={`text-sm font-mono text-foreground/70 leading-relaxed ${className ?? ""}`}>
          {text}
        </code>
      </pre>
    </div>
  );
};

const SidebarLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{children}</p>
);

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
    <div className="pb-8">
      <SidebarLabel>Neste artigo</SidebarLabel>
      <nav aria-label="Neste artigo" className="scrollbar-themed max-h-[40vh] space-y-1 overflow-y-auto overscroll-contain border-l border-border pr-3">
        {headings.map((h, i) => (
          <a
            key={i}
            href={`#${h.id}`}
            className={`-ml-px block border-l border-transparent py-1 text-[13px] leading-snug transition-colors hover:border-primary hover:text-foreground ${
              h.level === 2 ? "pl-4 text-foreground/60" : "pl-7 text-foreground/40"
            }`}
          >
            {h.text}
          </a>
        ))}
      </nav>
    </div>
  );
};

/* ─────────────────────────────────────────────
   TRAILS LIST
  ───────────────────────────────────────────── */
const TrailsList = () => {
  const { data: trails = [] } = useBlogTrails();
  const { data: allContents = [] } = useContents();
  const summaries = summarizeTrails(trails, allContents);

  if (summaries.length === 0) return null;

  return (
    <div className="py-8 border-t border-foreground/[0.06]">
      <SidebarLabel>Trilhas de estudo</SidebarLabel>
      <div className="flex flex-wrap gap-2">
        {summaries.map(({ trail, posts }) => (
          <Link
            key={trail.id}
            to={trailPath(trail)}
            className="flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/10 rounded-full text-[11px] font-bold tracking-widest uppercase text-primary hover:bg-primary/15 hover:border-primary/30 transition-all duration-300"
          >
            {trail.name}
            <span className="px-1.5 py-0.5 bg-primary/10 rounded-full text-[9px]">{posts.length}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   SHARE
  ───────────────────────────────────────────── */
const shareButton =
  "flex h-10 w-10 items-center justify-center rounded-full border border-foreground/10 text-foreground/60 transition-all hover:border-primary/40 hover:text-primary";

const ShareButtons = ({ title }: { title: string }) => {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="py-8 border-t border-foreground/[0.06]">
      <SidebarLabel>Compartilhar</SidebarLabel>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, "_blank")}
          className={shareButton}
          aria-label="Compartilhar no LinkedIn"
        >
          <Linkedin className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => window.open(`https://x.com/intent/post?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(title)}`, "_blank")}
          className={shareButton}
          aria-label="Compartilhar no X"
        >
          <SiX className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={copyLink} className={shareButton} aria-label="Copiar link">
          {copied ? <Check className="h-4 w-4 text-primary" /> : <Link2 className="h-4 w-4" />}
        </button>
        {copied && <span role="status" className="text-xs text-primary">Link copiado</span>}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   COVER
  ───────────────────────────────────────────── */
// Natural aspect ratio (no letterboxing); a blurred copy behind it adds an ambient glow in the image's own colors.
const PostCover = ({ src, alt }: { src: string; alt: string }) => (
  <figure className="relative isolate mb-14">
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full scale-95 rounded-3xl object-cover opacity-40 blur-3xl"
    />
    <img
      src={src}
      alt={alt}
      className="block h-auto w-full rounded-2xl border border-foreground/10 shadow-2xl shadow-black/40 sm:rounded-3xl"
    />
  </figure>
);

/* ─────────────────────────────────────────────
   TRAIL NAVIGATION
  ───────────────────────────────────────────── */
const postPath = (post: Content) => `/blog/${post.slug || post.id}`;
const navCard =
  "group flex flex-col rounded-2xl border border-foreground/[0.08] p-5 transition-all duration-300 hover:border-primary/40 hover:bg-primary/[0.03]";

const TrailNavigation = ({ previous, next }: { previous?: Content; next?: Content }) => {
  if (!previous && !next) return null;
  return (
    <nav aria-label="Navegação da trilha" className="mt-20 grid max-w-3xl gap-4 border-t border-foreground/[0.06] pt-10 sm:grid-cols-2">
      {previous ? (
        <Link to={postPath(previous)} className={navCard}>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" /> Anterior
          </span>
          <span className="mt-2 line-clamp-2 text-foreground transition-colors group-hover:text-primary">{previous.title.trim()}</span>
        </Link>
      ) : (
        <span aria-hidden="true" className="hidden sm:block" />
      )}
      {next && (
        <Link to={postPath(next)} className={`${navCard} sm:items-end sm:text-right`}>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Próximo <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="mt-2 line-clamp-2 text-foreground transition-colors group-hover:text-primary">{next.title.trim()}</span>
        </Link>
      )}
    </nav>
  );
};

const TrailUpNext = ({ trail, posts }: { trail: BlogTrail; posts: Content[] }) => {
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="related-title" className="border-t border-foreground/[0.05] py-20 px-8 sm:px-12 lg:px-20 max-w-[1400px] mx-auto">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/30">Continue na trilha</p>
          <h2 id="related-title" className="text-2xl font-light text-foreground">{trail.name}</h2>
        </div>
        <Link to={trailPath(trail)} className="text-sm font-medium text-primary transition-colors hover:text-primary/80">
          Ver trilha completa →
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <PostCard key={post.id} post={post} style={{ animationDelay: `${index * 100}ms` }} />
        ))}
      </div>
    </section>
  );
};

const BlogPost = () => {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const { data: post, isLoading } = useContent(idOrSlug);
  const { data: profiles = [] } = useProfiles();
  const { data: trails = [] } = useBlogTrails();
  const trail = trails.find((item) => item.id === post?.trail_id);
  const { data: trailList = [] } = useTrailPosts(trail?.id);
  const author = profiles[0];
  const articleRef = useRef<HTMLDivElement>(null);
  const contentImages = useMemo(() => extractMarkdownImages(post?.markdown), [post?.markdown]);
  const [lightbox, setLightbox] = useState<{ images: LightboxImage[]; index: number } | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [idOrSlug]);

  const openImage = (src: string, alt: string) => {
    const index = contentImages.findIndex((image) => image.src === src);
    setLightbox(index >= 0 ? { images: contentImages, index } : { images: [{ src, alt }], index: 0 });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border border-foreground/10 rounded-full border-t-foreground/40 animate-spin" />
          <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/25">Carregando Post</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-8 pt-16 text-center">
        <SEOHead title="Artigo não encontrado" noindex />
        <h1 className="text-3xl font-light text-foreground">Artigo não encontrado</h1>
        <p className="text-foreground/50">O endereço pode ter mudado ou o artigo não está mais publicado.</p>
        <Link to="/blog" className="text-primary hover:underline">Ver todos os artigos</Link>
      </div>
    );
  }

  const readingTime = readingMinutes(post.markdown);
  const authorName = author?.full_name || "Waldo Eller";
  const { index: stepIndex, previous, next, upNext } = trailNeighbors(trailList, post.id);
  const { step, total } = trailStep(trailList, stepIndex);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-foreground/20 pt-16">
      <SEOHead
        title={post.title}
        description={post.description || `Leia "${post.title}" nas trilhas de estudo de Waldo Eller.`}
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
            name: authorName,
            url: "https://waldoeller.com/about",
          },
          publisher: {
            "@type": "Person",
            name: authorName,
          },
          ...(post.image_url && { image: post.image_url }),
          ...(trail && {
            isPartOf: { "@type": "CollectionPage", name: trail.name, url: `https://waldoeller.com${trailPath(trail)}` },
            ...(stepIndex >= 0 && { position: step }),
          }),
          wordCount: post.markdown?.split(/\s+/).length,
          timeRequired: `PT${readingTime}M`,
        }}
      />
      <ScrollProgress />

      {/* HEADER */}
      <header className="pt-16 sm:pt-20 pb-14 px-8 sm:px-12 lg:px-20 max-w-[1400px] mx-auto animate-[fadeInUp_0.6s_ease-out_both]">
        <div className="max-w-4xl">
          {/* Back to the trail the post belongs to; posts outside a trail go back to the trails list */}
          <Link
            to={trail ? trailPath(trail) : "/blog"}
            className="group mb-10 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary shadow-[0_0_15px_hsl(var(--primary)/0.1)] transition-all duration-300 hover:border-primary/50 hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            {trail ? trail.name : "Trilhas"}
          </Link>

          <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            {stepIndex >= 0 && (
              <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                Etapa {pad(step)} de {pad(total)}
              </span>
            )}
            {post.created_at && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <time dateTime={post.created_at}>{format(new Date(post.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</time>
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {readingTime} min de leitura
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-foreground leading-[1.08]">
            {post.title.trim()}
          </h1>

          {post.description && (
            <p className="mt-6 max-w-3xl text-lg sm:text-xl font-light leading-relaxed text-foreground/60">
              {stripInlineMarkdown(post.description)}
            </p>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-foreground/[0.06] pt-6">
            <div className="flex items-center gap-3">
              <img
                src={author?.avatar_url || profilePhoto}
                alt=""
                className="h-11 w-11 rounded-full border border-foreground/10 object-cover"
              />
              <div>
                <p className="text-sm font-medium text-foreground">{authorName}</p>
                {author?.current_focus && <p className="text-xs text-muted-foreground">{author.current_focus}</p>}
              </div>
            </div>
            {post.drive_folder_url && (
              <a
                href={post.drive_folder_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:border-primary/40 rounded-full text-sm font-medium transition-all"
              >
                <FolderOpen className="w-4 h-4" />
                Ver arquivos
              </a>
            )}
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-20 pb-32">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_280px] gap-16 xl:gap-20">
          <main className="min-w-0">
            {post.image_url && <PostCover src={post.image_url} alt={post.title.trim()} />}

            <div ref={articleRef}>
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
                    h2: ({ children, ...props }: any) => {
                      const text = typeof children === "string" ? children : Array.isArray(children) ? children.map((c: any) => (typeof c === "string" ? c : "")).join("") : "";
                      const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
                      return <h2 id={id} className="text-3xl font-light text-foreground/90 mt-20 mb-6 pb-5 border-b border-foreground/[0.06] scroll-mt-24" {...props}>{children}</h2>;
                    },
                    h3: ({ children, ...props }: any) => {
                      const text = typeof children === "string" ? children : Array.isArray(children) ? children.map((c: any) => (typeof c === "string" ? c : "")).join("") : "";
                      const sectionKeywords = ["Problema", "Contexto", "Estratégia", "Resultados", "Solução", "Objetivo", "Tecnologias", "Arquitetura", "Conclusão", "Próximos Passos", "Impacto", "Insights"];
                      const isSectionLabel = sectionKeywords.includes(text.trim());
                      const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

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
                  {post.markdown || ""}
                </ReactMarkdown>
              </article>
            </div>

            <TrailNavigation previous={previous} next={next} />
          </main>

          <aside className="hidden lg:block">
            <div className="sticky top-28">
              {post.markdown && <TableOfContents markdown={post.markdown} />}

              {author?.bio_summary && (
                <div className="py-8 border-t border-foreground/[0.06]">
                  <SidebarLabel>Sobre o autor</SidebarLabel>
                  <p className="text-sm text-foreground/60 leading-relaxed mb-5">{author.bio_summary}</p>
                  <Link to="/about" className="text-xs font-semibold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors">
                    Ver perfil completo →
                  </Link>
                </div>
              )}

              <ShareButtons title={post.title} />
              <TrailsList />
            </div>
          </aside>
        </div>
      </div>

      <ImageLightbox
        images={lightbox?.images ?? []}
        index={lightbox?.index ?? null}
        onIndexChange={(index) => setLightbox((current) => (current ? { ...current, index } : current))}
        onClose={() => setLightbox(null)}
      />

      {/* MORE FROM THE TRAIL */}
      {trail && <TrailUpNext trail={trail} posts={upNext} />}

      {/* FOOTER CTA */}
      <footer className="border-t border-foreground/[0.05] py-20 px-8 sm:px-12 lg:px-20 max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-8">
        <div>
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/30 mb-2">Continue lendo</p>
          <p className="text-2xl font-light text-foreground/70">Explore as outras trilhas de estudo.</p>
        </div>
        <Link
          to="/blog"
          className="px-8 py-3 border border-foreground/15 rounded-full text-sm text-foreground/60 hover:border-foreground/40 hover:text-foreground transition-colors"
        >
          Voltar às Trilhas
        </Link>
      </footer>
    </div>
  );
};

export default BlogPost;

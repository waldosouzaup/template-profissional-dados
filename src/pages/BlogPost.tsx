import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, FolderOpen } from "lucide-react";
import { useContent, useContents, useTrailPosts } from "@/hooks/useContents";
import { useBlogTrails } from "@/hooks/useBlogTrails";
import { useProfiles } from "@/hooks/useProfile";
import SEOHead from "@/components/SEOHead";
import PostCard from "@/components/portfolio/PostCard";
import { readingMinutes, stripInlineMarkdown } from "@/lib/text";
import { safeUrl } from "@/lib/url";
import MarkdownArticle from "@/components/article/MarkdownArticle";
import { ArticleCover } from "@/components/article/ArticleCover";
import { ScrollProgress } from "@/components/article/ScrollProgress";
import { AboutAuthor, ShareButtons, SidebarLabel, TableOfContents } from "@/components/article/sidebar";
import { AuthorByline } from "@/components/article/AuthorByline";
import { summarizeTrails, trailNeighbors, trailPath, trailStep } from "@/lib/trails";
import type { BlogTrail, Content } from "@/types/database";

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [idOrSlug]);

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
            <AuthorByline author={author} />
            {safeUrl(post.drive_folder_url) && (
              <a
                href={safeUrl(post.drive_folder_url)}
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
            {post.image_url && <ArticleCover src={post.image_url} alt={post.title.trim()} />}

            <MarkdownArticle markdown={post.markdown || ""} />

            <TrailNavigation previous={previous} next={next} />
          </main>

          <aside className="hidden lg:block">
            <div className="sticky top-28">
              {post.markdown && <TableOfContents markdown={post.markdown} />}

              {author?.bio_summary && <AboutAuthor bio={author.bio_summary} />}

              <ShareButtons title={post.title} />
              <TrailsList />
            </div>
          </aside>
        </div>
      </div>

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

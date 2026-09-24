import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, Clock, Layers } from "lucide-react";
import { useBlogTrails } from "@/hooks/useBlogTrails";
import { useTrailPosts } from "@/hooks/useContents";
import SEOHead from "@/components/SEOHead";
import PostCard from "@/components/portfolio/PostCard";
import { readingMinutes } from "@/lib/text";
import { stepLabel, trailPath } from "@/lib/trails";

const SITE_URL = "https://waldoeller.com";

const backLink =
  "group mb-10 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary shadow-[0_0_15px_hsl(var(--primary)/0.1)] transition-all duration-300 hover:border-primary/50 hover:bg-primary/10";

const BlogTrail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: trails = [], isLoading: loadingTrails } = useBlogTrails();
  const trail = trails.find((item) => item.slug === slug);
  const { data: posts = [], isLoading: loadingPosts } = useTrailPosts(trail?.id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (loadingTrails || (trail && loadingPosts)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border border-foreground/10 rounded-full border-t-foreground/40 animate-spin" />
          <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/25">Carregando trilha</p>
        </div>
      </div>
    );
  }

  if (!trail) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-8 pt-16 text-center">
        <SEOHead title="Trilha não encontrada" noindex />
        <h1 className="text-3xl font-light text-foreground">Trilha não encontrada</h1>
        <p className="text-foreground/50">O endereço pode ter mudado ou a trilha não está mais publicada.</p>
        <Link to="/blog" className="text-primary hover:underline">Ver todas as trilhas</Link>
      </div>
    );
  }

  const url = `${SITE_URL}${trailPath(trail)}`;
  const minutes = posts.reduce((total, post) => total + readingMinutes(post.markdown), 0);
  const first = posts[0];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-foreground/20 pt-16">
      <SEOHead
        title={`${trail.name} — Trilha de estudo`}
        description={trail.description || `Trilha de estudo "${trail.name}": ${posts.length} artigos em sequência, por Waldo Eller.`}
        canonical={url}
        ogImage={trail.image_url || first?.image_url}
        ogType="website"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: trail.name,
          description: trail.description || undefined,
          url,
          isPartOf: { "@type": "Blog", name: "Blog — Waldo Eller", url: `${SITE_URL}/blog` },
          mainEntity: {
            "@type": "ItemList",
            itemListOrder: "https://schema.org/ItemListOrderAscending",
            numberOfItems: posts.length,
            itemListElement: posts.map((post, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: post.title.trim(),
              url: `${SITE_URL}/blog/${post.slug || post.id}`,
            })),
          },
        }}
      />

      <header className="pt-16 sm:pt-20 pb-14 px-8 sm:px-12 lg:px-20 max-w-[1400px] mx-auto animate-[fadeInUp_0.6s_ease-out_both]">
        <div className="max-w-4xl">
          <Link to="/blog" className={backLink}>
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Blog
          </Link>

          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Layers className="h-5 w-5 text-primary" aria-hidden="true" />
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Trilha de estudo</p>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-foreground leading-[1.08]">{trail.name}</h1>

          {trail.description && (
            <p className="mt-6 max-w-3xl text-lg sm:text-xl font-light leading-relaxed text-foreground/60">{trail.description}</p>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-foreground/[0.06] pt-6">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                {posts.length} {posts.length === 1 ? "artigo" : "artigos"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {minutes} min de leitura
              </span>
            </div>
            {first && (
              <Link
                to={`/blog/${first.slug || first.id}`}
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.25)] transition-all hover:shadow-[0_0_28px_hsl(var(--primary)/0.4)]"
              >
                Começar pela {(stepLabel(first.trail_position) ?? "primeira etapa").toLowerCase()}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
        </div>
      </header>

      <section aria-labelledby="trail-posts-title" className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-20 pb-40">
        <h2 id="trail-posts-title" className="mb-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Ordem de estudo
        </h2>
        {posts.length > 0 ? (
          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <li key={post.id} className="grid">
                <PostCard post={post} style={{ animationDelay: `${(index + 2) * 100}ms` }} />
              </li>
            ))}
          </ol>
        ) : (
          <p className="rounded-3xl border border-foreground/[0.06] py-20 text-center text-foreground/40">
            Esta trilha ainda não tem artigos publicados.
          </p>
        )}
      </section>
    </div>
  );
};

export default BlogTrail;

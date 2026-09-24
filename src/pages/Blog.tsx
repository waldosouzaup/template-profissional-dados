import { useEffect } from "react";
import { BookOpen, Layers } from "lucide-react";
import { useContents } from "@/hooks/useContents";
import { useBlogTrails } from "@/hooks/useBlogTrails";
import SEOHead from "@/components/SEOHead";
import PostCard from "@/components/portfolio/PostCard";
import TrailCard from "@/components/blog/TrailCard";
import { summarizeTrails, trailPath } from "@/lib/trails";

const SITE_URL = "https://waldoeller.com";

const Blog = () => {
  const { data: contents = [], isLoading: loadingPosts } = useContents();
  const { data: trails = [], isLoading: loadingTrails } = useBlogTrails();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const summaries = summarizeTrails(trails, contents);
  // Posts outside any trail (none, or a trail that no longer exists) are still reachable.
  const loosePosts = contents.filter((post) => !post.trail_id || !trails.some((trail) => trail.id === post.trail_id));

  if (loadingPosts || loadingTrails) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border border-foreground/10 rounded-full border-t-foreground/40 animate-spin" />
          <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/25">Carregando Blog</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-foreground/20 pt-16">
      <SEOHead
        title="Blog — Trilhas de estudo"
        description="Trilhas de estudo com artigos em sequência sobre Linux, Cloud, Dados e IA, escritas por Waldo Eller."
        canonical={`${SITE_URL}/blog`}
        ogType="website"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Blog — Waldo Eller",
          description: "Trilhas de estudo com artigos em sequência sobre Linux, Cloud, Dados e IA.",
          url: `${SITE_URL}/blog`,
          author: { "@type": "Person", name: "Waldo Eller" },
          hasPart: summaries.map(({ trail, posts }) => ({
            "@type": "CollectionPage",
            name: trail.name,
            url: `${SITE_URL}${trailPath(trail)}`,
            numberOfItems: posts.length,
          })),
        }}
      />

      {/* HERO */}
      <section className="pt-32 pb-16 px-8 sm:px-12 lg:px-20 max-w-[1400px] mx-auto animate-[fadeInUp_0.6s_ease-out_both]">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Layers className="w-6 h-6 text-primary" />
          </div>
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-foreground/30">
            Trilhas de estudo
          </p>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-light tracking-tight text-foreground leading-[1.05] max-w-4xl">
          Aprenda em <span className="text-primary italic">trilhas</span>, um passo de cada vez.
        </h1>
        <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-foreground/60">
          Escolha um assunto e siga os artigos na ordem de estudo, do primeiro ao último.
        </p>
      </section>

      {/* TRAILS */}
      <div className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-20 pb-40">
        {summaries.length > 0 && (
          <section aria-label="Trilhas de estudo" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {summaries.map((summary, index) => (
              <TrailCard key={summary.trail.id} summary={summary} style={{ animationDelay: `${(index + 2) * 100}ms` }} />
            ))}
          </section>
        )}

        {loosePosts.length > 0 && (
          <section aria-labelledby="loose-posts-title" className={summaries.length > 0 ? "mt-24" : ""}>
            <h2 id="loose-posts-title" className="mb-8 text-2xl font-light text-foreground">
              {summaries.length > 0 ? "Outros artigos" : "Artigos"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loosePosts.map((post, index) => (
                <PostCard key={post.id} post={post} style={{ animationDelay: `${(index + 2) * 100}ms` }} />
              ))}
            </div>
          </section>
        )}

        {contents.length === 0 && (
          <div className="py-32 text-center border border-foreground/[0.03] rounded-3xl bg-foreground/[0.01]">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-foreground/[0.03] flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-foreground/10" />
            </div>
            <p className="text-foreground/30 tracking-widest uppercase text-xs mb-2">Nenhum artigo publicado ainda.</p>
            <p className="text-foreground/15 text-sm">Volte em breve para novos conteúdos.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;

import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { useContents } from "@/hooks/useContents";
import SEOHead from "@/components/SEOHead";
import PostCard from "@/components/portfolio/PostCard";

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: contents = [], isLoading } = useContents();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = Array.from(new Set(contents.map(post => post.category).filter(Boolean))) as string[];
  
  const categoryCounts = contents.reduce((acc, post) => {
    if (post.category) {
      acc[post.category] = (acc[post.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const filteredContents = selectedCategory 
    ? contents.filter(post => post.category === selectedCategory)
    : contents;

  if (isLoading) {
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
        title="Blog — Insights sobre Dados, IA e Tecnologia"
        description="Artigos e insights sobre Dados, Inteligência Artificial, Tecnologia e NoCode por Waldo Eller."
        canonical="https://waldoeller.com/blog"
        ogType="website"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Blog — Waldo Eller",
          description: "Artigos e insights sobre Dados, Inteligência Artificial, Tecnologia e NoCode.",
          url: "https://waldoeller.com/blog",
          author: {
            "@type": "Person",
            name: "Waldo Eller",
          },
          blogPost: contents.map((post) => ({
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            datePublished: post.created_at,
            url: `https://waldoeller.com/blog/${post.slug || post.id}`,
            ...(post.image_url && { image: post.image_url }),
          })),
        }}
      />

      {/* HERO */}
      <section className="pt-32 pb-16 px-8 sm:px-12 lg:px-20 max-w-[1400px] mx-auto animate-[fadeInUp_0.6s_ease-out_both]">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-foreground/30">
            Insights & Artigos
          </p>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-light tracking-tight text-foreground leading-[1.05] max-w-4xl">
          Explorando a fronteira dos <span className="text-primary italic">Dados e IA</span>.
        </h1>
      </section>

      {/* CATEGORIES NAVIGATION */}
      <section className="px-8 sm:px-12 lg:px-20 max-w-[1400px] mx-auto mb-12 animate-[fadeInUp_0.7s_ease-out_0.2s_both]">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-2.5 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all duration-300 border ${
              selectedCategory === null
                ? "bg-primary text-[#0a0a0a] border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
                : "bg-foreground/[0.03] text-foreground/40 border-foreground/[0.06] hover:border-foreground/20 hover:text-foreground"
            }`}
          >
            Todos
            <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[9px] ${
              selectedCategory === null ? "bg-background/20" : "bg-foreground/10"
            }`}>
              {contents.length}
            </span>
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2.5 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all duration-300 border flex items-center ${
                selectedCategory === category
                  ? "bg-primary text-[#0a0a0a] border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
                  : "bg-foreground/[0.03] text-foreground/40 border-foreground/[0.06] hover:border-foreground/20 hover:text-foreground"
              }`}
            >
              {category}
              <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[9px] ${
                selectedCategory === category ? "bg-background/20" : "bg-foreground/10"
              }`}>
                {categoryCounts[category]}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* BLOG GRID */}
      <div className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-20 pb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContents.map((post, index) => (
            <PostCard key={post.id} post={post} style={{ animationDelay: `${(index + 2) * 100}ms` }} />
          ))}
        </div>

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

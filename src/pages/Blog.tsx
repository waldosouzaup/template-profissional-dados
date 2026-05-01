import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Calendar, ChevronRight, Clock } from "lucide-react";
import { useContents } from "@/hooks/useContents";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import SEOHead from "@/components/SEOHead";

/** Estimate reading time from markdown text */
const estimateReadingTime = (text?: string): number => {
  if (!text) return 1;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

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
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border border-white/10 rounded-full border-t-white/40 animate-spin" />
          <p className="text-[11px] tracking-[0.3em] uppercase text-white/25">Carregando Blog</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-white/20 pt-16">
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
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/30">
            Insights & Artigos
          </p>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-light tracking-tight text-white leading-[1.05] max-w-4xl">
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
                : "bg-white/[0.03] text-white/40 border-white/[0.06] hover:border-white/20 hover:text-white"
            }`}
          >
            Todos
            <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[9px] ${
              selectedCategory === null ? "bg-[#0a0a0a]/20" : "bg-white/10"
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
                  : "bg-white/[0.03] text-white/40 border-white/[0.06] hover:border-white/20 hover:text-white"
              }`}
            >
              {category}
              <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[9px] ${
                selectedCategory === category ? "bg-[#0a0a0a]/20" : "bg-white/10"
              }`}>
                {categoryCounts[category]}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* BLOG GRID */}
      <div className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-20 pb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredContents.map((post, index) => {
            const readingTime = estimateReadingTime(post.markdown);
            return (
              <Link 
                key={post.id} 
                to={`/blog/${post.slug || post.id}`}
                className="group relative bg-white/[0.015] border border-white/[0.04] rounded-2xl overflow-hidden hover:border-white/10 hover:bg-white/[0.025] transition-all duration-500 flex flex-col"
                style={{ animation: `fadeInUp 0.5s ease-out ${index * 100}ms both` }}
              >
                {/* Image Container */}
                <div className="aspect-[16/9] w-full overflow-hidden bg-white/[0.02]">
                  {post.image_url ? (
                    <img 
                      src={post.image_url} 
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/[0.02] to-white/[0.005]">
                      <BookOpen className="w-12 h-12 text-white/5 opacity-20" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-primary border border-primary/20 bg-primary/5 px-2 py-1 rounded-sm">
                      {post.category || "Post"}
                    </span>
                    {post.created_at && (
                      <div className="flex items-center gap-1.5 text-[9px] text-white/20 uppercase tracking-widest">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(post.created_at), "dd MMM, yyyy", { locale: ptBR })}
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-[9px] text-white/20 uppercase tracking-widest">
                      <Clock className="w-3 h-3" />
                      {readingTime} min
                    </div>
                  </div>

                  <h2 className="text-xl font-light text-white group-hover:text-primary transition-colors mb-4 leading-tight">
                    {post.title}
                  </h2>

                  <p className="text-sm text-white/40 leading-relaxed mb-8 line-clamp-3">
                    {post.description}
                  </p>

                  <div className="mt-auto flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-white/40 group-hover:text-white transition-colors">
                    Ler artigo completo
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {contents.length === 0 && (
          <div className="py-32 text-center border border-white/[0.03] rounded-3xl bg-white/[0.01]">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/[0.03] flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white/10" />
            </div>
            <p className="text-white/30 tracking-widest uppercase text-xs mb-2">Nenhum artigo publicado ainda.</p>
            <p className="text-white/15 text-sm">Volte em breve para novos conteúdos.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;

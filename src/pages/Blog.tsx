import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Calendar, ChevronRight } from "lucide-react";
import { useContents } from "@/hooks/useContents";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Blog = () => {
  const { data: contents = [], isLoading } = useContents();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-white/20">
      {/* TOP NAV */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-5 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.04]">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white/80 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Voltar para Início
        </Link>
        <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/25 hidden sm:block">
          Blog & Conteúdo
        </span>
        <div className="w-20" /> {/* Spacer */}
      </header>

      {/* HERO */}
      <section className="pt-32 pb-16 px-8 sm:px-12 lg:px-20 max-w-[1400px] mx-auto">
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

      {/* BLOG GRID */}
      <div className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-20 pb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {contents.map((post, index) => (
            <Link 
              key={post.id} 
              to={`/blog/${post.id}`}
              className="group relative bg-white/[0.015] border border-white/[0.04] rounded-2xl overflow-hidden hover:border-white/10 hover:bg-white/[0.025] transition-all duration-500 flex flex-col"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image Container */}
              <div className="aspect-[16/9] w-full overflow-hidden bg-white/[0.02]">
                {post.image_url ? (
                  <img 
                    src={post.image_url} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-white/5 opacity-20" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-primary">Post</span>
                  {post.created_at && (
                    <div className="flex items-center gap-1.5 text-[9px] text-white/20 uppercase tracking-widest">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(post.created_at), "dd MMM, yyyy", { locale: ptBR })}
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-light text-white group-hover:text-primary transition-colors mb-4 leading-tight">
                  {post.title}
                </h3>

                <p className="text-sm text-white/40 leading-relaxed mb-8 line-clamp-3">
                  {post.description}
                </p>

                <div className="mt-auto flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-white/40 group-hover:text-white transition-colors">
                  Ler artigo completo
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {contents.length === 0 && (
          <div className="py-24 text-center border border-white/[0.03] rounded-3xl">
            <p className="text-white/20 tracking-widest uppercase text-xs">Nenhum artigo publicado ainda.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;

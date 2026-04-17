import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";
import { useProfiles } from "@/hooks/useProfile";
import ReactMarkdown from "react-markdown";

const About = () => {
  const { data: profiles = [], isLoading } = useProfiles();
  const profile = profiles[0];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border border-white/10 rounded-full border-t-white/40 animate-spin" />
          <p className="text-[11px] tracking-[0.3em] uppercase text-white/25">Carregando</p>
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
          Sobre Mim
        </span>
        <div className="w-20" /> {/* Spacer */}
      </header>

      {/* HERO */}
      <section className="pt-32 pb-20 px-8 sm:px-12 lg:px-20 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/30">
            Minha História
          </p>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-light tracking-tight text-white leading-[1.05] max-w-4xl">
          Paixão por transformar dados em <span className="text-primary italic">conhecimento</span>.
        </h1>
      </section>

      {/* CONTENT */}
      <div className="max-w-[1000px] mx-auto px-8 sm:px-12 lg:px-20 pb-40">
        <article className="
          prose prose-invert max-w-none
          prose-headings:font-light prose-headings:tracking-tight
          prose-h2:text-3xl prose-h2:text-white/90 prose-h2:mt-20 prose-h2:mb-6 prose-h2:pb-5 prose-h2:border-b prose-h2:border-white/[0.06]
          prose-p:text-white/55 prose-p:leading-[2.2] prose-p:text-[18px] prose-p:my-8
          prose-strong:text-white/85 prose-strong:font-medium
          prose-blockquote:border-l-[3px] prose-blockquote:border-white/15 prose-blockquote:pl-7 prose-blockquote:text-white/40 prose-blockquote:my-12
        ">
          <ReactMarkdown>
            {profile?.bio_detailed || "Conteúdo em breve..."}
          </ReactMarkdown>
        </article>
      </div>
      
      {/* FOOTER CTA */}
      <footer className="border-t border-white/[0.05] py-20 px-8 sm:px-12 lg:px-20 max-w-[1400px] mx-auto text-center">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/20 mb-6">
          Gostou do que leu?
        </p>
        <Link
          to="/#contact"
          className="inline-block px-10 py-4 border border-white/15 rounded-full text-sm text-white/60 hover:border-white/40 hover:text-white transition-colors"
        >
          Vamos conversar
        </Link>
      </footer>
    </div>
  );
};

export default About;

import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCustomPages } from "@/hooks/useCustomPages";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SEOHead from "@/components/SEOHead";
import { ChevronLeft } from "lucide-react";

export default function CustomPageView() {
  const { slug } = useParams();
  const { data: pages = [], isLoading } = useCustomPages();
  const page = pages.find(p => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border border-foreground/10 rounded-full border-t-foreground/40 animate-spin" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-foreground">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-foreground/60 mb-8">Página não encontrada.</p>
        <Link to="/" className="text-primary hover:underline">Voltar para o início</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-foreground/20 pt-16">
      <SEOHead
        title={`${page.title} — Waldo Eller`}
        description={`Leia mais sobre ${page.title} no site de Waldo Eller.`}
      />

      <div className="max-w-[800px] mx-auto px-8 sm:px-12 lg:px-20 pt-20 pb-40">
        <div className="mb-12 animate-[fadeInUp_0.5s_ease-out_both]">
          <Link to="/" className="inline-flex items-center text-xs font-bold tracking-widest uppercase text-foreground/40 hover:text-foreground transition-colors mb-8">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Voltar
          </Link>
          <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-foreground leading-tight mb-6">
            {page.title}
          </h1>
        </div>

        <div className="prose prose-invert prose-lg max-w-none prose-headings:font-light prose-headings:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-xl prose-img:border prose-img:border-foreground/10 animate-[fadeInUp_0.6s_ease-out_0.2s_both]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {page.markdown || ""}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

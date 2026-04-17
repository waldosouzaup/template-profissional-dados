import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, User, Book as BookIcon, GraduationCap, ExternalLink, Calendar, Loader2 } from "lucide-react";
import { useProfiles } from "@/hooks/useProfile";
import { useBooks } from "@/hooks/useBooks";
import { useCourses } from "@/hooks/useCourses";
import ReactMarkdown from "react-markdown";

const About = () => {
  const { data: profiles = [], isLoading: loadingProfile } = useProfiles();
  const { data: books = [], isLoading: loadingBooks } = useBooks();
  const { data: courses = [], isLoading: loadingCourses } = useCourses();
  
  const profile = profiles[0];
  const isLoading = loadingProfile || loadingBooks || loadingCourses;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
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

      {/* CONTENT & BIO */}
      <div className="max-w-[1000px] mx-auto px-8 sm:px-12 lg:px-20 pb-20">
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

      {/* BOOKS SECTION */}
      {books.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-20 py-20 border-t border-white/[0.04]">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <BookIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/30 mb-1">Inpiração</p>
              <h3 className="text-2xl font-light text-white">Estante de Livros</h3>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div key={book.id} className="glass-panel p-6 rounded-2xl group hover:border-primary/30 transition-all">
                {book.image_url && (
                  <div className="aspect-[3/4] rounded-lg overflow-hidden mb-4 bg-white/5">
                    <img src={book.image_url} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <h4 className="text-lg font-medium text-white mb-1">{book.title}</h4>
                <p className="text-sm text-white/40 mb-3">{book.author}</p>
                {book.description && (
                  <p className="text-sm text-white/60 leading-relaxed line-clamp-3">{book.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* COURSES SECTION */}
      {courses.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-20 py-20 border-t border-white/[0.04] bg-white/[0.01]">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/30 mb-1">Certificações</p>
              <h3 className="text-2xl font-light text-white">Cursos Extras</h3>
            </div>
          </div>

          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/[0.03] transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-medium text-white">{course.title}</h4>
                    {course.period && (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full text-[10px] font-medium tracking-wide text-white/40 uppercase">
                        <Calendar className="w-3 h-3" />
                        {course.period}
                      </span>
                    )}
                  </div>
                  {course.description && (
                    <p className="text-sm text-white/60 leading-relaxed mb-3">{course.description}</p>
                  )}
                  {course.topics && course.topics.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {course.topics.map((topic, i) => (
                        <span key={i} className="text-[11px] text-primary/70 bg-primary/5 px-2 py-0.5 rounded border border-primary/10 inline-block">
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                {course.certificate_url && (
                  <a 
                    href={course.certificate_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium text-white transition-all group shrink-0"
                  >
                    Ver Certificado
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      
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


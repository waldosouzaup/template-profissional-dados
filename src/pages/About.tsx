import { useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Book as BookIcon, GraduationCap, ExternalLink, Calendar, Loader2, Mail, Phone, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-white/20 pt-16">
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
          {profile?.about_title || "Paixão por transformar dados em"} <span className="text-primary italic">conhecimento</span>.
        </h1>
        
        {(profile?.phone || profile?.email) && (
          <div className="flex flex-wrap items-center gap-6 mt-8">
            {profile?.phone && (
              <a href={`tel:${profile.phone}`} className="flex items-center gap-2 text-white/50 hover:text-primary transition-colors">
                <Phone className="w-4 h-4" />
                <span className="text-sm">{profile.phone}</span>
              </a>
            )}
            {profile?.email && (
              <a href={`mailto:${profile.email}`} className="flex items-center gap-2 text-white/50 hover:text-primary transition-colors">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{profile.email}</span>
              </a>
            )}
          </div>
        )}
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
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/30 mb-1">Inspiração</p>
              <h3 className="text-2xl font-light text-white">Estante de Livros</h3>
            </div>
          </div>
          
          {/* Improved Book Grid — Bookshelf Style */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {books.map((book) => (
              <div 
                key={book.id} 
                className="group cursor-default"
              >
                {/* Book Cover */}
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-white/5 border border-white/[0.06] shadow-lg shadow-black/30 transition-all duration-500 group-hover:shadow-primary/10 group-hover:border-primary/20 group-hover:-translate-y-1 group-hover:rotate-[-1deg]">
                  {book.image_url ? (
                    <img 
                      src={book.image_url} 
                      alt={book.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-white/[0.04] to-white/[0.01]">
                      <BookIcon className="w-8 h-8 text-white/15 mb-3" />
                      <p className="text-[11px] text-white/30 text-center font-medium leading-tight">{book.title}</p>
                    </div>
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-3">
                    <p className="text-[12px] font-medium text-white leading-tight">{book.title}</p>
                    {book.author && (
                      <p className="text-[10px] text-white/50 mt-0.5">{book.author}</p>
                    )}
                  </div>

                  {/* Spine effect */}
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-white/10 via-white/5 to-white/10 group-hover:from-primary/30 group-hover:via-primary/10 group-hover:to-primary/30 transition-colors duration-500" />
                </div>
                
                {/* Book Info Below Cover */}
                <div className="mt-2.5 px-0.5">
                  <h4 className="text-[12px] font-medium text-white/70 leading-tight line-clamp-2 group-hover:text-white/90 transition-colors">{book.title}</h4>
                  {book.author && (
                    <p className="text-[10px] text-white/30 mt-0.5 truncate">{book.author}</p>
                  )}
                </div>
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
      
      {/* FOOTER CTA — Highlighted */}
      <footer className="border-t border-white/[0.05] py-24 px-8 sm:px-12 lg:px-20 max-w-[1400px] mx-auto text-center">
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
          </div>
          
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/20 mb-4">
            Gostou do que leu?
          </p>
          <h3 className="text-3xl sm:text-4xl font-light text-white/80 mb-8 max-w-lg mx-auto leading-tight">
            Vamos transformar dados em <span className="text-primary">resultados</span> juntos.
          </h3>
          <Link
            to="/#contact"
            className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-full text-sm font-medium transition-all duration-500 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, hsl(142 71% 45%) 0%, hsl(142 60% 35%) 100%)',
              color: 'hsl(0 0% 4%)',
              boxShadow: '0 0 30px hsl(142 71% 45% / 0.2), 0 4px 20px hsl(0 0% 0% / 0.3)',
            }}
          >
            Vamos Conversar
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default About;



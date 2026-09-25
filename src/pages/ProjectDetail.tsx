import { useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, ExternalLink, Github } from "lucide-react";
import { useProject, useProjects } from "@/hooks/useProjects";
import { useProfiles } from "@/hooks/useProfile";
import SEOHead from "@/components/SEOHead";
import ProjectCard from "@/components/portfolio/ProjectCard";
import ProjectImages from "@/components/portfolio/ProjectImages";
import MarkdownArticle from "@/components/article/MarkdownArticle";
import { ArticleCover } from "@/components/article/ArticleCover";
import { AuthorByline } from "@/components/article/AuthorByline";
import { ScrollProgress } from "@/components/article/ScrollProgress";
import { AboutAuthor, ShareButtons, SidebarLabel, TableOfContents } from "@/components/article/sidebar";
import { readingMinutes, stripInlineMarkdown } from "@/lib/text";
import { safeUrl } from "@/lib/url";
import type { Project } from "@/types/project";

const SITE_URL = "https://waldoeller.com";

const backLink =
  "group mb-10 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary shadow-[0_0_15px_hsl(var(--primary)/0.1)] transition-all duration-300 hover:border-primary/50 hover:bg-primary/10";

const isLink = (url?: string | null) => !!url && url.trim() !== "" && url.trim() !== "#";

/* ─────────────────────────────────────────────
   PROJECT LINKS
 ───────────────────────────────────────────── */
const ProjectLinks = ({ project, stacked = false }: { project: Project; stacked?: boolean }) => {
  const demo = isLink(project.demoUrl) ? safeUrl(project.demoUrl) : undefined;
  const code = isLink(project.githubUrl) ? safeUrl(project.githubUrl) : undefined;
  if (!demo && !code) return null;
  return (
    <div className={stacked ? "flex flex-col gap-3" : "flex flex-wrap items-center gap-3"}>
      {demo && (
        <a
          href={demo}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.25)] transition-shadow hover:shadow-[0_0_28px_hsl(var(--primary)/0.4)]"
        >
          Ver projeto online
          <ExternalLink className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
        </a>
      )}
      {code && (
        <a
          href={code}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground/15 px-5 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:border-primary/40 hover:text-primary"
        >
          <Github className="h-4 w-4" aria-hidden="true" />
          Ver código
        </a>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   OTHER PROJECTS
 ───────────────────────────────────────────── */
// Same category first, then the rest in portfolio order.
const relatedProjects = (all: Project[], current: Project, count = 3) => {
  const others = all.filter((project) => project.id !== current.id);
  return [
    ...others.filter((project) => project.category === current.category),
    ...others.filter((project) => project.category !== current.category),
  ].slice(0, count);
};

const OtherProjects = ({ projects }: { projects: Project[] }) => {
  if (projects.length === 0) return null;
  return (
    <section aria-labelledby="related-projects-title" className="border-t border-foreground/[0.05] py-20 px-8 sm:px-12 lg:px-20 max-w-[1400px] mx-auto">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/30">Continue explorando</p>
          <h2 id="related-projects-title" className="text-2xl font-light text-foreground">Outros projetos</h2>
        </div>
        <Link to="/projects" className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80">
          Ver todos os projetos
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} style={{ animationDelay: `${index * 100}ms` }} />
        ))}
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   MAIN PAGE
 ───────────────────────────────────────────── */
const ProjectDetail = () => {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const { data: project, isLoading } = useProject(idOrSlug);
  const { data: allProjects = [] } = useProjects();
  const { data: profiles = [] } = useProfiles();
  const author = profiles[0];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [idOrSlug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border border-foreground/10 rounded-full border-t-foreground/40 animate-spin" />
          <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/25">Carregando projeto</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-8 pt-16 text-center">
        <SEOHead title="Projeto não encontrado" noindex />
        <h1 className="text-3xl font-light text-foreground">Projeto não encontrado</h1>
        <p className="text-foreground/50">O endereço pode ter mudado ou o projeto não está mais publicado.</p>
        <Link to="/projects" className="text-primary hover:underline">Ver todos os projetos</Link>
      </div>
    );
  }

  if (project.slug && idOrSlug !== project.slug) {
    return <Navigate to={`/projects/${project.slug}`} replace />;
  }

  const canonicalUrl = `${SITE_URL}/projects/${project.slug || project.id}`;
  // The Markdown carries the full story; older projects without it fall back to the business problem text.
  const body = project.content?.trim() ? project.content : project.businessProblem || "";
  const lead = stripInlineMarkdown(project.shortDescription || "");
  const summary = lead || stripInlineMarkdown(project.businessProblem || "") || `Projeto: ${project.title}`;
  const tags = project.tags ?? [];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-foreground/20 pt-16">
      <SEOHead
        title={`${project.title} — Projeto`}
        description={summary}
        canonical={canonicalUrl}
        ogImage={project.coverImage}
        ogType="article"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: project.title,
          description: summary,
          url: canonicalUrl,
          genre: project.category,
          author: { "@type": "Person", name: author?.full_name || "Waldo Eller", url: `${SITE_URL}/about` },
          ...(project.coverImage && { image: project.coverImage }),
          ...(tags.length > 0 && { keywords: tags.join(", ") }),
          ...(isLink(project.demoUrl) && { sameAs: project.demoUrl }),
        }}
      />
      <ScrollProgress />

      {/* HEADER */}
      <header aria-labelledby="project-title" className="pt-16 sm:pt-20 pb-14 px-8 sm:px-12 lg:px-20 max-w-[1400px] mx-auto animate-[fadeInUp_0.6s_ease-out_both]">
        <div className="max-w-4xl">
          <Link to="/projects" className={backLink}>
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Portfólio
          </Link>

          <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            {project.category && (
              <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                {project.category}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {readingMinutes(body)} min de leitura
            </span>
          </div>

          <h1 id="project-title" className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-foreground leading-[1.08]">
            {project.title}
          </h1>

          {lead && <p className="mt-6 max-w-3xl text-lg sm:text-xl font-light leading-relaxed text-foreground/60">{lead}</p>}

          {tags.length > 0 && (
            <ul aria-label="Tecnologias" className="mt-8 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <li key={tag} className="rounded-full border border-foreground/10 bg-foreground/[0.03] px-3 py-1 text-xs text-foreground/70">
                  {tag}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-foreground/[0.06] pt-6">
            <AuthorByline author={author} />
            <ProjectLinks project={project} />
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-20 pb-32">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_280px] gap-16 xl:gap-20">
          <main className="min-w-0">
            {project.coverImage && <ArticleCover src={project.coverImage} alt={project.title} />}
            {body ? (
              <MarkdownArticle markdown={body} />
            ) : (
              <p className="max-w-3xl text-foreground/50">Este projeto ainda não tem uma descrição detalhada.</p>
            )}
            <ProjectImages project={project} />
          </main>

          <aside className="hidden lg:block">
            <div className="sticky top-28">
              {body && <TableOfContents markdown={body} label="Neste projeto" />}

              {(isLink(project.demoUrl) || isLink(project.githubUrl)) && (
                <div className="py-8 border-t border-foreground/[0.06] first:border-t-0 first:pt-0">
                  <SidebarLabel>Links do projeto</SidebarLabel>
                  <ProjectLinks project={project} stacked />
                </div>
              )}

              {author?.bio_summary && <AboutAuthor bio={author.bio_summary} />}
              <ShareButtons title={project.title} />
            </div>
          </aside>
        </div>
      </div>

      {/* OTHER PROJECTS */}
      <OtherProjects projects={relatedProjects(allProjects, project)} />

      {/* FOOTER CTA */}
      <footer className="border-t border-foreground/[0.05] py-20 px-8 sm:px-12 lg:px-20 max-w-[1400px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
        <div>
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/30 mb-2">Próximo passo</p>
          <p className="text-2xl font-light text-foreground/70">Vamos conversar sobre o seu projeto.</p>
        </div>
        <Link
          to="/contact"
          className="rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_0_25px_hsl(var(--primary)/0.25)] transition-shadow hover:shadow-[0_0_32px_hsl(var(--primary)/0.4)]"
        >
          Entrar em contato
        </Link>
      </footer>
    </div>
  );
};

export default ProjectDetail;

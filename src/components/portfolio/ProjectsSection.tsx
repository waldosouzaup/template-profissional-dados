import { FolderOpen, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useProjects } from "@/hooks/useProjects";
import ProjectCard from "@/components/portfolio/ProjectCard";

const ProjectsSection = () => {
  const { data: projectsData, isLoading } = useProjects();
  const projects = projectsData?.filter(p => p.featured).slice(0, 4) || [];

  return (
    <section className="animate-fade-up delay-300 mt-16">
      {/* Section Header */}
      <div className="section-header">
        <div className="section-icon">
          <FolderOpen className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Projetos em Destaque</h2>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground">
          Carregando projetos...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            />
          ))}
        </div>
      )}

      {/* View All Link */}
      <div className="mt-10 text-center">
        <Link
          to="/projects"
          className="group inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-6 py-2.5 text-sm font-medium text-primary shadow-[0_0_20px_hsl(var(--primary)/0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_28px_hsl(var(--primary)/0.35)]"
        >
          Ver todos os projetos
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
};

export default ProjectsSection;

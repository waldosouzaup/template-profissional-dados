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
      <div className="mt-8 text-center">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          Ver todos os projetos
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};

export default ProjectsSection;

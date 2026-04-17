import { FolderOpen, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useProjects } from "@/hooks/useProjects";

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
        <h3 className="text-xl font-semibold text-foreground">Projetos em Destaque</h3>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground">
          Carregando projetos...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
          <Link
            key={project.id}
            to={`/projects/${project.id}`}
            className="project-card group"
          >
            {/* Project Image */}
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            
            {/* Overlay */}
            <div className="project-overlay">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-lg font-semibold text-foreground">{project.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{project.shortDescription}</p>
                  <div className="flex gap-2 mt-3">
                    {project.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="badge-time text-xs">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 transition-transform group-hover:rotate-45">
                  <ArrowUpRight className="w-5 h-5 text-primary-foreground" />
                </div>
              </div>
            </div>

            {/* Always visible info on mobile */}
            <div className="p-4 md:hidden">
              <h4 className="text-lg font-semibold text-foreground">{project.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{project.shortDescription}</p>
              <div className="flex gap-2 mt-3">
                {project.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="badge-time text-xs">{tag}</span>
                ))}
              </div>
            </div>
          </Link>
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

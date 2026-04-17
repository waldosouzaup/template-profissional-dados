import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ShoppingCart, 
  Cloud, 
  Workflow, 
  Layers, 
  Smartphone,
  ArrowUpRight,
  FolderOpen,
  ArrowLeft
} from "lucide-react";
import { ProjectCategory, projectCategories } from "@/types/project";
import { useProjects } from "@/hooks/useProjects";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ShoppingCart,
  Cloud,
  Workflow,
  Layers,
  Smartphone,
};

const ProjectsGallery = () => {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | "all">("all");

  const { data: allProjects = [], isLoading } = useProjects();
  
  const filteredProjects = activeCategory === "all" 
    ? allProjects 
    : allProjects.filter(p => p.category === activeCategory);

  const categories = Object.keys(projectCategories) as ProjectCategory[];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <div className="animate-fade-up">
          {/* Back Button */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para home
          </Link>

          <div className="section-header">
            <div className="section-icon">
              <FolderOpen className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Projetos
            </h1>
          </div>
          <p className="text-muted-foreground mt-4 max-w-2xl text-lg">
            Explore os projetos desenvolvidos utilizando tecnologias NoCode e IA.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mt-8 animate-fade-up delay-100">
          <button
            onClick={() => setActiveCategory("all")}
            className={`category-tab ${activeCategory === "all" ? "active" : ""}`}
          >
            Todos
          </button>
          {categories.map((cat) => {
            const catInfo = projectCategories[cat];
            if (!catInfo) return null;
            const Icon = iconMap[catInfo.icon] || Workflow;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`category-tab ${activeCategory === cat ? "active" : ""}`}
              >
                <Icon className="w-4 h-4" />
                {catInfo.label}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="py-20 text-center text-muted-foreground w-full">
            Carregando projetos...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {filteredProjects.map((project, index) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="project-gallery-card group"
              style={{ animationDelay: `${(index + 2) * 100}ms` }}
            >
              {/* Cover Image */}
              <div className="aspect-[16/10] overflow-hidden rounded-t-2xl">
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Category Badge */}
                <span className="badge-time text-xs mb-3 inline-block">
                  {projectCategories[project.category]?.label || project.category}
                </span>

                {/* Title */}
                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground mt-2 text-sm line-clamp-2">
                  {project.shortDescription}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="tag-mini">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Arrow */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                  <ArrowUpRight className="w-5 h-5 text-foreground" />
                </div>
              </div>
            </Link>
          ))}
        </div>
        )}

        {/* Empty State */}
        {filteredProjects.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Nenhum projeto encontrado nesta categoria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsGallery;
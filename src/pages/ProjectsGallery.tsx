import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Database,
  Globe,
  Brain,
  FolderOpen,
  ArrowLeft
} from "lucide-react";
import { ProjectCategory, projectCategories } from "@/types/project";
import { useProjects } from "@/hooks/useProjects";
import SEOHead from "@/components/SEOHead";
import ProjectCard from "@/components/portfolio/ProjectCard";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Database,
  Globe,
  Brain,
};

const ProjectsGallery = () => {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | "all">("all");

  const { data: allProjects = [], isLoading } = useProjects();
  
  const filteredProjects = activeCategory === "all" 
    ? allProjects 
    : allProjects.filter(p => p.category === activeCategory);

  const categories = Object.keys(projectCategories) as ProjectCategory[];

  return (
    <div className="min-h-screen bg-background pt-16">
      <SEOHead
        title="Projetos — Portfólio"
        description="Explore os projetos desenvolvidos por Waldo Eller utilizando tecnologias de Dados, IA e Web."
        canonical="https://waldoeller.com/projects"
        ogType="website"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Projetos — Waldo Eller",
          description: "Portfólio de projetos em Dados, IA e Web.",
          url: "https://waldoeller.com/projects",
        }}
      />
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <div className="animate-fade-up">
          {/* Back Button */}
          <Link
            to="/"
            className="group mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary shadow-[0_0_15px_hsl(var(--primary)/0.1)] transition-all duration-300 hover:border-primary/50 hover:bg-primary/10 hover:shadow-[0_0_20px_hsl(var(--primary)/0.2)]"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
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
            const Icon = iconMap[catInfo.icon] || Database;
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
            <ProjectCard
              key={project.id}
              project={project}
              style={{ animationDelay: `${(index + 2) * 100}ms` }}
            />
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
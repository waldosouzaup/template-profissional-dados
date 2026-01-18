import { FolderOpen, ArrowUpRight } from "lucide-react";
import projectNoCodeMatch from "@/assets/project-nocodematch.jpg";
import projectIkigai from "@/assets/project-ikigai.jpg";

const projects = [
  {
    title: "NoCode Match",
    description: "Maior marketplace de devs NoCode IA do Brasil",
    link: "https://www.nocodematch.ai/",
    image: projectNoCodeMatch,
    tags: ["Marketplace", "NoCode"],
  },
  {
    title: "Ikigai – Plataforma de Agendamento Integrado",
    description: "Sistema completo de agendamentos para a Ikigai Experience",
    link: "https://ikigaiexperience.com.br/",
    image: projectIkigai,
    tags: ["SaaS", "Agendamento"],
  },
];

const ProjectsSection = () => {
  return (
    <section className="animate-fade-up delay-300 mt-16">
      {/* Section Header */}
      <div className="section-header">
        <div className="section-icon">
          <FolderOpen className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">Projetos em Destaque</h3>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <a
            key={index}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="project-card group"
          >
            {/* Project Image */}
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            
            {/* Overlay */}
            <div className="project-overlay">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-lg font-semibold text-foreground">{project.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                  <div className="flex gap-2 mt-3">
                    {project.tags.map((tag) => (
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
              <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
              <div className="flex gap-2 mt-3">
                {project.tags.map((tag) => (
                  <span key={tag} className="badge-time text-xs">{tag}</span>
                ))}
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;

import { FolderOpen } from "lucide-react";
import { Project } from "@/types/project";
import MediaCard from "@/components/portfolio/MediaCard";

interface ProjectCardProps {
  project: Project;
  style?: React.CSSProperties;
}

const ProjectCard = ({ project, style }: ProjectCardProps) => (
  <MediaCard
    to={`/projects/${project.slug || project.id}`}
    image={project.coverImage}
    imageAlt={project.title}
    fallbackIcon={FolderOpen}
    eyebrow={project.category}
    title={project.title}
    description={project.shortDescription}
    details={
      project.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag-mini">
              {tag}
            </span>
          ))}
        </div>
      )
    }
    ctaLabel="Ver projeto"
    style={style}
  />
);

export default ProjectCard;

import { BookOpen, Clock, Layers } from "lucide-react";
import MediaCard from "@/components/portfolio/MediaCard";
import { trailPath, type TrailSummary } from "@/lib/trails";
import type { BlogTrail, Content } from "@/types/database";

interface TrailCardProps {
  summary: TrailSummary<BlogTrail, Content>;
  style?: React.CSSProperties;
}

const TrailCard = ({ summary: { trail, posts, cover, minutes }, style }: TrailCardProps) => (
  <MediaCard
    to={trailPath(trail)}
    image={cover}
    imageAlt={trail.name}
    fallbackIcon={Layers}
    eyebrow="Trilha de estudo"
    title={trail.name}
    description={trail.description || undefined}
    details={
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5" />
          {posts.length} {posts.length === 1 ? "artigo" : "artigos"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {minutes} min de leitura
        </span>
      </div>
    }
    ctaLabel="Ver trilha"
    imageAspectClass="aspect-[3/2]"
    style={style}
  />
);

export default TrailCard;

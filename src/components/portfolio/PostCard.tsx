import { BookOpen, Clock } from "lucide-react";
import type { Content } from "@/types/database";
import MediaCard from "@/components/portfolio/MediaCard";
import { readingMinutes, stripInlineMarkdown } from "@/lib/text";
import { stepLabel } from "@/lib/trails";

interface PostCardProps {
  post: Content;
  style?: React.CSSProperties;
}

const PostCard = ({ post, style }: PostCardProps) => (
  <MediaCard
    to={`/blog/${post.slug || post.id}`}
    image={post.image_url}
    imageAlt={post.title}
    fallbackIcon={BookOpen}
    eyebrow={stepLabel(post.trail_position) ?? "Artigo"}
    title={post.title.trim()}
    description={post.description ? stripInlineMarkdown(post.description) : undefined}
    details={
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {readingMinutes(post.markdown)} min de leitura
        </span>
      </div>
    }
    ctaLabel="Ler artigo"
    // Blog covers are produced at 3:2; a 16:9 frame would crop their header and footer strips
    imageAspectClass="aspect-[3/2]"
    style={style}
  />
);

export default PostCard;

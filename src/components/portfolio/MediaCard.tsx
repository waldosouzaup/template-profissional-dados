import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

interface MediaCardProps {
  to: string;
  image?: string;
  imageAlt: string;
  fallbackIcon: LucideIcon;
  eyebrow: string;
  title: string;
  description?: string;
  details?: React.ReactNode;
  ctaLabel: string;
  imageAspectClass?: string;
  style?: React.CSSProperties;
}

const MediaCard = ({
  to, image, imageAlt, fallbackIcon: FallbackIcon, eyebrow, title, description, details, ctaLabel,
  imageAspectClass = "aspect-video", style,
}: MediaCardProps) => {
  const [imageFailed, setImageFailed] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const showImage = !!image && !imageFailed;

  return (
    <Link to={to} className="media-card group" style={style}>
      <div className={`relative ${imageAspectClass} overflow-hidden bg-secondary`}>
        {showImage ? (
          <img
            src={image}
            alt={imageAlt}
            loading="lazy"
            onLoad={(e) => setIsPortrait(e.currentTarget.naturalHeight > e.currentTarget.naturalWidth)}
            onError={() => setImageFailed(true)}
            // Portrait covers are full-page site screenshots: anchor to the top so the hero stays visible
            className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
              isPortrait ? "object-top" : "object-center"
            }`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary to-card">
            <FallbackIcon className="h-10 w-10 text-muted-foreground/40" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col border-t border-border p-6">
        <span className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</span>
        <h3 className="text-lg font-semibold leading-snug text-foreground line-clamp-2 transition-colors group-hover:text-primary">
          {title}
        </h3>

        {description && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">{description}</p>
        )}

        {details && <div className="mt-5">{details}</div>}

        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between border-t border-border/60 pt-4 text-sm font-medium text-muted-foreground transition-colors group-hover:text-primary">
            {ctaLabel}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MediaCard;

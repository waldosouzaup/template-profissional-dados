import { Calendar, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Shared frame for every /about section so they align with the hero and with each other.
export const AboutSection = ({ id, icon: Icon, eyebrow, title, tinted = false, children }: {
  id: string; icon: LucideIcon; eyebrow: string; title: string; tinted?: boolean; children: React.ReactNode;
}) => (
  <section aria-labelledby={`${id}-title`} className={cn("border-t border-foreground/[0.04]", tinted && "bg-foreground/[0.015]")}>
    <div className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-20 py-20 animate-[fadeInUp_0.8s_ease-out_both]">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
        </div>
        <div>
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-foreground/30 mb-1">{eyebrow}</p>
          <h2 id={`${id}-title`} className="text-2xl font-light text-foreground">{title}</h2>
        </div>
      </div>
      {children}
    </div>
  </section>
);

export const AboutCard = ({ className, style, children }: { className?: string; style?: React.CSSProperties; children: React.ReactNode }) => (
  <article
    className={cn(
      "rounded-2xl border border-foreground/[0.06] bg-foreground/[0.02] p-6 transition-all duration-300 hover:border-foreground/[0.12] hover:bg-foreground/[0.035]",
      className,
    )}
    style={style}
  >
    {children}
  </article>
);

export const PeriodPill = ({ period }: { period: string }) => (
  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-foreground/5 px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-foreground/50">
    <Calendar className="h-3 w-3" aria-hidden="true" />
    {period}
  </span>
);

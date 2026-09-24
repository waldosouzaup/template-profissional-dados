import { Briefcase } from "lucide-react";
import type { Experience } from "@/types/database";
import { AboutCard, AboutSection, PeriodPill } from "@/components/portfolio/AboutSection";
import { findExperienceIcon } from "@/lib/experience-icons";

const ExperienceSection = ({ items }: { items: Experience[] }) => {
  if (items.length === 0) return null;

  return (
    <AboutSection id="experiencias" icon={Briefcase} eyebrow="Carreira" title="Experiências Profissionais" tinted>
      <ol className="relative space-y-6">
        <span aria-hidden="true" className="absolute left-5 top-6 bottom-6 w-px bg-gradient-to-b from-primary/40 via-foreground/10 to-transparent" />
        {items.map((exp, index) => {
          const Icon = findExperienceIcon(exp.icon_type).icon;
          return (
            <li key={exp.id} className="relative pl-16" style={{ animation: "fadeInUp 0.5s ease-out both", animationDelay: `${index * 80}ms` }}>
              <span className="absolute left-0 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-primary/25 bg-background">
                <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
              </span>
              <AboutCard>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="text-lg font-medium leading-snug text-foreground">{exp.title}</h3>
                    <p className="mt-1 text-sm text-primary/80">{exp.institution}</p>
                  </div>
                  {exp.period && <PeriodPill period={exp.period} />}
                </div>
                {exp.description && <p className="mt-4 max-w-3xl text-sm leading-relaxed text-foreground/60">{exp.description}</p>}
              </AboutCard>
            </li>
          );
        })}
      </ol>
    </AboutSection>
  );
};

export default ExperienceSection;

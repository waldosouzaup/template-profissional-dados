import { GraduationCap } from "lucide-react";
import type { Education } from "@/types/database";
import { AboutCard, AboutSection, PeriodPill } from "@/components/portfolio/AboutSection";

const EducationSection = ({ items }: { items: Education[] }) => {
  if (items.length === 0) return null;

  return (
    <AboutSection id="formacao" icon={GraduationCap} eyebrow="Estudos" title="Formação Acadêmica">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.map((edu, index) => (
          <AboutCard key={edu.id} style={{ animation: "fadeInUp 0.5s ease-out both", animationDelay: `${index * 80}ms` }}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="text-lg font-medium leading-snug text-foreground">{edu.title}</h3>
                <p className="mt-1 text-sm text-foreground/50">{edu.institution}</p>
              </div>
              {edu.period && <PeriodPill period={edu.period} />}
            </div>
            {edu.description && <p className="mt-4 text-sm leading-relaxed text-foreground/60">{edu.description}</p>}
          </AboutCard>
        ))}
      </div>
    </AboutSection>
  );
};

export default EducationSection;

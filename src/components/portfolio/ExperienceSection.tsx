import { Briefcase, Rocket, Award } from "lucide-react";
import { useExperiences } from "@/hooks/useExperiences";

const IconMap = {
  rocket: Rocket,
  award: Award,
  briefcase: Briefcase,
};

const ExperienceSection = () => {
  const { data: experiences = [], isLoading } = useExperiences();

  if (isLoading) {
    return <div className="text-muted-foreground animate-pulse mt-16">Carregando experiências...</div>;
  }

  if (experiences.length === 0) return null;

  return (
    <section className="animate-fade-up delay-200 mt-16">
      {/* Section Header */}
      <div className="section-header">
        <div className="section-icon">
          <Briefcase className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">Experiências</h3>
      </div>

      {/* Experience Cards */}
      <div className="space-y-4">
        {experiences.map((exp, index) => {
          const IconComponent = IconMap[exp.icon_type as keyof typeof IconMap] || Briefcase;
          
          return (
            <div
              key={exp.id}
              className="content-card"
              style={{ animationDelay: `${(index + 3) * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h4 className="text-lg font-semibold text-foreground">{exp.title}</h4>
                      <p className="text-sm text-muted-foreground">{exp.institution}</p>
                    </div>
                    {exp.period && (
                      <span className="badge-time shrink-0">{exp.period}</span>
                    )}
                  </div>
                  {exp.description && (
                    <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ExperienceSection;

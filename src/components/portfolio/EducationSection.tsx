import { GraduationCap } from "lucide-react";
import { useEducationList } from "@/hooks/useEducation";

const EducationSection = () => {
  const { data: educationItems, isLoading } = useEducationList();

  if (isLoading) {
    return (
      <div className="mt-16 animate-pulse">
        <div className="h-8 w-48 bg-secondary rounded mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-secondary/50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!educationItems || educationItems.length === 0) return null;

  return (
    <section className="animate-fade-up delay-400 mt-16">
      {/* Section Header */}
      <div className="section-header">
        <div className="section-icon">
          <GraduationCap className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">Formação</h3>
      </div>

      {/* Education Items */}
      <div className="space-y-4">
        {educationItems.map((edu, index) => (
          <div
            key={edu.id}
            className="education-item"
            style={{ animationDelay: `${(index + 4) * 100}ms` }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div>
                <h4 className="text-lg font-semibold text-foreground">{edu.title}</h4>
                <p className="text-muted-foreground">{edu.institution}</p>
              </div>
              {edu.period && (
                <span className="badge-time shrink-0">{edu.period}</span>
              )}
            </div>
            {edu.description && (
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                {edu.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default EducationSection;
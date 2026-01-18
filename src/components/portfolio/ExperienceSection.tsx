import { Briefcase, Rocket, Award } from "lucide-react";

const experiences = [
  {
    icon: Rocket,
    title: "Fundador – NoCode StartUp",
    company: "NoCode StartUp",
    period: "2022 - Presente",
    description: "+110 mil inscritos no YouTube · +9 mil alunos formados",
  },
  {
    icon: Award,
    title: "Embaixador – Lovable",
    company: "Lovable",
    period: "2025",
    description: "Embaixador oficial da plataforma no Brasil",
  },
  {
    icon: Award,
    title: "Embaixador – Flutterflow",
    company: "Flutterflow",
    period: "2023",
    description: "Prêmio de Melhor Educador do Ano",
  },
];

const ExperienceSection = () => {
  return (
    <section className="animate-fade-up delay-200 mt-16">
      {/* Section Header */}
      <div className="section-header">
        <div className="section-icon">
          <Briefcase className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">Grandes Conquistas</h3>
      </div>

      {/* Experience Cards */}
      <div className="space-y-4">
        {experiences.map((exp, index) => (
          <div
            key={index}
            className="content-card"
            style={{ animationDelay: `${(index + 3) * 100}ms` }}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                <exp.icon className="w-6 h-6 text-primary" />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h4 className="text-lg font-semibold text-foreground">{exp.title}</h4>
                    <p className="text-sm text-muted-foreground">{exp.company}</p>
                  </div>
                  <span className="badge-time shrink-0">{exp.period}</span>
                </div>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  {exp.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExperienceSection;

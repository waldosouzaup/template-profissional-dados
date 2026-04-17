import { GraduationCap } from "lucide-react";

const education = [
  {
    title: "Sistemas de Informação",
    institution: "UNIP - Universidade Paulista",
    period: "2011 - 2014",
    description: "Disciplinas: Banco de Dados, Redes de Computadores, Segurança da Informação e Gestão de Projetos de TI.",
  },
  {
    title: "Pós-Graduação em Arquitetura e Projetos de Cloud Computing",
    institution: "GRAN Faculdade",
    period: "2026",
    description: "Disciplinas: Modelagem de Banco de Dados, Business Intelligence, Integração de Dados e Data Lake, Probabilidade e Inferência para Ciência de Dados.",
  },
  {
    title: "Pós-graduação Engenharia de Dados",
    institution: "FOCUS Faculdade",
    period: "2026",
    description: "Disciplinas: Modelagem de Banco de Dados, Business Intelligence, Integração de Dados e Data Lake, Probabilidade e Inferência para Ciência de Dados.",
  },
  {
    title: "Pós-graduação Ciência de Dados",
    institution: "GRAN Faculdade",
    period: "2026",
    description: "Disciplinas: Modelagem de Banco de Dados, Business Intelligence, Integração de Dados e Data Lake, Probabilidade e Inferência para Ciência de Dados.",
  },
  {
    title: "Pós-graduação em Marketing",
    institution: "IESLA - Instituto de Educação Latino Americano",
    period: "2021 - 2022",
    description: "Disciplinas: Visualização de Dados, Bancos de Dados, Métricas na Web, SEO e Analytics, Gestão de Projetos e Metodologias Ágeis.",
  },
];

const EducationSection = () => {
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
        {education.map((edu, index) => (
          <div
            key={index}
            className="education-item"
            style={{ animationDelay: `${(index + 4) * 100}ms` }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div>
                <h4 className="text-lg font-semibold text-foreground">{edu.title}</h4>
                <p className="text-muted-foreground">{edu.institution}</p>
              </div>
              <span className="badge-time shrink-0">{edu.period}</span>
            </div>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              {edu.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EducationSection;
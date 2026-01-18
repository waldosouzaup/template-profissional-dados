import { Zap, Code, Database } from "lucide-react";

const skills = [
  {
    icon: Zap,
    name: "N8N",
    description: "Criação de Agentes IA e Automações",
    color: "text-orange-400",
  },
  {
    icon: Code,
    name: "Lovable",
    description: "Criação de Plataformas",
    color: "text-pink-400",
  },
  {
    icon: Database,
    name: "Supabase",
    description: "Criação de Backends",
    color: "text-emerald-400",
  },
];

const SkillsSection = () => {
  return (
    <section className="animate-fade-up delay-400 mt-16">
      {/* Section Header */}
      <div className="section-header">
        <div className="section-icon">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">Skills / Competências</h3>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill, index) => (
          <div key={index} className="skill-card">
            <div className="skill-icon">
              <skill.icon className={`w-6 h-6 ${skill.color}`} />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">{skill.name}</h4>
              <p className="text-sm text-muted-foreground">{skill.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SkillsSection;

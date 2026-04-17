import { Zap, Code, Database, Cpu, Brain, Laptop, Server, Globe, Smartphone, Shield, Search, Terminal, Database as DbIcon, Code2, LucideIcon, Loader2 } from "lucide-react";
import { useTechnologies } from "@/hooks/useTechnologies";

const iconMap: Record<string, LucideIcon> = {
  Zap, Code, Database, Cpu, Brain, Laptop, Server, Globe, Smartphone, Shield, Search, Terminal, Code2,
  "Db": DbIcon,
};

const SkillsSection = () => {
  const { data: technologies = [], isLoading } = useTechnologies();

  // Filter only technologies that have a description (these are the "Skills")
  const skills = (technologies || [])
    .filter(tech => tech.description)
    .map(tech => ({
      icon: iconMap[tech.icon || "Zap"] || Zap,
      name: tech.title,
      description: tech.description,
      color: tech.color || "text-primary",
    }));

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Fallback to defaults if no skills found in DB
  const displaySkills = skills.length > 0 ? skills : [
    { icon: Zap, name: "IA & Automação", description: "Agentes e fluxos n8n", color: "text-orange-400" },
    { icon: Code, name: "Web / SaaS", description: "Desenvolvimento Fullstack", color: "text-pink-400" },
    { icon: Database, name: "Eng. Dados", description: "Arquitetura e Supabase", color: "text-emerald-400" },
  ];

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
        {displaySkills.map((skill, index) => (
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

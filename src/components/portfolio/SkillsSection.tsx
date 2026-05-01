import { Zap, Code, Database, Cpu, Brain, Laptop, Server, Globe, Smartphone, Shield, Search, Terminal, Database as DbIcon, Code2, LucideIcon, Loader2, Table2, BarChart3, Cloud } from "lucide-react";
import {
  SiPython, SiDocker, SiJavascript, SiTypescript, SiReact, SiHtml5, SiCss, SiTailwindcss,
  SiGit, SiGithub, SiFigma,
  SiSupabase, SiPostgresql, SiMongodb, SiMysql, SiNodedotjs,
  SiApacheairflow, SiApachespark, SiDatabricks, SiPandas,
  SiGooglecloud, SiN8N,
} from "react-icons/si";
import { useTechnologies } from "@/hooks/useTechnologies";

const iconMap: Record<string, React.ElementType> = {
  // Lucide icons
  Zap, Code, Database, Cpu, Brain, Laptop, Server, Globe, Smartphone, Shield, Search, Terminal, Code2, Cloud,
  "Db": DbIcon, "Table": Table2, "BarChart": BarChart3,

  // Brand icons (react-icons/si) with friendly aliases
  SiPython, "Python": SiPython, "python": SiPython,
  SiDocker, "Docker": SiDocker, "docker": SiDocker,
  SiJavascript, "JavaScript": SiJavascript, "javascript": SiJavascript, "js": SiJavascript,
  SiTypescript, "TypeScript": SiTypescript, "typescript": SiTypescript, "ts": SiTypescript,
  SiReact, "React": SiReact, "react": SiReact,
  SiNodedotjs, "Node.js": SiNodedotjs, "Node": SiNodedotjs, "node": SiNodedotjs, "nodejs": SiNodedotjs,
  SiHtml5, "HTML": SiHtml5, "html": SiHtml5, "html5": SiHtml5, "HTML5": SiHtml5,
  SiCss, "CSS": SiCss, "css": SiCss, "css3": SiCss, "CSS3": SiCss,
  SiTailwindcss, "Tailwind": SiTailwindcss, "tailwind": SiTailwindcss, "tailwindcss": SiTailwindcss,
  SiGit, "Git": SiGit, "git": SiGit,
  SiGithub, "GitHub": SiGithub, "github": SiGithub,
  SiFigma, "Figma": SiFigma, "figma": SiFigma,
  SiSupabase, "Supabase": SiSupabase, "supabase": SiSupabase,
  SiPostgresql, "PostgreSQL": SiPostgresql, "postgresql": SiPostgresql, "postgres": SiPostgresql,
  SiMongodb, "MongoDB": SiMongodb, "mongodb": SiMongodb, "mongo": SiMongodb,
  SiMysql, "MySQL": SiMysql, "mysql": SiMysql,
  SiApacheairflow, "Airflow": SiApacheairflow, "airflow": SiApacheairflow, "ApacheAirflow": SiApacheairflow,
  SiApachespark, "Spark": SiApachespark, "spark": SiApachespark, "ApacheSpark": SiApachespark,
  SiDatabricks, "Databricks": SiDatabricks, "databricks": SiDatabricks,
  SiPandas, "Pandas": SiPandas, "pandas": SiPandas,
  SiGooglecloud, "GCP": SiGooglecloud, "gcp": SiGooglecloud, "GoogleCloud": SiGooglecloud,
  SiN8N, "n8n": SiN8N, "N8N": SiN8N,

  // Fallback aliases for icons NOT in react-icons/si v5.6
  "Excel": Table2, "excel": Table2, "SiMicrosoftexcel": Table2,
  "PowerBI": BarChart3, "powerbi": BarChart3, "Power BI": BarChart3, "SiPowerbi": BarChart3,
  "Azure": Cloud, "azure": Cloud, "SiMicrosoftazure": Cloud,
  "AWS": Cloud, "aws": Cloud, "SiAmazonwebservices": Cloud,
};

const SkillsSection = () => {
  const { data: technologies = [], isLoading } = useTechnologies();

  // Filter only technologies that have a description (these are the "Skills")
  const skills = (technologies || [])
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
        <h3 className="text-xl font-semibold text-foreground">Skills & Tecnologias</h3>
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

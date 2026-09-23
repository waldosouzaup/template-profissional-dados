import { Zap, Code, Database, Cpu, Brain, Laptop, Server, Globe, Smartphone, Shield, Search, Terminal, Database as DbIcon, Code2, LucideIcon, Loader2, Table2, BarChart3, Cloud } from "lucide-react";
import {
  SiPython, SiDocker, SiJavascript, SiTypescript, SiReact, SiHtml5, SiCss, SiTailwindcss,
  SiGit, SiGithub, SiFigma,
  SiSupabase, SiPostgresql, SiMongodb, SiMysql, SiNodedotjs,
  SiApacheairflow, SiApachespark, SiDatabricks, SiPandas,
  SiGooglecloud, SiN8N,
} from "react-icons/si";
import { useTechnologies } from "@/hooks/useTechnologies";
import { useProfiles } from "@/hooks/useProfile";
import { HOME_SECTION_DEFAULTS, TECHNOLOGY_CATEGORIES, getTechnologyCategory } from "@/lib/home-sections";

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
  const { data: technologies = [], isLoading, isError } = useTechnologies();
  const { data: profiles = [] } = useProfiles();
  const profile = profiles[0];

  return (
    <section aria-labelledby="skills-heading" className="animate-fade-up delay-400 mt-16">
      <div className="section-header">
        <div className="section-icon"><Zap className="w-5 h-5 text-primary" /></div>
        <h2 id="skills-heading" className="text-xl font-semibold text-foreground">
          {profile?.skills_title || HOME_SECTION_DEFAULTS.skills_title}
        </h2>
      </div>
      <p className="mb-8 text-sm text-muted-foreground leading-relaxed">
        {profile?.skills_description ?? HOME_SECTION_DEFAULTS.skills_description}
      </p>
      {isLoading ? (
        <div role="status" className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary" /><span className="sr-only">Carregando tecnologias</span>
        </div>
      ) : isError ? (
        <p role="alert" className="text-sm text-muted-foreground">Não foi possível carregar as tecnologias.</p>
      ) : (
        <div className="space-y-8">
          {TECHNOLOGY_CATEGORIES.map((category) => {
            const skills = technologies.filter((tech) => getTechnologyCategory(tech.category) === category);
            return (
              <div key={category}>
                <h3 className="mb-4 text-lg font-bold text-primary">{category}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                  {skills.map((skill) => {
                    const Icon = iconMap[skill.icon || "Zap"] || Zap;
                    return (
                      <div key={skill.id} className="skill-card min-w-0">
                        <div className="skill-icon shrink-0"><Icon className={`w-6 h-6 ${skill.color || "text-primary"}`} /></div>
                        <h4 className="font-semibold text-sm text-foreground break-words">{skill.title}</h4>
                      </div>
                    );
                  })}
                </div>
                {skills.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma tecnologia cadastrada nesta categoria.</p>}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default SkillsSection;

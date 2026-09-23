export const HOME_SECTION_DEFAULTS = {
  skills_title: "Skills & Tecnologias",
  skills_description: "Ferramentas e linguagens que uso no dia a dia para construir soluções pipelines confiáveis.",
  certifications_title: "Certificações",
  certifications_description: "Meu compromisso contínuo com a excelência técnica e o aprendizado constante.",
};

export const TECHNOLOGY_CATEGORIES = [
  "Cloud & Big Data",
  "Engenharia, Orquestração & Dados",
  "Qualidade, DevOps & IA",
  "Background & Outros",
] as const;

export const getTechnologyCategory = (category?: string | null) =>
  TECHNOLOGY_CATEGORIES.find((option) => option === category) ?? "Background & Outros";

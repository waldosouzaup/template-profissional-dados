import {
  Award, Briefcase, Bug, Cloud, CodeXml, Database, GraduationCap, Headset, Infinity as InfinityIcon, LifeBuoy,
  Network, Palette, Rocket, Server, ShieldCheck, SquareTerminal, Users, Workflow, Wrench, type LucideIcon,
} from "lucide-react";

// Icons for the career timeline on /about (experience.icon_type), one per kind of IT role.
export interface ExperienceIcon {
  value: string;
  label: string;
  icon: LucideIcon;
  // Job titles that suggest this icon; the first matching entry wins, so the list order matters.
  matches?: RegExp;
}

export const EXPERIENCE_ICONS: ExperienceIcon[] = [
  { value: "devops", label: "DevOps", icon: InfinityIcon, matches: /devops|\bsre\b|site reliability|platform engineer/i },
  { value: "helpdesk", label: "Help Desk / Service Desk", icon: LifeBuoy, matches: /help ?desk|service ?desk/i },
  { value: "suporte", label: "Suporte técnico", icon: Headset, matches: /suporte|support|atendimento/i },
  { value: "tecnico", label: "Técnico em informática", icon: Wrench, matches: /t[ée]cnico|manuten[çc][ãa]o|hardware/i },
  { value: "infraestrutura", label: "Infraestrutura / Sysadmin", icon: Server, matches: /infra|sysadmin|administrador de (sistemas|servidores)/i },
  { value: "redes", label: "Redes", icon: Network, matches: /\bredes?\b|network|telecom/i },
  { value: "cloud", label: "Cloud", icon: Cloud, matches: /cloud|nuvem|\baws\b|azure|\bgcp\b/i },
  { value: "linux", label: "Linux / Terminal", icon: SquareTerminal, matches: /linux|unix/i },
  { value: "desenvolvimento", label: "Desenvolvimento", icon: CodeXml, matches: /desenvolv|developer|programador|software|front-?end|back-?end|full ?stack/i },
  { value: "dados", label: "Dados / BI", icon: Database, matches: /\bdados\b|\bdata\b|\bbi\b|\bdba\b|analytics/i },
  { value: "seguranca", label: "Segurança da informação", icon: ShieldCheck, matches: /seguran[çc]a|security|cyber/i },
  { value: "automacao", label: "Automação", icon: Workflow, matches: /automa[çc]|\brpa\b/i },
  { value: "qualidade", label: "Qualidade / Testes", icon: Bug, matches: /\bqa\b|qualidade|\btest/i },
  { value: "design", label: "Design / Multimídia", icon: Palette, matches: /design|multim[íi]dia|\bux\b/i },
  { value: "gestao", label: "Gestão / Liderança", icon: Users, matches: /gest[ãa]o|gestor|gerente|coordenad|l[íi]der|manager/i },
  { value: "ensino", label: "Ensino / Instrutor", icon: GraduationCap, matches: /professor|instrutor|ensino|mentor|teacher/i },
  { value: "briefcase", label: "Geral (maleta)", icon: Briefcase },
  { value: "rocket", label: "Projeto (foguete)", icon: Rocket },
  { value: "award", label: "Reconhecimento (prêmio)", icon: Award },
];

export const DEFAULT_EXPERIENCE_ICON = "briefcase";

export const findExperienceIcon = (value?: string | null) =>
  EXPERIENCE_ICONS.find((item) => item.value === value) ?? EXPERIENCE_ICONS.find((item) => item.value === DEFAULT_EXPERIENCE_ICON)!;

export const suggestExperienceIcon = (title: string) =>
  EXPERIENCE_ICONS.find((item) => item.matches?.test(title))?.value;

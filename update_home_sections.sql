-- Execute no SQL Editor do Supabase antes de salvar os novos campos pelo painel.
BEGIN;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS skills_title TEXT DEFAULT 'Skills & Tecnologias',
  ADD COLUMN IF NOT EXISTS skills_description TEXT DEFAULT 'Ferramentas e linguagens que uso no dia a dia para construir soluções pipelines confiáveis.',
  ADD COLUMN IF NOT EXISTS certifications_title TEXT DEFAULT 'Certificações',
  ADD COLUMN IF NOT EXISTS certifications_description TEXT DEFAULT 'Meu compromisso contínuo com a excelência técnica e o aprendizado constante.';

ALTER TABLE public.technologies
  ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'Background & Outros'
  CHECK (category IN (
    'Cloud & Big Data',
    'Engenharia, Orquestração & Dados',
    'Qualidade, DevOps & IA',
    'Background & Outros'
  ));

ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS show_on_home BOOLEAN NOT NULL DEFAULT false;

COMMIT;

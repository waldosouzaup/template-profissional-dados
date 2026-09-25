-- Categorias de projeto editáveis pelo painel (Editar Projeto → Gerenciar).
-- Execute no SQL Editor do Supabase ANTES de publicar a versão do site que usa esta tabela.
-- Requer security_admin_rls.sql (função public.is_admin). Pode ser executado mais de uma vez com segurança.
BEGIN;

CREATE TABLE IF NOT EXISTS public.project_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE CHECK (length(trim(name)) > 0),
  icon TEXT NOT NULL DEFAULT 'FolderOpen',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE public.project_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access" ON public.project_categories;
DROP POLICY IF EXISTS "Allow authenticated CRUD" ON public.project_categories;
DROP POLICY IF EXISTS "Admin CRUD" ON public.project_categories;
CREATE POLICY "Allow public read access" ON public.project_categories FOR SELECT USING (true);
-- Só a conta administradora escreve (public.is_admin vem de security_admin_rls.sql).
CREATE POLICY "Admin CRUD" ON public.project_categories FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

-- Obrigatório para tabelas novas em projetos Supabase a partir de 30/10/2026.
GRANT SELECT ON public.project_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_categories TO authenticated, service_role;

-- Categorias padrão + qualquer categoria já usada por projetos existentes.
INSERT INTO public.project_categories (name, icon, display_order) VALUES
  ('Dados', 'Database', 1),
  ('Web', 'Globe', 2),
  ('IA', 'Brain', 3)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.project_categories (name, display_order)
SELECT DISTINCT p.category, 100
FROM public.projects p
WHERE p.category IS NOT NULL AND trim(p.category) <> ''
ON CONFLICT (name) DO NOTHING;

-- A lista fixa antiga (CHECK category IN (...)) impediria categorias novas.
DO $$
DECLARE c record;
BEGIN
  FOR c IN
    SELECT conname FROM pg_constraint
    WHERE conrelid = 'public.projects'::regclass AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%category%'
  LOOP
    EXECUTE format('ALTER TABLE public.projects DROP CONSTRAINT %I', c.conname);
  END LOOP;
END;
$$;

-- Renomear uma categoria atualiza os projetos; excluir uma categoria em uso é bloqueado.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'projects_category_fkey' AND conrelid = 'public.projects'::regclass) THEN
    ALTER TABLE public.projects
      ADD CONSTRAINT projects_category_fkey FOREIGN KEY (category)
      REFERENCES public.project_categories (name) ON UPDATE CASCADE ON DELETE RESTRICT;
  END IF;
END;
$$;

COMMIT;

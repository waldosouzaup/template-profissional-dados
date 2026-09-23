-- URLs amigáveis para projetos: /projects/<slug>
-- Execute no SQL Editor do Supabase ANTES de publicar a versão do site que usa slugs.
-- Pode ser executado mais de uma vez com segurança.
BEGIN;

-- Mesma regra de src/lib/slug.ts: sem acentos, minúsculas, hífen no lugar de qualquer outro caractere.
CREATE OR REPLACE FUNCTION public.slugify(value text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = ''
AS $$
  SELECT trim(both '-' from regexp_replace(
    lower(translate(
      coalesce(value, ''),
      'áàâãäåÁÀÂÃÄÅéèêëÉÈÊËíìîïÍÌÎÏóòôõöÓÒÔÕÖúùûüÚÙÛÜçÇñÑýÿÝ',
      'aaaaaaAAAAAAeeeeEEEEiiiiIIIIoooooOOOOOuuuuUUUUcCnNyyY'
    )),
    '[^a-z0-9]+', '-', 'g'
  ))
$$;

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS previous_slugs TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();

-- Slugs antigos de outros projetos ficam reservados para que seus redirecionamentos continuem valendo.
CREATE OR REPLACE FUNCTION public.projects_unique_slug(desired text, project_id uuid)
RETURNS text
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  base text := coalesce(nullif(public.slugify(desired), ''), 'projeto');
  candidate text := base;
  n int := 1;
BEGIN
  WHILE EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id <> project_id AND (p.slug = candidate OR candidate = ANY (p.previous_slugs))
  ) LOOP
    n := n + 1;
    candidate := base || '-' || n;
  END LOOP;
  RETURN candidate;
END;
$$;

DROP TRIGGER IF EXISTS projects_slug_and_timestamps ON public.projects;

-- Preenche projetos existentes (só na primeira execução), do mais antigo para o mais novo.
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT id, title, created_at FROM public.projects WHERE slug IS NULL ORDER BY created_at, id LOOP
    UPDATE public.projects
    SET slug = public.projects_unique_slug(r.title, r.id),
        updated_at = coalesce(r.created_at, now())
    WHERE id = r.id;
  END LOOP;
END;
$$;

ALTER TABLE public.projects ALTER COLUMN slug SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS projects_slug_key ON public.projects (slug);
CREATE INDEX IF NOT EXISTS projects_previous_slugs_idx ON public.projects USING gin (previous_slugs);

-- O banco é quem manda: normaliza o slug, resolve colisões, guarda o slug anterior e atualiza updated_at.
CREATE OR REPLACE FUNCTION public.projects_before_write()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.previous_slugs := '{}';
  ELSE
    NEW.previous_slugs := OLD.previous_slugs;
  END IF;

  IF TG_OP = 'INSERT' OR NEW.slug IS DISTINCT FROM OLD.slug THEN
    NEW.slug := public.projects_unique_slug(coalesce(nullif(trim(NEW.slug), ''), NEW.title), NEW.id);
  END IF;

  IF TG_OP = 'UPDATE' AND NEW.slug IS DISTINCT FROM OLD.slug THEN
    NEW.previous_slugs := array_append(array_remove(NEW.previous_slugs, OLD.slug), OLD.slug);
  END IF;
  NEW.previous_slugs := array_remove(NEW.previous_slugs, NEW.slug);
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER projects_slug_and_timestamps
BEFORE INSERT OR UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.projects_before_write();

COMMIT;

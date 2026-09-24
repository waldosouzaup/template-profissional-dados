-- Trilhas de estudo do blog: /blog mostra as trilhas e cada trilha lista seus artigos na ordem de estudo.
-- Execute no SQL Editor do Supabase ANTES de publicar a versão do site que usa trilhas.
-- Requer project_slugs.sql (função public.slugify). Pode ser executado mais de uma vez com segurança.
BEGIN;

CREATE TABLE IF NOT EXISTS public.blog_trails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE CHECK (length(trim(name)) > 0),
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- O endereço /blog/trilha/<slug> é sempre normalizado; sem slug informado, vem do nome.
CREATE OR REPLACE FUNCTION public.blog_trails_before_write()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.name := trim(NEW.name);
  NEW.slug := coalesce(nullif(public.slugify(NEW.slug), ''), nullif(public.slugify(NEW.name), ''), 'trilha');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS blog_trails_normalize ON public.blog_trails;
CREATE TRIGGER blog_trails_normalize
  BEFORE INSERT OR UPDATE ON public.blog_trails
  FOR EACH ROW EXECUTE FUNCTION public.blog_trails_before_write();

ALTER TABLE public.blog_trails ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access" ON public.blog_trails;
DROP POLICY IF EXISTS "Allow authenticated CRUD" ON public.blog_trails;
CREATE POLICY "Allow public read access" ON public.blog_trails FOR SELECT USING (true);
CREATE POLICY "Allow authenticated CRUD" ON public.blog_trails FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Obrigatório para tabelas novas em projetos Supabase a partir de 30/10/2026.
GRANT SELECT ON public.blog_trails TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_trails TO authenticated, service_role;

-- Cada artigo pertence a uma trilha (excluir uma trilha com artigos é bloqueado) e tem uma posição nela.
ALTER TABLE public.contents
  ADD COLUMN IF NOT EXISTS trail_id UUID REFERENCES public.blog_trails (id) ON DELETE RESTRICT,
  ADD COLUMN IF NOT EXISTS trail_position INTEGER CHECK (trail_position > 0);
CREATE INDEX IF NOT EXISTS contents_trail_idx ON public.contents (trail_id, trail_position);

-- Migração dos artigos existentes: cada categoria usada vira uma trilha, na ordem do seu primeiro artigo.
INSERT INTO public.blog_trails (name, slug, display_order)
SELECT c.name, c.name,
       (SELECT coalesce(max(display_order), 0) FROM public.blog_trails) + row_number() OVER (ORDER BY c.first_post)
FROM (
  SELECT trim(category) AS name, min(created_at) AS first_post
  FROM public.contents
  WHERE trail_id IS NULL AND nullif(trim(category), '') IS NOT NULL
  GROUP BY trim(category)
) c
ON CONFLICT DO NOTHING;

UPDATE public.contents c
SET trail_id = t.id
FROM public.blog_trails t
WHERE c.trail_id IS NULL AND t.name = trim(c.category);

-- Posição: o número do título ("Dia 05/30" → 5); os demais entram depois, por data de publicação.
UPDATE public.contents
SET trail_position = (regexp_match(title, 'dia\s*0*([0-9]{1,4})\s*/', 'i'))[1]::int
WHERE trail_id IS NOT NULL AND trail_position IS NULL
  AND (regexp_match(title, 'dia\s*0*([0-9]{1,4})\s*/', 'i'))[1]::int > 0;

UPDATE public.contents c
SET trail_position = n.position
FROM (
  SELECT x.id,
         coalesce((SELECT max(y.trail_position) FROM public.contents y WHERE y.trail_id = x.trail_id), 0)
           + row_number() OVER (PARTITION BY x.trail_id ORDER BY x.created_at, x.id) AS position
  FROM public.contents x
  WHERE x.trail_id IS NOT NULL AND x.trail_position IS NULL
) n
WHERE c.id = n.id;

COMMIT;

-- Corrige a ordem de estudo das trilhas: a etapa de cada artigo passa a ser o número do dia no título.
--   "Dia 11/30 — Revisão do Tópico 2" → etapa 11
--   "26/30 — Permissões e Propriedade"  → etapa 26
-- Artigos sem esse número no título (ex.: "O que é um PRD?") não mudam.
-- Execute no SQL Editor do Supabase. O resultado lista os artigos que mudaram de etapa;
-- rodar de novo não altera nada (a lista volta vazia).

UPDATE public.contents AS c
SET trail_position = n.day
FROM (
  SELECT id, (regexp_match(title, '^\s*(?:dia\s*)?0*([0-9]{1,4})\s*/\s*[0-9]', 'i'))[1]::int AS day
  FROM public.contents
  WHERE trail_id IS NOT NULL
) AS n
WHERE c.id = n.id
  AND n.day > 0
  AND c.trail_position IS DISTINCT FROM n.day
RETURNING c.title, c.trail_position AS etapa;

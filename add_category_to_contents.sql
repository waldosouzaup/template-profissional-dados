-- Adiciona a coluna category na tabela contents para categorização dos posts do blog
ALTER TABLE public.contents ADD COLUMN IF NOT EXISTS category TEXT;

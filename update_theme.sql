-- Adiciona as colunas de tema e cor no profile
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'dark';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS primary_color TEXT DEFAULT '142 71% 45%';

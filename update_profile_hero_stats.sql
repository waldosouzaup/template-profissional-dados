-- Adiciona campos de estatísticas, frase do Hero e Chave do Formulário no perfil
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS stat_1_number TEXT DEFAULT '+15',
ADD COLUMN IF NOT EXISTS stat_1_label TEXT DEFAULT 'Projetos Ativos',
ADD COLUMN IF NOT EXISTS stat_2_number TEXT DEFAULT '5+',
ADD COLUMN IF NOT EXISTS stat_2_label TEXT DEFAULT 'Anos de Experiência',
ADD COLUMN IF NOT EXISTS hero_phrase_start TEXT DEFAULT 'Data is the',
ADD COLUMN IF NOT EXISTS hero_phrase_strike TEXT DEFAULT 'Future',
ADD COLUMN IF NOT EXISTS hero_phrase_end TEXT DEFAULT 'Present.',
ADD COLUMN IF NOT EXISTS contact_form_key TEXT;

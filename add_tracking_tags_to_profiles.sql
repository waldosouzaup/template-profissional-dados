-- Adiciona um campo para snippets de rastreamento no perfil principal.
-- Use este comando no SQL Editor do Supabase antes de salvar tags em /admin/settings.
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS tracking_tags TEXT;

COMMENT ON COLUMN public.profiles.tracking_tags IS
'Snippets HTML/JavaScript de rastreamento, como Google Tag, Google Analytics, GTM ou Meta Pixel.';

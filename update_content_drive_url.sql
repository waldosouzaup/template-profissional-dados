-- Adiciona a coluna drive_folder_url na tabela contents
ALTER TABLE public.contents ADD COLUMN IF NOT EXISTS drive_folder_url TEXT;

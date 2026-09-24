-- Versões de aparência do site (Configurações → Aparência do Portfólio): Padrão, Obsidiana, Meia-noite e Ametista.
-- Guarda a versão escolhida no perfil; o modo (claro/escuro) e a cor de destaque continuam em theme e primary_color.
-- Execute no SQL Editor do Supabase ANTES de publicar a versão do site que usa esta coluna.
-- Pode ser executado mais de uma vez com segurança.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS theme_preset TEXT NOT NULL DEFAULT 'padrao';

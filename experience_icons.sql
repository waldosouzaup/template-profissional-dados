-- Ícones por cargo em Experiências Profissionais (Sobre → Experiências Profissionais).
-- A lista fixa antiga (rocket, award, briefcase) bloquearia os ícones novos (DevOps, Suporte, Help Desk...);
-- as opções agora vêm do painel (src/lib/experience-icons.ts). Os ícones já salvos continuam valendo.
-- Execute no SQL Editor do Supabase ANTES de salvar um ícone novo. Pode ser executado mais de uma vez com segurança.
BEGIN;

DO $$
DECLARE c record;
BEGIN
  FOR c IN
    SELECT conname FROM pg_constraint
    WHERE conrelid = 'public.experience'::regclass AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%icon_type%'
  LOOP
    EXECUTE format('ALTER TABLE public.experience DROP CONSTRAINT %I', c.conname);
  END LOOP;
END;
$$;

ALTER TABLE public.experience ALTER COLUMN icon_type SET DEFAULT 'briefcase';

COMMIT;

-- Segurança do painel: só a conta administradora escreve no banco e no Storage; o público só lê.
--
-- Por quê: com o cadastro público ligado no Supabase Auth, qualquer pessoa cria uma conta pela API
-- (a chave anon está no JavaScript do site) e as políticas antigas ("qualquer usuário autenticado")
-- davam a ela permissão para editar/apagar tudo, inclusive as Tags de Rastreamento (JavaScript que
-- roda em todas as páginas).
--
-- ANTES DE EXECUTAR
--   1. Painel do Supabase → Authentication → Sign In / Providers: desligue "Allow new users to sign up"
--      e ligue "Confirm email". Em URL Configuration, use Site URL https://waldoeller.com.
--   2. Rode as consultas de auditoria abaixo (uma por vez) e guarde o resultado:
--        -- Contas existentes: exclua (Authentication → Users) qualquer uma que não seja sua.
--        SELECT id, email, created_at, last_sign_in_at, raw_app_meta_data FROM auth.users ORDER BY created_at;
--        -- Políticas atuais (este script apaga e recria todas as das tabelas abaixo e do Storage).
--        SELECT schemaname, tablename, policyname, cmd, roles, qual, with_check FROM pg_policies
--        WHERE schemaname IN ('public', 'storage') ORDER BY 1, 2, 3;
--        -- Buckets: este script supõe que o projeto Supabase é só deste site (bucket "portfolio").
--        SELECT id, public, file_size_limit, allowed_mime_types FROM storage.buckets;
--        -- Arquivos enviados recentemente e por quem.
--        SELECT name, owner, created_at FROM storage.objects ORDER BY created_at DESC LIMIT 50;
--        -- Tags de rastreamento salvas: devem estar vazias ou conter só o que você colou.
--        SELECT tracking_tags FROM public.profiles;
--   3. Troque SEU_EMAIL_ADMIN (mais abaixo) pelo e-mail que você usa em /admin/login.
--
-- DEPOIS DE EXECUTAR
--   Saia do painel e entre de novo: a sessão nova é que carrega o papel de administrador.
--   Rode este arquivo de novo sempre que executar outro SQL que crie tabelas ou políticas.
--
-- Pode ser executado mais de uma vez com segurança. Se o e-mail não existir, nada é alterado.
BEGIN;

-- Administrador = conta com app_metadata.role = "admin". O app_metadata só muda por SQL ou pela
-- chave service_role; o próprio usuário não consegue se promover (ao contrário do user_metadata).
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
  SELECT coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false)
$$;

DO $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
  WHERE lower(email) = lower('SEU_EMAIL_ADMIN');
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Nenhuma conta com esse e-mail. Troque SEU_EMAIL_ADMIN pelo e-mail que você usa em /admin/login.';
  END IF;
END;
$$;

-- Tabelas do site: leitura pública, escrita só do administrador.
DO $$
DECLARE
  t text;
  p record;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'projects', 'profiles', 'contents', 'blog_trails', 'project_categories', 'custom_pages',
    'technologies', 'courses', 'education', 'experience', 'books', 'journey_items'
  ] LOOP
    CONTINUE WHEN to_regclass(format('public.%I', t)) IS NULL;

    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    FOR p IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = t LOOP
      EXECUTE format('DROP POLICY %I ON public.%I', p.policyname, t);
    END LOOP;

    EXECUTE format('CREATE POLICY "Leitura pública" ON public.%I FOR SELECT TO anon, authenticated USING (true)', t);
    EXECUTE format('CREATE POLICY "Admin insere" ON public.%I FOR INSERT TO authenticated WITH CHECK ((SELECT public.is_admin()))', t);
    EXECUTE format('CREATE POLICY "Admin edita" ON public.%I FOR UPDATE TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()))', t);
    EXECUTE format('CREATE POLICY "Admin exclui" ON public.%I FOR DELETE TO authenticated USING ((SELECT public.is_admin()))', t);

    -- Obrigatório para tabelas novas em projetos Supabase a partir de 30/10/2026; visitantes nunca escrevem.
    EXECUTE format('GRANT SELECT ON public.%I TO anon, authenticated', t);
    EXECUTE format('GRANT INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.%I FROM anon', t);
    EXECUTE format('REVOKE TRUNCATE ON public.%I FROM authenticated', t);
  END LOOP;
END;
$$;

-- Storage: imagens de até 5 MB (sem SVG, que pode conter scripts). Os links públicos continuam
-- funcionando sem política; enviar, trocar e apagar arquivos fica só com o administrador.
DO $$
DECLARE p record;
BEGIN
  UPDATE storage.buckets
  SET public = true,
      file_size_limit = 5242880,
      allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif', 'image/x-icon', 'image/vnd.microsoft.icon']
  WHERE id = 'portfolio';
  IF NOT FOUND THEN
    RAISE NOTICE 'Bucket "portfolio" não encontrado: crie-o em Storage (público) e rode este arquivo de novo.';
  END IF;

  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' LOOP
    EXECUTE format('DROP POLICY %I ON storage.objects', p.policyname);
  END LOOP;
END;
$$;

CREATE POLICY "Admin lê arquivos do portfolio" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'portfolio' AND (SELECT public.is_admin()));
CREATE POLICY "Admin envia arquivos ao portfolio" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'portfolio' AND (SELECT public.is_admin()));
CREATE POLICY "Admin troca arquivos do portfolio" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'portfolio' AND (SELECT public.is_admin()))
  WITH CHECK (bucket_id = 'portfolio' AND (SELECT public.is_admin()));
CREATE POLICY "Admin apaga arquivos do portfolio" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'portfolio' AND (SELECT public.is_admin()));

-- Função antiga de supabase_schema.sql sem search_path fixo (alerta do linter do Supabase).
DO $$
BEGIN
  IF to_regprocedure('public.update_updated_at_column()') IS NOT NULL THEN
    ALTER FUNCTION public.update_updated_at_column() SET search_path = '';
  END IF;
END;
$$;

COMMIT;

-- Conferência (depois do COMMIT): toda política de escrita deve citar is_admin.
-- SELECT schemaname, tablename, policyname, cmd, qual, with_check FROM pg_policies
-- WHERE schemaname IN ('public', 'storage') AND cmd <> 'SELECT' ORDER BY 1, 2, 3;

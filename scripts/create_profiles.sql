-- Remover constraint de foreign key se existir e criar tabela profiles
-- Primeiro, verifica se existe a constraint e remove
DO $$
BEGIN
  -- Se a constraint existir, removê-la
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'profiles_id_fkey' AND table_name = 'profiles') THEN
    ALTER TABLE profiles DROP CONSTRAINT profiles_id_fkey;
  END IF;
END $$;

-- Agora criar/atualizar a tabela
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') THEN
    CREATE TABLE profiles (
      id UUID PRIMARY KEY,
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      full_name TEXT,
      bio_summary TEXT,
      bio_detailed TEXT,
      phone TEXT DEFAULT '(61) 9 9116-1854',
      email TEXT,
      avatar_url TEXT,
      location TEXT DEFAULT 'Brasília, DF',
      current_focus TEXT DEFAULT 'Engenharia de Dados'
    );
    
    -- Inserir registro inicial com ID válido (UUID vazio ou criar novo)
    INSERT INTO profiles (id, full_name, bio_summary, bio_detailed, phone, email, avatar_url, location, current_focus)
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      'Paulo Martins',
      'Engenheiro de Dados | Desenvolvedor Full Stack',
      'Profissional com experiência em engenharia de dados, desenvolvimento web e soluções de IA.',
      '(61) 9 9116-1854',
      'contato@pmartinsimob.com.br',
      '',
      'Brasília, DF',
      'Engenharia de Dados'
    );
  ELSE
    IF NOT EXISTS (SELECT 1 FROM profiles LIMIT 1) THEN
      INSERT INTO profiles (id, full_name, bio_summary, bio_detailed, phone, email, avatar_url, location, current_focus)
      VALUES (
        '00000000-0000-0000-0000-000000000000',
        'Paulo Martins',
        'Engenheiro de Dados | Desenvolvedor Full Stack',
        'Profissional com experiência em engenharia de dados, desenvolvimento web e soluções de IA.',
        '(61) 9 9116-1854',
        'contato@pmartinsimob.com.br',
        '',
        'Brasília, DF',
        'Engenharia de Dados'
      );
    END IF;
  END IF;
END $$;
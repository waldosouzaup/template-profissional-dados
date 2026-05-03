-- Adiciona a coluna navbar_logo_url à tabela profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS navbar_logo_url TEXT;

-- Atualiza o perfil atual com a nova logo
UPDATE profiles 
SET navbar_logo_url = 'https://ltgqjjxhkqunuiqxmfvl.supabase.co/storage/v1/object/public/portfolio/favicon/mc2xxbwgfy-1777834060613.png'
WHERE id = (SELECT id FROM profiles LIMIT 1);

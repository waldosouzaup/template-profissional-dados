-- Adicionar coluna markdown se não existir e verificar projetos
DO $$
BEGIN
  -- Adicionar coluna markdown se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'markdown'
  ) THEN
    ALTER TABLE projects ADD COLUMN markdown TEXT;
  END IF;
END $$;

-- Verificar projetos com markdown
SELECT id, title, LENGTH(markdown) as tamanho_markdown 
FROM projects 
WHERE markdown IS NOT NULL AND LENGTH(markdown) > 0
LIMIT 10;
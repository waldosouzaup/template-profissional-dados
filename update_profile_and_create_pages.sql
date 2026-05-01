-- Adiciona a coluna navbar_icon no profile
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS navbar_icon TEXT DEFAULT 'Database';

-- Cria a tabela de páginas customizadas
CREATE TABLE IF NOT EXISTS public.custom_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    markdown TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilita RLS
ALTER TABLE public.custom_pages ENABLE ROW LEVEL SECURITY;

-- Políticas para custom_pages
CREATE POLICY "Leitura pública de custom_pages" ON public.custom_pages FOR SELECT USING (true);
CREATE POLICY "Escrita autenticada de custom_pages" ON public.custom_pages FOR ALL USING (auth.role() = 'authenticated');

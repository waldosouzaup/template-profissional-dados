-- Tabela para armazenar os itens da jornada (timeline)
CREATE TABLE IF NOT EXISTS public.journey_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    year TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Políticas de RLS
ALTER TABLE public.journey_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Journey items are viewable by everyone"
    ON public.journey_items FOR SELECT
    USING (true);

CREATE POLICY "Users can insert journey items"
    ON public.journey_items FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update journey items"
    ON public.journey_items FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete journey items"
    ON public.journey_items FOR DELETE
    USING (auth.role() = 'authenticated');

-- Create the projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  cover_image TEXT NOT NULL,
  link TEXT NOT NULL DEFAULT '#',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  content TEXT NOT NULL,
  stack TEXT[] NOT NULL DEFAULT '{}',
  stats JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all users (including anonymous) to read projects
CREATE POLICY "Allow public read access to projects"
  ON public.projects
  FOR SELECT
  USING (true);

-- Create policy to allow only authenticated users to insert projects
CREATE POLICY "Allow authenticated users to insert projects"
  ON public.projects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policy to allow only authenticated users to update projects
CREATE POLICY "Allow authenticated users to update projects"
  ON public.projects
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policy to allow only authenticated users to delete projects
CREATE POLICY "Allow authenticated users to delete projects"
  ON public.projects
  FOR DELETE
  TO authenticated
  USING (true);

-- Trigger to update 'updated_at' column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Note: To manage the Admin users, use the built-in Supabase Auth functionalities directly via Dashboard.

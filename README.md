# 🚀 Template para Profissionais de Dados & IA & TI


---

## Português

Este projeto é um **template profissional de Portfólio e Blog**, construído com tecnologias modernas para oferecer uma experiência de "Dark Mode" elegante, gestão administrativa integrada e alta performance. Ideal para engenheiros de dados, desenvolvedores e entusiastas de IA que desejam uma presença online de impacto.

### ✨ Funcionalidades

- 🌑 **Dark Mode Nativo**: Interface sofisticada com tema escuro.
- 📝 **Blog Integrado**: Suporte a Markdown para posts técnicos e tutoriais.
- 🛠️ **Painel Administrativo**: Gestão completa de projetos, experiências, educação e tecnologias.
- 📱 **Responsivo**: Adaptado para todos os dispositivos.
- ⚡ **Performance**: Construído com Vite + React para carregamento instantâneo.

### 🛠️ Tecnologias

- **Frontend**: React 18, TypeScript, Tailwind CSS, Shadcn UI, Lucide React.
- **Backend/Database**: Supabase (PostgreSQL, Auth, Storage).
- **Gerenciamento de Estado**: TanStack Query (React Query).

---

## 🚀 Setup & Installation (Guia de Configuração)

### 1. Clonar e Instalar (Clone & Install)

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
npm install
```

### 2. Variáveis de Ambiente (Environment Variables)

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
```

### 3. Banco de Dados (Database Setup - Supabase)

Execute o seguinte SQL no **SQL Editor** do seu projeto Supabase para criar a estrutura necessária:

```sql
-- TABELA DE PERFIS (PROFILES)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  updated_at timestamp with time zone,
  full_name text,
  bio_summary text,
  bio_detailed text,
  phone text default '(61) 9 9116-1854',
  email text,
  avatar_url text,
  location text default 'Brasília, DF',
  current_focus text default 'Engenharia de Dados'
);

-- TABELA DE PROJETOS (PROJECTS)
create table projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text check (category in ('Dados', 'Web', 'IA')),
  description text not null,
  technologies text[] default '{}',
  image_url text,
  business_problem text,
  context text,
  premises text[] default '{}',
  strategy text[] default '{}',
  insights text[] default '{}',
  results text[] default '{}',
  next_steps text[] default '{}',
  github_url text,
  demo_url text,
  display_order integer default 0,
  is_published boolean default true,
  markdown text,
  created_at timestamp with time zone default now()
);

-- TABELA DE EDUCAÇÃO (EDUCATION)
create table education (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  institution text not null,
  period text,
  description text,
  display_order integer default 0,
  created_at timestamp with time zone default now()
);

-- TABELA DE EXPERIÊNCIAS (EXPERIENCE)
create table experience (
  id uuid default gen_random_uuid() primary key,
  type text check (type in ('Profissional', 'Embaixador', 'Projeto', 'Outros')),
  icon_type text default 'rocket',
  title text not null,
  institution text not null,
  description text,
  period text,
  display_order integer default 0,
  created_at timestamp with time zone default now()
);

-- TABELA DE CONTEÚDO / BLOG (CONTENTS)
create table contents (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  markdown text,
  image_url text,
  created_at timestamp with time zone default now()
);

-- Habilitar RLS (Enable Row Level Security)
alter table profiles enable row level security;
alter table projects enable row level security;
alter table education enable row level security;
alter table experience enable row level security;
alter table contents enable row level security;

-- Políticas de Acesso (Policies - Read for Anon)
create policy "Allow public read access" on profiles for select using (true);
create policy "Allow public read access" on projects for select using (true);
create policy "Allow public read access" on education for select using (true);
create policy "Allow public read access" on experience for select using (true);
create policy "Allow public read access" on contents for select using (true);
```

### 4. Deploy

Este projeto está configurado para deploy instantâneo na **Netlify** ou **Vercel**. 
Certifique-se de adicionar as variáveis de ambiente no painel administrativo da plataforma escolhida.

---

## 📄 Licença (License)

Este projeto está sob a licença MIT. Sinta-se à vontade para clonar e usar como base para o seu próprio portfólio profissional!

Developed with ❤️ por Waldo Eller.

# 🚀 Template para Profissionais de Dados & IA & TI

---

Este projeto é um **template profissional de Portfólio e Blog**, construído com tecnologias modernas para oferecer uma experiência de "Dark Mode" elegante, gestão administrativa integrada e alta performance. Ideal para engenheiros de dados, desenvolvedores e entusiastas de IA que desejam uma presença online de impacto.

![Template](https://ltgqjjxhkqunuiqxmfvl.supabase.co/storage/v1/object/public/portfolio/00-template.png)

### ✨ Funcionalidades

- 🌑 **Dark/Light Mode Premium**: Suporte total a temas claros e escuros, configurável via painel administrativo.
- 🎨 **Personalização de Cores**: Escolha entre 6 paletas de cores de destaque premium (Verde, Azul, Roxo, Laranja, Rosa, Amarelo) que alteram instantaneamente a estética de todo o site.
- 🏷️ **Páginas Customizadas (CMS)**: Crie novas páginas dinâmicas com suporte a Markdown diretamente pelo admin (ex: `/p/seu-link`).
- 📝 **Blog Integrado com Categorias**: Sistema de blog completo com suporte a Markdown, categorias filtráveis, tempo de leitura estimado e índice interativo.
- 📂 **Arquivos do Post**: Campo dedicado para vincular pastas do Google Drive com arquivos de apoio diretamente nos posts do blog.
- 🏠 **Branding Dinâmico**: Altere o ícone de logo da Navbar diretamente no perfil usando qualquer ícone da biblioteca Lucide.
- 📚 **Biblioteca & Certificações**: Seções dinâmicas para exibir livros que você recomenda e cursos/certificações extras.
- 🛠️ **Painel Administrativo**: Gestão completa com autenticação Supabase para gerenciar Portfólio, Experiências, Educação, Livros, Cursos, Páginas Customizadas e Configurações de Perfil (incluindo Favicon).
- 🔍 **SEO Otimizado**: Meta tags dinâmicas, Microdados Estruturados (JSON-LD) e geração pronta para sitemap para garantir visibilidade máxima nos motores de busca.
- ⚡ **Performance Ultra**: Construído com Vite + React para carregamento instantâneo.

### 🛠️ Tecnologias

- **Frontend**: React 18, TypeScript, Tailwind CSS, Shadcn UI, Lucide React, Framer Motion (animações).
- **Backend/Database**: Supabase (PostgreSQL, Auth, Storage).
- **Gerenciamento de Estado**: TanStack Query (React Query) e Zustand.

---

## 🚀 Guia Completo de Setup & Instalação

Siga este passo a passo detalhado para clonar e rodar o seu próprio portfólio.

### 1. Clonar e Instalar as Dependências

Primeiro, obtenha o código fonte do repositório:

```bash
git clone https://github.com/waldosouzaup/template-profissional-dados.git
cd dark-mode-mirror
npm install
```

### 2. Configurar o Supabase (Banco de Dados e Auth)

Este projeto usa o **Supabase** como backend.

1. Crie uma conta no [Supabase](https://supabase.com/) e crie um novo projeto.
2. Vá no portal do seu projeto Supabase, acesse **Project Settings > API** e anote a sua **Project URL** e a sua **"anon" public API key**.

#### Criando as Tabelas (Database Schema)

Vá até o menu **SQL Editor** no painel do Supabase, crie um novo script e execute o seguinte código SQL para construir estruturalmente o banco de dados e habilitar o sistema de segurança (RLS):

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
  current_focus text default 'Engenharia de Dados',
  about_title text,
  cv_url text,
  favicon_url text,
  hero_title text,
  navbar_icon text default 'Database',
  theme text default 'dark',
  primary_color text default '142 71% 45%'
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
  type text check (type in ('profissional', 'embaixador', 'projeto', 'outros')),
  icon_type text check (icon_type in ('rocket', 'award', 'briefcase')) default 'rocket',
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
  category text,
  drive_folder_url text,
  created_at timestamp with time zone default now()
);

-- TABELA DE PÁGINAS CUSTOMIZADAS (CUSTOM_PAGES)
create table custom_pages (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  markdown text,
  created_at timestamp with time zone default now()
);

-- TABELA DE LIVROS (BOOKS)
create table books (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  author text,
  description text,
  image_url text,
  created_at timestamp with time zone default now()
);

-- TABELA DE CURSOS (COURSES)
create table courses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  period text,
  certificate_url text,
  description text,
  topics text[] default '{}',
  created_at timestamp with time zone default now()
);

-- Habilitar RLS (Row Level Security)
alter table profiles enable row level security;
alter table projects enable row level security;
alter table education enable row level security;
alter table experience enable row level security;
alter table contents enable row level security;
alter table custom_pages enable row level security;
alter table books enable row level security;
alter table courses enable row level security;

-- Políticas de Acesso de Leitura Pública
create policy "Allow public read access" on profiles for select using (true);
create policy "Allow public read access" on projects for select using (true);
create policy "Allow public read access" on education for select using (true);
create policy "Allow public read access" on experience for select using (true);
create policy "Allow public read access" on contents for select using (true);
create policy "Allow public read access" on custom_pages for select using (true);
create policy "Allow public read access" on books for select using (true);
create policy "Allow public read access" on courses for select using (true);

-- Políticas Básicas de Escrita para Usuários Autenticados (Admin)
create policy "Allow authenticated CRUD" on profiles for all to authenticated using (true) with check (true);
create policy "Allow authenticated CRUD" on projects for all to authenticated using (true) with check (true);
create policy "Allow authenticated CRUD" on education for all to authenticated using (true) with check (true);
create policy "Allow authenticated CRUD" on experience for all to authenticated using (true) with check (true);
create policy "Allow authenticated CRUD" on contents for all to authenticated using (true) with check (true);
create policy "Allow authenticated CRUD" on custom_pages for all to authenticated using (true) with check (true);
create policy "Allow authenticated CRUD" on books for all to authenticated using (true) with check (true);
create policy "Allow authenticated CRUD" on courses for all to authenticated using (true) with check (true);
```

#### Criação do Usuário Administrador

Ainda no Supabase Dashboard, navegue até a guia **Authentication > Users** e clique em **Add user** (Adicionar Usuário). 
Crie a sua conta de Email e Senha. Este será o login que você usará para acessar o `/admin` do portfólio.

#### 📂 Configurando o Storage (Imagens)

Para que o upload de fotos de perfil e capas de projetos funcione:
1. No painel do Supabase, vá em **Storage**.
2. Clique em **New Bucket** e crie um bucket chamado `portfolio`.
3. Certifique-se de marcar a opção **Public bucket** para que as imagens fiquem visíveis no seu site.

### 3. Configurar as Variáveis de Ambiente Locais

Crie um novo arquivo chamado `.env.local` na pasta raiz do projeto clonado, e preencha com as credenciais que você anotou no Passo 2:

```env
VITE_SUPABASE_URL=sua_url_do_supabase_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase_aqui
```

### 4. Rodando o Projeto

Agora que o banco está configurado e as chaves injetadas, basta rodar o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse `http://localhost:8080/admin` (ou a porta exibida no seu console) e faça o login com o e-mail e senha criados. Após o login, você poderá cadastrar seus projetos, experiências e livros!

### 5. Deploy em Produção (Vercel ou Netlify)

Fazer o deploy para a nuvem é rápido e gratuito com plataformas como a Netlify ou a Vercel.

1. Suba o seu código push no GitHub.
2. Acesse a **Netlify** (ou **Vercel**), crie um novo site importando o seu repositório.
3. Nas configurações de deploy da plataforma, garanta as seguintes regras:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Na página de configuração das **Environment Variables** da Vercel/Netlify, certifique-se de preencher as chaves `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
5. Clique em Deploy.

Seu portfólio está configurado e responsivo, pronto para brilhar online.

## 👨‍💻 Criador

Este projeto foi desenvolvido e é mantido por **Waldo Eller**. Se você gostou deste template ou deseja conhecer mais do meu trabalho, visite meu site oficial:

👉 [**www.waldoeller.com**](https://www.waldoeller.com)

---

## 🎨 Gestão de Ícones (Experiências e Skills)

Este template foi projetado para oferecer flexibilidade total na renderização de ícones para as suas tecnologias e experiências. Abaixo, explicamos como gerenciar e utilizar os ícones através do Painel Administrativo.

### Seção 'Experiências'
Na seção de Experiências profissionais, o sistema utiliza a biblioteca **Lucide React**.
No momento do cadastro de uma nova experiência no painel de administração (`/admin/experiences`), você deve selecionar o tipo da experiência que define o ícone padrão, ou inserir o nome do ícone diretamente. 

Os ícones padrão suportados na aba de experiência são:
- `rocket`: Ideal para experiências profissionais e lançamentos.
- `award`: Ideal para prêmios, reconhecimentos ou posições de destaque.
- `briefcase`: Ideal para experiência corporativa, trabalhos formais ou projetos de longo prazo.

*(Se necessário adicionar novos ícones na experiência, basta adicionar novos nomes no schema do banco de dados na constante `IconTypeEnum` e injetar o ícone correspondente no frontend via Lucide).*

### Seção 'Skills & Tecnologias'
A seção de Tecnologias da página inicial possui um renderizador dinâmico extremamente robusto, que mapeia ícones diretamente das bibliotecas `react-icons/si` (Simple Icons) e `lucide-react`.

1. **Como Inserir o Ícone no Painel**:
   No painel administrativo de Tecnologias (`/admin/technologies`), há um campo chamado **"Ícone"**. Neste campo, você deve digitar o nome exato do componente de ícone desejado da biblioteca Simple Icons.
   Exemplos comuns:
   - Para Python: digite `SiPython`
   - Para React: digite `SiReact`
   - Para Docker: digite `SiDocker`
   - Para AWS: digite `SiAmazonaws` ou use o fallback configurado.

2. **Fallbacks Internos Automáticos**:
   O sistema foi configurado com um mapeamento automático (Fallback) para tecnologias famosas que as vezes possuem nomes complexos ou não estão disponíveis. Caso a string não seja encontrada exatamente no repositório do `react-icons`, o sistema tentará renderizar ícones baseados no `lucide-react` para garantir que o layout nunca quebre (Ex: Azure, Power BI, AWS, Databricks).

3. **Pesquisa de Ícones**:
   Para consultar o nome exato de um ícone que você queira usar na seção de skills, visite o site oficial do [React Icons - Simple Icons](https://react-icons.github.io/react-icons/icons/si/) e busque pela tecnologia. Lembre-se sempre de copiar o nome completo com o prefixo `Si` (Exemplo: `SiPostgresql`).

---

## 📄 Licença (License)

Este projeto está sob a licença MIT. Sinta-se à vontade para clonar, modificar as estéticas e usar livremente para a sua própria apresentação técnica! No painel de administração, as ferramentas se tornam dinâmicas e de fácil uso.

Desenvolvido por Waldo Eller para ajudar profissionais de tecnologia a apresentarem o que fazem de melhor aos recrutadores e clientes.

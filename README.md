# Template Profissional de Portfólio, Trilhas de Estudo e CMS

Aplicação React para portfólio profissional com trilhas de estudo, painel administrativo, CMS de páginas customizadas, upload de imagens, SEO dinâmico, tema configurável e integração com Supabase.

O projeto foi criado para profissionais de Dados, IA, Tecnologia e Desenvolvimento que precisam de uma presença digital elegante, editável e pronta para produção.

![Template](https://ltgqjjxhkqunuiqxmfvl.supabase.co/storage/v1/object/public/portfolio/00-template.png)

## Funcionalidades

- Portfólio com projetos organizados por categorias editáveis no painel (padrão: Dados, Web e IA).
- **Trilhas de estudo** (em `/blog`): a página mostra um card por trilha e cada trilha lista seus artigos na ordem de estudo, com anterior/próximo em cada post. Posts em Markdown, com capa, slug, ampliação de imagens e arquivos complementares via Google Drive.
- Conteúdo legível por assistentes de IA e rastreadores sem JavaScript: cada página pública chega com título, meta tags, JSON-LD e o texto completo no HTML (Netlify Edge Function), além de `/llms.txt`.
- Página exclusiva de contato em `/contact`, com formulário Web3Forms ou fallback por `mailto`.
- Painel administrativo protegido por Supabase Auth.
- CMS de páginas customizadas em `/p/:slug`.
- Tema claro/escuro e cor de destaque configuráveis no admin.
- Branding dinâmico com favicon, logo da navbar e ícone fallback Lucide.
- Hero da página inicial editável pelo painel (título, destaque, bio e link do CV).
- URLs amigáveis para projetos (`/projects/<slug>`), com redirecionamento 301 das URLs antigas.
- Cards de projetos e posts padronizados em todo o site (capa, categoria, resumo e chamada).
- Botão flutuante de voltar ao topo nas páginas públicas.
- Página Sobre com título, apresentação, formação acadêmica, experiências profissionais, livros e cursos complementares.
- Upload de imagens no Supabase Storage.
- SEO dinâmico com meta tags, canonical, Open Graph e JSON-LD.
- Sitemap e redirecionamentos (`_redirects`) gerados automaticamente no build.
- Painel organizado por página do site: **Perfil (Home)** e **Sobre** com índice lateral, cadastros em janelas e salvamento imediato das listas.
- Campo administrativo para tags de rastreamento como Google Tag, Google Analytics, GTM e Pixel da Meta.

## Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui e Radix UI
- Lucide React
- React Icons
- React Router
- TanStack Query
- React Hook Form e Zod
- React Markdown e remark-gfm
- Supabase Auth, Database e Storage
- Web3Forms para formulário de contato
- Vitest
- Netlify-ready

## Rotas Públicas

| Rota | Descrição |
| --- | --- |
| `/` | Home com perfil, Hero, projetos em destaque, skills e certificações |
| `/projects` | Galeria de projetos |
| `/projects/:slug` | Detalhe de projeto (URL amigável; links antigos por UUID redirecionam) |
| `/about` | Página Sobre: título, apresentação, formação acadêmica, experiências profissionais, livros e cursos complementares |
| `/blog` | Trilhas de estudo (um card por trilha) |
| `/blog/trilha/:slug` | Artigos da trilha, na ordem de estudo |
| `/blog/:idOrSlug` | Post individual, com etapa e anterior/próximo na trilha |
| `/llms.txt` | Mapa do site em Markdown para modelos de linguagem |
| `/contact` | Página dedicada de contato |
| `/p/:slug` | Página customizada criada pelo CMS |

## Painel Administrativo

O painel fica em `/admin` e usa autenticação do Supabase.

Módulos disponíveis:

- Perfil (Home)
- Sobre (título e apresentação, formação acadêmica, experiências profissionais, livros e cursos complementares, na mesma ordem da página)
- Projetos
- Trilhas (trilhas de estudo e seus artigos)
- Páginas customizadas
- Configurações

Na aba `Configurações`, o administrador pode ajustar aparência e inserir tags de rastreamento. Na aba `Perfil (Home)`, é possível editar identidade, marca (favicon, logo e ícone da navbar), Hero, contato, chave Web3Forms e, no mesmo lugar, cadastrar as skills e escolher as certificações exibidas na Home.

## Pré-requisitos

- Node.js 20 ou superior
- npm
- Projeto Supabase ativo
- Bucket público `portfolio` no Supabase Storage
- Usuário admin criado no Supabase Auth

## Instalação

```bash
git clone https://github.com/waldosouzaup/template-profissional-dados.git
cd template-profissional-dados
npm install
```

Crie o arquivo `.env.local` na raiz:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon_publica
```

Rode o projeto:

```bash
npm run dev
```

Acesse:

- Site: `http://localhost:8080`
- Admin: `http://localhost:8080/admin`

## Scripts

```bash
npm run dev
npm run build
npm run build:dev
npm run preview
npm run lint
npm run test
npm run test:watch
```

O comando `npm run build` executa `scripts/generate-sitemap.js` antes do build para atualizar `public/sitemap.xml`.

## Banco de Dados

O projeto usa Supabase/PostgreSQL. As tabelas principais são:

- `profiles`
- `projects`
- `contents`
- `blog_trails`
- `project_categories`
- `custom_pages`
- `books`
- `courses`
- `education`
- `experience`
- `journey_items` (legado: a Jornada não é mais exibida no site)
- `technologies`

As políticas esperadas são:

- leitura pública para conteúdo exibido no site;
- CRUD para usuários autenticados no painel administrativo.

### Migrações

Em um banco já existente, execute no **SQL Editor** do Supabase, nesta ordem, os scripts da raiz do projeto (ambos podem ser executados novamente sem apagar dados):

1. `update_home_sections.sql` — textos de Skills e Certificações no perfil, categoria das skills e destaque de cursos na Home.
2. `project_slugs.sql` — URLs amigáveis dos projetos (`slug`, `previous_slugs`, `updated_at`), com gatilho que normaliza e versiona os slugs.
3. `project_categories.sql` — tabela `project_categories` (nome, ícone e ordem) usada pelas categorias editáveis; `projects.category` passa a referenciá-la (renomear atualiza os projetos; categorias em uso não podem ser excluídas).
4. `blog_trails.sql` — tabela `blog_trails` (nome, endereço, descrição, capa e ordem) e as colunas `contents.trail_id` e `contents.trail_position`. Cada categoria usada pelos posts vira uma trilha, e a posição vem do título ("Dia 05/30" → 5) ou da data. Trilhas com artigos não podem ser excluídas.
5. `experience_icons.sql` — libera os ícones por cargo em Experiências Profissionais (remove a lista fixa `rocket`/`award`/`briefcase` da coluna `experience.icon_type`).
6. `theme_preset.sql` — coluna `profiles.theme_preset`, com a versão de aparência escolhida em Configurações.

Em instalações novas, rode o SQL completo abaixo e, em seguida, `project_slugs.sql`, `project_categories.sql` e `blog_trails.sql` (o SQL completo já inclui as mudanças de `experience_icons.sql` e `theme_preset.sql`).

### Instalação completa

Execute o SQL abaixo no **SQL Editor** do Supabase para criar a estrutura principal do banco de dados:

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  full_name TEXT,
  bio_summary TEXT,
  bio_detailed TEXT,
  phone TEXT DEFAULT '(61) 9 9116-1854',
  email TEXT,
  avatar_url TEXT,
  location TEXT DEFAULT 'Brasilia, DF',
  current_focus TEXT DEFAULT 'Engenharia de Dados',
  about_title TEXT,
  cv_url TEXT,
  favicon_url TEXT,
  hero_title TEXT,
  navbar_icon TEXT DEFAULT 'Database',
  navbar_logo_url TEXT,
  theme TEXT DEFAULT 'dark',
  theme_preset TEXT NOT NULL DEFAULT 'padrao',
  primary_color TEXT DEFAULT '142 71% 45%',
  stat_1_number TEXT DEFAULT '+15',
  stat_1_label TEXT DEFAULT 'Projetos Ativos',
  stat_2_number TEXT DEFAULT '5+',
  stat_2_label TEXT DEFAULT 'Anos de Experiencia',
  hero_phrase_start TEXT DEFAULT 'Data is the',
  hero_phrase_strike TEXT DEFAULT 'Future',
  hero_phrase_end TEXT DEFAULT 'Present.',
  contact_form_key TEXT,
  tracking_tags TEXT,
  skills_title TEXT DEFAULT 'Skills & Tecnologias',
  skills_description TEXT DEFAULT 'Ferramentas e linguagens que uso no dia a dia para construir soluções pipelines confiáveis.',
  certifications_title TEXT DEFAULT 'Certificações',
  certifications_description TEXT DEFAULT 'Meu compromisso contínuo com a excelência técnica e o aprendizado constante.'
);

CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT CHECK (category IN ('Dados', 'Web', 'IA')),
  description TEXT NOT NULL,
  technologies TEXT[] DEFAULT '{}',
  image_url TEXT,
  business_problem TEXT,
  context TEXT,
  premises TEXT[] DEFAULT '{}',
  strategy TEXT[] DEFAULT '{}',
  insights TEXT[] DEFAULT '{}',
  results TEXT[] DEFAULT '{}',
  next_steps TEXT[] DEFAULT '{}',
  github_url TEXT,
  demo_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  business_problem_image TEXT,
  context_image TEXT,
  premises_image TEXT,
  strategy_image TEXT,
  results_image TEXT,
  next_steps_image TEXT,
  gallery_images TEXT[] DEFAULT '{}',
  markdown TEXT,
  card_problem TEXT,
  card_solution TEXT,
  card_result TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  markdown TEXT,
  category TEXT,
  image_url TEXT,
  drive_folder_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.custom_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  markdown TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  period TEXT,
  certificate_url TEXT,
  show_on_home BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  topics TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.education (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  institution TEXT NOT NULL,
  period TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.experience (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT CHECK (type IN ('profissional', 'embaixador', 'projeto', 'outros')),
  icon_type TEXT DEFAULT 'briefcase',
  title TEXT NOT NULL,
  institution TEXT NOT NULL,
  description TEXT,
  period TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.journey_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.technologies (
  category TEXT NOT NULL DEFAULT 'Background & Outros' CHECK (category IN (
    'Cloud & Big Data', 'Engenharia, Orquestração & Dados',
    'Qualidade, DevOps & IA', 'Background & Outros'
  )),
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  items TEXT[] DEFAULT '{}',
  description TEXT,
  icon TEXT DEFAULT 'Zap',
  color TEXT DEFAULT 'text-primary',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technologies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated CRUD" ON public.profiles;
CREATE POLICY "Allow public read access" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow authenticated CRUD" ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read access" ON public.projects;
DROP POLICY IF EXISTS "Allow authenticated CRUD" ON public.projects;
CREATE POLICY "Allow public read access" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow authenticated CRUD" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read access" ON public.contents;
DROP POLICY IF EXISTS "Allow authenticated CRUD" ON public.contents;
CREATE POLICY "Allow public read access" ON public.contents FOR SELECT USING (true);
CREATE POLICY "Allow authenticated CRUD" ON public.contents FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read access" ON public.custom_pages;
DROP POLICY IF EXISTS "Allow authenticated CRUD" ON public.custom_pages;
CREATE POLICY "Allow public read access" ON public.custom_pages FOR SELECT USING (true);
CREATE POLICY "Allow authenticated CRUD" ON public.custom_pages FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read access" ON public.books;
DROP POLICY IF EXISTS "Allow authenticated CRUD" ON public.books;
CREATE POLICY "Allow public read access" ON public.books FOR SELECT USING (true);
CREATE POLICY "Allow authenticated CRUD" ON public.books FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read access" ON public.courses;
DROP POLICY IF EXISTS "Allow authenticated CRUD" ON public.courses;
CREATE POLICY "Allow public read access" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Allow authenticated CRUD" ON public.courses FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read access" ON public.education;
DROP POLICY IF EXISTS "Allow authenticated CRUD" ON public.education;
CREATE POLICY "Allow public read access" ON public.education FOR SELECT USING (true);
CREATE POLICY "Allow authenticated CRUD" ON public.education FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read access" ON public.experience;
DROP POLICY IF EXISTS "Allow authenticated CRUD" ON public.experience;
CREATE POLICY "Allow public read access" ON public.experience FOR SELECT USING (true);
CREATE POLICY "Allow authenticated CRUD" ON public.experience FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read access" ON public.journey_items;
DROP POLICY IF EXISTS "Allow authenticated CRUD" ON public.journey_items;
CREATE POLICY "Allow public read access" ON public.journey_items FOR SELECT USING (true);
CREATE POLICY "Allow authenticated CRUD" ON public.journey_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read access" ON public.technologies;
DROP POLICY IF EXISTS "Allow authenticated CRUD" ON public.technologies;
CREATE POLICY "Allow public read access" ON public.technologies FOR SELECT USING (true);
CREATE POLICY "Allow authenticated CRUD" ON public.technologies FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Acesso da Data API (obrigatório em projetos Supabase criados a partir de 30/10/2026)
GRANT SELECT ON
  public.profiles, public.projects, public.contents, public.custom_pages, public.books,
  public.courses, public.education, public.experience, public.journey_items, public.technologies
TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON
  public.profiles, public.projects, public.contents, public.custom_pages, public.books,
  public.courses, public.education, public.experience, public.journey_items, public.technologies
TO authenticated, service_role;

COMMENT ON COLUMN public.profiles.tracking_tags IS
'Snippets HTML/JavaScript de rastreamento, como Google Tag, Google Analytics, GTM ou Meta Pixel.';
```

> **Permissões da Data API:** a partir de 30/10/2026 o Supabase deixa de liberar automaticamente o acesso da API a tabelas novas no schema `public`. Por isso o SQL acima termina com `GRANT`s explícitos. Toda migration futura que **criar** uma tabela precisa incluir, no mesmo script: `SELECT` para `anon` e `SELECT, INSERT, UPDATE, DELETE` para `authenticated` e `service_role`. Sem isso, a API responde *permission denied*. Scripts que apenas adicionam colunas (como `update_home_sections.sql`) não precisam de grants.

Depois de criar o usuário administrador em **Authentication > Users**, insira o perfil inicial substituindo o `id` pelo UUID do usuário criado:

```sql
INSERT INTO public.profiles (
  id,
  full_name,
  email,
  bio_summary,
  bio_detailed,
  current_focus
) VALUES (
  'UUID_DO_USUARIO_AUTH',
  'Seu Nome',
  'seu@email.com',
  'Resumo curto para o card de perfil.',
  'Texto completo da pagina sobre.',
  'Engenharia de Dados'
) ON CONFLICT (id) DO NOTHING;
```

## SQL Para Tags de Rastreamento

Execute no SQL Editor do Supabase:

```sql
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS tracking_tags TEXT;

COMMENT ON COLUMN public.profiles.tracking_tags IS
'Snippets HTML/JavaScript de rastreamento, como Google Tag, Google Analytics, GTM ou Meta Pixel.';
```

O mesmo comando está disponível em:

```text
add_tracking_tags_to_profiles.sql
```

Depois de aplicar o SQL, acesse `/admin/settings`, cole os snippets no campo `Tags de Rastreamento` e salve.

## Como Usar Tags de Rastreamento

Cole o snippet completo fornecido pela ferramenta. Exemplo:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

Também são aceitos snippets com `<noscript>`, como os usados pelo Google Tag Manager e Pixel da Meta. Cole apenas códigos de provedores confiáveis.

## Storage

Crie no Supabase um bucket público chamado:

```text
portfolio
```

Ele é usado para:

- foto de perfil;
- favicon;
- logo da navbar;
- capas de projetos;
- imagens de posts;
- livros;
- certificados;
- imagens auxiliares do portfólio.

## Formulário de Contato

A página `/contact` usa a chave `contact_form_key` salva no perfil.

Para configurar:

1. Acesse `https://web3forms.com/`.
2. Gere uma Access Key.
3. Entre em `/admin/profiles`.
4. Cole a chave em `Chave de Acesso Web3Forms`.
5. Salve.

Se a chave não estiver configurada, o formulário abre o cliente de email do visitante usando `mailto`.

## Versões de aparência

Em **Configurações → Aparência do Portfólio**, escolha a versão visual do site, o modo e a cor de destaque:

| Versão | Escuro | Claro | Títulos |
| --- | --- | --- | --- |
| Padrão | preto neutro, verde | branco, verde | Inter |
| Obsidiana | vidro vulcânico, ouro champanhe | mármore, bronze | Fraunces |
| Meia-noite | azul-marinho, ciano | gelo, cobalto | Red Hat Display |
| Ametista | berinjela, lilás | lavanda, violeta | Sora |

- Cada versão muda a paleta inteira (fundo, cards, bordas, textos e destaque) e a fonte dos títulos; o texto corrido continua em Inter. Todas as combinações de texto passam no contraste WCAG AA (verificado em `src/test/themes.test.ts`).
- **Cor de destaque:** *Cor do tema* usa a cor da versão; as cores fixas a substituem.
- As paletas ficam em `src/lib/themes.ts`. A Padrão também está em `src/index.css`, que pinta a primeira tela; um teste garante que as duas não divergem.
- O navegador guarda a última aparência aplicada e o `index.html` a reaplica antes de o app carregar, então o site abre direto no tema escolhido, sem piscar o padrão.
- Requer `theme_preset.sql` em bancos existentes.

## Branding e Aparência

No painel administrativo é possível configurar:

- tema claro ou escuro;
- cor de destaque;
- favicon;
- logo da navbar;
- ícone fallback da navbar;
- nome, foco profissional, telefone, email e links;
- textos do Hero;
- títulos, descrições e itens das seções Skills e Certificações da Home.

## Categorias de projetos

Em **Projetos → Editar Projeto**, o botão ao lado de *Categoria* abre **Categorias de projeto**: renomeie, troque o ícone, exclua (somente categorias sem projetos) ou adicione novas — uma categoria criada ali já fica selecionada no projeto. As abas da página `/projects` mostram apenas categorias com projetos, com o ícone escolhido.

## Skills e Certificações na Home

Em bancos existentes, execute `update_home_sections.sql` no SQL Editor do Supabase antes de salvar os novos campos. O script pode ser executado novamente sem apagar dados. Instalações novas já incluem esses campos no SQL completo acima.

Tudo fica em **Perfil (Home) → Página inicial**:

- **Skills & Tecnologias:** edite o título e a descrição da seção (salvos em *Salvar Alterações*) e, logo abaixo, cadastre, edite ou exclua cada skill numa janela, escolhendo a categoria: Cloud & Big Data; Engenharia, Orquestração & Dados; Qualidade, DevOps & IA; Background & Outros. A Home apresenta os grupos nessa ordem. As skills são salvas na hora.
- **Certificações:** edite o título e a descrição da seção e veja todos os cursos com um interruptor **Na Home**. Ligue para destacar o curso na Home; desligar remove só o destaque, e o curso continua na página Sobre. **Adicionar certificação** já cria o curso marcado para a Home. Os cursos também podem ser gerenciados em **Sobre → Cursos Complementares**.

Skills existentes ficam inicialmente em **Background & Outros** até serem categorizadas pelo painel. Cursos existentes não são publicados automaticamente na Home. Se não houver itens, a Home mantém os títulos e descrições e apresenta uma mensagem de lista vazia.

## Página Sobre

A página `/about` segue esta ordem, espelhada no painel em **Sobre** (página única com índice lateral):

1. **Título e apresentação:** o título (a última palavra aparece destacada) e o texto de abertura, que aceita Markdown. Salvos pelo botão *Salvar título e apresentação*.
2. **Formação Acadêmica**, 3. **Experiências Profissionais**, 4. **Livros** e 5. **Cursos Complementares:** cada lista tem *Adicionar*, editar e excluir em janela, com salvamento imediato. Formação e experiências são ordenadas pelo campo *Ordem*; cursos têm o interruptor **Na Home** para aparecer também em Certificações.

Cada experiência tem um **ícone do cargo** (DevOps, Suporte técnico, Help Desk, Técnico em informática, Infraestrutura, Redes, Cloud, Linux, Desenvolvimento, Dados, Segurança, Automação, Qualidade, Design, Gestão e Ensino, além de maleta, foguete e prêmio), escolhido numa grade no painel e exibido na linha do tempo da página Sobre. O ícone é sugerido a partir do cargo digitado; em experiências já salvas, o botão **Usar sugestão** aplica a sugestão. A lista fica em `src/lib/experience-icons.ts`. Requer `experience_icons.sql` em bancos existentes.

Links antigos do painel (`/admin/education`, `/admin/experiences`, `/admin/books`, `/admin/courses`, `/admin/journey`) levam à seção correspondente. A seção Jornada foi removida do site; os itens de `journey_items` permanecem no banco.

## Trilhas de estudo

O conteúdo é organizado em trilhas (por exemplo, *Linux Essentials 30 dias*):

- `/blog` mostra um card por trilha com capa, descrição, quantidade de artigos e tempo de leitura. Trilhas sem artigos não aparecem; posts sem trilha ficam em *Outros artigos*.
- `/blog/trilha/<slug>` lista os artigos na ordem de estudo (Etapa 01, 02…), com o botão *Começar pela etapa 01*.
- Cada post mostra a etapa ("Etapa 05 de 08"), volta para a sua trilha, leva ao artigo anterior e ao próximo e sugere os seguintes em *Continue na trilha*.

No painel, no menu **Trilhas**:

- **Trilhas de estudo:** crie, edite e exclua trilhas (nome, endereço, descrição, capa e ordem em `/blog`). Sem capa, o card usa a capa do primeiro artigo. Só é possível excluir trilhas sem artigos.
- **Editar conteúdo:** escolha a *Trilha de estudo* e a *Posição na trilha*. Ao escolher uma trilha, a posição sugerida é a próxima livre.

Depois de rodar `blog_trails.sql`, as trilhas têm o nome das categorias antigas (por exemplo, *Linux*); renomeie e descreva cada uma pelo painel.

Se a ordem de estudo não bater com os títulos (posts publicados fora de ordem), rode `fix_trail_positions.sql` no SQL Editor: a etapa de cada artigo passa a ser o número do dia no título ("Dia 11/30" ou "11/30" → 11). O resultado lista o que mudou; artigos sem esse número e posts sem trilha não são alterados.

## Acesso para IAs e rastreadores

Assistentes como ChatGPT, Claude e Perplexity não executam JavaScript. Por isso, a Edge Function `netlify/edge-functions/prerender.ts` entrega cada página pública já com:

- `<title>`, descrição, canonical, Open Graph/Twitter e JSON-LD da página;
- o conteúdo completo em HTML semântico dentro de `#root` (post inteiro, trilha, projeto, Sobre etc.);
- status HTTP corretos: 404 para endereços inexistentes e 301 de UUIDs e slugs antigos para o endereço atual.

Quem abre o site no navegador continua vendo o app React: essa cópia fica oculta enquanto o JavaScript carrega e é substituída na montagem, com o mesmo conteúdo. A lógica fica em `src/seo/` (testada em `src/test/prerender.test.ts`), e as respostas ficam em cache na CDN por 5 minutos, então edições aparecem sem novo deploy.

A mesma função responde `/llms.txt`, um resumo do site em Markdown com links para páginas, trilhas, artigos e projetos. O `public/robots.txt` libera explicitamente os robôs de IA (GPTBot, ClaudeBot, PerplexityBot e outros) e bloqueia `/admin`.

**Configuração na Netlify:** a função lê `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` em tempo de execução. Em *Site configuration → Environment variables*, confirme que o escopo das duas inclui **Functions** (ou *All scopes*). Sem isso o site funciona normalmente, mas sem o HTML pré-renderizado.

Para conferir depois do deploy (o cabeçalho `x-prerender: hit` indica que a função atuou):

```bash
curl -sI -A GPTBot https://waldoeller.com/blog | grep -i x-prerender
curl -s -A GPTBot https://waldoeller.com/blog | grep -o '<h1>[^<]*</h1>'
curl -s https://waldoeller.com/llms.txt | head
```

Para testar localmente: `npm run build` e depois `npx netlify-cli dev --dir dist --offline`, com as variáveis do `.env.local` exportadas no terminal.

## Skills e Ícones

O módulo de Skills aceita ícones de:

- `lucide-react`
- `react-icons/si`

Exemplos:

```text
SiPython
SiReact
SiDocker
Database
Cloud
Zap
```

Há fallbacks internos para tecnologias comuns como Power BI, Azure e AWS.

## SEO

O componente `SEOHead` atualiza dinamicamente:

- `title`
- `description`
- canonical
- Open Graph
- Twitter tags
- JSON-LD

No build, `scripts/generate-sitemap.js` gera a partir do Supabase:

- `public/sitemap.xml` com rotas fixas, projetos publicados, trilhas de estudo, posts e páginas customizadas, sempre no domínio canônico `https://waldoeller.com` e com `lastmod` real dos projetos;
- `public/_redirects` com redirecionamentos 301 da Netlify para URLs antigas de projetos (arquivo gerado, fora do Git).

### URLs amigáveis de projetos

Cada projeto é publicado em `/projects/<slug>`, por exemplo `/projects/rifa-online`.

1. **Antes do deploy**, execute `project_slugs.sql` no SQL Editor do Supabase (vale também para instalações novas, depois do SQL completo acima). O script gera o slug dos projetos existentes a partir do título e pode ser executado novamente sem apagar dados.
2. No admin, o campo **URL amigável (slug)** é sugerido a partir do título em projetos novos e pode ser editado. Mudar o título de um projeto existente não muda a URL.
3. O banco normaliza o slug (sem acentos, minúsculas, hífens), resolve duplicados com sufixo (`-2`) e, quando o slug muda, guarda o anterior em `previous_slugs`.
4. URLs antigas (por UUID ou slug anterior) respondem 301 para a atual via `_redirects`; a página também redireciona no navegador e usa o slug no canonical. Slug inexistente mostra "Projeto não encontrado" com `noindex`.

## Deploy

### Netlify

O arquivo `netlify.toml` já define:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Configure as variáveis de ambiente na plataforma, com escopo que inclua **Builds** e **Functions** (a Edge Function de pré-renderização também as usa):

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon_publica
```

Aplique as migrações pendentes (seção **Migrações**) **antes** de publicar: o build consulta o banco para gerar o sitemap e os redirecionamentos, e o painel grava as colunas novas.

## Qualidade

Antes de publicar alterações:

```bash
npm run typecheck
npm run test
npm run build
```

Use `npm run typecheck` para checar tipos: o `tsconfig.json` da raiz só referencia os configs da aplicação, então `npx tsc --noEmit` sozinho não verifica nenhum arquivo.

O projeto usa Vitest com ambiente `jsdom` e Testing Library. Os testes ficam em `src/test/` e cobrem as seções da Home, o painel (Perfil, Sobre, projetos, trilhas), trilhas e posts, a pré-renderização para IAs, URLs amigáveis, sitemap/redirecionamentos, cards e navegação.

## Licença

MIT.

## Autor

Desenvolvido por Waldo Eller.

Site oficial: [www.waldoeller.com](https://www.waldoeller.com)

# Template Profissional de Portfólio, Blog e CMS

Aplicação React para portfólio profissional com blog, painel administrativo, CMS de páginas customizadas, upload de imagens, SEO dinâmico, tema configurável e integração com Supabase.

O projeto foi criado para profissionais de Dados, IA, Tecnologia e Desenvolvimento que precisam de uma presença digital elegante, editável e pronta para produção.

![Template](https://ltgqjjxhkqunuiqxmfvl.supabase.co/storage/v1/object/public/portfolio/00-template.png)

## Funcionalidades

- Portfólio com projetos categorizados por Dados, Web e IA.
- Blog com Markdown, categorias, imagem de capa, slug e arquivos complementares via Google Drive.
- Página exclusiva de contato em `/contact`, com formulário Web3Forms ou fallback por `mailto`.
- Painel administrativo protegido por Supabase Auth.
- CMS de páginas customizadas em `/p/:slug`.
- Tema claro/escuro e cor de destaque configuráveis no admin.
- Branding dinâmico com favicon, logo da navbar e ícone fallback Lucide.
- Estatísticas e frases do Hero editáveis pelo painel.
- Biblioteca de livros, cursos/certificações, experiência, formação e timeline de jornada.
- Upload de imagens no Supabase Storage.
- SEO dinâmico com meta tags, canonical, Open Graph e JSON-LD.
- Sitemap gerado automaticamente no build.
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
| `/` | Home com perfil, Hero, projetos destacados e skills |
| `/projects` | Galeria de projetos |
| `/projects/:id` | Detalhe de projeto |
| `/about` | Página sobre, jornada, experiência, formação, livros e cursos |
| `/blog` | Listagem de posts |
| `/blog/:idOrSlug` | Post individual |
| `/contact` | Página dedicada de contato |
| `/p/:slug` | Página customizada criada pelo CMS |

## Painel Administrativo

O painel fica em `/admin` e usa autenticação do Supabase.

Módulos disponíveis:

- Projetos
- Jornada
- Livros
- Conteúdos/Blog
- Formação
- Cursos
- Experiências
- Páginas customizadas
- Perfil
- Tecnologias
- Configurações

Na aba `Configurações`, o administrador pode ajustar aparência e inserir tags de rastreamento. Na aba `Perfil`, é possível editar identidade, contato, Hero, favicon, logo da navbar e chave Web3Forms.

## Pré-requisitos

- Node.js 20 ou superior
- npm
- Projeto Supabase ativo
- Bucket público `portfolio` no Supabase Storage
- Usuário admin criado no Supabase Auth

## Instalação

```bash
git clone https://github.com/waldosouzaup/template-profissional-dados.git
cd dark-mode-mirror
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
- `custom_pages`
- `books`
- `courses`
- `education`
- `experience`
- `journey_items`
- `technologies`

As políticas esperadas são:

- leitura pública para conteúdo exibido no site;
- CRUD para usuários autenticados no painel administrativo.

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

## Branding e Aparência

No painel administrativo é possível configurar:

- tema claro ou escuro;
- cor de destaque;
- favicon;
- logo da navbar;
- ícone fallback da navbar;
- nome, foco profissional, telefone, email e links;
- textos do Hero;
- estatísticas do Hero;
- frase de impacto.

## Tecnologias e Ícones

O módulo de Tecnologias aceita ícones de:

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

O sitemap inclui rotas fixas e conteúdos dinâmicos de projetos e blog durante o build.

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

Configure as variáveis de ambiente na plataforma:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon_publica
```

## Qualidade

Antes de publicar alterações:

```bash
npm run build
npm run test
```

O projeto possui configuração de Vitest com ambiente `jsdom`.

## Licença

MIT.

## Autor

Desenvolvido por Waldo Eller.

Site oficial: [www.waldoeller.com](https://www.waldoeller.com)

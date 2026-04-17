# Waldo Eller | Portfolio & Blog

Este projeto é um portfólio profissional e blog pessoal focado em Tecnologia, Dados e IA.

## Tecnologias Utilizadas

- **Vite** & **React**
- **Tailwind CSS**
- **Supabase** (Database & Auth)
- **Lucide React** (Ícones)
- **React Markdown** (Renderização do Blog)

## Como Executar Localmente

1. Clone o repositório.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente no arquivo `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Estrutura do Projeto

- `src/components`: Componentes reutilizáveis do sistema e seções do portfólio.
- `src/pages`: Páginas principais (Home, About, Blog, Admin).
- `src/hooks`: Hooks personalizados para integração com Supabase.
- `src/lib`: Configurações de bibliotecas (Supabase client).
- `src/types`: Definições de tipos TypeScript.

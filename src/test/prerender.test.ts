// @vitest-environment node
import { describe, expect, it } from "vitest";
import { buildLlmsTxt, prerender, type Rest } from "@/seo/prerender";

const SHELL = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <title>Waldo Eller | Especialista em Dados, Tecnologia e IA</title>
    <meta name="description" content="Fundador da NoCode StartUp." />
    <meta name="robots" content="index, follow" />
    <meta property="og:site_name" content="Waldo Eller" />
    <meta property="og:title" content="Antigo" />
    <meta property="og:image" content="/og-image.png" />
    <meta property="twitter:title" content="Antigo" />
    <link rel="manifest" href="/manifest.webmanifest" />
    <script type="module" crossorigin src="/assets/index-abc.js"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

const LINUX = "11111111-1111-4111-8111-111111111111";
const POST_UUID = "22222222-2222-4222-8222-222222222222";
const PROJECT_UUID = "33333333-3333-4333-8333-333333333333";

const tables: Record<string, Record<string, unknown>[]> = {
  profiles: [{
    id: "p", full_name: "Waldo Eller", current_focus: "Cloud/DevOps", location: "Brasília, DF", email: "eu@example.com",
    phone: "(61) 9 9999-0000", bio_summary: "Profissional de TI com foco em Linux e Cloud.", hero_title: "Eu sou Waldo Eller,",
    about_title: "Paixão por infraestrutura", bio_detailed: "Comecei no **suporte** e hoje trabalho com Cloud.",
    skills_title: "Skills & Tecnologias", certifications_title: "Certificações",
  }],
  blog_trails: [
    { id: "ia", name: "IA", slug: "ia", description: "Documentos com agentes.", display_order: 1 },
    { id: LINUX, name: "Linux Essentials 30 dias", slug: "linux-essentials-30-dias", description: "Um desafio diário rumo à LPI.", display_order: 2 },
  ],
  contents: [
    { id: "d1", slug: "dia-01", title: "Dia 01/30 - Começando", description: "O início.", trail_id: LINUX, trail_position: 1, created_at: "2026-05-01T12:00:00Z", markdown: "Primeiro dia." },
    {
      id: POST_UUID, slug: "dia-02", title: "Dia 02/30 - Comandos", description: "Terminal na prática.", trail_id: LINUX, trail_position: 2,
      created_at: "2026-05-02T12:00:00Z", image_url: "https://example.com/dia-02.png",
      markdown: "## Primeiros comandos\n\nUse `ls -la` para listar.\n\n```bash\necho \"$1\" && sed 's/a/$&/'\n```\n\n- item um\n- item dois",
    },
    { id: "d3", slug: "dia-0830-revisão-geral", title: "Dia 03/30 - Revisão", trail_id: LINUX, trail_position: 3, created_at: "2026-05-03T12:00:00Z", markdown: "Revisão." },
    { id: "prd", slug: "o-que-e-um-prd", title: "O que é um PRD?", description: "Documento de requisitos.", trail_id: "ia", trail_position: 1, created_at: "2026-04-14T12:00:00Z", markdown: "PRD." },
    {
      id: "xss", slug: "perigoso", title: "<script>alert(1)</script> Título", description: "</script><script>alert(2)</script>",
      trail_id: null, created_at: "2026-06-01T12:00:00Z",
      markdown: "<img src=x onerror=alert(3)>\n\n[clique](javascript:alert(4)) e [site](https://example.com)",
    },
  ],
  projects: [
    {
      id: PROJECT_UUID, slug: "rifa-online", previous_slugs: ["rifa-uplinux"], title: "Rifa Online", category: "Web",
      description: "Plataforma de rifas.", business_problem: "Vendas manuais em planilhas.", context: "Evento beneficente.",
      technologies: ["React", "Supabase"], results: ["300 bilhetes vendidos"], strategy: ["Checkout via Pix"],
      markdown: "", is_published: true, display_order: 2, demo_url: "https://rifa.example.com",
    },
    { id: "p2", slug: "painel", previous_slugs: [], title: "Painel de Dados", category: "Dados", description: "Dashboard.", technologies: ["SQL"], is_published: false, display_order: 1, markdown: "## Visão geral\n\nPainel em **SQL**." },
  ],
  technologies: [{ title: "Linux", category: "Background & Outros", items: ["Bash", "systemd"], description: "" }],
  courses: [
    { title: "LPI Linux Essentials", period: "2026", description: "Certificação.", topics: ["Shell"], show_on_home: true },
    { title: "Curso só no Sobre", period: "2025", topics: [], show_on_home: false },
  ],
  education: [{ title: "Redes de Computadores", institution: "UnB", period: "2018 - 2022", description: "Graduação." }],
  experience: [{ title: "Analista de Infraestrutura", institution: "Empresa X", period: "2022 - Presente", description: "Cloud e Linux." }],
  books: [{ title: "The Linux Command Line", author: "William Shotts", description: "Referência." }],
  custom_pages: [{ id: "c1", slug: "mentoria", title: "Mentoria", markdown: "Sessões **individuais**." }],
};

// Minimal PostgREST: eq, cs (array contains), order is ignored (fixtures are in the expected order), limit.
const rest: Rest = async (table, query) => {
  const params = new URLSearchParams(query);
  let rows = [...(tables[table] ?? [])];
  for (const [column, filter] of params) {
    if (["select", "order", "limit"].includes(column)) continue;
    const [op, ...rest] = filter.split(".");
    const value = rest.join(".");
    if (op === "eq") rows = rows.filter((row) => String(row[column]) === value);
    if (op === "cs") rows = rows.filter((row) => (row[column] as string[] | undefined)?.includes(value.slice(1, -1)));
  }
  const limit = params.get("limit");
  return (limit ? rows.slice(0, Number(limit)) : rows) as never[];
};

const render = async (path: string, source: Rest = rest) => {
  const result = await prerender(path, SHELL, source);
  if (result.type !== "html") throw new Error(`esperado HTML, veio ${JSON.stringify(result)}`);
  const root = result.html.split('<div id="root">')[1].split("</body>")[0];
  const jsonLd = result.html.match(/<script type="application\/ld\+json" id="seo-jsonld">([\s\S]*?)<\/script>/)?.[1];
  return { ...result, root, jsonLd: jsonLd ? JSON.parse(jsonLd) : undefined };
};

describe("Pré-renderização para IAs e rastreadores", () => {
  it("post: título, descrição, canonical e o texto completo no HTML inicial", async () => {
    const page = await render("/blog/dia-02");
    expect(page.status).toBe(200);
    expect(page.html).toContain("<title>Dia 02/30 - Comandos | Waldo Eller</title>");
    expect(page.html.match(/<title>/g)).toHaveLength(1);
    expect(page.html).toContain('<meta name="description" content="Terminal na prática." />');
    expect(page.html).toContain('<link rel="canonical" href="https://waldoeller.com/blog/dia-02" />');
    expect(page.html).toContain('<meta property="og:image" content="https://example.com/dia-02.png" />');
    expect(page.html).toContain('<meta property="og:type" content="article" />');
    // Tags estáticas antigas saem, o resto do shell fica.
    expect(page.html).not.toContain("NoCode StartUp");
    expect(page.html).not.toContain("/og-image.png");
    expect(page.html).not.toContain('content="Antigo"');
    expect(page.html).toContain('<script type="module" crossorigin src="/assets/index-abc.js"></script>');
    expect(page.html).toContain('<meta property="og:site_name" content="Waldo Eller" />');
    expect(page.root).toContain("<h1>Dia 02/30 - Comandos</h1>");
    expect(page.root).toContain("<h2>Primeiros comandos</h2>");
    expect(page.root).toContain("<code>ls -la</code>");
    expect(page.root).toContain("<li>item dois</li>");
  });

  it("post: trilha, etapa e anterior/próximo, também nos dados estruturados", async () => {
    const page = await render("/blog/dia-02");
    expect(page.root).toContain('<a href="/blog/trilha/linux-essentials-30-dias">Linux Essentials 30 dias</a>');
    expect(page.root).toContain("Etapa 02 de 03");
    expect(page.root).toMatch(/Anterior: <a href="\/blog\/dia-01">Dia 01\/30 - Começando<\/a>/);
    expect(page.root).toMatch(/Próximo: <a href="\/blog\/dia-0830-revis%C3%A3o-geral">Dia 03\/30 - Revisão<\/a>/);
    expect(page.jsonLd).toMatchObject({
      "@type": "BlogPosting", headline: "Dia 02/30 - Comandos", datePublished: "2026-05-02T12:00:00Z",
      author: { "@type": "Person", name: "Waldo Eller" }, position: 2,
      isPartOf: { "@type": "CollectionPage", name: "Linux Essentials 30 dias", url: "https://waldoeller.com/blog/trilha/linux-essentials-30-dias" },
    });
  });

  it("preserva $& e $1 do conteúdo (sem interpretar como padrão de substituição)", async () => {
    const page = await render("/blog/dia-02");
    expect(page.root).toContain("echo &quot;$1&quot; &amp;&amp; sed &#39;s/a/$&amp;/&#39;");
  });

  it("escapa HTML e scripts vindos do conteúdo", async () => {
    const page = await render("/blog/perigoso");
    expect(page.html).not.toContain("<script>alert");
    expect(page.html).not.toContain("<img src=x");
    expect(page.root).toContain("&lt;script&gt;alert(1)&lt;/script&gt; Título");
    expect(page.root).toContain("&lt;img src=x onerror=alert(3)&gt;");
    expect(page.root).not.toContain("javascript:");
    expect(page.root).toContain('<a href="https://example.com">site</a>');
    expect(page.html).toContain("\\u003c/script>\\u003cscript>alert(2)");
  });

  it("slug com acento na URL codificada e barra final", async () => {
    const page = await render("/blog/dia-0830-revis%C3%A3o-geral/");
    expect(page.root).toContain("<h1>Dia 03/30 - Revisão</h1>");
  });

  it("post pelo UUID redireciona (301) para o slug", async () => {
    expect(await prerender(`/blog/${POST_UUID}`, SHELL, rest)).toEqual({ type: "redirect", status: 301, location: "/blog/dia-02" });
  });

  it("post inexistente responde 404 sem indexação", async () => {
    const page = await render("/blog/nao-existe");
    expect(page.status).toBe(404);
    expect(page.html).toContain('<meta name="robots" content="noindex, follow" />');
    expect(page.root).toContain("Artigo não encontrado");
  });

  it("/blog lista as trilhas e os artigos de cada uma, na ordem de estudo", async () => {
    const page = await render("/blog");
    expect(page.html).toContain('<link rel="canonical" href="https://waldoeller.com/blog" />');
    expect(page.html).toContain("<title>Trilhas de estudo | Waldo Eller</title>");
    expect(page.jsonLd).toMatchObject({ "@type": "Blog", name: "Trilhas de estudo — Waldo Eller" });
    const linux = page.root.indexOf("Linux Essentials 30 dias");
    expect(page.root.indexOf('<a href="/blog/trilha/ia">IA</a>')).toBeGreaterThan(-1);
    expect(linux).toBeGreaterThan(page.root.indexOf('<a href="/blog/trilha/ia">IA</a>'));
    const order = ["/blog/dia-01", "/blog/dia-02", "/blog/dia-0830-revis%C3%A3o-geral"].map((href) => page.root.indexOf(`href="${href}"`));
    expect(order.every((i, n) => i > linux && (n === 0 || i > order[n - 1]))).toBe(true);
    expect(page.root).toContain("Outros artigos");
  });

  it("/blog/trilha/:slug: a trilha com os artigos em ordem e ItemList", async () => {
    const page = await render("/blog/trilha/linux-essentials-30-dias");
    expect(page.html).toContain("<title>Linux Essentials 30 dias — Trilha de estudo | Waldo Eller</title>");
    expect(page.root).toContain('<nav aria-label="Voltar"><a href="/blog">Trilhas</a></nav>');
    expect(page.root).toContain("<h1>Linux Essentials 30 dias</h1>");
    expect(page.root).toContain("Um desafio diário rumo à LPI.");
    expect(page.root).toMatch(/Etapa 01[\s\S]*dia-01[\s\S]*Etapa 02[\s\S]*dia-02/);
    expect(page.jsonLd["@type"]).toBe("CollectionPage");
    expect(page.jsonLd.mainEntity.itemListElement).toHaveLength(3);
    expect((await render("/blog/trilha/nao-existe")).status).toBe(404);
  });

  it("sem a tabela de trilhas (SQL ainda não aplicado), o blog continua com todos os artigos", async () => {
    const withoutTrails: Rest = (table, query) => (table === "blog_trails" ? Promise.reject(new Error("PGRST205")) : rest(table, query));
    const blog = await render("/blog", withoutTrails);
    expect(blog.root).toContain('href="/blog/dia-02"');
    const post = await render("/blog/dia-02", withoutTrails);
    expect(post.root).toContain("<h1>Dia 02/30 - Comandos</h1>");
  });

  it("projeto: conteúdo, tecnologias e links; UUID e slug antigo redirecionam; inexistente é 404", async () => {
    const page = await render("/projects/rifa-online");
    expect(page.html).toContain("<title>Rifa Online — Projeto | Waldo Eller</title>");
    expect(page.root).toContain("<h1>Rifa Online</h1>");
    expect(page.root).toContain("Vendas manuais em planilhas.");
    expect(page.root).toContain("React, Supabase");
    expect(page.root).toContain("300 bilhetes vendidos");
    expect(page.root).toContain('href="https://rifa.example.com"');
    expect(page.jsonLd["@type"]).toBe("CreativeWork");
    expect(await prerender(`/projects/${PROJECT_UUID}`, SHELL, rest)).toMatchObject({ status: 301, location: "/projects/rifa-online" });
    expect(await prerender("/projects/rifa-uplinux", SHELL, rest)).toMatchObject({ status: 301, location: "/projects/rifa-online" });
    expect((await render("/projects/nao-existe")).status).toBe(404);
    expect((await render("/projects/painel")).root).toContain("<strong>SQL</strong>");
  });

  it("/projects lista todos os projetos", async () => {
    const page = await render("/projects");
    expect(page.root).toContain('<a href="/projects/rifa-online">Rifa Online</a>');
    expect(page.root).toContain('<a href="/projects/painel">Painel de Dados</a>');
  });

  it("home: apresentação, projetos em destaque, skills e certificações", async () => {
    const page = await render("/");
    expect(page.html).toContain("<title>Waldo Eller | Cloud/DevOps</title>");
    expect(page.root).toContain("<h1>Eu sou Waldo Eller, Cloud/DevOps</h1>");
    expect(page.root).toContain("<p>Waldo Eller · Brasília, DF</p>");
    expect(page.root).toContain("Profissional de TI com foco em Linux e Cloud.");
    expect(page.root).toContain('<a href="/projects/rifa-online">Rifa Online</a>');
    expect(page.root).not.toContain("Painel de Dados");
    expect(page.root).toContain("Bash, systemd");
    expect(page.root).toContain("LPI Linux Essentials");
    expect(page.root).not.toContain("Curso só no Sobre");
    expect(page.jsonLd["@type"]).toBe("Person");
  });

  it("sobre: apresentação, formação, experiências, livros e cursos", async () => {
    const page = await render("/about");
    expect(page.root).toContain("<h1>Paixão por infraestrutura</h1>");
    expect(page.root).toContain("<strong>suporte</strong>");
    for (const text of ["Formação Acadêmica", "Redes de Computadores", "UnB", "Experiências Profissionais", "Analista de Infraestrutura", "Livros", "The Linux Command Line", "Cursos Complementares", "Curso só no Sobre"]) {
      expect(page.root).toContain(text);
    }
  });

  it("contato e páginas personalizadas", async () => {
    const contact = await render("/contact");
    expect(contact.root).toContain('<a href="mailto:eu@example.com">eu@example.com</a>');
    const custom = await render("/p/mentoria");
    expect(custom.root).toContain("<h1>Mentoria</h1>");
    expect(custom.root).toContain("<strong>individuais</strong>");
    expect((await render("/p/nao-existe")).status).toBe(404);
  });

  it("rota desconhecida responde 404", async () => {
    const page = await render("/nao-existe/de-jeito-nenhum");
    expect(page.status).toBe(404);
    expect(page.root).toContain("Página não encontrada");
  });

  it("toda página tem a navegação do site e o conteúdo fica oculto para quem roda o app", async () => {
    const page = await render("/about");
    for (const href of ["/", "/about", "/projects", "/blog", "/contact"]) expect(page.root).toContain(`href="${href}"`);
    expect(page.root).toContain('<a href="/blog">Trilhas</a>');
    expect(page.root.startsWith("<div data-prerender>")).toBe(true);
    expect(page.html).toContain('document.documentElement.classList.add("js")');
    expect(page.html).toContain(".js [data-prerender]{display:none}");
  });
});

describe("llms.txt", () => {
  it("resume o site com links absolutos para páginas, trilhas, artigos e projetos", async () => {
    const text = await buildLlmsTxt(rest);
    expect(text.startsWith("# Waldo Eller\n\n> Profissional de TI com foco em Linux e Cloud.\n")).toBe(true);
    expect(text).toContain("## Páginas");
    expect(text).toContain("- [Trilhas](https://waldoeller.com/blog): ");
    expect(text).toContain("## Trilhas de estudo");
    expect(text).toContain("- [Linux Essentials 30 dias](https://waldoeller.com/blog/trilha/linux-essentials-30-dias): Um desafio diário rumo à LPI. (3 artigos)");
    expect(text).toContain("### Linux Essentials 30 dias");
    expect(text).toMatch(/- \[Dia 01\/30 - Começando\]\(https:\/\/waldoeller.com\/blog\/dia-01\): O início.\n- \[Dia 02\/30 - Comandos\]/);
    expect(text).toContain("## Projetos");
    expect(text).toContain("- [Rifa Online](https://waldoeller.com/projects/rifa-online): Plataforma de rifas.");
    expect(text).toContain("- [Mentoria](https://waldoeller.com/p/mentoria)");
  });
});

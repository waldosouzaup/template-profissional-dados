// Server-side copy of every public page, for AI assistants and crawlers that do not run JavaScript.
// Pure logic (data comes through `rest`), shared by the Netlify edge function and the tests.
import { stripInlineMarkdown } from "../lib/text.ts";
import { stepLabel, summarizeTrails, trailNeighbors, trailPath, trailPosts, trailStep } from "../lib/trails.ts";
import { SITE_NAME, SITE_URL, escapeHtml as e, href, renderDocument, renderMarkdown, type PageMeta } from "./html.ts";

// Untyped JSON rows from PostgREST; each builder reads the columns it renders.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;
export type Rest = (table: string, query: string) => Promise<Row[]>;
interface TrailRow {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
}

export type PrerenderResult =
  | { type: "html"; status: number; html: string }
  | { type: "redirect"; status: 301; location: string };

type Page = { status?: number; meta: PageMeta; body: string } | { redirect: string };

// Supabase REST (PostgREST) with the public anon key: the same data the site reads in the browser.
export const createRest = (supabaseUrl: string, anonKey: string, timeoutMs = 4000): Rest => async (table, query) => {
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${query}`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) throw new Error(`${table}: HTTP ${response.status}`);
  return response.json();
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const eq = (value: string) => `eq.${encodeURIComponent(value)}`;
// Optional data (a table not created yet, a failed side query) must not take the page down.
const optional = (rows: Promise<Row[]>) => rows.catch(() => [] as Row[]);

const load = {
  profile: async (rest: Rest) => (await optional(rest("profiles", "select=*&limit=1")))[0] ?? {},
  trails: (rest: Rest) => optional(rest("blog_trails", "select=*&order=display_order.asc,name.asc")) as Promise<TrailRow[]>,
  posts: (rest: Rest) => rest("contents", "select=id,slug,title,description,trail_id,trail_position,created_at,image_url&order=created_at.desc"),
  projects: (rest: Rest) => rest("projects", "select=*&order=display_order.desc"),
};

const postPath = (post: Row) => `/blog/${post.slug || post.id}`;
const plain = (text?: string | null) => stripInlineMarkdown(text ?? "").replace(/\s+/g, " ").trim();
const dateLabel = (iso?: string) =>
  iso ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: "America/Sao_Paulo" }).format(new Date(iso)) : "";
const count = (n: number) => `${n} ${n === 1 ? "artigo" : "artigos"}`;
const link = (path: string, text: string) => `<a href="${href(path)}">${e(text)}</a>`;
const list = (items: string[], tag: "ul" | "ol" = "ul") => (items.length ? `<${tag}>${items.map((i) => `<li>${i}</li>`).join("")}</${tag}>` : "");
const withNote = (main: string, note?: string | null) => (plain(note) ? `${main} — ${e(plain(note))}` : main);

const SITE_NAV = `<header><nav aria-label="Principal">${[
  ["/", "Início"], ["/about", "Sobre"], ["/projects", "Portfólio"], ["/blog", "Trilhas"], ["/contact", "Contato"],
].map(([path, text]) => link(path, text)).join(" · ")}</nav></header>`;

const notFound = (title: string, back: [string, string]): Page => ({
  status: 404,
  meta: { title, noindex: true },
  body: `<h1>${e(title)}</h1><p>${link(...back)}</p>`,
});

/* ── Home ─────────────────────────────────── */
const home = async (rest: Rest): Promise<Page> => {
  const [profile, projects, skills, courses] = await Promise.all([
    load.profile(rest),
    optional(load.projects(rest)),
    optional(rest("technologies", "select=title,category,items,description&order=created_at.desc")),
    optional(rest("courses", "select=title,period,show_on_home&order=created_at.desc")),
  ]);
  const name = profile.full_name || SITE_NAME;
  const featured = projects.filter((p) => p.is_published).slice(0, 4);
  const certifications = courses.filter((c) => c.show_on_home);
  return {
    meta: {
      title: profile.full_name ? `${profile.full_name} | ${profile.current_focus || "Especialista"}` : `${SITE_NAME} | Especialista em Dados, Tecnologia e IA`,
      description: profile.bio_summary || `Portfólio e Trilhas de estudo de ${SITE_NAME}.`,
      canonical: `${SITE_URL}/`,
      image: profile.avatar_url || undefined,
      jsonLd: {
        "@context": "https://schema.org", "@type": "Person", name, url: SITE_URL,
        jobTitle: profile.current_focus || undefined, description: profile.bio_summary || undefined,
      },
    },
    body: [
      // The home headline is hero_title followed by current_focus ("Infraestrutura Linux e Cloud/DevOps").
      `<header><h1>${e(`${profile.hero_title ?? ""} ${profile.current_focus ?? ""}`.replace(/\s+/g, " ").trim() || name)}</h1>`,
      `<p>${e([name, profile.location].filter(Boolean).join(" · "))}</p>`,
      profile.bio_summary ? `<p>${e(profile.bio_summary)}</p>` : "",
      `</header>`,
      featured.length ? `<section><h2>Projetos em destaque</h2>${list(featured.map((p) => withNote(link(`/projects/${p.slug}`, p.title), p.description)))}<p>${link("/projects", "Ver todos os projetos")}</p></section>` : "",
      skills.length ? `<section><h2>${e(profile.skills_title || "Skills & Tecnologias")}</h2>${profile.skills_description ? `<p>${e(profile.skills_description)}</p>` : ""}${list(skills.map((s) => `<strong>${e(s.title)}</strong>${s.category ? ` (${e(s.category)})` : ""}: ${e((s.items ?? []).join(", "))}`))}</section>` : "",
      certifications.length ? `<section><h2>${e(profile.certifications_title || "Certificações")}</h2>${list(certifications.map((c) => `${e(c.title)}${c.period ? ` (${e(c.period)})` : ""}`))}</section>` : "",
    ].join(""),
  };
};

/* ── About ────────────────────────────────── */
const about = async (rest: Rest): Promise<Page> => {
  const [profile, education, experience, books, courses] = await Promise.all([
    load.profile(rest),
    optional(rest("education", "select=*&order=display_order.asc")),
    optional(rest("experience", "select=*&order=display_order.asc")),
    optional(rest("books", "select=*&order=created_at.desc")),
    optional(rest("courses", "select=*&order=created_at.desc")),
  ]);
  const name = profile.full_name || SITE_NAME;
  const career = (items: Row[]) =>
    list(items.map((i) => `<strong>${e(i.title)}</strong> — ${e(i.institution)}${i.period ? ` (${e(i.period)})` : ""}${i.description ? `<p>${e(i.description)}</p>` : ""}`));
  const section = (title: string, content: string) => (content ? `<section><h2>${title}</h2>${content}</section>` : "");
  return {
    meta: {
      title: `Sobre — ${name}`,
      description: profile.bio_summary || `Conheça a trajetória de ${name}.`,
      canonical: `${SITE_URL}/about`,
      type: "profile",
      jsonLd: {
        "@context": "https://schema.org", "@type": "AboutPage", url: `${SITE_URL}/about`,
        mainEntity: { "@type": "Person", name, jobTitle: profile.current_focus || undefined, description: profile.bio_summary || undefined },
      },
    },
    body: [
      `<header><p>Sobre</p><h1>${e(profile.about_title || "Paixão por transformar dados em conhecimento")}</h1></header>`,
      renderMarkdown(profile.bio_detailed),
      section("Formação Acadêmica", career(education)),
      section("Experiências Profissionais", career(experience)),
      section("Livros", list(books.map((b) => `<strong>${e(b.title)}</strong>${b.author ? ` — ${e(b.author)}` : ""}${b.description ? `: ${e(b.description)}` : ""}`))),
      section("Cursos Complementares", list(courses.map((c) =>
        `<strong>${e(c.title)}</strong>${c.period ? ` (${e(c.period)})` : ""}${c.description ? `: ${e(c.description)}` : ""}${c.topics?.length ? `. Tópicos: ${e(c.topics.join(", "))}` : ""}`))),
    ].join(""),
  };
};

/* ── Projects ─────────────────────────────── */
const projectsIndex = async (rest: Rest): Promise<Page> => {
  const projects = await load.projects(rest);
  return {
    meta: {
      title: "Projetos — Portfólio",
      description: `Explore os projetos desenvolvidos por ${SITE_NAME} utilizando tecnologias de Dados, IA e Web.`,
      canonical: `${SITE_URL}/projects`,
      jsonLd: { "@context": "https://schema.org", "@type": "CollectionPage", name: `Projetos — ${SITE_NAME}`, url: `${SITE_URL}/projects` },
    },
    body: `<header><h1>Projetos</h1><p>Explore os projetos desenvolvidos utilizando tecnologias do mercado.</p></header>${list(
      projects.map((p) => withNote(`${link(`/projects/${p.slug}`, p.title)}${p.category ? ` (${e(p.category)})` : ""}`, p.description)),
    )}`,
  };
};

const findProject = async (rest: Rest, idOrSlug: string) => {
  if (UUID.test(idOrSlug)) return { project: (await rest("projects", `select=*&id=${eq(idOrSlug)}`))[0], moved: true };
  const [current] = await rest("projects", `select=*&slug=${eq(idOrSlug)}`);
  if (current || !/^[a-z0-9-]+$/.test(idOrSlug)) return { project: current, moved: false };
  return { project: (await rest("projects", `select=*&previous_slugs=cs.${encodeURIComponent(`{${idOrSlug}}`)}`))[0], moved: true };
};

const project = async (rest: Rest, idOrSlug: string): Promise<Page> => {
  const { project: p, moved } = await findProject(rest, idOrSlug);
  if (!p) return notFound("Projeto não encontrado", ["/projects", "Ver todos os projetos"]);
  if (moved) return { redirect: `/projects/${p.slug}` };
  const url = `${SITE_URL}/projects/${p.slug}`;
  const summary = p.business_problem || p.description;
  const textSections = [["Problema de negócio", p.business_problem], ["Contexto", p.context]] as const;
  const listSections = [["Premissas", p.premises], ["Estratégia", p.strategy], ["Insights", p.insights], ["Resultados", p.results], ["Próximos passos", p.next_steps]] as const;
  return {
    meta: {
      title: `${p.title} — Projeto`,
      description: plain(summary) || `Projeto: ${p.title}`,
      canonical: url,
      image: p.image_url || undefined,
      type: "article",
      jsonLd: {
        "@context": "https://schema.org", "@type": "CreativeWork", name: p.title, description: plain(summary) || undefined, url,
        author: { "@type": "Person", name: SITE_NAME }, ...(p.image_url && { image: p.image_url }), keywords: (p.technologies ?? []).join(", ") || undefined,
      },
    },
    body: [
      `<nav aria-label="Voltar">${link("/projects", "Projetos")}</nav><article><header>`,
      p.category ? `<p>${e(p.category)}</p>` : "",
      `<h1>${e(p.title)}</h1>`,
      p.description ? `<p>${e(p.description)}</p>` : "",
      `</header>`,
      p.technologies?.length ? `<p><strong>Tecnologias:</strong> ${e(p.technologies.join(", "))}</p>` : "",
      renderMarkdown(p.markdown),
      ...textSections.filter(([, text]) => text).map(([title, text]) => `<h2>${title}</h2><p>${e(text)}</p>`),
      ...listSections.filter(([, items]) => items?.length).map(([title, items]) => `<h2>${title}</h2>${list(items.map((i: string) => e(i)))}`),
      p.demo_url ? `<p>${link(p.demo_url, "Ver projeto online")}</p>` : "",
      p.github_url ? `<p>${link(p.github_url, "Código no GitHub")}</p>` : "",
      `</article>`,
    ].join(""),
  };
};

/* ── Trilhas (/blog) ──────────────────────── */
const blogIndex = async (rest: Rest): Promise<Page> => {
  const [trails, posts] = await Promise.all([load.trails(rest), load.posts(rest)]);
  const summaries = summarizeTrails(trails, posts);
  const loose = posts.filter((p) => !p.trail_id || !trails.some((t) => t.id === p.trail_id));
  const postItem = (p: Row) => withNote(link(postPath(p), p.title.trim()), p.description);
  return {
    meta: {
      title: "Trilhas de estudo",
      description: `Trilhas de estudo com artigos em sequência sobre Linux, Cloud, Dados e IA, escritas por ${SITE_NAME}.`,
      canonical: `${SITE_URL}/blog`,
      jsonLd: {
        "@context": "https://schema.org", "@type": "Blog", name: `Trilhas de estudo — ${SITE_NAME}`, url: `${SITE_URL}/blog`,
        author: { "@type": "Person", name: SITE_NAME },
        hasPart: summaries.map(({ trail: t, posts: items }) => ({
          "@type": "CollectionPage", name: t.name, url: `${SITE_URL}${trailPath(t)}`, numberOfItems: items.length,
        })),
      },
    },
    body: [
      `<header><h1>Trilhas de estudo</h1><p>Escolha um assunto e siga os artigos na ordem de estudo, do primeiro ao último.</p></header>`,
      ...summaries.map(({ trail: t, posts: items }) =>
        `<section><h2>${link(trailPath(t), t.name)}</h2>${t.description ? `<p>${e(t.description)}</p>` : ""}<p>${count(items.length)}</p>${list(items.map(postItem), "ol")}</section>`),
      loose.length ? `<section><h2>${summaries.length ? "Outros artigos" : "Artigos"}</h2>${list(loose.map(postItem))}</section>` : "",
    ].join(""),
  };
};

const trail = async (rest: Rest, slug: string): Promise<Page> => {
  const [t] = (await optional(rest("blog_trails", `select=*&slug=${eq(slug)}`))) as TrailRow[];
  if (!t) return notFound("Trilha não encontrada", ["/blog", "Ver todas as trilhas"]);
  const posts = trailPosts(await rest("contents", `select=id,slug,title,description,trail_id,trail_position,created_at,image_url&trail_id=${eq(t.id)}`), t.id);
  const url = `${SITE_URL}${trailPath(t)}`;
  return {
    meta: {
      title: `${t.name} — Trilha de estudo`,
      description: t.description || `Trilha de estudo "${t.name}": ${count(posts.length)} em sequência, por ${SITE_NAME}.`,
      canonical: url,
      image: t.image_url || posts.find((p) => p.image_url)?.image_url || undefined,
      jsonLd: {
        "@context": "https://schema.org", "@type": "CollectionPage", name: t.name, description: t.description || undefined, url,
        isPartOf: { "@type": "Blog", name: `Trilhas de estudo — ${SITE_NAME}`, url: `${SITE_URL}/blog` },
        mainEntity: {
          "@type": "ItemList", itemListOrder: "https://schema.org/ItemListOrderAscending", numberOfItems: posts.length,
          itemListElement: posts.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.title.trim(), url: `${SITE_URL}${encodeURI(postPath(p))}` })),
        },
      },
    },
    body: [
      `<nav aria-label="Voltar">${link("/blog", "Trilhas")}</nav>`,
      `<header><p>Trilha de estudo</p><h1>${e(t.name)}</h1>${t.description ? `<p>${e(t.description)}</p>` : ""}<p>${count(posts.length)}</p></header>`,
      list(posts.map((p) => `${stepLabel(p.trail_position) ? `<p>${stepLabel(p.trail_position)}</p>` : ""}<h2>${link(postPath(p), p.title.trim())}</h2>${p.description ? `<p>${e(plain(p.description))}</p>` : ""}`), "ol"),
    ].join(""),
  };
};

const post = async (rest: Rest, idOrSlug: string): Promise<Page> => {
  const [p] = await rest("contents", `select=*&${UUID.test(idOrSlug) ? "id" : "slug"}=${eq(idOrSlug)}`);
  if (!p) return notFound("Artigo não encontrado", ["/blog", "Ver todos os artigos"]);
  if (UUID.test(idOrSlug) && p.slug) return { redirect: postPath(p) };

  const [profile, trails, siblings] = await Promise.all([
    load.profile(rest),
    p.trail_id ? optional(rest("blog_trails", `select=*&id=${eq(p.trail_id)}`)) : Promise.resolve([]),
    p.trail_id ? optional(rest("contents", `select=id,slug,title,trail_id,trail_position,created_at&trail_id=${eq(p.trail_id)}`)) : Promise.resolve([]),
  ]);
  const t = trails[0] as TrailRow | undefined;
  const ordered = t ? trailPosts(siblings, t.id) : [];
  const { index, previous, next } = trailNeighbors(ordered, p.id);
  const { step, total } = trailStep(ordered, index);
  const url = `${SITE_URL}${encodeURI(postPath(p))}`;
  const author = profile.full_name || SITE_NAME;
  const pad = (n: number) => String(n).padStart(2, "0");
  const title = p.title.trim();
  return {
    meta: {
      title,
      description: plain(p.description) || `Leia "${title}" nas trilhas de estudo de ${SITE_NAME}.`,
      canonical: url,
      image: p.image_url || undefined,
      type: "article",
      jsonLd: {
        "@context": "https://schema.org", "@type": "BlogPosting", headline: title, description: plain(p.description) || undefined,
        datePublished: p.created_at, url, inLanguage: "pt-BR",
        author: { "@type": "Person", name: author, url: `${SITE_URL}/about` },
        publisher: { "@type": "Person", name: author },
        ...(p.image_url && { image: p.image_url }),
        ...(t && {
          isPartOf: { "@type": "CollectionPage", name: t.name, url: `${SITE_URL}${trailPath(t)}` },
          ...(index >= 0 && { position: step }),
        }),
        wordCount: p.markdown ? p.markdown.split(/\s+/).length : undefined,
      },
    },
    body: [
      `<nav aria-label="Trilha">${link("/blog", "Trilhas")}${t ? ` › ${link(trailPath(t), t.name)}` : ""}</nav>`,
      `<article><header>`,
      `<p>${[t && index >= 0 ? `Etapa ${pad(step)} de ${pad(total)}` : "", p.created_at ? `<time datetime="${e(p.created_at)}">${dateLabel(p.created_at)}</time>` : ""].filter(Boolean).join(" · ")}</p>`,
      `<h1>${e(title)}</h1>`,
      p.description ? `<p>${e(plain(p.description))}</p>` : "",
      `<p>Por ${e(author)}</p></header>`,
      p.image_url ? `<img src="${e(p.image_url)}" alt="${e(title)}" />` : "",
      renderMarkdown(p.markdown),
      `</article>`,
      previous || next
        ? `<nav aria-label="Navegação da trilha">${previous ? `<p>Anterior: ${link(postPath(previous), previous.title.trim())}</p>` : ""}${next ? `<p>Próximo: ${link(postPath(next), next.title.trim())}</p>` : ""}</nav>`
        : "",
    ].join(""),
  };
};

/* ── Contact and custom pages ─────────────── */
const contact = async (rest: Rest): Promise<Page> => {
  const profile = await load.profile(rest);
  const name = profile.full_name || SITE_NAME;
  return {
    meta: {
      title: `Contato - ${name}`,
      description: profile.bio_summary || "Entre em contato para projetos, consultorias e conversas sobre Dados, IA e Tecnologia.",
      canonical: `${SITE_URL}/contact`,
      jsonLd: { "@context": "https://schema.org", "@type": "ContactPage", name: "Contato", url: `${SITE_URL}/contact`, about: name },
    },
    body: [
      `<h1>Contato</h1><p>Entre em contato para projetos, consultorias e conversas sobre tecnologia.</p>`,
      list([
        profile.email ? `E-mail: ${link(`mailto:${profile.email}`, profile.email)}` : "",
        profile.phone ? `Telefone: ${e(profile.phone)}` : "",
        profile.location ? `Localização: ${e(profile.location)}` : "",
      ].filter(Boolean)),
    ].join(""),
  };
};

const customPage = async (rest: Rest, slug: string): Promise<Page> => {
  const [page] = await rest("custom_pages", `select=*&slug=${eq(slug)}`);
  if (!page) return notFound("Página não encontrada", ["/", "Voltar ao início"]);
  return {
    meta: {
      title: `${page.title} — ${SITE_NAME}`,
      description: `Leia mais sobre ${page.title} no site de ${SITE_NAME}.`,
      canonical: `${SITE_URL}/p/${encodeURI(page.slug)}`,
    },
    body: `<article><h1>${e(page.title)}</h1>${renderMarkdown(page.markdown)}</article>`,
  };
};

/* ── Routing ──────────────────────────────── */
const decode = (segment: string) => {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
};

const resolve = (pathname: string, rest: Rest): Promise<Page> => {
  const [first, second, third, ...extra] = pathname.split("/").filter(Boolean).map(decode);
  if (extra.length) return Promise.resolve(notFound("Página não encontrada", ["/", "Voltar ao início"]));
  if (!first) return home(rest);
  if (first === "about" && !second) return about(rest);
  if (first === "contact" && !second) return contact(rest);
  if (first === "projects" && !third) return second ? project(rest, second) : projectsIndex(rest);
  if (first === "blog" && second === "trilha" && third) return trail(rest, third);
  if (first === "blog" && !third) return second ? post(rest, second) : blogIndex(rest);
  if (first === "p" && second && !third) return customPage(rest, second);
  return Promise.resolve(notFound("Página não encontrada", ["/", "Voltar ao início"]));
};

export const prerender = async (pathname: string, shell: string, rest: Rest): Promise<PrerenderResult> => {
  const page = await resolve(pathname, rest);
  if ("redirect" in page) return { type: "redirect", status: 301, location: encodeURI(page.redirect) };
  return { type: "html", status: page.status ?? 200, html: renderDocument(shell, page.meta, `${SITE_NAV}<main>${page.body}</main>`) };
};

/* ── llms.txt ─────────────────────────────── */
// https://llmstxt.org: a Markdown map of the site for language models.
export const buildLlmsTxt = async (rest: Rest) => {
  const [profile, trails, posts, projects, pages] = await Promise.all([
    load.profile(rest),
    load.trails(rest),
    optional(load.posts(rest)),
    optional(load.projects(rest)),
    optional(rest("custom_pages", "select=slug,title&order=created_at.desc")),
  ]);
  const name = profile.full_name || SITE_NAME;
  const item = (title: string, path: string, note?: string | null) =>
    `- [${title.trim().replace(/([[\]])/g, "\\$1")}](${SITE_URL}${encodeURI(path)})${plain(note) ? `: ${plain(note)}` : ""}`;
  const summaries = summarizeTrails(trails, posts);
  const loose = posts.filter((p) => !p.trail_id || !trails.some((t) => t.id === p.trail_id));

  const lines = [
    `# ${name}`,
    "",
    profile.bio_summary ? `> ${plain(profile.bio_summary)}` : "",
    "",
    `${[profile.current_focus, profile.location].filter(Boolean).join(" · ")}. Site pessoal com portfólio de projetos e trilhas de estudo, em português (pt-BR).`,
    "",
    "## Páginas",
    "",
    item("Início", "/", "Apresentação, projetos em destaque, skills e certificações"),
    item("Sobre", "/about", "Formação acadêmica, experiências profissionais, livros e cursos"),
    item("Portfólio", "/projects", "Todos os projetos"),
    item("Trilhas", "/blog", "Trilhas de estudo com artigos em sequência"),
    item("Contato", "/contact", "Formas de contato"),
  ];
  if (summaries.length) {
    lines.push("", "## Trilhas de estudo", "");
    for (const { trail: t, posts: items } of summaries) lines.push(`${item(t.name, trailPath(t), t.description)} (${count(items.length)})`);
  }
  if (posts.length) {
    lines.push("", "## Artigos");
    for (const { trail: t, posts: items } of summaries) {
      lines.push("", `### ${t.name}`, "", ...items.map((p) => item(p.title, postPath(p), p.description)));
    }
    if (loose.length) lines.push("", summaries.length ? "### Outros artigos" : "", "", ...loose.map((p) => item(p.title, postPath(p), p.description)));
  }
  if (projects.length) lines.push("", "## Projetos", "", ...projects.map((p) => item(p.title, `/projects/${p.slug}`, p.description)));
  if (pages.length) lines.push("", "## Outras páginas", "", ...pages.map((p) => item(p.title, `/p/${p.slug}`)));

  return `${lines.join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`;
};

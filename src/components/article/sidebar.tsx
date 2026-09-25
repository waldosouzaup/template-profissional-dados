import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Link2, Linkedin } from "lucide-react";
import { SiX } from "react-icons/si";
import { headingId, stripInlineMarkdown } from "@/lib/text";

export const SidebarLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{children}</p>
);

/* ─────────────────────────────────────────────
   TABLE OF CONTENTS
 ───────────────────────────────────────────── */
export const TableOfContents = ({ markdown, label = "Neste artigo" }: { markdown: string; label?: string }) => {
  const headings = useMemo(() => {
    const lines = markdown.split("\n");
    const result: { level: number; text: string; id: string }[] = [];
    for (const line of lines) {
      const match = line.match(/^(#{2,3})\s+(.+)/);
      if (match) {
        // Shown and anchored without Markdown marks, matching the rendered heading.
        const text = stripInlineMarkdown(match[2].trim());
        const id = headingId(text);
        result.push({ level: match[1].length, text, id });
      }
    }
    return result;
  }, [markdown]);

  if (headings.length < 2) return null;

  return (
    <div className="pb-8">
      <SidebarLabel>{label}</SidebarLabel>
      <nav aria-label={label} className="scrollbar-themed max-h-[40vh] space-y-1 overflow-y-auto overscroll-contain border-l border-border pr-3">
        {headings.map((h, i) => (
          <a
            key={i}
            href={`#${h.id}`}
            className={`-ml-px block border-l border-transparent py-1 text-[13px] leading-snug transition-colors hover:border-primary hover:text-foreground ${
              h.level === 2 ? "pl-4 text-foreground/60" : "pl-7 text-foreground/40"
            }`}
          >
            {h.text}
          </a>
        ))}
      </nav>
    </div>
  );
};

/* ─────────────────────────────────────────────
   SHARE
  ───────────────────────────────────────────── */
const shareButton =
  "flex h-10 w-10 items-center justify-center rounded-full border border-foreground/10 text-foreground/60 transition-all hover:border-primary/40 hover:text-primary";

export const ShareButtons = ({ title }: { title: string }) => {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="py-8 border-t border-foreground/[0.06]">
      <SidebarLabel>Compartilhar</SidebarLabel>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, "_blank")}
          className={shareButton}
          aria-label="Compartilhar no LinkedIn"
        >
          <Linkedin className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => window.open(`https://x.com/intent/post?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(title)}`, "_blank")}
          className={shareButton}
          aria-label="Compartilhar no X"
        >
          <SiX className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={copyLink} className={shareButton} aria-label="Copiar link">
          {copied ? <Check className="h-4 w-4 text-primary" /> : <Link2 className="h-4 w-4" />}
        </button>
        {copied && <span role="status" className="text-xs text-primary">Link copiado</span>}
      </div>
    </div>
  );
};

export const AboutAuthor = ({ bio }: { bio: string }) => (
  <div className="py-8 border-t border-foreground/[0.06]">
    <SidebarLabel>Sobre o autor</SidebarLabel>
    <p className="text-sm text-foreground/60 leading-relaxed mb-5">{bio}</p>
    <Link to="/about" className="text-xs font-semibold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors">
      Ver perfil completo →
    </Link>
  </div>
);

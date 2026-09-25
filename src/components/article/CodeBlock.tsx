import { useState } from "react";
import { Check, Copy } from "lucide-react";

/* ─────────────────────────────────────────────
   COPY-CODE BLOCK
 ───────────────────────────────────────────── */
export const CodeBlock = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  const [copied, setCopied] = useState(false);
  const text = String(children ?? "");
  const lang = className?.replace("language-", "") ?? "code";

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-8 group">
      <div className="flex items-center justify-between px-5 py-2.5 bg-foreground/[0.04] border border-foreground/8 rounded-t-xl">
        <span className="text-[10px] font-mono tracking-widest uppercase text-foreground/30">
          {lang}
        </span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-[11px] text-foreground/30 hover:text-foreground/70 transition-colors"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>
      <pre className="bg-card border border-t-0 border-foreground/8 rounded-b-xl p-6 overflow-x-auto">
        <code className={`text-sm font-mono text-foreground/70 leading-relaxed ${className ?? ""}`}>
          {text}
        </code>
      </pre>
    </div>
  );
};

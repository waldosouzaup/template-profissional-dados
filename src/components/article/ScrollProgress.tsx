import { useEffect, useState } from "react";

/* ─────────────────────────────────────────────
   SCROLL PROGRESS BAR
 ───────────────────────────────────────────── */
export const ScrollProgress = () => {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      setPct((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 w-full h-[2px] z-50 bg-foreground/5">
      <div
        className="h-full bg-primary/60 transition-all duration-75"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

/* ─────────────────────────────────────────────
   COVER
  ───────────────────────────────────────────── */
// Natural aspect ratio (no letterboxing); a blurred copy behind it adds an ambient glow in the image's own colors.
export const ArticleCover = ({ src, alt }: { src: string; alt: string }) => (
  <figure className="relative isolate mb-14">
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full scale-95 rounded-3xl object-cover opacity-40 blur-3xl"
    />
    <img
      src={src}
      alt={alt}
      className="block h-auto w-full rounded-2xl border border-foreground/10 shadow-2xl shadow-black/40 sm:rounded-3xl"
    />
  </figure>
);

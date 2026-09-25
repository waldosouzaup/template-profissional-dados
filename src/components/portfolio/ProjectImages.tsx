import { useState } from "react";
import { ZoomIn } from "lucide-react";
import ImageLightbox, { type LightboxImage } from "@/components/blog/ImageLightbox";
import type { Project } from "@/types/project";

// Images uploaded in the admin under "Imagens das Seções", with the section they illustrate as caption.
const SECTION_IMAGES: [keyof Project, string][] = [
  ["businessProblemImage", "Problema de negócio"],
  ["contextImage", "Contexto"],
  ["premisesImage", "Premissas"],
  ["strategyImage", "Estratégia"],
  ["resultsImage", "Resultados"],
  ["nextStepsImage", "Próximos passos"],
];

const projectImages = (project: Project): LightboxImage[] => {
  const gallery = project.galleryImages?.filter(Boolean) ?? [];
  return [
    ...SECTION_IMAGES.flatMap(([field, alt]) => (project[field] ? [{ src: project[field] as string, alt }] : [])),
    ...gallery.map((src, i) => ({ src, alt: gallery.length === 1 ? "Galeria" : `Galeria ${i + 1}` })),
  ];
};

export default function ProjectImages({ project }: { project: Project }) {
  // Links that stopped serving an image (e.g. a removed external upload) are dropped instead of leaving empty boxes.
  const [failed, setFailed] = useState<string[]>([]);
  const images = projectImages(project).filter((image) => !failed.includes(image.src));
  const [index, setIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  return (
    <section aria-labelledby="project-images-title" className="mt-20 max-w-3xl border-t border-foreground/[0.06] pt-10">
      <h2 id="project-images-title" className="mb-8 text-3xl font-light text-foreground/90">Imagens do projeto</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {images.map((image, i) => (
          <figure key={`${image.src}-${i}`} className="m-0">
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ampliar imagem: ${image.alt}`}
              className="group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-border bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
            >
              <img
                src={image.src}
                alt=""
                loading="lazy"
                onError={() => setFailed((current) => [...current, image.src])}
                className="aspect-[4/3] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]" />
              <span className="pointer-events-none absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/75 text-foreground opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <ZoomIn className="h-4 w-4" aria-hidden="true" />
              </span>
            </button>
            <figcaption className="mt-3 text-sm text-muted-foreground">{image.alt}</figcaption>
          </figure>
        ))}
      </div>

      <ImageLightbox images={images} index={index} onIndexChange={setIndex} onClose={() => setIndex(null)} />
    </section>
  );
}

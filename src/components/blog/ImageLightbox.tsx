import { useEffect, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, ExternalLink, X, ZoomIn, ZoomOut } from "lucide-react";

export interface LightboxImage {
  src: string;
  alt: string;
}

interface ImageLightboxProps {
  images: LightboxImage[];
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

const ZOOM_FACTOR = 2;
const toolbarButton =
  "flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

export default function ImageLightbox({ images, index, onIndexChange, onClose }: ImageLightboxProps) {
  const image = index !== null ? images[index] : undefined;
  const [zoomed, setZoomed] = useState(false);
  const [zoomWidth, setZoomWidth] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const focusPoint = useRef({ x: 0.5, y: 0.5 });
  const drag = useRef<{ x: number; y: number; left: number; top: number; moved: boolean } | null>(null);
  const hasMany = images.length > 1;

  useEffect(() => setZoomed(false), [index]);

  // Keep the clicked point in view once the enlarged image is laid out.
  useEffect(() => {
    const stage = stageRef.current;
    const img = imgRef.current;
    if (!zoomed || !stage || !img) return;
    stage.scrollLeft = focusPoint.current.x * img.offsetWidth - stage.clientWidth / 2;
    stage.scrollTop = focusPoint.current.y * img.offsetHeight - stage.clientHeight / 2;
  }, [zoomed]);

  const go = (step: number) => {
    if (index === null || !hasMany) return;
    onIndexChange((index + step + images.length) % images.length);
  };

  const toggleZoom = (point?: { clientX: number; clientY: number }) => {
    const img = imgRef.current;
    if (zoomed || !img) {
      setZoomed(false);
      return;
    }
    const rect = img.getBoundingClientRect();
    focusPoint.current = point && rect.width
      ? { x: (point.clientX - rect.left) / rect.width, y: (point.clientY - rect.top) / rect.height }
      : { x: 0.5, y: 0.5 };
    // At least twice the fitted size, or the real resolution when that is larger.
    setZoomWidth(Math.max(img.naturalWidth, rect.width * ZOOM_FACTOR));
    setZoomed(true);
  };

  // Mouse drag pans the zoomed image; touch and trackpads use native scrolling.
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!zoomed || e.pointerType !== "mouse" || !stageRef.current) return;
    drag.current = { x: e.clientX, y: e.clientY, left: stageRef.current.scrollLeft, top: stageRef.current.scrollTop, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || !stageRef.current) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) d.moved = true;
    stageRef.current.scrollLeft = d.left - dx;
    stageRef.current.scrollTop = d.top - dy;
  };
  const onPointerUp = () => {
    setTimeout(() => (drag.current = null));
  };

  const onStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (drag.current?.moved) return;
    if (e.target === imgRef.current) toggleZoom(e);
    else if (!zoomed) onClose();
  };

  return (
    <DialogPrimitive.Root open={image !== undefined} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className="fixed inset-0 z-[100] flex flex-col outline-none"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") go(1);
            if (e.key === "ArrowLeft") go(-1);
          }}
        >
          <DialogPrimitive.Title className="sr-only">Imagem ampliada</DialogPrimitive.Title>

          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <span className="text-sm tabular-nums text-white/60">{hasMany && index !== null ? `${index + 1} / ${images.length}` : ""}</span>
            <div className="flex items-center gap-2">
              <button type="button" className={toolbarButton} onClick={() => toggleZoom()} aria-label={zoomed ? "Reduzir" : "Ampliar"}>
                {zoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
              </button>
              {image && (
                <a href={image.src} target="_blank" rel="noopener noreferrer" className={toolbarButton} aria-label="Abrir original" title="Abrir original">
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              <DialogPrimitive.Close className={toolbarButton} aria-label="Fechar">
                <X className="h-5 w-5" />
              </DialogPrimitive.Close>
            </div>
          </div>

          <div
            ref={stageRef}
            className={`relative flex-1 overflow-auto ${zoomed ? "cursor-grab active:cursor-grabbing" : ""}`}
            onClick={onStageClick}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            {/* Grid + w-max keeps an image larger than the viewport fully scrollable on every side */}
            <div className="grid min-h-full min-w-full w-max place-items-center p-4">
              {image && (
                <img
                  ref={imgRef}
                  src={image.src}
                  alt={image.alt || "Imagem do artigo"}
                  data-zoomed={zoomed}
                  draggable={false}
                  style={zoomed ? { width: zoomWidth, maxWidth: "none", maxHeight: "none" } : undefined}
                  className={`select-none rounded-lg shadow-2xl ${
                    zoomed ? "" : "max-h-[calc(100dvh-9rem)] max-w-[calc(100vw-2rem)] cursor-zoom-in object-contain sm:max-w-[calc(100vw-9rem)]"
                  }`}
                />
              )}
            </div>
          </div>

          {hasMany && (
            <>
              <button type="button" onClick={() => go(-1)} aria-label="Imagem anterior" className={`${toolbarButton} absolute left-3 top-1/2 -translate-y-1/2 sm:left-6`}>
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Próxima imagem" className={`${toolbarButton} absolute right-3 top-1/2 -translate-y-1/2 sm:right-6`}>
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <div className="px-6 pb-5 pt-2 text-center">
            {/* The visible caption doubles as the dialog description, so it is announced once */}
            {image?.alt ? (
              <DialogPrimitive.Description className="mx-auto max-w-3xl text-sm text-white/80">{image.alt}</DialogPrimitive.Description>
            ) : (
              <DialogPrimitive.Description className="sr-only">Imagem do artigo</DialogPrimitive.Description>
            )}
            <span className="mt-1 block text-xs text-white/40">
              {zoomed ? "Arraste para navegar · clique para reduzir" : "Clique na imagem para ampliar os detalhes"}
            </span>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

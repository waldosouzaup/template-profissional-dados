// Study-trail helpers shared by the blog pages. Relative imports only: the prerender edge function bundles this too.
import { readingMinutes } from "./text.ts";

interface TrailPost {
  id?: string;
  trail_id?: string | null;
  trail_position?: number | null;
  created_at?: string;
  image_url?: string | null;
  markdown?: string | null;
}

interface Trail {
  id: string;
  image_url?: string | null;
}

// Study order: position first (unnumbered posts last), then publication date.
const byTrailOrder = (a: TrailPost, b: TrailPost) => {
  const pa = a.trail_position ?? Number.POSITIVE_INFINITY;
  const pb = b.trail_position ?? Number.POSITIVE_INFINITY;
  if (pa !== pb) return pa - pb;
  return (a.created_at ?? "").localeCompare(b.created_at ?? "");
};

export const trailPosts = <P extends TrailPost>(posts: P[], trailId: string) =>
  posts.filter((post) => post.trail_id === trailId).sort(byTrailOrder);

export const trailPath = (trail: { slug: string }) => `/blog/trilha/${trail.slug}`;

export const stepLabel = (position?: number | null) =>
  position ? `Etapa ${String(position).padStart(2, "0")}` : undefined;

export const trailNeighbors = <P extends TrailPost>(ordered: P[], currentId: string, upNextCount = 3) => {
  const index = ordered.findIndex((post) => post.id === currentId);
  if (index < 0) return { index, previous: undefined, next: undefined, upNext: [] as P[] };
  const after = ordered.slice(index + 1);
  const before = ordered.slice(0, index).reverse();
  return {
    index,
    previous: ordered[index - 1] as P | undefined,
    next: ordered[index + 1] as P | undefined,
    // The rest of the trail; near the end, the closest earlier posts fill the row.
    upNext: [...after, ...before].slice(0, upNextCount),
  };
};

export interface TrailSummary<T, P> {
  trail: T;
  posts: P[];
  cover?: string;
  minutes: number;
  lastPublished?: string;
}

// Trails that have posts, in their own order, with what the trail cards show.
export const summarizeTrails = <T extends Trail, P extends TrailPost>(trails: T[], posts: P[]): TrailSummary<T, P>[] =>
  trails
    .map((trail) => {
      const list = trailPosts(posts, trail.id);
      return {
        trail,
        posts: list,
        cover: trail.image_url || list.find((post) => post.image_url)?.image_url || undefined,
        minutes: list.reduce((total, post) => total + readingMinutes(post.markdown ?? undefined), 0),
        lastPublished: list.map((post) => post.created_at ?? "").sort().pop() || undefined,
      };
    })
    .filter((summary) => summary.posts.length > 0);

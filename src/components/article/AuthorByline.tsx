import profilePhoto from "@/assets/profile-photo.jpg";
import type { Profile } from "@/types/database";

// Author photo, name and focus shown under a post or project title.
export const AuthorByline = ({ author }: { author?: Profile }) => (
  <div className="flex items-center gap-3">
    <img
      src={author?.avatar_url || profilePhoto}
      alt=""
      className="h-11 w-11 rounded-full border border-foreground/10 object-cover"
    />
    <div>
      <p className="text-sm font-medium text-foreground">{author?.full_name || "Waldo Eller"}</p>
      {author?.current_focus && <p className="text-xs text-muted-foreground">{author.current_focus}</p>}
    </div>
  </div>
);

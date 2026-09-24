import { useEffect } from "react";
import { useProfiles } from "@/hooks/useProfile";
import { applyAppearance } from "@/lib/themes";

export function ThemeProvider() {
  const { data: profiles = [] } = useProfiles();
  const profile = profiles[0];

  useEffect(() => {
    const root = window.document.documentElement;
    // Until the profile arrives, keep what index.html painted from the last visit (dark on a first visit).
    if (!profile) {
      if (!root.classList.contains("light")) root.classList.add("dark");
      return;
    }
    applyAppearance(root, { preset: profile.theme_preset, mode: profile.theme, primary: profile.primary_color });
  }, [profile]);

  return null;
}

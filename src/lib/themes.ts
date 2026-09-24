// Appearance versions of the site (Configurações → Aparência do Portfólio). Each one has a dark and a light
// palette plus its own heading typeface; the body text stays Inter everywhere for legibility.
// Values are "H S% L%" triplets for the CSS custom properties in src/index.css.

export type ThemeMode = "dark" | "light";

export const THEME_TOKEN_NAMES = [
  "background", "foreground", "card", "card-foreground", "popover", "popover-foreground",
  "primary", "primary-foreground", "secondary", "secondary-foreground", "muted", "muted-foreground",
  "accent", "accent-foreground", "border", "input", "ring",
  "card-highlight", "card-dark", "border-hover", "border-muted", "text-secondary", "text-tertiary", "badge-bg",
] as const;

export type ThemeTokens = Record<(typeof THEME_TOKEN_NAMES)[number], string>;

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  font: { family: string; stack: string; url?: string };
  tokens: Record<ThemeMode, ThemeTokens>;
}

interface Palette {
  background: string;
  surface: string;
  surfaceRaised: string;
  surfaceSunken: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  textMuted: string;
  secondary: string;
  muted: string;
  border: string;
  borderHover: string;
  borderMuted: string;
  primary: string;
  onPrimary: string;
  // Hover/selection surface: the brand color on dark palettes, a quiet tint on light ones.
  accent: string;
  onAccent: string;
}

const tokens = (p: Palette): ThemeTokens => ({
  background: p.background,
  foreground: p.text,
  card: p.surface,
  "card-foreground": p.text,
  popover: p.surface,
  "popover-foreground": p.text,
  primary: p.primary,
  "primary-foreground": p.onPrimary,
  secondary: p.secondary,
  "secondary-foreground": p.text,
  muted: p.muted,
  "muted-foreground": p.textMuted,
  accent: p.accent,
  "accent-foreground": p.onAccent,
  border: p.border,
  input: p.border,
  ring: p.primary,
  "card-highlight": p.surfaceRaised,
  "card-dark": p.surfaceSunken,
  "border-hover": p.borderHover,
  "border-muted": p.borderMuted,
  "text-secondary": p.textSecondary,
  "text-tertiary": p.textTertiary,
  "badge-bg": p.muted,
});

const INTER = "'Inter', system-ui, -apple-system, sans-serif";

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "padrao",
    name: "Padrão",
    description: "Preto neutro com destaque verde.",
    font: { family: "Inter", stack: INTER },
    // Mirrors src/index.css, which paints the first frame; kept in sync by a test.
    tokens: {
      dark: {
        background: "0 0% 4%", foreground: "0 0% 98%", card: "0 0% 8%", "card-foreground": "0 0% 98%",
        popover: "0 0% 8%", "popover-foreground": "0 0% 98%", primary: "142 71% 45%", "primary-foreground": "0 0% 4%",
        secondary: "0 0% 12%", "secondary-foreground": "0 0% 98%", muted: "0 0% 15%", "muted-foreground": "0 0% 60%",
        accent: "142 71% 45%", "accent-foreground": "0 0% 4%", border: "0 0% 18%", input: "0 0% 18%", ring: "142 71% 45%",
        "card-highlight": "0 0% 10%", "card-dark": "0 0% 7%", "border-hover": "0 0% 25%", "border-muted": "0 0% 20%",
        "text-secondary": "0 0% 80%", "text-tertiary": "0 0% 70%", "badge-bg": "0 0% 15%",
      },
      light: {
        background: "0 0% 100%", foreground: "222 47% 11%", card: "0 0% 100%", "card-foreground": "222 47% 11%",
        popover: "0 0% 100%", "popover-foreground": "222 47% 11%", primary: "142 71% 45%", "primary-foreground": "0 0% 100%",
        secondary: "210 40% 96.1%", "secondary-foreground": "222 47% 11.2%", muted: "210 40% 96.1%",
        "muted-foreground": "215.4 16.3% 46.9%", accent: "210 40% 96.1%", "accent-foreground": "222 47% 11.2%",
        border: "214.3 31.8% 91.4%", input: "214.3 31.8% 91.4%", ring: "142 71% 45%", "card-highlight": "0 0% 100%",
        "card-dark": "210 40% 98%", "border-hover": "214.3 31.8% 85%", "border-muted": "214.3 31.8% 95%",
        "text-secondary": "215.4 16.3% 40%", "text-tertiary": "215.4 16.3% 50%", "badge-bg": "210 40% 94%",
      },
    },
  },
  {
    id: "obsidiana",
    name: "Obsidiana",
    description: "Vidro vulcânico e ouro; claro em mármore e bronze.",
    font: {
      family: "Fraunces",
      stack: "'Fraunces', Georgia, 'Times New Roman', serif",
      url: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..700&display=swap",
    },
    tokens: {
      dark: tokens({
        background: "40 12% 5%", surface: "37 12% 8%", surfaceRaised: "34 14% 10%", surfaceSunken: "35 10% 6%",
        text: "40 33% 92%", textSecondary: "39 20% 82%", textTertiary: "39 14% 72%", textMuted: "39 11% 62%",
        secondary: "37 14% 11%", muted: "36 15% 13%",
        border: "38 13% 17%", borderHover: "38 14% 25%", borderMuted: "38 12% 14%",
        primary: "39 55% 64%", onPrimary: "40 50% 7%", accent: "39 55% 64%", onAccent: "40 50% 7%",
      }),
      light: tokens({
        background: "40 9% 95%", surface: "0 0% 100%", surfaceRaised: "0 0% 100%", surfaceSunken: "40 10% 97%",
        text: "36 22% 9%", textSecondary: "36 14% 22%", textTertiary: "36 9% 32%", textMuted: "36 8% 36%",
        secondary: "40 10% 90%", muted: "40 10% 91%",
        border: "40 10% 85%", borderHover: "40 10% 74%", borderMuted: "40 10% 90%",
        primary: "37 64% 30%", onPrimary: "0 0% 100%", accent: "40 12% 90%", onAccent: "36 22% 9%",
      }),
    },
  },
  {
    id: "meia-noite",
    name: "Meia-noite",
    description: "Azul-marinho e ciano; claro em gelo e cobalto.",
    font: {
      family: "Red Hat Display",
      stack: "'Red Hat Display', 'Inter', system-ui, sans-serif",
      url: "https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@300..800&display=swap",
    },
    tokens: {
      dark: tokens({
        background: "222 47% 6%", surface: "221 40% 9%", surfaceRaised: "221 36% 12%", surfaceSunken: "222 44% 7%",
        text: "210 40% 96%", textSecondary: "214 30% 84%", textTertiary: "215 22% 74%", textMuted: "215 20% 67%",
        secondary: "220 32% 13%", muted: "220 30% 15%",
        border: "219 30% 18%", borderHover: "219 28% 27%", borderMuted: "219 30% 15%",
        primary: "190 88% 56%", onPrimary: "222 47% 6%", accent: "190 88% 56%", onAccent: "222 47% 6%",
      }),
      light: tokens({
        background: "210 40% 97%", surface: "0 0% 100%", surfaceRaised: "0 0% 100%", surfaceSunken: "210 40% 98%",
        text: "222 47% 11%", textSecondary: "220 25% 24%", textTertiary: "217 18% 34%", textMuted: "217 18% 38%",
        secondary: "212 35% 92%", muted: "212 33% 93%",
        border: "213 30% 87%", borderHover: "213 28% 76%", borderMuted: "213 30% 92%",
        primary: "219 76% 44%", onPrimary: "0 0% 100%", accent: "212 35% 92%", onAccent: "222 47% 11%",
      }),
    },
  },
  {
    id: "ametista",
    name: "Ametista",
    description: "Berinjela e lilás; claro em lavanda e violeta.",
    font: {
      family: "Sora",
      stack: "'Sora', 'Inter', system-ui, sans-serif",
      url: "https://fonts.googleapis.com/css2?family=Sora:wght@300..700&display=swap",
    },
    tokens: {
      dark: tokens({
        background: "268 35% 6%", surface: "268 28% 9%", surfaceRaised: "268 26% 12%", surfaceSunken: "268 32% 7%",
        text: "270 30% 96%", textSecondary: "268 22% 84%", textTertiary: "268 16% 75%", textMuted: "268 14% 68%",
        secondary: "268 22% 13%", muted: "268 20% 15%",
        border: "268 20% 19%", borderHover: "268 18% 28%", borderMuted: "268 20% 15%",
        primary: "265 83% 77%", onPrimary: "268 40% 8%", accent: "265 83% 77%", onAccent: "268 40% 8%",
      }),
      light: tokens({
        background: "270 40% 98%", surface: "0 0% 100%", surfaceRaised: "0 0% 100%", surfaceSunken: "270 40% 99%",
        text: "268 35% 12%", textSecondary: "268 22% 24%", textTertiary: "266 12% 34%", textMuted: "266 12% 40%",
        secondary: "268 35% 94%", muted: "268 30% 94%",
        border: "268 25% 89%", borderHover: "268 22% 79%", borderMuted: "268 25% 94%",
        primary: "262 60% 48%", onPrimary: "0 0% 100%", accent: "268 35% 94%", onAccent: "268 35% 12%",
      }),
    },
  },
];

export const DEFAULT_THEME_PRESET = "padrao";

export const findThemePreset = (id?: string | null) =>
  THEME_PRESETS.find((preset) => preset.id === id) ?? THEME_PRESETS.find((preset) => preset.id === DEFAULT_THEME_PRESET)!;

export interface Appearance {
  preset?: string | null;
  mode?: string | null;
  // Custom accent from the admin; empty means "the version's own color".
  primary?: string | null;
}

// Read by the boot script in index.html to paint the last appearance before the app loads.
export const APPEARANCE_CACHE_KEY = "appearance";

// "theme" links follow the active version; "preview" links stay while the admin compares versions.
export const ensureFontLink = (url: string, kind: "theme" | "preview" = "theme") => {
  const attribute = kind === "theme" ? "data-theme-font" : "data-font-preview";
  if (document.head.querySelector(`link[${attribute}][href="${url}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  link.setAttribute(attribute, "");
  document.head.appendChild(link);
};

export const applyAppearance = (root: HTMLElement, { preset: presetId, mode: rawMode, primary }: Appearance) => {
  const preset = findThemePreset(presetId);
  const mode: ThemeMode = rawMode === "light" ? "light" : "dark";
  const isDefault = preset.id === DEFAULT_THEME_PRESET;

  root.classList.toggle("light", mode === "light");
  root.classList.toggle("dark", mode === "dark");
  root.dataset.themePreset = preset.id;

  // The default palette comes from index.css; the premium ones are set inline, overriding it.
  const vars: Record<string, string> = isDefault ? {} : { ...preset.tokens[mode] };
  if (primary) {
    vars.primary = primary;
    vars.ring = primary;
    // Kept from the original single-palette site, where the chosen color also drove the accent.
    if (isDefault) vars.accent = primary;
  }
  for (const name of THEME_TOKEN_NAMES) root.style.removeProperty(`--${name}`);
  for (const [name, value] of Object.entries(vars)) root.style.setProperty(`--${name}`, value);

  const fontStack = isDefault ? "" : preset.font.stack;
  const fontUrl = preset.font.url ?? "";
  if (fontStack) root.style.setProperty("--font-display", fontStack);
  else root.style.removeProperty("--font-display");
  document.head.querySelectorAll<HTMLLinkElement>("link[data-theme-font]").forEach((link) => {
    if (link.getAttribute("href") !== fontUrl) link.remove();
  });
  if (fontUrl) ensureFontLink(fontUrl);

  try {
    localStorage.setItem(APPEARANCE_CACHE_KEY, JSON.stringify({ mode, preset: preset.id, vars, fontStack, fontUrl }));
  } catch {
    // Private mode or blocked storage: the app still applies the appearance once the profile loads.
  }
};

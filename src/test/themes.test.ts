import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it } from "vitest";
import { APPEARANCE_CACHE_KEY, THEME_PRESETS, THEME_TOKEN_NAMES, applyAppearance, findThemePreset } from "@/lib/themes";

// WCAG 2.x relative luminance of an "H S% L%" token.
const luminance = (hsl: string) => {
  const [h, s, l] = hsl.replace(/%/g, "").split(/\s+/).map(Number);
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l / 100 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(f(0)) + 0.7152 * lin(f(8)) + 0.0722 * lin(f(4));
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const root = document.documentElement;
afterEach(() => {
  applyAppearance(root, { preset: "padrao", mode: "dark" });
  localStorage.clear();
  document.head.querySelectorAll("link[data-theme-font]").forEach((link) => link.remove());
});

const premium = THEME_PRESETS.filter((preset) => preset.id !== "padrao");

describe("Versões de aparência", () => {
  it("oferece a Padrão e três versões premium, cada uma com modo escuro e claro", () => {
    expect(THEME_PRESETS.map((preset) => preset.name)).toEqual(["Padrão", "Obsidiana", "Meia-noite", "Ametista"]);
    for (const preset of THEME_PRESETS) {
      for (const mode of ["dark", "light"] as const) {
        expect(Object.keys(preset.tokens[mode]).sort()).toEqual([...THEME_TOKEN_NAMES].sort());
        for (const value of Object.values(preset.tokens[mode])) expect(value).toMatch(/^\d+(\.\d+)? \d+(\.\d+)?% \d+(\.\d+)?%$/);
      }
    }
  });

  it.each(premium.flatMap((preset) => (["dark", "light"] as const).map((mode) => [preset.name, mode, preset.tokens[mode]] as const)))(
    "%s (%s): textos legíveis (WCAG AA)",
    (_name, _mode, t) => {
      expect(contrast(t.foreground, t.background)).toBeGreaterThanOrEqual(7);
      for (const text of [t["muted-foreground"], t["text-secondary"], t["text-tertiary"], t.primary]) {
        expect(contrast(text, t.background)).toBeGreaterThanOrEqual(4.5);
        expect(contrast(text, t.card)).toBeGreaterThanOrEqual(4.5);
      }
      expect(contrast(t["primary-foreground"], t.primary)).toBeGreaterThanOrEqual(4.5);
    },
  );

  it("a Padrão em TypeScript é a mesma do index.css (a primeira pintura usa o CSS)", () => {
    const css = readFileSync("src/index.css", "utf8");
    const block = (selector: string) => {
      const body = css.split(`${selector} {`)[1].split("}")[0];
      return Object.fromEntries([...body.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(([, name, value]) => [name, value.trim()]));
    };
    const padrao = findThemePreset("padrao").tokens;
    const dark = block(":root");
    const light = { ...dark, ...block(".light") };
    for (const name of THEME_TOKEN_NAMES) {
      expect(padrao.dark[name], `dark --${name}`).toBe(dark[name]);
      expect(padrao.light[name], `light --${name}`).toBe(light[name]);
    }
  });
});

describe("Aplicação da aparência", () => {
  it("aplica paleta, modo e fonte dos títulos da versão, e guarda para a próxima visita", () => {
    applyAppearance(root, { preset: "meia-noite", mode: "light" });
    const tokens = findThemePreset("meia-noite").tokens.light;
    expect(root).toHaveClass("light");
    expect(root).not.toHaveClass("dark");
    expect(root.dataset.themePreset).toBe("meia-noite");
    expect(root.style.getPropertyValue("--background")).toBe(tokens.background);
    expect(root.style.getPropertyValue("--primary")).toBe(tokens.primary);
    expect(root.style.getPropertyValue("--font-display")).toContain("Red Hat Display");
    expect(document.head.querySelector("link[data-theme-font]")).toHaveAttribute("href", expect.stringContaining("Red+Hat+Display"));

    const cached = JSON.parse(localStorage.getItem(APPEARANCE_CACHE_KEY)!);
    expect(cached).toMatchObject({ mode: "light", preset: "meia-noite", vars: { background: tokens.background } });
  });

  it("voltar para a Padrão devolve o controle ao CSS e remove a fonte extra", () => {
    applyAppearance(root, { preset: "obsidiana", mode: "dark" });
    applyAppearance(root, { preset: "padrao", mode: "dark" });
    expect(root.style.getPropertyValue("--background")).toBe("");
    expect(root.style.getPropertyValue("--font-display")).toBe("");
    expect(root).toHaveClass("dark");
    expect(document.head.querySelector("link[data-theme-font]")).toBeNull();
  });

  it("uma cor de destaque escolhida sobrescreve a da versão", () => {
    applyAppearance(root, { preset: "ametista", mode: "dark", primary: "24 98% 50%" });
    expect(root.style.getPropertyValue("--primary")).toBe("24 98% 50%");
    expect(root.style.getPropertyValue("--ring")).toBe("24 98% 50%");
    // Accent stays the preset's: in light mode it is a surface tint, not the brand color.
    expect(root.style.getPropertyValue("--accent")).toBe(findThemePreset("ametista").tokens.dark.accent);
  });

  it("na Padrão, a cor escolhida continua valendo como antes (destaque e acento)", () => {
    applyAppearance(root, { preset: "padrao", mode: "dark", primary: "221 83% 53%" });
    expect(root.style.getPropertyValue("--primary")).toBe("221 83% 53%");
    expect(root.style.getPropertyValue("--accent")).toBe("221 83% 53%");
  });

  it("versão desconhecida cai na Padrão", () => {
    expect(findThemePreset("nao-existe").id).toBe("padrao");
  });

  it("o index.html reaplica a aparência guardada antes de o app carregar (sem piscar)", () => {
    applyAppearance(root, { preset: "obsidiana", mode: "light" });
    const cached = localStorage.getItem(APPEARANCE_CACHE_KEY)!;
    applyAppearance(root, { preset: "padrao", mode: "dark" });
    localStorage.setItem(APPEARANCE_CACHE_KEY, cached);

    // A plain file, loaded before anything else, so the admin CSP needs no inline script.
    expect(readFileSync("index.html", "utf8")).toMatch(/<head>[\s\S]*?<script src="\/appearance-boot\.js"><\/script>[\s\S]*?<title>/);
    const boot = readFileSync("public/appearance-boot.js", "utf8");
    new Function(boot)();

    expect(root).toHaveClass("light");
    expect(root.style.getPropertyValue("--background")).toBe(findThemePreset("obsidiana").tokens.light.background);
    expect(root.style.getPropertyValue("--font-display")).toContain("Fraunces");
    expect(document.head.querySelector("link[data-theme-font]")).toHaveAttribute("href", expect.stringContaining("Fraunces"));
  });
});

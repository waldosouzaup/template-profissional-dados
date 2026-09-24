import { useEffect, useState } from "react";
import { Check, Loader2, Moon, Palette, Sun } from "lucide-react";
import { useProfiles } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { DEFAULT_THEME_PRESET, THEME_PRESETS, ensureFontLink, findThemePreset, type ThemeMode, type ThemePreset } from "@/lib/themes";

// Fixed accents that can replace a version's own color.
const ACCENT_COLORS = [
  { name: "Verde", value: "142 71% 45%" },
  { name: "Azul", value: "221 83% 53%" },
  { name: "Roxo", value: "262 83% 58%" },
  { name: "Laranja", value: "24 98% 50%" },
  { name: "Rosa", value: "346 87% 43%" },
  { name: "Amarelo", value: "45 93% 47%" },
];

const MODES: { value: ThemeMode; label: string; icon: typeof Moon }[] = [
  { value: "dark", label: "Escuro", icon: Moon },
  { value: "light", label: "Claro", icon: Sun },
];

// A miniature of the site in the version's own colors and heading typeface.
const VersionPreview = ({ preset, mode, accent }: { preset: ThemePreset; mode: ThemeMode; accent: string }) => {
  const t = preset.tokens[mode];
  const color = (name: keyof typeof t) => `hsl(${t[name]})`;
  return (
    <div
      data-theme-preview
      aria-hidden="true"
      className="rounded-lg border p-3"
      style={{ background: color("background"), borderColor: color("border"), color: color("foreground"), fontFamily: preset.font.stack }}
    >
      <div className="rounded-md border p-3" style={{ background: color("card"), borderColor: color("border") }}>
        <p className="text-xl font-light leading-tight">Estude comigo</p>
        <div className="mt-2.5 space-y-1.5">
          <div className="h-1.5 w-11/12 rounded-full" style={{ background: color("muted-foreground"), opacity: 0.45 }} />
          <div className="h-1.5 w-2/3 rounded-full" style={{ background: color("muted-foreground"), opacity: 0.45 }} />
        </div>
        <span
          className="mt-3 inline-block rounded-full px-2.5 py-1 font-sans text-[10px] font-semibold"
          style={{ background: `hsl(${accent})`, color: color("primary-foreground") }}
        >
          Ver trilha
        </span>
      </div>
    </div>
  );
};

export default function AppearanceSettings() {
  const { data: profiles = [], updateProfile, isUpdating } = useProfiles();
  const profile = profiles[0];

  const [preset, setPreset] = useState(DEFAULT_THEME_PRESET);
  const [mode, setMode] = useState<ThemeMode>("dark");
  // "" = the version's own accent.
  const [color, setColor] = useState("");

  useEffect(() => {
    if (!profile) return;
    setPreset(findThemePreset(profile.theme_preset).id);
    setMode(profile.theme === "light" ? "light" : "dark");
    setColor(profile.primary_color ?? "");
  }, [profile]);

  // Every version's heading font, so the previews can be compared side by side.
  useEffect(() => {
    THEME_PRESETS.forEach(({ font }) => font.url && ensureFontLink(font.url, "preview"));
  }, []);

  if (!profile) return null;

  const current = findThemePreset(preset);
  const accent = color || current.tokens[mode].primary;

  const choosePreset = (id: string) => {
    setPreset(id);
    // A new version starts with its own accent; a fixed color can be picked again below.
    setColor("");
  };

  const handleSave = () => updateProfile({ ...profile, theme_preset: preset, theme: mode, primary_color: color });

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          Aparência do Portfólio
        </CardTitle>
        <CardDescription>Escolha a versão visual do site, o modo claro ou escuro e a cor de destaque.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-3">
          <Label id="appearance-version" className="text-base font-semibold">Versão</Label>
          <p className="text-sm text-muted-foreground">Cada versão tem paleta e fonte de títulos próprias, nos modos escuro e claro.</p>
          <div role="radiogroup" aria-labelledby="appearance-version" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {THEME_PRESETS.map((option) => {
              const checked = option.id === preset;
              return (
                <label key={option.id} className="cursor-pointer">
                  <input
                    type="radio"
                    name="theme-preset"
                    value={option.id}
                    checked={checked}
                    onChange={() => choosePreset(option.id)}
                    className="peer sr-only"
                  />
                  <div className="h-full rounded-xl border-2 border-border p-2 transition-colors hover:border-primary/50 peer-checked:border-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background">
                    <VersionPreview preset={option} mode={mode} accent={checked ? accent : option.tokens[mode].primary} />
                    <div className="px-1 pb-1 pt-3">
                      <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                        {option.name}
                        {checked && <Check className="h-4 w-4 text-primary" aria-hidden="true" />}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {option.description} Títulos em {option.font.family}.
                      </p>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <Label id="appearance-mode" className="text-base font-semibold">Modo</Label>
          <div role="radiogroup" aria-labelledby="appearance-mode" className="flex gap-3">
            {MODES.map(({ value, label, icon: Icon }) => (
              <label key={value} className="cursor-pointer">
                <input
                  type="radio"
                  name="theme-mode"
                  value={value}
                  checked={mode === value}
                  onChange={() => setMode(value)}
                  aria-label={label}
                  className="peer sr-only"
                />
                <span className="flex items-center gap-2 rounded-xl border-2 border-border px-5 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-primary">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold">Cor de destaque</Label>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setColor("")}
              aria-pressed={color === ""}
              aria-label="Cor do tema"
              className={`flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3 text-sm transition-colors ${
                color === "" ? "border-foreground text-foreground" : "border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              <span className="h-7 w-7 rounded-full ring-1 ring-border" style={{ background: `hsl(${current.tokens[mode].primary})` }} />
              Cor do tema
            </button>
            {ACCENT_COLORS.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setColor(c.value)}
                aria-pressed={color === c.value}
                aria-label={c.name}
                title={c.name}
                className={`h-10 w-10 rounded-full transition-transform ${
                  color === c.value ? "scale-110 ring-2 ring-foreground ring-offset-2 ring-offset-background" : "ring-1 ring-border hover:scale-110"
                }`}
                style={{ background: `hsl(${c.value})` }}
              />
            ))}
          </div>
        </div>

        <Button onClick={handleSave} disabled={isUpdating} className="w-full sm:w-auto">
          {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Salvar aparência
        </Button>
      </CardContent>
    </Card>
  );
}

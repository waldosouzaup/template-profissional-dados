import { useState } from "react";
import { useExperiences } from "@/hooks/useExperiences";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DEFAULT_EXPERIENCE_ICON, EXPERIENCE_ICONS, findExperienceIcon, suggestExperienceIcon } from "@/lib/experience-icons";
import type { Experience } from "@/types/database";

const TYPES: { value: Experience["type"]; label: string }[] = [
  { value: "profissional", label: "Profissional" },
  { value: "embaixador", label: "Embaixador" },
  { value: "projeto", label: "Projeto" },
  { value: "outros", label: "Outros" },
];

const selectClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm";

// Visual grid of role icons; native radios keep arrow-key navigation and screen reader semantics.
const IconPicker = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
  <div role="radiogroup" aria-labelledby="experience-icon-label" className="grid grid-cols-3 gap-2 sm:grid-cols-4">
    {EXPERIENCE_ICONS.map(({ value: option, label, icon: Icon }) => (
      <label key={option} className="cursor-pointer">
        <input
          type="radio"
          name="experience-icon"
          value={option}
          checked={value === option}
          onChange={() => onChange(option)}
          aria-label={label}
          className="peer sr-only"
        />
        <span className="flex h-full flex-col items-center gap-1.5 rounded-lg border border-border px-1.5 py-2.5 text-center text-[11px] leading-tight text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
          {label}
        </span>
      </label>
    ))}
  </div>
);

interface ExperienceEditorProps {
  experience?: Experience;
  onDone: () => void;
  onCancel: () => void;
}

export default function ExperienceEditor({ experience, onDone, onCancel }: ExperienceEditorProps) {
  const { createExperience, updateExperience, isCreating, isUpdating } = useExperiences();
  const [formData, setFormData] = useState({
    type: experience?.type ?? ("profissional" as Experience["type"]),
    icon_type: experience?.icon_type ?? DEFAULT_EXPERIENCE_ICON,
    title: experience?.title ?? "",
    institution: experience?.institution ?? "",
    period: experience?.period ?? "",
    description: experience?.description ?? "",
    display_order: experience?.display_order ?? 0,
  });

  // A new experience follows the job title until an icon is picked by hand; saved ones only get an offer.
  const [iconPicked, setIconPicked] = useState(!!experience);
  const suggestion = suggestExperienceIcon(formData.title);

  const set = (key: "title" | "institution" | "period" | "description") =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData((prev) => ({ ...prev, [key]: e.target.value }));

  const setTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      icon_type: iconPicked ? prev.icon_type : suggestExperienceIcon(title) ?? DEFAULT_EXPERIENCE_ICON,
    }));
  };

  const pickIcon = (icon_type: string) => {
    setIconPicked(true);
    setFormData((prev) => ({ ...prev, icon_type }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (experience) {
        await updateExperience({ ...experience, ...formData });
      } else {
        await createExperience(formData);
      }
      onDone();
    } catch (error) {
      console.error("Error saving experience:", error);
    }
  };

  const isSaving = isCreating || isUpdating;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="experience-title">Cargo</Label>
        <Input id="experience-title" value={formData.title} onChange={setTitle} placeholder="Ex: Analista de Infraestrutura" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="experience-institution">Empresa / Instituição</Label>
        <Input id="experience-institution" value={formData.institution} onChange={set("institution")} required />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_140px]">
        <div className="space-y-2">
          <Label htmlFor="experience-period">Período</Label>
          <Input id="experience-period" value={formData.period} onChange={set("period")} placeholder="Ex: 2022 - Presente" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="experience-order">Ordem</Label>
          <Input
            id="experience-order"
            type="number"
            value={formData.display_order}
            onChange={(e) => setFormData((prev) => ({ ...prev, display_order: Number(e.target.value) || 0 }))}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="experience-type">Tipo</Label>
        <select
          id="experience-type"
          value={formData.type}
          onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value as Experience["type"] }))}
          className={selectClass}
        >
          {TYPES.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        <Label id="experience-icon-label">Ícone do cargo</Label>
        <p className="text-xs text-muted-foreground">Aparece na linha do tempo de Experiências Profissionais, na página Sobre.</p>
        {suggestion && suggestion !== formData.icon_type && iconPicked && (
          <div className="flex flex-wrap items-center gap-2 rounded-md border border-primary/25 bg-primary/5 px-3 py-2 text-xs text-foreground">
            <span>
              Sugestão para este cargo: <strong className="text-primary">{findExperienceIcon(suggestion).label}</strong>
            </span>
            <Button type="button" size="sm" variant="outline" className="ml-auto h-7" onClick={() => pickIcon(suggestion)}>
              Usar sugestão
            </Button>
          </div>
        )}
        <IconPicker value={formData.icon_type} onChange={pickIcon} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="experience-description">Descrição</Label>
        <Textarea id="experience-description" value={formData.description} onChange={set("description")} rows={3} placeholder="Responsabilidades e conquistas" />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={isSaving}>{isSaving ? "Salvando..." : "Salvar"}</Button>
      </div>
    </form>
  );
}

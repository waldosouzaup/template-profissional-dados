import { useState } from "react";
import { useExperiences } from "@/hooks/useExperiences";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Experience } from "@/types/database";

const TYPES: { value: Experience["type"]; label: string }[] = [
  { value: "profissional", label: "Profissional" },
  { value: "embaixador", label: "Embaixador" },
  { value: "projeto", label: "Projeto" },
  { value: "outros", label: "Outros" },
];

const ICONS: { value: Experience["icon_type"]; label: string }[] = [
  { value: "briefcase", label: "Maleta" },
  { value: "rocket", label: "Foguete" },
  { value: "award", label: "Prêmio" },
];

const selectClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm";

interface ExperienceEditorProps {
  experience?: Experience;
  onDone: () => void;
  onCancel: () => void;
}

export default function ExperienceEditor({ experience, onDone, onCancel }: ExperienceEditorProps) {
  const { createExperience, updateExperience, isCreating, isUpdating } = useExperiences();
  const [formData, setFormData] = useState({
    type: experience?.type ?? ("profissional" as Experience["type"]),
    icon_type: experience?.icon_type ?? ("briefcase" as Experience["icon_type"]),
    title: experience?.title ?? "",
    institution: experience?.institution ?? "",
    period: experience?.period ?? "",
    description: experience?.description ?? "",
    display_order: experience?.display_order ?? 0,
  });

  const set = (key: "title" | "institution" | "period" | "description") =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData((prev) => ({ ...prev, [key]: e.target.value }));

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
        <Input id="experience-title" value={formData.title} onChange={set("title")} placeholder="Ex: Analista de Infraestrutura" required />
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          <Label htmlFor="experience-icon">Ícone</Label>
          <select
            id="experience-icon"
            value={formData.icon_type}
            onChange={(e) => setFormData((prev) => ({ ...prev, icon_type: e.target.value as Experience["icon_type"] }))}
            className={selectClass}
          >
            {ICONS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
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

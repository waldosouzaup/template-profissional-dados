import { useState } from "react";
import { useTechnologies } from "@/hooks/useTechnologies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TECHNOLOGY_CATEGORIES, getTechnologyCategory } from "@/lib/home-sections";
import type { Technology } from "@/types/database";

interface SkillFormProps {
  technology?: Technology;
  onDone: () => void;
  onCancel: () => void;
}

const splitLines = (value: string) => value.split("\n").map((line) => line.trim()).filter(Boolean);

export default function SkillForm({ technology, onDone, onCancel }: SkillFormProps) {
  const { createTechnology, updateTechnology, isCreating, isUpdating } = useTechnologies();
  const [formData, setFormData] = useState({
    title: technology?.title ?? "",
    category: getTechnologyCategory(technology?.category),
    items: (technology?.items ?? []).join("\n"),
    description: technology?.description ?? "",
    icon: technology?.icon || "Zap",
    color: technology?.color || "text-primary",
  });

  const set = (key: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Rendered in a portal inside the profile form: stop the submit from also saving the profile.
    e.stopPropagation();
    const data = { ...formData, items: splitLines(formData.items) };
    try {
      if (technology) {
        await updateTechnology({ ...technology, ...data });
      } else {
        await createTechnology(data);
      }
      onDone();
    } catch (error) {
      console.error("Error saving technology:", error);
    }
  };

  const isSaving = isCreating || isUpdating;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="skill-category">Categoria na Home</Label>
        <select
          id="skill-category"
          value={formData.category}
          onChange={(e) => setFormData((prev) => ({ ...prev, category: getTechnologyCategory(e.target.value) }))}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          {TECHNOLOGY_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="skill-title">Título</Label>
        <Input id="skill-title" value={formData.title} onChange={set("title")} placeholder="Ex: Kubernetes" required />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="skill-icon">Ícone</Label>
          <Input id="skill-icon" value={formData.icon} onChange={set("icon")} placeholder="Ex: SiDocker, Database" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="skill-color">Cor (classe CSS)</Label>
          <Input id="skill-color" value={formData.color} onChange={set("color")} placeholder="Ex: text-primary" />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Marcas: prefixo <code>Si</code> + nome (SiPython, SiDocker). Conceitos gerais: nome de um ícone Lucide (Database, Cloud).
      </p>
      <div className="space-y-2">
        <Label htmlFor="skill-description">Descrição</Label>
        <Textarea id="skill-description" value={formData.description} onChange={set("description")} rows={2} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="skill-items">Itens/Tags (um por linha)</Label>
        <Textarea id="skill-items" value={formData.items} onChange={set("items")} rows={3} placeholder={"Python\nSQL"} />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={isSaving}>{isSaving ? "Salvando..." : "Salvar"}</Button>
      </div>
    </form>
  );
}

import { useState } from "react";
import { useEducationList } from "@/hooks/useEducation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Education } from "@/types/database";

interface EducationEditorProps {
  education?: Education;
  onDone: () => void;
  onCancel: () => void;
}

export default function EducationEditor({ education, onDone, onCancel }: EducationEditorProps) {
  const { createEducation, updateEducation, isCreating, isUpdating } = useEducationList();
  const [formData, setFormData] = useState({
    title: education?.title ?? "",
    institution: education?.institution ?? "",
    period: education?.period ?? "",
    description: education?.description ?? "",
    display_order: education?.display_order ?? 0,
  });

  const set = (key: "title" | "institution" | "period" | "description") =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (education) {
        await updateEducation({ ...education, ...formData });
      } else {
        await createEducation(formData);
      }
      onDone();
    } catch (error) {
      console.error("Error saving education:", error);
    }
  };

  const isSaving = isCreating || isUpdating;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="education-title">Curso</Label>
        <Input id="education-title" value={formData.title} onChange={set("title")} placeholder="Ex: Análise e Desenvolvimento de Sistemas" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="education-institution">Instituição</Label>
        <Input id="education-institution" value={formData.institution} onChange={set("institution")} placeholder="Ex: UNIP" required />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_140px]">
        <div className="space-y-2">
          <Label htmlFor="education-period">Período</Label>
          <Input id="education-period" value={formData.period} onChange={set("period")} placeholder="Ex: 2018 - 2020" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="education-order">Ordem</Label>
          <Input
            id="education-order"
            type="number"
            value={formData.display_order}
            onChange={(e) => setFormData((prev) => ({ ...prev, display_order: Number(e.target.value) || 0 }))}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="education-description">Descrição</Label>
        <Textarea id="education-description" value={formData.description} onChange={set("description")} rows={3} />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={isSaving}>{isSaving ? "Salvando..." : "Salvar"}</Button>
      </div>
    </form>
  );
}

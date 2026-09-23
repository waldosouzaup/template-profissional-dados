import { useState } from "react";
import { useCourses } from "@/hooks/useCourses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { Course } from "@/types/database";

interface CourseEditorProps {
  course?: Course;
  defaultShowOnHome?: boolean;
  onDone: () => void;
  onCancel: () => void;
}

const splitLines = (value: string) => value.split("\n").map((line) => line.trim()).filter(Boolean);

export default function CourseEditor({ course, defaultShowOnHome = false, onDone, onCancel }: CourseEditorProps) {
  const { createCourse, updateCourse, isCreating, isUpdating } = useCourses();
  const [formData, setFormData] = useState({
    title: course?.title ?? "",
    period: course?.period ?? "",
    certificate_url: course?.certificate_url ?? "",
    show_on_home: course?.show_on_home ?? defaultShowOnHome,
    description: course?.description ?? "",
    topics: (course?.topics ?? []).join("\n"),
  });

  const set = (key: "title" | "period" | "description" | "topics") =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Rendered in a portal inside the profile form: stop the submit from also saving the profile.
    e.stopPropagation();
    const data = { ...formData, topics: splitLines(formData.topics) };
    try {
      if (course) {
        await updateCourse({ ...course, ...data });
      } else {
        await createCourse(data);
      }
      onDone();
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  const isSaving = isCreating || isUpdating;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg border border-border p-4">
        <label className="flex items-center gap-3 text-sm font-medium text-foreground">
          <input
            type="checkbox"
            checked={formData.show_on_home}
            onChange={(e) => setFormData((prev) => ({ ...prev, show_on_home: e.target.checked }))}
            className="h-4 w-4 accent-primary"
          />
          Exibir em Certificações na Home
        </label>
        <p className="mt-2 text-xs text-muted-foreground">O curso aparece na página Sobre de qualquer forma; isto só controla o destaque na Home.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_160px]">
        <div className="space-y-2">
          <Label htmlFor="course-title">Título</Label>
          <Input id="course-title" value={formData.title} onChange={set("title")} placeholder="Título do curso" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="course-period">Período</Label>
          <Input id="course-period" value={formData.period} onChange={set("period")} placeholder="Ex: 2024.1" />
        </div>
      </div>
      <ImageUpload
        label="Imagem do certificado"
        value={formData.certificate_url}
        onChange={(url) => setFormData((prev) => ({ ...prev, certificate_url: url }))}
        path="courses"
      />
      <div className="space-y-2">
        <Label htmlFor="course-description">Descrição</Label>
        <Textarea id="course-description" value={formData.description} onChange={set("description")} rows={3} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="course-topics">Tópicos (um por linha)</Label>
        <Textarea id="course-topics" value={formData.topics} onChange={set("topics")} rows={4} placeholder={"Tópico 1\nTópico 2"} />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={isSaving}>{isSaving ? "Salvando..." : "Salvar"}</Button>
      </div>
    </form>
  );
}

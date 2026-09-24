import { useState } from "react";
import { useBlogTrails } from "@/hooks/useBlogTrails";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Field } from "@/components/admin/page-sections";
import { slugify } from "@/lib/slug";
import type { BlogTrail } from "@/types/database";

interface TrailEditorProps {
  trail?: BlogTrail;
  nextOrder: number;
  onDone: () => void;
  onCancel: () => void;
}

export default function TrailEditor({ trail, nextOrder, onDone, onCancel }: TrailEditorProps) {
  const { createTrail, updateTrail, isSaving } = useBlogTrails();
  const [formData, setFormData] = useState({
    name: trail?.name ?? "",
    slug: trail?.slug ?? "",
    description: trail?.description ?? "",
    image_url: trail?.image_url ?? "",
    display_order: String(trail?.display_order ?? nextOrder),
  });

  const set = (key: "name" | "slug" | "description" | "display_order") =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData((prev) => ({ ...prev, [key]: e.target.value }));

  // An empty address follows the name; the database normalizes it the same way.
  const slug = slugify(formData.slug) || slugify(formData.name);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: formData.name.trim(),
      slug,
      description: formData.description.trim() || null,
      image_url: formData.image_url || null,
      display_order: Number(formData.display_order) || 0,
    };
    try {
      if (trail) {
        await updateTrail({ ...trail, ...data });
      } else {
        await createTrail(data);
      }
      onDone();
    } catch (error) {
      console.error("Error saving trail:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field id="trail-name" label="Nome da trilha">
        <Input id="trail-name" value={formData.name} onChange={set("name")} placeholder="Ex: Linux Essentials 30 dias" required />
      </Field>
      <Field
        id="trail-slug"
        label="Endereço"
        hint={<>waldoeller.com/blog/trilha/<span className="font-mono text-foreground">{slug || "nome-da-trilha"}</span>{trail && " · alterar muda o link da trilha"}</>}
      >
        <Input id="trail-slug" value={formData.slug} onChange={set("slug")} placeholder={slugify(formData.name) || "gerado a partir do nome"} />
      </Field>
      <Field id="trail-description" label="Descrição" hint="Aparece no card da trilha em /blog e no topo da página da trilha.">
        <Textarea id="trail-description" value={formData.description} onChange={set("description")} rows={3} />
      </Field>
      <div className="space-y-2">
        <ImageUpload
          label="Capa da trilha"
          value={formData.image_url}
          onChange={(url) => setFormData((prev) => ({ ...prev, image_url: url }))}
          path="blog/trilhas"
        />
        <p className="text-xs text-muted-foreground">Sem capa, o card usa a capa do primeiro artigo da trilha.</p>
      </div>
      <Field id="trail-order" label="Ordem em /blog" hint="Trilhas com número menor aparecem primeiro.">
        <Input id="trail-order" type="number" value={formData.display_order} onChange={set("display_order")} className="w-32" />
      </Field>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={isSaving || !formData.name.trim()}>{isSaving ? "Salvando..." : "Salvar"}</Button>
      </div>
    </form>
  );
}

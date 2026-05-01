import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCustomPages } from "@/hooks/useCustomPages";

export default function CustomPageForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const { data: pages = [], createPage, updatePage } = useCustomPages();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    markdown: "",
  });

  useEffect(() => {
    if (isEditing && pages.length > 0) {
      const pageToEdit = pages.find((p) => p.id === id);
      if (pageToEdit) {
        setFormData({
          title: pageToEdit.title || "",
          slug: pageToEdit.slug || "",
          markdown: pageToEdit.markdown || "",
        });
      }
    }
  }, [id, pages, isEditing]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    if (!isEditing || formData.slug === "") {
      setFormData({ ...formData, title, slug: generateSlug(title) });
    } else {
      setFormData({ ...formData, title });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (isEditing && id) {
        await updatePage.mutateAsync({ id, ...formData });
      } else {
        await createPage.mutateAsync(formData);
      }
      navigate("/admin/custom-pages");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          {isEditing ? "Editar Página" : "Nova Página"}
        </h1>
        <Button variant="outline" onClick={() => navigate("/admin/custom-pages")}>
          Cancelar
        </Button>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Conteúdo da Página</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Título</label>
                <Input
                  required
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="Ex: Minha Mentoria"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Slug (URL)</label>
                <Input
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="ex: minha-mentoria"
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  A página ficará acessível em: /p/{formData.slug}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Conteúdo (Markdown)</label>
              <Textarea
                required
                value={formData.markdown}
                onChange={(e) => setFormData({ ...formData, markdown: e.target.value })}
                placeholder="# Título Principal\nEscreva o conteúdo da sua página em markdown aqui..."
                className="mt-1 font-mono min-h-[400px] text-sm"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Salvando..." : "Salvar Página"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useContent, useContents } from "@/hooks/useContents";
import { useBlogTrails } from "@/hooks/useBlogTrails";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { slugify } from "@/lib/slug";

export default function ContentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const { data: content, isLoading } = useContent(id);
  const { data: allContents = [], createContent, updateContent, isCreating, isUpdating } = useContents();
  const { data: trails = [] } = useBlogTrails();
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    markdown: "",
    trail_id: "",
    trail_position: "",
    image_url: "",
    drive_folder_url: "",
  });

  // Next free step of a trail, ignoring this post itself.
  const nextPosition = (trailId: string) =>
    Math.max(0, ...allContents.filter((post) => post.trail_id === trailId && post.id !== content?.id).map((post) => post.trail_position ?? 0)) + 1;

  const handleTrailChange = (trailId: string) => {
    const position = !trailId
      ? ""
      : trailId === content?.trail_id && content?.trail_position
        ? String(content.trail_position)
        : String(nextPosition(trailId));
    setFormData((prev) => ({ ...prev, trail_id: trailId, trail_position: position }));
  };

  useEffect(() => {
    if (content) {
      setFormData({
        title: content.title || "",
        slug: content.slug || "",
        description: content.description || "",
        markdown: content.markdown || "",
        trail_id: content.trail_id || "",
        trail_position: content.trail_position ? String(content.trail_position) : "",
        image_url: content.image_url || "",
        drive_folder_url: content.drive_folder_url || "",
      });
    }
  }, [content]);

  const handleTitleChange = (title: string) => {
    const newSlug = !isEditing ? slugify(title) : formData.slug;
    setFormData({ ...formData, title, slug: newSlug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure slug is not empty
    const finalSlug = formData.slug || slugify(formData.title);
    const trailId = formData.trail_id || null;
    const data = {
      ...formData,
      slug: finalSlug,
      trail_id: trailId,
      trail_position: trailId ? Number(formData.trail_position) || nextPosition(trailId) : null,
    };
    
    try {
      if (isEditing && content) {
        await updateContent({ ...content, ...data });
      } else {
        await createContent(data);
      }
      navigate("/admin/contents");
    } catch (error) {
      console.error("Error saving content:", error);
    }
  };

  if (isEditing && isLoading) {
    return <div className="text-muted-foreground animate-pulse">Carregando...</div>;
  }

  return (
    <div className="max-w-2xl animate-fade-up">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/admin/contents")}>
          ← Voltar
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Editar Conteúdo / Blog" : "Novo Conteúdo / Blog"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Título</label>
              <Input
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Título do post"
                required
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Slug (URL)</label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="exemplo-de-slug"
                required
                className="mt-1"
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                A URL será: waldoeller.com/blog/{formData.slug || "titulo-do-post"}
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_170px]">
              <div>
                <label htmlFor="content-trail" className="text-sm font-medium text-foreground">Trilha de estudo</label>
                <select
                  id="content-trail"
                  value={formData.trail_id}
                  onChange={(e) => handleTrailChange(e.target.value)}
                  className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Sem trilha (aparece em Outros artigos)</option>
                  {trails.map((trail) => (
                    <option key={trail.id} value={trail.id}>{trail.name}</option>
                  ))}
                </select>
                <p className="text-[10px] text-muted-foreground mt-1">
                  As trilhas são criadas e editadas em Conteúdos → Trilhas de estudo.
                </p>
              </div>
              <div>
                <label htmlFor="content-trail-position" className="text-sm font-medium text-foreground">Posição na trilha</label>
                <Input
                  id="content-trail-position"
                  type="number"
                  min={1}
                  value={formData.trail_position}
                  onChange={(e) => setFormData({ ...formData, trail_position: e.target.value })}
                  disabled={!formData.trail_id}
                  className="mt-1"
                />
                <p className="text-[10px] text-muted-foreground mt-1">Ordem de estudo: 1 é o primeiro artigo.</p>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground">Resumo (Thumbnail)</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição curta que aparece na listagem do blog"
                className="mt-1"
                rows={2}
              />
            </div>

            <div>
              <ImageUpload
                label="Imagem de Capa do Post"
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                path="blog"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground">Link do Google Drive (Arquivos)</label>
              <Input
                value={formData.drive_folder_url}
                onChange={(e) => setFormData({ ...formData, drive_folder_url: e.target.value })}
                placeholder="https://drive.google.com/drive/folders/..."
                className="mt-1"
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                Link da pasta do Google Drive com os arquivos deste post.
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground">Conteúdo Completo (Markdown)</label>
              <Textarea
                value={formData.markdown}
                onChange={(e) => setFormData({ ...formData, markdown: e.target.value })}
                placeholder="Escreva seu post aqui usando Markdown..."
                className="mt-1"
                rows={12}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Suporta formatação Markdown padrão.
              </p>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isCreating || isUpdating ? "Salvando..." : "Salvar Conteúdo"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/admin/contents")}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
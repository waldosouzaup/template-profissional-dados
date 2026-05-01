import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useContent, useContents } from "@/hooks/useContents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/ImageUpload";

export default function ContentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const { data: content, isLoading } = useContent(id);
  const { createContent, updateContent, isCreating, isUpdating } = useContents();
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    markdown: "",
    category: "",
    image_url: "",
    drive_folder_url: "",
  });

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim();
  };

  useEffect(() => {
    if (content) {
      setFormData({
        title: content.title || "",
        slug: content.slug || "",
        description: content.description || "",
        markdown: content.markdown || "",
        category: content.category || "",
        image_url: content.image_url || "",
        drive_folder_url: content.drive_folder_url || "",
      });
    }
  }, [content]);

  const handleTitleChange = (title: string) => {
    const newSlug = !isEditing ? generateSlug(title) : formData.slug;
    setFormData({ ...formData, title, slug: newSlug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure slug is not empty
    const finalSlug = formData.slug || generateSlug(formData.title);
    
    try {
      if (isEditing && content) {
        await updateContent({ ...content, ...formData, slug: finalSlug });
      } else {
        await createContent({ ...formData, slug: finalSlug });
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
            
            <div>
              <label className="text-sm font-medium text-foreground">Categoria</label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Ex: Certificação Linux, Docker, Carreira"
                className="mt-1"
              />
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
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useContent, useContents } from "@/hooks/useContents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const { data: content, isLoading } = useContent(id);
  const { createContent, updateContent, isCreating, isUpdating } = useContents();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    markdown: "",
    image_url: "",
  });

  useEffect(() => {
    if (content) {
      setFormData({
        title: content.title || "",
        description: content.description || "",
        markdown: content.markdown || "",
        image_url: content.image_url || "",
      });
    }
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && content) {
        await updateContent({ ...content, ...formData });
      } else {
        await createContent(formData);
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
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Título do post"
                required
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
              <label className="text-sm font-medium text-foreground">URL da Imagem de Capa</label>
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://exemplo.com/imagem.png"
                className="mt-1"
              />
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
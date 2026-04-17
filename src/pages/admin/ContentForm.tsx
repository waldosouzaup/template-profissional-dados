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
  });

  useEffect(() => {
    if (content) {
      setFormData({
        title: content.title || "",
        description: content.description || "",
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
          <CardTitle>{isEditing ? "Editar Conteúdo" : "Novo Conteúdo"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Título</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Título do conteúdo"
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground">Descrição</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição do conteúdo"
                className="mt-1"
                rows={3}
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isCreating || isUpdating ? "Salvando..." : "Salvar"}
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
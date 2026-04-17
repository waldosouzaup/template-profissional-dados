import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useExperience, useExperiences } from "@/hooks/useExperiences";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ExperienceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const { data: experience, isLoading } = useExperience(id);
  const { createExperience, updateExperience, isCreating, isUpdating } = useExperiences();
  
  const [formData, setFormData] = useState({
    type: "Curso" as string,
    title: "",
    institution: "",
    description: "",
    date_completed: "",
    display_order: 0,
  });

  useEffect(() => {
    if (experience) {
      setFormData({
        type: experience.type || "Curso",
        title: experience.title || "",
        institution: experience.institution || "",
        description: experience.description || "",
        date_completed: experience.date_completed || "",
        display_order: experience.display_order || 0,
      });
    }
  }, [experience]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = {
        type: formData.type as "Curso" | "Certificação" | "Acadêmico" | "Estudo",
        title: formData.title,
        institution: formData.institution,
        description: formData.description || null,
        date_completed: formData.date_completed || null,
        display_order: formData.display_order,
      };
      
      if (isEditing && experience) {
        await updateExperience({ ...experience, ...data });
      } else {
        await createExperience(data);
      }
      navigate("/admin/experiences");
    } catch (error) {
      console.error("Error saving experience:", error);
    }
  };

  if (isEditing && isLoading) {
    return <div className="text-muted-foreground animate-pulse">Carregando...</div>;
  }

  return (
    <div className="max-w-2xl animate-fade-up">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/admin/experiences")}>
          ← Voltar
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Editar Experiência" : "Nova Experiência"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Tipo</label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Curso">Curso</SelectItem>
                  <SelectItem value="Certificação">Certificação</SelectItem>
                  <SelectItem value="Acadêmico">Acadêmico</SelectItem>
                  <SelectItem value="Estudo">Estudo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground">Título</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Título da experiência"
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground">Instituição</label>
              <Input
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                placeholder="Instituição"
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground">Data de Conclusão</label>
              <Input
                type="date"
                value={formData.date_completed}
                onChange={(e) => setFormData({ ...formData, date_completed: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground">Ordem de Exibição</label>
              <Input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground">Descrição</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição da experiência"
                className="mt-1"
                rows={3}
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isCreating || isUpdating ? "Salvando..." : "Salvar"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/admin/experiences")}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
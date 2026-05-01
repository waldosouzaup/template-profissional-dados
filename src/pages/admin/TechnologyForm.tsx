import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTechnology, useTechnologies } from "@/hooks/useTechnologies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TechnologyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const { data: technology, isLoading } = useTechnology(id);
  const { createTechnology, updateTechnology, isCreating, isUpdating } = useTechnologies();
  
  const [formData, setFormData] = useState({
    title: "",
    items: "",
    description: "",
    icon: "Zap",
    color: "text-primary",
  });

  useEffect(() => {
    if (technology) {
      setFormData({
        title: technology.title || "",
        items: (technology.items || []).join("\n"),
        description: technology.description || "",
        icon: technology.icon || "Zap",
        color: technology.color || "text-primary",
      });
    }
  }, [technology]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const itemsArray = formData.items
      .split("\n")
      .map(t => t.trim())
      .filter(t => t.length > 0);
    
    try {
      const data = {
        title: formData.title,
        items: itemsArray,
        description: formData.description,
        icon: formData.icon,
        color: formData.color,
      };
      
      if (isEditing && technology) {
        await updateTechnology({ ...technology, ...data });
      } else {
        await createTechnology(data);
      }
      navigate("/admin/technologies");
    } catch (error) {
      console.error("Error saving technology:", error);
    }
  };

  if (isEditing && isLoading) {
    return <div className="text-muted-foreground animate-pulse">Carregando...</div>;
  }

  return (
    <div className="max-w-2xl animate-fade-up">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/admin/technologies")}>
          ← Voltar
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Editar Tecnologia" : "Nova Tecnologia"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Título</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Linguagens"
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground">Descrição (Para Skills)</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ex: Criação de Agentes IA e Automações"
                className="mt-1"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Ícone (Nome Lucide)</label>
                <Input
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="Ex: Zap, SiPython, SiDocker, Database"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Cor (Classe CSS)</label>
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="Ex: text-orange-400, text-primary"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground">Itens/Tags (um por linha)</label>
              <Textarea
                value={formData.items}
                onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                placeholder="Python&#10;JavaScript&#10;TypeScript"
                className="mt-1"
                rows={4}
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isCreating || isUpdating ? "Salvando..." : "Salvar"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/admin/technologies")}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useJourneyItem, useJourneyList } from "@/hooks/useJourney";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function JourneyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const { data: journeyItem, isLoading } = useJourneyItem(id);
  const { createJourneyItem, updateJourneyItem, isCreating, isUpdating } = useJourneyList();
  
  const [formData, setFormData] = useState({
    year: "",
    title: "",
    description: "",
    order_index: 0,
  });

  useEffect(() => {
    if (journeyItem) {
      setFormData({
        year: journeyItem.year || "",
        title: journeyItem.title || "",
        description: journeyItem.description || "",
        order_index: journeyItem.order_index || 0,
      });
    }
  }, [journeyItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = {
        year: formData.year,
        title: formData.title,
        description: formData.description || null,
        order_index: formData.order_index,
      };
      
      if (isEditing && journeyItem) {
        await updateJourneyItem({ ...journeyItem, ...data });
      } else {
        await createJourneyItem(data);
      }
      navigate("/admin/journey");
    } catch (error) {
      console.error("Error saving journey item:", error);
    }
  };

  if (isEditing && isLoading) {
    return <div className="text-muted-foreground animate-pulse">Carregando...</div>;
  }

  return (
    <div className="max-w-2xl animate-fade-up">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/admin/journey")}>
          ← Voltar
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Editar Item da Jornada" : "Novo Item da Jornada"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Ano / Período</label>
              <Input
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="Ex: 2024"
                required
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Título</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Transição para Engenharia de Dados"
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground">Ordem de Exibição</label>
              <Input
                type="number"
                value={formData.order_index}
                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground">Descrição</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Breve descrição do marco..."
                className="mt-1"
                rows={4}
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isCreating || isUpdating ? "Salvando..." : "Salvar"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/admin/journey")}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

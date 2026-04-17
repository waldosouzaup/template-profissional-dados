import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCourse, useCourses } from "@/hooks/useCourses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/ImageUpload";

export default function CourseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const { data: course, isLoading } = useCourse(id);
  const { createCourse, updateCourse, isCreating, isUpdating } = useCourses();
  
  const [formData, setFormData] = useState({
    title: "",
    period: "",
    certificate_url: "",
    description: "",
    topics: "",
  });

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || "",
        period: course.period || "",
        certificate_url: course.certificate_url || "",
        description: course.description || "",
        topics: (course.topics || []).join("\n"),
      });
    }
  }, [course]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const topicsArray = formData.topics
      .split("\n")
      .map(t => t.trim())
      .filter(t => t.length > 0);
    
    try {
      const data = {
        title: formData.title,
        period: formData.period,
        certificate_url: formData.certificate_url,
        description: formData.description,
        topics: topicsArray,
      };
      
      if (isEditing && course) {
        await updateCourse({ ...course, ...data });
      } else {
        await createCourse(data);
      }
      navigate("/admin/courses");
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  if (isEditing && isLoading) {
    return <div className="text-muted-foreground animate-pulse">Carregando...</div>;
  }

  return (
    <div className="max-w-2xl animate-fade-up">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/admin/courses")}>
          ← Voltar
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Editar Curso" : "Novo Curso"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Título</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Título do curso"
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground">Período</label>
              <Input
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                placeholder="Ex: 2024.1"
                className="mt-1"
              />
            </div>
            
            <div>
              <ImageUpload
                label="Imagem do Certificado"
                value={formData.certificate_url}
                onChange={(url) => setFormData({ ...formData, certificate_url: url })}
                path="courses"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground">Descrição</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição do curso"
                className="mt-1"
                rows={3}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground">Tópicos (um por linha)</label>
              <Textarea
                value={formData.topics}
                onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
                placeholder="Tópico 1&#10;Tópico 2&#10;Tópico 3"
                className="mt-1"
                rows={5}
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isCreating || isUpdating ? "Salvando..." : "Salvar"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/admin/courses")}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
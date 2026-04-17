import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBook, useBooks } from "@/hooks/useBooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/ImageUpload";

export default function BookForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const { data: book, isLoading } = useBook(id);
  const { createBook, updateBook, isCreating, isUpdating } = useBooks();
  
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    image_url: "",
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || "",
        author: book.author || "",
        description: book.description || "",
        image_url: book.image_url || "",
      });
    }
  }, [book]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && book) {
        await updateBook({ ...book, ...formData });
      } else {
        await createBook(formData);
      }
      navigate("/admin/books");
    } catch (error) {
      console.error("Error saving book:", error);
    }
  };

  if (isEditing && isLoading) {
    return <div className="text-muted-foreground animate-pulse">Carregando...</div>;
  }

  return (
    <div className="max-w-2xl animate-fade-up">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/admin/books")}>
          ← Voltar
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Editar Livro" : "Novo Livro"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Título</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Título do livro"
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground">Autor</label>
              <Input
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Autor do livro"
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground">Descrição</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição do livro"
                className="mt-1"
                rows={3}
              />
            </div>
            
            <div>
              <ImageUpload
                label="Capa do Livro"
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                path="books"
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isCreating || isUpdating ? "Salvando..." : "Salvar"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/admin/books")}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
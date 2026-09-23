import { useState } from "react";
import { useBooks } from "@/hooks/useBooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { Book } from "@/types/database";

interface BookEditorProps {
  book?: Book;
  onDone: () => void;
  onCancel: () => void;
}

export default function BookEditor({ book, onDone, onCancel }: BookEditorProps) {
  const { createBook, updateBook, isCreating, isUpdating } = useBooks();
  const [formData, setFormData] = useState({
    title: book?.title ?? "",
    author: book?.author ?? "",
    description: book?.description ?? "",
    image_url: book?.image_url ?? "",
  });

  const set = (key: "title" | "author" | "description") =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (book) {
        await updateBook({ ...book, ...formData });
      } else {
        await createBook(formData);
      }
      onDone();
    } catch (error) {
      console.error("Error saving book:", error);
    }
  };

  const isSaving = isCreating || isUpdating;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="book-title">Título</Label>
          <Input id="book-title" value={formData.title} onChange={set("title")} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="book-author">Autor</Label>
          <Input id="book-author" value={formData.author} onChange={set("author")} />
        </div>
      </div>
      <ImageUpload
        label="Capa do livro"
        value={formData.image_url}
        onChange={(url) => setFormData((prev) => ({ ...prev, image_url: url }))}
        path="books"
      />
      <div className="space-y-2">
        <Label htmlFor="book-description">Descrição</Label>
        <Textarea id="book-description" value={formData.description} onChange={set("description")} rows={3} placeholder="Por que este livro é importante para você" />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={isSaving}>{isSaving ? "Salvando..." : "Salvar"}</Button>
      </div>
    </form>
  );
}

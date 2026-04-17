import { Link } from "react-router-dom";
import { useBooks } from "@/hooks/useBooks";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BooksDashboard() {
  const { data: books = [], isLoading, deleteBook } = useBooks();

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja apagar este livro? Esta ação é irreversível.")) {
      await deleteBook(id);
    }
  };

  if (isLoading) {
    return <div className="text-muted-foreground animate-pulse">Carregando dados...</div>;
  }

  return (
    <div className="animate-fade-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Livros</h1>
          <p className="text-muted-foreground mt-1">Gerencie seus livros.</p>
        </div>
        <Link to="/admin/books/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Livro
          </Button>
        </Link>
      </div>

      <div className="bg-secondary/30 rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary text-muted-foreground text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Livro</th>
                <th className="px-6 py-4 font-medium">Autor</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {books.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                    Nenhum livro encontrado.
                  </td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr key={book.id} className="hover:bg-secondary/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {book.image_url && (
                          <img 
                            src={book.image_url} 
                            alt={book.title}
                            className="w-12 h-12 rounded object-cover" 
                          />
                        )}
                        <div>
                          <div className="font-medium text-foreground">{book.title}</div>
                          <div className="text-muted-foreground text-xs mt-1">
                            {book.id.substring(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground">
                      {book.author || "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/books/${book.id}`}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(book.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
import { Link } from "react-router-dom";
import { useContents } from "@/hooks/useContents";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContentsDashboard() {
  const { data: contents = [], isLoading, deleteContent } = useContents();

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja apagar este conteúdo? Esta ação é irreversível.")) {
      await deleteContent(id);
    }
  };

  if (isLoading) {
    return <div className="text-muted-foreground animate-pulse">Carregando dados...</div>;
  }

  return (
    <div className="animate-fade-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Conteúdos</h1>
          <p className="text-muted-foreground mt-1">Gerencie seus conteúdos.</p>
        </div>
        <Link to="/admin/contents/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Conteúdo
          </Button>
        </Link>
      </div>

      <div className="bg-secondary/30 rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary text-muted-foreground text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Título</th>
                <th className="px-6 py-4 font-medium">Descrição</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {contents.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                    Nenhum conteúdo encontrado.
                  </td>
                </tr>
              ) : (
                contents.map((content) => (
                  <tr key={content.id} className="hover:bg-secondary/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{content.title}</td>
                    <td className="px-6 py-4 text-muted-foreground max-w-md truncate">
                      {content.description || "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/contents/${content.id}`}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(content.id)}
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
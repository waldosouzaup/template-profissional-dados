import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, FileText, Loader2 } from "lucide-react";
import { useCustomPages } from "@/hooks/useCustomPages";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function CustomPagesDashboard() {
  const { data: pages = [], isLoading, deletePage } = useCustomPages();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta página?")) {
      setDeletingId(id);
      await deletePage.mutateAsync(id);
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Páginas Customizadas</h1>
        <Link to="/admin/custom-pages/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nova Página
          </Button>
        </Link>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Suas Páginas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : pages.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground border-2 border-dashed border-border rounded-lg">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma página cadastrada.</p>
              <p className="text-sm">Crie sua primeira página clicando em "Nova Página".</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-secondary/50">
                  <tr>
                    <th className="px-6 py-3 rounded-tl-lg">Título</th>
                    <th className="px-6 py-3">Slug (URL)</th>
                    <th className="px-6 py-3">Data</th>
                    <th className="px-6 py-3 rounded-tr-lg text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pages.map((page) => (
                    <tr key={page.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">
                        {page.title}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">
                        /p/{page.slug}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {page.created_at ? format(new Date(page.created_at), "dd MMM, yyyy", { locale: ptBR }) : '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link to={`/admin/custom-pages/${page.id}`}>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => page.id && handleDelete(page.id)}
                            disabled={deletingId === page.id}
                          >
                            {deletingId === page.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

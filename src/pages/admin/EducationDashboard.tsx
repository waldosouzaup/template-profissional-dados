import { Link } from "react-router-dom";
import { useEducationList } from "@/hooks/useEducation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EducationDashboard() {
  const { data: educationItems = [], isLoading, deleteEducation } = useEducationList();

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja apagar esta formação? Esta ação é irreversível.")) {
      await deleteEducation(id);
    }
  };

  if (isLoading) {
    return <div className="text-muted-foreground animate-pulse">Carregando dados...</div>;
  }

  return (
    <div className="animate-fade-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Formação</h1>
          <p className="text-muted-foreground mt-1">Gerencie sua formação acadêmica.</p>
        </div>
        <Link to="/admin/education/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nova Formação
          </Button>
        </Link>
      </div>

      <div className="bg-secondary/30 rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary text-muted-foreground text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Título</th>
                <th className="px-6 py-4 font-medium">Instituição</th>
                <th className="px-6 py-4 font-medium">Período</th>
                <th className="px-6 py-4 font-medium">Ordem</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {educationItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    Nenhuma formação encontrada.
                  </td>
                </tr>
              ) : (
                educationItems.map((edu) => (
                  <tr key={edu.id} className="hover:bg-secondary/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{edu.title}</td>
                    <td className="px-6 py-4 text-foreground">{edu.institution}</td>
                    <td className="px-6 py-4">
                      <span className="badge-time">{edu.period}</span>
                    </td>
                    <td className="px-6 py-4 text-foreground font-mono">
                      {edu.display_order ?? 0}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/education/${edu.id}`}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(edu.id)}
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

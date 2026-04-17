import { Link } from "react-router-dom";
import { useTechnologies } from "@/hooks/useTechnologies";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TechnologiesDashboard() {
  const { data: technologies = [], isLoading, deleteTechnology } = useTechnologies();

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja apagar esta tecnologia? Esta ação é irreversível.")) {
      await deleteTechnology(id);
    }
  };

  if (isLoading) {
    return <div className="text-muted-foreground animate-pulse">Carregando dados...</div>;
  }

  return (
    <div className="animate-fade-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tecnologias</h1>
          <p className="text-muted-foreground mt-1">Gerencie suas tecnologias.</p>
        </div>
        <Link to="/admin/technologies/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nova Tecnologia
          </Button>
        </Link>
      </div>

      <div className="bg-secondary/30 rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary text-muted-foreground text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Título</th>
                <th className="px-6 py-4 font-medium">Ícone</th>
                <th className="px-6 py-4 font-medium">Descrição</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {technologies.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    Nenhuma tecnologia encontrada.
                  </td>
                </tr>
              ) : (
                technologies.map((tech) => (
                  <tr key={tech.id} className="hover:bg-secondary/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{tech.title}</td>
                    <td className="px-6 py-4">
                      <span className={`${tech.color || 'text-primary'}`}>
                        {tech.icon || 'Zap'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs max-w-xs truncate">
                      {tech.description || "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/technologies/${tech.id}`}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(tech.id)}
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
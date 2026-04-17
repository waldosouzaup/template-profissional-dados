import { Link } from "react-router-dom";
import { useProjects } from "@/hooks/useProjects";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const { data: projects = [], isLoading, deleteProject } = useProjects();

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja apagar este projeto? Esta ação é irreversível.")) {
      await deleteProject(id);
    }
  };

  if (isLoading) {
    return <div className="text-muted-foreground animate-pulse">Carregando dados...</div>;
  }

  return (
    <div className="animate-fade-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projetos</h1>
          <p className="text-muted-foreground mt-1">Gerencie seu portfólio.</p>
        </div>
        <Link to="/admin/projects/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Projeto
          </Button>
        </Link>
      </div>

      <div className="bg-secondary/30 rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary text-muted-foreground text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Projeto</th>
                <th className="px-6 py-4 font-medium">Ordem</th>
                <th className="px-6 py-4 font-medium">Categoria</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    Nenhum projeto encontrado.
                  </td>
                </tr>
              ) : (
                projects.map((project: any) => (
                  <tr key={project.id} className="hover:bg-secondary/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={project.coverImage} 
                          alt={project.title}
                          className="w-12 h-12 rounded object-cover" 
                        />
                        <div>
                          <div className="font-medium text-foreground">{project.title}</div>
                          <div className="text-muted-foreground text-xs mt-1">
                            {project.id.substring(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-foreground font-mono">
                        {project.displayOrder ?? "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="badge-time">
                        {project.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {project.featured ? (
                        <span className="text-green-500">Sim</span>
                      ) : (
                        <span className="text-muted-foreground">Não</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a 
                          href={`/projects/${project.id}`} 
                          target="_blank" 
                          rel="noreferrer"
                          title="Visualizar na vitrine"
                        >
                          <Button variant="ghost" size="icon">
                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </a>
                        <Link to={`/admin/projects/${project.id}`}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(project.id)}
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

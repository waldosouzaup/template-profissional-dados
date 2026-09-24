import { useState } from "react";
import { Link } from "react-router-dom";
import { useContents } from "@/hooks/useContents";
import { useBlogTrails } from "@/hooks/useBlogTrails";
import { Layers, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import EntityManager from "@/components/admin/EntityManager";
import TrailEditor from "@/components/admin/TrailEditor";
import { SectionCard } from "@/components/admin/page-sections";
import { stepLabel, trailPath } from "@/lib/trails";
import type { BlogTrail } from "@/types/database";

export default function ContentsDashboard() {
  const { data: contents = [], isLoading, deleteContent } = useContents();
  const { data: trails = [], isLoading: loadingTrails, deleteTrail } = useBlogTrails();
  const [trailError, setTrailError] = useState<string | null>(null);

  const postCount = (trail: BlogTrail) => contents.filter((post) => post.trail_id === trail.id).length;
  const trailName = (trailId?: string | null) => trails.find((trail) => trail.id === trailId)?.name;

  const handleDeleteTrail = async (trail: BlogTrail) => {
    setTrailError(null);
    try {
      await deleteTrail(trail.id);
    } catch (err) {
      const code = (err as { code?: string }).code;
      setTrailError(
        code === "23001" || code === "23503"
          ? `“${trail.name}” tem artigos vinculados. Mova esses artigos para outra trilha antes de excluir.`
          : `Não foi possível excluir “${trail.name}”.`,
      );
    }
  };

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
          <h1 className="text-3xl font-bold text-foreground">Trilhas</h1>
          <p className="text-muted-foreground mt-1">Trilhas de estudo e seus artigos.</p>
        </div>
        <Link to="/admin/contents/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Conteúdo
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <SectionCard
          id="trilhas"
          icon={Layers}
          title="Trilhas de estudo"
          description="Cada trilha vira um card em /blog e reúne seus artigos na ordem de estudo."
        >
          {trailError && (
            <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {trailError}
            </p>
          )}
          <EntityManager<BlogTrail>
            items={trails}
            isLoading={loadingTrails}
            primary={(trail) => trail.name}
            secondary={(trail) => {
              const count = postCount(trail);
              return `${trailPath(trail)} · ${count} ${count === 1 ? "artigo" : "artigos"}`;
            }}
            leading={(trail) => (
              <span className="flex h-9 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-secondary/40">
                {trail.image_url ? <img src={trail.image_url} alt="" className="h-full w-full object-cover" /> : <Layers className="h-4 w-4 text-muted-foreground" />}
              </span>
            )}
            labels={{
              add: "Nova trilha",
              newTitle: "Nova trilha de estudo",
              editTitle: "Editar trilha de estudo",
              dialogDescription: "Nome, endereço, descrição e capa do card da trilha em /blog.",
              empty: "Nenhuma trilha ainda. Crie uma para organizar os artigos em sequência.",
              deleteTitle: "Excluir trilha?",
              deleteDescription: (trail) => `“${trail.name}” deixa de aparecer em Trilhas. Só é possível excluir trilhas sem artigos.`,
            }}
            renderEditor={(trail, close) => (
              <TrailEditor
                trail={trail}
                nextOrder={Math.max(0, ...trails.map((t) => t.display_order)) + 1}
                onDone={close}
                onCancel={close}
              />
            )}
            onDelete={handleDeleteTrail}
          />
        </SectionCard>
      </div>

      <div className="bg-secondary/30 rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary text-muted-foreground text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Título</th>
                <th className="px-6 py-4 font-medium">Slug</th>
                <th className="px-6 py-4 font-medium">Trilha</th>
                <th className="px-6 py-4 font-medium">Descrição</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {contents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    Nenhum conteúdo encontrado.
                  </td>
                </tr>
              ) : (
                contents.map((content) => (
                  <tr key={content.id} className="hover:bg-secondary/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{content.title}</td>
                    <td className="px-6 py-4 text-xs font-mono text-muted-foreground">
                      {content.slug || <span className="italic opacity-50">sem slug</span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {trailName(content.trail_id) ? (
                        <div className="flex flex-col items-start gap-1">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs whitespace-nowrap">
                            {trailName(content.trail_id)}
                          </span>
                          {content.trail_position && (
                            <span className="text-xs text-muted-foreground">{stepLabel(content.trail_position)}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Sem trilha</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">
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
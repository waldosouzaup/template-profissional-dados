import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useTechnologies } from "@/hooks/useTechnologies";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import SkillForm from "@/components/admin/SkillForm";
import { TECHNOLOGY_CATEGORIES, getTechnologyCategory } from "@/lib/home-sections";
import type { Technology } from "@/types/database";

export default function SkillsManager() {
  const { data: technologies = [], isLoading, deleteTechnology } = useTechnologies();
  const [editing, setEditing] = useState<Technology | "new" | null>(null);
  const [toDelete, setToDelete] = useState<Technology | null>(null);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">As skills são salvas na hora, ao confirmar cada janela.</p>
        <Button type="button" size="sm" onClick={() => setEditing("new")} className="gap-2">
          <Plus className="h-4 w-4" /> Adicionar skill
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando skills...</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {TECHNOLOGY_CATEGORIES.map((category) => {
            const skills = technologies.filter((tech) => getTechnologyCategory(tech.category) === category);
            return (
              <div key={category}>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {category} <span className="font-normal">({skills.length})</span>
                </h4>
                {skills.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">Nenhuma skill nesta categoria.</p>
                ) : (
                  <ul className="divide-y divide-border rounded-lg border border-border">
                    {skills.map((skill) => (
                      <li key={skill.id} className="flex items-center justify-between gap-2 py-1 pl-3 pr-1">
                        <span className="truncate text-sm text-foreground">{skill.title}</span>
                        <div className="flex shrink-0">
                          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" aria-label={`Editar ${skill.title}`} onClick={() => setEditing(skill)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" aria-label={`Excluir ${skill.title}`} onClick={() => setToDelete(skill)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing === "new" ? "Nova skill" : "Editar skill"}</DialogTitle>
            <DialogDescription>Aparece na seção Skills & Tecnologias da Home, dentro da categoria escolhida.</DialogDescription>
          </DialogHeader>
          {editing !== null && (
            <SkillForm
              key={editing === "new" ? "new" : editing.id}
              technology={editing === "new" ? undefined : editing}
              onDone={() => setEditing(null)}
              onCancel={() => setEditing(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={toDelete !== null} onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir skill?</AlertDialogTitle>
            <AlertDialogDescription>"{toDelete?.title}" deixa de aparecer na Home. Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => toDelete && deleteTechnology(toDelete.id)}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

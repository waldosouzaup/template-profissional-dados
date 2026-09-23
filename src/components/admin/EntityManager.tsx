import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface EntityManagerLabels<T> {
  add: string;
  newTitle: string;
  editTitle: string;
  dialogDescription: string;
  empty: string;
  deleteTitle: string;
  deleteDescription: (item: T) => string;
}

interface EntityManagerProps<T extends { id: string }> {
  items: T[];
  isLoading?: boolean;
  primary: (item: T) => string;
  secondary?: (item: T) => string | undefined;
  leading?: (item: T) => React.ReactNode;
  hint?: React.ReactNode;
  labels: EntityManagerLabels<T>;
  renderEditor: (item: T | undefined, close: () => void) => React.ReactNode;
  onDelete: (item: T) => void;
}

// List + create/edit dialog + delete confirmation. Items are saved by their own editor, immediately.
export default function EntityManager<T extends { id: string }>({
  items, isLoading, primary, secondary, leading, hint, labels, renderEditor, onDelete,
}: EntityManagerProps<T>) {
  const [editing, setEditing] = useState<T | "new" | null>(null);
  const [toDelete, setToDelete] = useState<T | null>(null);
  const close = () => setEditing(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">{hint ?? "Alterações salvas na hora, ao confirmar cada janela."}</p>
        <Button type="button" size="sm" onClick={() => setEditing("new")} className="gap-2">
          <Plus className="h-4 w-4" /> {labels.add}
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">{labels.empty}</p>
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 py-2 pl-3 pr-1">
              {leading?.(item)}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-foreground">{primary(item)}</p>
                {secondary?.(item) && <p className="truncate text-xs text-muted-foreground">{secondary(item)}</p>}
              </div>
              <div className="flex shrink-0">
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" aria-label={`Editar ${primary(item)}`} onClick={() => setEditing(item)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" aria-label={`Excluir ${primary(item)}`} onClick={() => setToDelete(item)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={editing !== null} onOpenChange={(open) => !open && close()}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing === "new" ? labels.newTitle : labels.editTitle}</DialogTitle>
            <DialogDescription>{labels.dialogDescription}</DialogDescription>
          </DialogHeader>
          {editing !== null && (
            <div key={editing === "new" ? "new" : editing.id}>
              {renderEditor(editing === "new" ? undefined : editing, close)}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={toDelete !== null} onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{labels.deleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>{toDelete && labels.deleteDescription(toDelete)}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => toDelete && onDelete(toDelete)}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

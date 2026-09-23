import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useProjectCategories } from "@/hooks/useProjectCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CATEGORY_ICON_NAMES, getCategoryIcon } from "@/lib/category-icons";
import type { ProjectCategory } from "@/types/project";

const selectClass = "h-10 rounded-md border border-input bg-background px-2 text-sm";

const IconSelect = ({ value, onChange, label }: { value: string; onChange: (icon: string) => void; label: string }) => {
  const Icon = getCategoryIcon(value);
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-secondary/40">
        <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
      </span>
      <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} className={selectClass}>
        {CATEGORY_ICON_NAMES.map((name) => <option key={name} value={name}>{name}</option>)}
      </select>
    </div>
  );
};

const CategoryRow = ({ category, onSave, onDelete }: {
  category: ProjectCategory;
  onSave: (category: ProjectCategory) => Promise<void>;
  onDelete: (category: ProjectCategory) => void;
}) => {
  const [name, setName] = useState(category.name);
  const [icon, setIcon] = useState(category.icon);
  const trimmed = name.trim();
  const dirty = trimmed !== category.name || icon !== category.icon;

  return (
    <li className="flex flex-wrap items-center gap-2 py-3">
      <Input
        aria-label={`Nome da categoria ${category.name}`}
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="min-w-0 flex-1 basis-40"
      />
      <IconSelect value={icon} onChange={setIcon} label={`Ícone da categoria ${category.name}`} />
      <Button
        type="button"
        size="sm"
        variant={dirty ? "default" : "outline"}
        disabled={!dirty || !trimmed}
        onClick={() => onSave({ ...category, name: trimmed, icon })}
        aria-label={`Salvar ${category.name}`}
      >
        Salvar
      </Button>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="h-9 w-9 text-destructive hover:text-destructive"
        onClick={() => onDelete(category)}
        aria-label={`Excluir ${category.name}`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </li>
  );
};

interface ProjectCategoriesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (name: string) => void;
  onRenamed?: (oldName: string, newName: string) => void;
}

export default function ProjectCategoriesDialog({ open, onOpenChange, onCreated, onRenamed }: ProjectCategoriesDialogProps) {
  const { data: categories = [], createCategory, updateCategory, deleteCategory } = useProjectCategories();
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("FolderOpen");
  const [toDelete, setToDelete] = useState<ProjectCategory | null>(null);
  const [error, setError] = useState<string | null>(null);

  const saveRow = async (category: ProjectCategory) => {
    const previous = categories.find((c) => c.id === category.id);
    await updateCategory(category);
    if (previous && previous.name !== category.name) onRenamed?.(previous.name, category.name);
  };

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    // Rendered in a portal: keep the submit from reaching the project form.
    e.stopPropagation();
    const name = newName.trim();
    if (!name) return;
    const nextOrder = Math.max(0, ...categories.map((c) => c.display_order)) + 1;
    const created = await createCategory({ name, icon: newIcon, display_order: nextOrder });
    setNewName("");
    setNewIcon("FolderOpen");
    onCreated?.(created.name);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setError(null);
    try {
      await deleteCategory(toDelete.id);
    } catch (err) {
      const code = (err as { code?: string }).code;
      setError(
        code === "23001" || code === "23503"
          ? `“${toDelete.name}” tem projetos vinculados. Mova esses projetos para outra categoria antes de excluir.`
          : `Não foi possível excluir “${toDelete.name}”.`,
      );
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Categorias de projeto</DialogTitle>
            <DialogDescription>
              Renomear atualiza todos os projetos da categoria. Categorias com projetos vinculados não podem ser excluídas.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <ul className="divide-y divide-border">
            {categories.map((category) => (
              <CategoryRow key={category.id} category={category} onSave={saveRow} onDelete={setToDelete} />
            ))}
          </ul>

          <form onSubmit={addCategory} className="space-y-2 rounded-lg border border-dashed border-border p-3">
            <Label htmlFor="new-category-name">Nova categoria</Label>
            <div className="flex flex-wrap items-center gap-2">
              <Input
                id="new-category-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ex: Automação"
                className="min-w-0 flex-1 basis-40"
              />
              <IconSelect value={newIcon} onChange={setNewIcon} label="Ícone da nova categoria" />
              <Button type="submit" size="sm" disabled={!newName.trim()} className="gap-1">
                <Plus className="h-4 w-4" /> Adicionar
              </Button>
            </div>
          </form>

          <DialogFooter>
            <Button type="button" onClick={() => onOpenChange(false)}>Concluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={toDelete !== null} onOpenChange={(isOpen) => !isOpen && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir categoria?</AlertDialogTitle>
            <AlertDialogDescription>
              “{toDelete?.name}” deixa de aparecer no site. Só é possível excluir categorias sem projetos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

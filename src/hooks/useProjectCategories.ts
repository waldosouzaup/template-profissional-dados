import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import type { ProjectCategory } from "@/types/project";

const describe = (error: { code?: string; message: string }) =>
  error.code === "23505" ? "já existe uma categoria com esse nome" : error.message;

export const useProjectCategories = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["project_categories"],
    queryFn: async (): Promise<ProjectCategory[]> => {
      const { data, error } = await supabase
        .from("project_categories")
        .select("*")
        .order("display_order", { ascending: true })
        .order("name", { ascending: true });
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  // Renames cascade to projects in the database, so project queries are refreshed too.
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["project_categories"] });
    queryClient.invalidateQueries({ queryKey: ["projects"] });
    queryClient.invalidateQueries({ queryKey: ["project"] });
  };

  const createMutation = useMutation({
    mutationFn: async (category: Omit<ProjectCategory, "id">) => {
      const { data, error } = await supabase.from("project_categories").insert([category]).select().single();
      if (error) throw error;
      return data as ProjectCategory;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Categoria criada!");
    },
    onError: (error: { code?: string; message: string }) => toast.error(`Erro ao criar categoria: ${describe(error)}`),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, name, icon, display_order }: ProjectCategory) => {
      const { data, error } = await supabase
        .from("project_categories")
        .update({ name, icon, display_order })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as ProjectCategory;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Categoria atualizada!");
    },
    onError: (error: { code?: string; message: string }) => toast.error(`Erro ao atualizar categoria: ${describe(error)}`),
  });

  // Delete errors (category still in use) are explained by the caller, next to the list.
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("project_categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Categoria excluída!");
    },
  });

  return {
    ...query,
    createCategory: createMutation.mutateAsync,
    updateCategory: updateMutation.mutateAsync,
    deleteCategory: deleteMutation.mutateAsync,
    isSaving: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
  };
};

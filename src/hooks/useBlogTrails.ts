import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import type { BlogTrail } from "@/types/database";

type TrailInput = Pick<BlogTrail, "name" | "slug" | "description" | "image_url" | "display_order">;

const describe = (error: { code?: string; message: string }) =>
  error.code === "23505" ? "já existe uma trilha com esse nome ou endereço" : error.message;

export const useBlogTrails = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["blog_trails"],
    queryFn: async (): Promise<BlogTrail[]> => {
      const { data, error } = await supabase
        .from("blog_trails")
        .select("*")
        .order("display_order", { ascending: true })
        .order("name", { ascending: true });
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["blog_trails"] });

  const createMutation = useMutation({
    mutationFn: async (trail: TrailInput) => {
      const { data, error } = await supabase.from("blog_trails").insert([trail]).select().single();
      if (error) throw error;
      return data as BlogTrail;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Trilha criada!");
    },
    onError: (error: { code?: string; message: string }) => toast.error(`Erro ao criar trilha: ${describe(error)}`),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, name, slug, description, image_url, display_order }: BlogTrail) => {
      const { data, error } = await supabase
        .from("blog_trails")
        .update({ name, slug, description, image_url, display_order })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as BlogTrail;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Trilha atualizada!");
    },
    onError: (error: { code?: string; message: string }) => toast.error(`Erro ao atualizar trilha: ${describe(error)}`),
  });

  // Delete errors (trail still has posts) are explained by the caller, next to the list.
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_trails").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Trilha excluída!");
    },
  });

  return {
    ...query,
    createTrail: createMutation.mutateAsync,
    updateTrail: updateMutation.mutateAsync,
    deleteTrail: deleteMutation.mutateAsync,
    isSaving: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
  };
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Education } from "@/types/database";
import { toast } from "sonner";

export const useEducationList = () => {
  const queryClient = useQueryClient();

  const fetchEducation = async (): Promise<Education[]> => {
    const { data, error } = await supabase
      .from("education")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching education:", error);
      throw new Error(error.message);
    }

    return data || [];
  };

  const query = useQuery({
    queryKey: ["education-list"],
    queryFn: fetchEducation,
  });

  const createMutation = useMutation({
    mutationFn: async (newEducation: Omit<Education, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("education")
        .insert([newEducation])
        .select()
        .single();

      if (error) throw error;
      return data as Education;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education-list"] });
      toast.success("Formação criada com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao criar formação: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedEducation: Education) => {
      const { id, created_at, ...rest } = updatedEducation;
      const { data, error } = await supabase
        .from("education")
        .update(rest)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Education;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education-list"] });
      toast.success("Formação atualizada com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar formação: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("education").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education-list"] });
      toast.success("Formação excluída com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao excluir formação: ${error.message}`);
    },
  });

  return {
    ...query,
    createEducation: createMutation.mutateAsync,
    updateEducation: updateMutation.mutateAsync,
    deleteEducation: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useEducationItem = (id: string | undefined) => {
  const fetchEducationItem = async (): Promise<Education | null> => {
    if (!id) return null;

    const { data, error } = await supabase
      .from("education")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }

    return data as Education;
  };

  return useQuery({
    queryKey: ["education-item", id],
    queryFn: fetchEducationItem,
    enabled: !!id,
  });
};

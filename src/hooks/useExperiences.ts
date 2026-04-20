import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Experience } from "@/types/database";
import { toast } from "sonner";

export const useExperiences = () => {
  const queryClient = useQueryClient();

  const fetchExperiences = async (): Promise<Experience[]> => {
    const { data, error } = await supabase
      .from("experience")
      .select("*")
      .order("display_order", { ascending: true });
    
    if (error) {
      console.error("Error fetching experiences:", error);
      throw new Error(error.message);
    }
    
    return data || [];
  };

  const query = useQuery({
    queryKey: ["experiences"],
    queryFn: fetchExperiences,
  });

  const createMutation = useMutation({
    mutationFn: async (newExperience: Omit<Experience, "id" | "created_at">) => {
      console.log("Creating experience with payload:", JSON.stringify(newExperience, null, 2));
      
      const { data, error } = await supabase
        .from("experience")
        .insert([newExperience])
        .select()
        .single();
        
      if (error) {
        console.error("Supabase INSERT error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        throw error;
      }
      return data as Experience;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
      toast.success("Experiência criada com sucesso!");
    },
    onError: (error: any) => {
      console.error("Full error object:", error);
      toast.error(`Erro ao criar experiência: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedExperience: Experience) => {
      const { id, created_at, ...rest } = updatedExperience;
      const { data, error } = await supabase
        .from("experience")
        .update(rest)
        .eq("id", id)
        .select()
        .single();
        
      if (error) throw error;
      return data as Experience;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
      toast.success("Experiência atualizada com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar experiência: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("experience").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
      toast.success("Experiência excluída com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao excluir experiência: ${error.message}`);
    },
  });

  return {
    ...query,
    createExperience: createMutation.mutateAsync,
    updateExperience: updateMutation.mutateAsync,
    deleteExperience: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useExperience = (id: string | undefined) => {
  const fetchExperience = async (): Promise<Experience | null> => {
    if (!id) return null;
    
    const { data, error } = await supabase
      .from("experience")
      .select("*")
      .eq("id", id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }
    
    return data as Experience;
  };

  return useQuery({
    queryKey: ["experience", id],
    queryFn: fetchExperience,
    enabled: !!id,
  });
};
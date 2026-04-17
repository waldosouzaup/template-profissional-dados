import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Technology } from "@/types/database";
import { toast } from "sonner";

export const useTechnologies = () => {
  const queryClient = useQueryClient();

  const fetchTechnologies = async (): Promise<Technology[]> => {
    const { data, error } = await supabase
      .from("technologies")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching technologies:", error);
      throw new Error(error.message);
    }
    
    return data || [];
  };

  const query = useQuery({
    queryKey: ["technologies"],
    queryFn: fetchTechnologies,
  });

  const createMutation = useMutation({
    mutationFn: async (newTech: Omit<Technology, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("technologies")
        .insert([newTech])
        .select()
        .single();
        
      if (error) throw error;
      return data as Technology;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technologies"] });
      toast.success("Tecnologia criada com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao criar tecnologia: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedTech: Technology) => {
      const { id, created_at, ...rest } = updatedTech;
      const { data, error } = await supabase
        .from("technologies")
        .update(rest)
        .eq("id", id)
        .select()
        .single();
        
      if (error) throw error;
        return data as Technology;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technologies"] });
      toast.success("Tecnologia atualizada com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar tecnologia: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("technologies").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technologies"] });
      toast.success("Tecnologia excluída com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao excluir tecnologia: ${error.message}`);
    },
  });

  return {
    ...query,
    createTechnology: createMutation.mutateAsync,
    updateTechnology: updateMutation.mutateAsync,
    deleteTechnology: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useTechnology = (id: string | undefined) => {
  const fetchTechnology = async (): Promise<Technology | null> => {
    if (!id) return null;
    
    const { data, error } = await supabase
      .from("technologies")
      .select("*")
      .eq("id", id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }
    
    return data as Technology;
  };

  return useQuery({
    queryKey: ["technology", id],
    queryFn: fetchTechnology,
    enabled: !!id,
  });
};
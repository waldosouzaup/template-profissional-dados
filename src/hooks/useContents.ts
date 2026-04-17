import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Content } from "@/types/database";
import { toast } from "sonner";

export const useContents = () => {
  const queryClient = useQueryClient();

  const fetchContents = async (): Promise<Content[]> => {
    const { data, error } = await supabase
      .from("contents")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching contents:", error);
      throw new Error(error.message);
    }
    
    return data || [];
  };

  const query = useQuery({
    queryKey: ["contents"],
    queryFn: fetchContents,
  });

  const createMutation = useMutation({
    mutationFn: async (newContent: Omit<Content, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("contents")
        .insert([newContent])
        .select()
        .single();
        
      if (error) throw error;
      return data as Content;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contents"] });
      toast.success("Conteúdo criado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao criar conteúdo: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedContent: Content) => {
      const { id, created_at, ...rest } = updatedContent;
      const { data, error } = await supabase
        .from("contents")
        .update(rest)
        .eq("id", id)
        .select()
        .single();
        
      if (error) throw error;
      return data as Content;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contents"] });
      toast.success("Conteúdo atualizado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar conteúdo: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contents").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contents"] });
      toast.success("Conteúdo excluído com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao excluir conteúdo: ${error.message}`);
    },
  });

  return {
    ...query,
    createContent: createMutation.mutateAsync,
    updateContent: updateMutation.mutateAsync,
    deleteContent: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useContent = (id: string | undefined) => {
  const fetchContent = async (): Promise<Content | null> => {
    if (!id) return null;
    
    const { data, error } = await supabase
      .from("contents")
      .select("*")
      .eq("id", id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }
    
    return data as Content;
  };

  return useQuery({
    queryKey: ["content", id],
    queryFn: fetchContent,
    enabled: !!id,
  });
};
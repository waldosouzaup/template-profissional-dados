import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Content } from "@/types/database";
import { toast } from "sonner";
import { trailPosts } from "@/lib/trails";

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

  // A post edit can also move it inside or between trails.
  const invalidate = () => {
    for (const key of ["contents", "content", "trail-posts"]) queryClient.invalidateQueries({ queryKey: [key] });
  };

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
      invalidate();
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
      invalidate();
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
      invalidate();
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

export const useContent = (idOrSlug: string | undefined) => {
  const fetchContent = async (): Promise<Content | null> => {
    if (!idOrSlug) return null;
    
    // Check if it's a UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    
    let query = supabase.from("contents").select("*");
    
    if (isUuid) {
      query = query.eq("id", idOrSlug);
    } else {
      query = query.eq("slug", idOrSlug);
    }
    
    const { data, error } = await query.single();
      
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }
    
    return data as Content;
  };

  return useQuery({
    queryKey: ["content", idOrSlug],
    queryFn: fetchContent,
    enabled: !!idOrSlug,
  });
};

// Every post of a trail, in study order.
export const useTrailPosts = (trailId: string | undefined | null) =>
  useQuery({
    queryKey: ["trail-posts", trailId],
    queryFn: async (): Promise<Content[]> => {
      const { data, error } = await supabase
        .from("contents")
        .select("*")
        .eq("trail_id", trailId)
        .order("trail_position", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: true });
      if (error) throw new Error(error.message);
      return trailPosts(data ?? [], trailId as string);
    },
    enabled: !!trailId,
  });

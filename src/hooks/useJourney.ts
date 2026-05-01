import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { JourneyItem } from "@/types/database";
import { toast } from "sonner";

export const useJourneyList = () => {
  const queryClient = useQueryClient();

  const fetchJourney = async (): Promise<JourneyItem[]> => {
    const { data, error } = await supabase
      .from("journey_items")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      console.error("Error fetching journey items:", error);
      throw new Error(error.message);
    }

    return data || [];
  };

  const query = useQuery({
    queryKey: ["journey-list"],
    queryFn: fetchJourney,
  });

  const createMutation = useMutation({
    mutationFn: async (newItem: Omit<JourneyItem, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("journey_items")
        .insert([newItem])
        .select()
        .single();

      if (error) throw error;
      return data as JourneyItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journey-list"] });
      toast.success("Item da jornada criado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao criar item da jornada: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedItem: JourneyItem) => {
      const { id, created_at, ...rest } = updatedItem;
      const { data, error } = await supabase
        .from("journey_items")
        .update(rest)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as JourneyItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journey-list"] });
      toast.success("Item da jornada atualizado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar item da jornada: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("journey_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journey-list"] });
      toast.success("Item da jornada excluído com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao excluir item da jornada: ${error.message}`);
    },
  });

  return {
    ...query,
    createJourneyItem: createMutation.mutateAsync,
    updateJourneyItem: updateMutation.mutateAsync,
    deleteJourneyItem: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useJourneyItem = (id: string | undefined) => {
  const fetchJourneyItem = async (): Promise<JourneyItem | null> => {
    if (!id) return null;

    const { data, error } = await supabase
      .from("journey_items")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }

    return data as JourneyItem;
  };

  return useQuery({
    queryKey: ["journey-item", id],
    queryFn: fetchJourneyItem,
    enabled: !!id,
  });
};

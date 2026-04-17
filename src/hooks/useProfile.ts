import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Profile } from "@/types/database";
import { toast } from "sonner";

export const useProfiles = () => {
  const queryClient = useQueryClient();

  const fetchProfiles = async (): Promise<Profile[]> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*");
    
    if (error) {
      console.error("Error fetching profiles:", error);
      throw new Error(error.message);
    }
    
    return data || [];
  };

  const query = useQuery({
    queryKey: ["profiles"],
    queryFn: fetchProfiles,
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedProfile: Profile) => {
      const { id, ...rest } = updatedProfile;
      const { data, error } = await supabase
        .from("profiles")
        .update(rest)
        .eq("id", id)
        .select()
        .single();
        
      if (error) throw error;
      return data as Profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      toast.success("Perfil atualizado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar perfil: ${error.message}`);
    },
  });

  return {
    ...query,
    updateProfile: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
};

export const useProfile = (id: string | undefined) => {
  const fetchProfile = async (): Promise<Profile | null> => {
    if (!id) return null;
    
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }
    
    return data as Profile;
  };

  return useQuery({
    queryKey: ["profile", id],
    queryFn: fetchProfile,
    enabled: !!id,
  });
};
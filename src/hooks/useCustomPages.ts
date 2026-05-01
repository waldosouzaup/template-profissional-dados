import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { CustomPage } from "@/types/database";

export const useCustomPages = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["customPages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("custom_pages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Erro ao carregar páginas",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data as CustomPage[];
    },
  });

  const createPage = useMutation({
    mutationFn: async (newPage: Partial<CustomPage>) => {
      const { data, error } = await supabase
        .from("custom_pages")
        .insert([newPage])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customPages"] });
      toast({
        title: "Página criada",
        description: "A página foi criada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar página",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updatePage = useMutation({
    mutationFn: async (page: Partial<CustomPage> & { id: string }) => {
      const { id, ...updateData } = page;
      const { data, error } = await supabase
        .from("custom_pages")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customPages"] });
      toast({
        title: "Página atualizada",
        description: "As alterações foram salvas com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deletePage = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("custom_pages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customPages"] });
      toast({
        title: "Página excluída",
        description: "A página foi removida com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    data,
    isLoading,
    createPage,
    updatePage,
    deletePage,
  };
};

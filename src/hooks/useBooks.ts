import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Book } from "@/types/database";
import { toast } from "sonner";

export const useBooks = () => {
  const queryClient = useQueryClient();

  const fetchBooks = async (): Promise<Book[]> => {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching books:", error);
      throw new Error(error.message);
    }
    
    return data || [];
  };

  const query = useQuery({
    queryKey: ["books"],
    queryFn: fetchBooks,
  });

  const createMutation = useMutation({
    mutationFn: async (newBook: Omit<Book, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("books")
        .insert([newBook])
        .select()
        .single();
        
      if (error) throw error;
      return data as Book;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast.success("Livro criado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao criar livro: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedBook: Book) => {
      const { id, created_at, ...rest } = updatedBook;
      const { data, error } = await supabase
        .from("books")
        .update(rest)
        .eq("id", id)
        .select()
        .single();
        
      if (error) throw error;
      return data as Book;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast.success("Livro atualizado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar livro: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("books").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast.success("Livro excluído com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao excluir livro: ${error.message}`);
    },
  });

  return {
    ...query,
    createBook: createMutation.mutateAsync,
    updateBook: updateMutation.mutateAsync,
    deleteBook: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useBook = (id: string | undefined) => {
  const fetchBook = async (): Promise<Book | null> => {
    if (!id) return null;
    
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .eq("id", id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }
    
    return data as Book;
  };

  return useQuery({
    queryKey: ["book", id],
    queryFn: fetchBook,
    enabled: !!id,
  });
};
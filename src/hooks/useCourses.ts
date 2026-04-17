import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Course } from "@/types/database";
import { toast } from "sonner";

export const useCourses = () => {
  const queryClient = useQueryClient();

  const fetchCourses = async (): Promise<Course[]> => {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching courses:", error);
      throw new Error(error.message);
    }
    
    return data || [];
  };

  const query = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  const createMutation = useMutation({
    mutationFn: async (newCourse: Omit<Course, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("courses")
        .insert([newCourse])
        .select()
        .single();
        
      if (error) throw error;
      return data as Course;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Curso criado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao criar curso: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedCourse: Course) => {
      const { id, created_at, ...rest } = updatedCourse;
      const { data, error } = await supabase
        .from("courses")
        .update(rest)
        .eq("id", id)
        .select()
        .single();
        
      if (error) throw error;
      return data as Course;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Curso atualizado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar curso: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("courses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Curso excluído com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao excluir curso: ${error.message}`);
    },
  });

  return {
    ...query,
    createCourse: createMutation.mutateAsync,
    updateCourse: updateMutation.mutateAsync,
    deleteCourse: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useCourse = (id: string | undefined) => {
  const fetchCourse = async (): Promise<Course | null> => {
    if (!id) return null;
    
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }
    
    return data as Course;
  };

  return useQuery({
    queryKey: ["course", id],
    queryFn: fetchCourse,
    enabled: !!id,
  });
};
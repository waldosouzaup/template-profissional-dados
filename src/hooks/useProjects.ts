import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Project, ProjectSchema } from "@/types/project";
import { toast } from "sonner";

const mapToCamelCase = (data: any): Project => {
  return {
    id: data.id,
    title: data.title,
    category: data.category,
    shortDescription: data.description || "",
    description: data.business_problem || data.description || "",
    content: data.markdown || "",
    coverImage: data.image_url || "",
    tags: data.technologies || [],
    stack: data.technologies || [],
    featured: data.is_published || false,
    isPublished: data.is_published || false,
    displayOrder: data.display_order || 0,
    githubUrl: data.github_url || "",
    demoUrl: data.demo_url || "",
    link: data.demo_url || data.github_url || "",
    businessProblemImage: data.business_problem_image || "",
    contextImage: data.context_image || "",
    premisesImage: data.premises_image || "",
    strategyImage: data.strategy_image || "",
    resultsImage: data.results_image || "",
    nextStepsImage: data.next_steps_image || "",
    galleryImages: data.gallery_images || [],
    premises: data.premises || [],
    strategy: data.strategy || [],
    insights: data.insights || [],
    results: data.results || [],
    nextSteps: data.next_steps || [],
    context: data.context || "",
    cardProblem: data.card_problem || "",
    cardSolution: data.card_solution || "",
    cardResult: data.card_result || "",
    businessProblem: data.business_problem || "",
    stats: Array.isArray(data.results) 
      ? data.results.slice(0, 4).map((res: string) => {
          const parts = res.split(":");
          return {
            label: parts[1]?.trim() || "Resultado",
            value: parts[0]?.trim() || res
          };
        })
      : [],
  };
};

const mapToSnakeCase = (project: Project): any => {
  return {
    id: project.id,
    title: project.title,
    category: project.category,
    description: project.shortDescription,
    business_problem: project.description,
    image_url: project.coverImage,
    markdown: project.content,
    technologies: project.tags,
    is_published: project.isPublished,
    display_order: project.displayOrder,
    github_url: project.githubUrl,
    demo_url: project.demoUrl,
    business_problem_image: project.businessProblemImage,
    context_image: project.contextImage,
    premises_image: project.premisesImage,
    strategy_image: project.strategyImage,
    results_image: project.resultsImage,
    next_steps_image: project.nextStepsImage,
    gallery_images: project.galleryImages,
    premises: project.premises,
    strategy: project.strategy,
    insights: project.insights,
    results: project.results,
    next_steps: project.nextSteps,
    context: project.context,
    card_problem: project.cardProblem,
    card_solution: project.cardSolution,
    card_result: project.cardResult,
  };
};

export const useProjects = () => {
  const queryClient = useQueryClient();

  const fetchProjects = async (): Promise<Project[]> => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: false });
    
    if (error) {
      console.error("Error fetching projects:", error);
      throw new Error(error.message);
    }
    
    if (!data) return [];
    
    return data.map((item) => mapToCamelCase(item));
  };

  const query = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const createMutation = useMutation({
    mutationFn: async (newProject: Project) => {
      const snakeCaseData = mapToSnakeCase(newProject);
      const { data, error } = await supabase
        .from("projects")
        .insert([snakeCaseData])
        .select()
        .single();
        
      if (error) throw error;
      return mapToCamelCase(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Projeto criado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao criar projeto: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedProject: Project) => {
      const snakeCaseData = mapToSnakeCase(updatedProject);
      const { data, error } = await supabase
        .from("projects")
        .update(snakeCaseData)
        .eq("id", updatedProject.id)
        .select()
        .single();
        
      if (error) throw error;
      return mapToCamelCase(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Projeto atualizado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar projeto: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Projeto excluído com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao excluir projeto: ${error.message}`);
    },
  });

  return {
    ...query,
    createProject: createMutation.mutateAsync,
    updateProject: updateMutation.mutateAsync,
    deleteProject: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useProject = (id: string | undefined) => {
  const fetchProject = async (): Promise<Project | null> => {
    if (!id) return null;
    
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }
    
    return mapToCamelCase(data);
  };

  return useQuery({
    queryKey: ["project", id],
    queryFn: fetchProject,
    enabled: !!id,
  });
};
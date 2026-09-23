import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useProjects, useProject } from "@/hooks/useProjects";
import { ProjectSchema, Project, projectCategories, ProjectCategory } from "@/types/project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { slugify } from "@/lib/slug";
import { ArrowLeft, Loader2, Image as ImageIcon, Images, FileText, Settings } from "lucide-react";

// Form schema adapting arrays to comma-separated strings for simpler UI
// id is optional here: omitted on creation (DB auto-generates UUID), present on edit
const FormSchema = ProjectSchema.extend({
  id: z.string().optional(),
  tags: z.string(),
  stack: z.string(),
  galleryImages: z.string(),
  premises: z.string(),
  strategy: z.string(),
  insights: z.string(),
  results: z.string(),
  nextSteps: z.string(),
});

type FormValues = z.infer<typeof FormSchema>;

const SECTION_IMAGE_FIELDS = [
  { name: "businessProblemImage", label: "Img: Business Problem" },
  { name: "contextImage", label: "Img: Context" },
  { name: "premisesImage", label: "Img: Premises" },
  { name: "strategyImage", label: "Img: Strategy" },
  { name: "resultsImage", label: "Img: Results" },
  { name: "nextStepsImage", label: "Img: Next Steps" },
] as const;

export default function AdminProjectForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();

  const { createProject, updateProject, isCreating, isUpdating } = useProjects();
  const { data: projectData, isLoading: isLoadingProject } = useProject(id);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: "",
      slug: "",
      title: "",
      category: "",
      description: "",
      shortDescription: "",
      content: "",
      coverImage: "",
      businessProblemImage: "",
      contextImage: "",
      premisesImage: "",
      strategyImage: "",
      resultsImage: "",
      nextStepsImage: "",
      galleryImages: "",
      tags: "",
      stack: "",
      premises: "",
      strategy: "",
      insights: "",
      results: "",
      nextSteps: "",
      context: "",
      cardProblem: "",
      cardSolution: "",
      cardResult: "",
      link: "",
      demoUrl: "",
      githubUrl: "",
      featured: false,
      isPublished: true,
      displayOrder: 0,
      stats: [],
    },
  });


  // New projects follow the title until the slug is edited by hand; existing URLs never change on their own.
  const [slugEdited, setSlugEdited] = useState(isEditing);
  const slugPreview = slugify(form.watch("slug") || "");

  // Load data if editing
  useEffect(() => {
    if (isEditing && projectData) {
      form.reset({
        ...projectData,
        tags: (projectData.tags || []).join(", "),
        stack: (projectData.stack || []).join(", "),
        galleryImages: (projectData.galleryImages || []).join(", "),
        premises: (projectData.premises || []).join(", "),
        strategy: (projectData.strategy || []).join(", "),
        insights: (projectData.insights || []).join(", "),
        results: (projectData.results || []).join(", "),
        nextSteps: (projectData.nextSteps || []).join(", "),
      } as any);
    }
  }, [isEditing, projectData, form]);

  const onSubmit = async (values: FormValues) => {
    const splitComma = (str: string) => str.split(",").map((s) => s.trim()).filter(Boolean);
    
    // Transform back to actual Project payload
    const payload: Project = {
      ...values,
      tags: splitComma(values.tags),
      stack: splitComma(values.stack),
      galleryImages: splitComma(values.galleryImages),
      premises: splitComma(values.premises),
      strategy: splitComma(values.strategy),
      insights: splitComma(values.insights),
      // Results are not edited in this form: keep the stored list untouched.
      results: projectData?.results ?? [],
      nextSteps: splitComma(values.nextSteps),
    };

    if (isEditing) {
      await updateProject(payload);
    } else {
      await createProject(payload);
    }
    navigate("/admin");
  };

  if (isEditing && isLoadingProject) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] animate-pulse">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
        <p className="text-muted-foreground">Carregando formulário...</p>
      </div>
    );
  }

  const isSaving = isCreating || isUpdating;

  return (
    <div className="animate-fade-up max-w-5xl mx-auto pb-20">
      <Link 
        to="/admin" 
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar ao Dashboard
      </Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          {isEditing ? "Editar Projeto" : "Novo Projeto"}
        </h1>
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" onClick={() => navigate("/admin")}>
            Cancelar
          </Button>
          <Button type="button" onClick={form.handleSubmit(onSubmit)} disabled={isSaving}>
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isEditing ? "Salvar Alterações" : "Criar Projeto"}
          </Button>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Seção 1: Identificação e Status */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-semibold mb-2">
            <Settings className="w-5 h-5" />
            <h2>Identificação e Status</h2>
          </div>
          <div className="glass-panel p-6 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6">
            {isEditing && (
              <div className="md:col-span-1">
                <label className="block text-sm font-medium mb-1">ID (UUID)</label>
                <Input {...form.register("id")} disabled className="font-mono text-xs text-muted-foreground" />
              </div>
            )}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-1">Título*</label>
              <Input
                {...form.register("title", {
                  onChange: (e) => {
                    if (!slugEdited) form.setValue("slug", slugify(e.target.value));
                  },
                })}
                placeholder="Ex: NoCode Match"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-1">Categoria*</label>
              <select
                {...form.register("category")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Selecione uma categoria</option>
                {Object.entries(projectCategories).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              {form.formState.errors.category && <p className="text-red-500 text-xs mt-1">{form.formState.errors.category.message}</p>}
            </div>
            <div className="md:col-span-3">
              <label htmlFor="project-slug" className="block text-sm font-medium mb-1">URL amigável (slug)</label>
              <Input
                id="project-slug"
                {...form.register("slug", {
                  onChange: () => setSlugEdited(true),
                  onBlur: (e) => form.setValue("slug", slugify(e.target.value)),
                })}
                placeholder="gerado-a-partir-do-titulo"
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                waldoeller.com/projects/<span className="text-foreground">{slugPreview || "…"}</span>
                {isEditing && " · Se você alterar, o endereço antigo continua redirecionando para o novo."}
              </p>
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-1">Ordem de Exibição</label>
              <Input type="number" {...form.register("displayOrder", { valueAsNumber: true })} />
            </div>
            <div className="md:col-span-1 flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...form.register("isPublished")} className="w-4 h-4 rounded border-gray-300" />
                <span className="text-sm font-medium">Publicado</span>
              </label>
            </div>
            <div className="md:col-span-1 flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...form.register("featured")} className="w-4 h-4 rounded border-gray-300" />
                <span className="text-sm font-medium">Destaque na Home</span>
              </label>
            </div>
          </div>
        </section>

        {/* Seção 2: Conteúdo e Texto Principal */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-semibold mb-2">
            <FileText className="w-5 h-5" />
            <h2>Conteúdo Principal</h2>
          </div>
          <div className="glass-panel p-6 rounded-2xl space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Descrição Curta (Cards)</label>
              <Input {...form.register("shortDescription")} placeholder="Resumo rápido para a galeria" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Problema de Negócio (Descrição Longa)</label>
              <textarea 
                {...form.register("description")} 
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Explicação detalhada do problema que o projeto resolve..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Conteúdo Principal (Markdown)</label>
              <textarea 
                {...form.register("content")} 
                rows={10}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="# Introdução..."
              />
            </div>
          </div>
        </section>

        {/* Seção 3: Mídia e URLs */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-semibold mb-2">
            <ImageIcon className="w-5 h-5" />
            <h2>Mídia e URLs</h2>
          </div>
          <div className="glass-panel p-6 rounded-2xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Controller
                  control={form.control}
                  name="coverImage"
                  render={({ field }) => (
                    <ImageUpload 
                      label="Imagem de Capa"
                      value={field.value}
                      onChange={field.onChange}
                      path="projects/covers"
                    />
                  )}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Demo URL</label>
                <Input {...form.register("demoUrl")} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Github URL</label>
                <Input {...form.register("githubUrl")} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Galeria (URLs sep. por vírgula)</label>
                <Input {...form.register("galleryImages")} />
                <p className="text-[10px] text-muted-foreground mt-1">Dica: Futuramente suportaremos upload múltiplo aqui. Por enquanto, use URLs separadas por vírgula.</p>
              </div>
            </div>
          </div>
        </section>


        {/* Seção 4: Imagens das Seções */}
        <section aria-labelledby="section-images-title" className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-semibold mb-2">
            <Images className="w-5 h-5" />
            <h2 id="section-images-title">Imagens das Seções</h2>
          </div>
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <p className="text-sm text-muted-foreground">
              Imagens que ilustram cada etapa do projeto. Clique na área para enviar; passe o mouse sobre a imagem para removê-la.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {SECTION_IMAGE_FIELDS.map(({ name, label }) => (
                <Controller
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <ImageUpload label={label} value={field.value} onChange={field.onChange} path="projects/sections" allowUrl={false} />
                  )}
                />
              ))}
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-4 border-t border-border pt-8 mt-10">
          <Button type="button" variant="outline" size="lg" onClick={() => navigate("/admin")}>
            Sair sem salvar
          </Button>
          <Button type="button" size="lg" onClick={form.handleSubmit(onSubmit)} disabled={isSaving}>
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isEditing ? "Salvar Alterações" : "Criar Projeto"}
          </Button>
        </div>
      </form>
    </div>
  );
}

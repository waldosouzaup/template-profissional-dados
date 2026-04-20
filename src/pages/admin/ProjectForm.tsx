import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useProjects, useProject } from "@/hooks/useProjects";
import { ProjectSchema, Project, projectCategories, ProjectCategory } from "@/types/project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { ArrowLeft, Loader2, Plus, Trash2, Layout, Image as ImageIcon, Link as LinkIcon, FileText, BarChart, Settings } from "lucide-react";

// Form schema adapting arrays to comma-separated strings for simpler UI
const FormSchema = ProjectSchema.extend({
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

  const { fields: statFields, append: appendStat, remove: removeStat } = useFieldArray({
    control: form.control,
    name: "stats",
  });

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
      results: splitComma(values.results),
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
            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-1">ID (Slug único)*</label>
              <Input {...form.register("id")} placeholder="ex: nocode-match" disabled={isEditing} />
              {form.formState.errors.id && <p className="text-red-500 text-xs mt-1">{form.formState.errors.id.message}</p>}
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-1">Título*</label>
              <Input {...form.register("title")} placeholder="Ex: NoCode Match" />
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

        {/* Seção 3: Detalhamento Técnico e Metodologia */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-semibold mb-2">
            <Layout className="w-5 h-5" />
            <h2>Metodologia e Detalhes</h2>
          </div>
          <div className="glass-panel p-6 rounded-2xl space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Contexto</label>
              <textarea {...form.register("context")} rows={2} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Premissas (sep. por vírgula)</label>
                <Input {...form.register("premises")} placeholder="Premissa 1, Premissa 2..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Estratégia (sep. por vírgula)</label>
                <Input {...form.register("strategy")} placeholder="Fase 1, Fase 2..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Insights (sep. por vírgula)</label>
                <Input {...form.register("insights")} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Próximos Passos (sep. por vírgula)</label>
                <Input {...form.register("nextSteps")} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Resultados (sep. por vírgula)</label>
              <Input {...form.register("results")} placeholder="10%: Redução de custos, +50k: Usuários..." />
              <p className="text-[10px] text-muted-foreground mt-1">Dica: Use 'Valor: Descrição' para gerar métricas automáticas no site.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Technologies (Tags)</label>
                <Input {...form.register("tags")} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stack Secundária</label>
                <Input {...form.register("stack")} />
              </div>
            </div>
          </div>
        </section>

        {/* Seção 4: Links e Media */}
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Controller
                  control={form.control}
                  name="businessProblemImage"
                  render={({ field }) => (
                    <ImageUpload 
                      label="Img: Business Problem"
                      value={field.value}
                      onChange={field.onChange}
                      path="projects/sections"
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  control={form.control}
                  name="contextImage"
                  render={({ field }) => (
                    <ImageUpload 
                      label="Img: Context"
                      value={field.value}
                      onChange={field.onChange}
                      path="projects/sections"
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  control={form.control}
                  name="premisesImage"
                  render={({ field }) => (
                    <ImageUpload 
                      label="Img: Premises"
                      value={field.value}
                      onChange={field.onChange}
                      path="projects/sections"
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  control={form.control}
                  name="strategyImage"
                  render={({ field }) => (
                    <ImageUpload 
                      label="Img: Strategy"
                      value={field.value}
                      onChange={field.onChange}
                      path="projects/sections"
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  control={form.control}
                  name="resultsImage"
                  render={({ field }) => (
                    <ImageUpload 
                      label="Img: Results"
                      value={field.value}
                      onChange={field.onChange}
                      path="projects/sections"
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  control={form.control}
                  name="nextStepsImage"
                  render={({ field }) => (
                    <ImageUpload 
                      label="Img: Next Steps"
                      value={field.value}
                      onChange={field.onChange}
                      path="projects/sections"
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Seção 5: Cartões (Briefing Rápido) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-semibold mb-2">
            <BarChart className="w-5 h-5" />
            <h2>Estatísticas e Cartões Rápidos</h2>
          </div>
          <div className="glass-panel p-6 rounded-2xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Card: Problema</label>
                <textarea {...form.register("cardProblem")} rows={2} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Card: Solução</label>
                <textarea {...form.register("cardSolution")} rows={2} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Card: Resultado</label>
                <textarea {...form.register("cardResult")} rows={2} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
            </div>

            <hr className="border-border" />

            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Métricas Visuais (Legacy Stats)</h3>
              <Button type="button" variant="outline" size="sm" onClick={() => appendStat({ label: "", value: "" })}>
                <Plus className="w-4 h-4 mr-2" /> Adicionar Métrica
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {statFields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-3 p-3 rounded-lg border border-dashed border-border">
                  <div className="flex-1">
                    <Input {...form.register(`stats.${index}.label`)} placeholder="Ex: Eficiência" />
                  </div>
                  <div className="flex-1">
                    <Input {...form.register(`stats.${index}.value`)} placeholder="Ex: +15%" />
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeStat(index)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
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

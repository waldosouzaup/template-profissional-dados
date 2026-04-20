import { z } from "zod";

export const ProjectCategoryEnum = z.enum([
  "Dados",
  "Web",
  "IA",
]);

export type ProjectCategory = z.infer<typeof ProjectCategoryEnum>;

export const StatSchema = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
});

export const ProjectSchema = z.object({
  id: z.string().min(1, "ID is required"),
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  
  // Basic Info
  description: z.string().default(""), // Maps to business_problem
  shortDescription: z.string().default(""), // Maps to description
  content: z.string().default(""), // Maps to markdown
  businessProblem: z.string().default(""), // Maps to business_problem directly
  
  // Media
  coverImage: z.string().default(""), // Maps to image_url
  businessProblemImage: z.string().default(""),
  contextImage: z.string().default(""),
  premisesImage: z.string().default(""),
  strategyImage: z.string().default(""),
  resultsImage: z.string().default(""),
  nextStepsImage: z.string().default(""),
  galleryImages: z.array(z.string()).default([]),
  
  // Taxonomy & Lists
  tags: z.array(z.string()).default([]), // Maps to technologies
  stack: z.array(z.string()).default([]), // Usually redundant with tags in this DB
  premises: z.array(z.string()).default([]),
  strategy: z.array(z.string()).default([]),
  insights: z.array(z.string()).default([]),
  results: z.array(z.string()).default([]),
  nextSteps: z.array(z.string()).default([]),
  
  // Text Sections
  context: z.string().default(""),
  cardProblem: z.string().default(""),
  cardSolution: z.string().default(""),
  cardResult: z.string().default(""),
  
  // Links
  link: z.string().optional().nullable(), // Maps to demo_url/github_url helper
  demoUrl: z.string().optional().nullable(),
  githubUrl: z.string().optional().nullable(),
  
  // Meta
  featured: z.boolean().default(false), // Maps to is_published
  isPublished: z.boolean().default(true),
  displayOrder: z.number().default(0),
  
  // UI legacy support (will be computed from 'results')
  stats: z.array(StatSchema).optional(),
});

export type Project = z.infer<typeof ProjectSchema>;

export const projectCategories: Record<ProjectCategory, { label: string; icon: string }> = {
  Dados: { label: "Dados", icon: "Database" },
  Web: { label: "Web", icon: "Globe" },
  IA: { label: "IA", icon: "Brain" },
};

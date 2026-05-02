import { z } from "zod";

export const BookSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  author: z.string().optional(),
  description: z.string().optional(),
  image_url: z.string().optional(),
  created_at: z.string().datetime().optional(),
});

export type Book = z.infer<typeof BookSchema>;

export const JourneyItemSchema = z.object({
  id: z.string().uuid(),
  year: z.string().min(1, "Year is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  order_index: z.number().default(0),
  created_at: z.string().datetime().optional(),
});

export type JourneyItem = z.infer<typeof JourneyItemSchema>;

export const ContentSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  markdown: z.string().optional(),
  category: z.string().optional(),
  image_url: z.string().optional(),
  drive_folder_url: z.string().optional(),
  created_at: z.string().datetime().optional(),
});

export type Content = z.infer<typeof ContentSchema>;

export const CustomPageSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  markdown: z.string().optional(),
  created_at: z.string().datetime().optional(),
});

export type CustomPage = z.infer<typeof CustomPageSchema>;

export const EducationSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  institution: z.string().min(1, "Institution is required"),
  period: z.string().optional(),
  description: z.string().optional(),
  display_order: z.number().default(0),
  created_at: z.string().datetime().optional(),
});

export type Education = z.infer<typeof EducationSchema>;

export const CourseSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  period: z.string().optional(),
  certificate_url: z.string().optional(),
  description: z.string().optional(),
  topics: z.array(z.string()).default([]),
  created_at: z.string().datetime().optional(),
});

export type Course = z.infer<typeof CourseSchema>;

export const ExperienceTypeEnum = z.enum(["profissional", "embaixador", "projeto", "outros"]);
export const IconTypeEnum = z.enum(["rocket", "award", "briefcase"]);

export const ExperienceSchema = z.object({
  id: z.string().uuid(),
  type: ExperienceTypeEnum,
  icon_type: IconTypeEnum.default("rocket"),
  title: z.string().min(1, "Title is required"),
  institution: z.string().min(1, "Institution is required"), // Keeping as institution in DB for compatibility, but labeled as Company in UI
  description: z.string().optional(),
  period: z.string().optional(), // New field for ranges like "2022 - Presente"
  display_order: z.number().default(0),
  created_at: z.string().datetime().optional(),
});

export type Experience = z.infer<typeof ExperienceSchema>;
export type ExperienceType = z.infer<typeof ExperienceTypeEnum>;
export type IconType = z.infer<typeof IconTypeEnum>;

export const ProfileSchema = z.object({
  id: z.string().uuid(),
  updated_at: z.string().datetime().optional(),
  full_name: z.string().optional(),
  bio_summary: z.string().optional(),
  bio_detailed: z.string().optional(),
  phone: z.string().default("(61) 9 9116-1854"),
  email: z.string().optional(),
  avatar_url: z.string().optional(),
  location: z.string().default("Brasília, DF"),
  current_focus: z.string().default("Engenharia de Dados"),
  about_title: z.string().optional(),
  cv_url: z.string().optional(),
  favicon_url: z.string().optional(),
  hero_title: z.string().optional(),
  navbar_icon: z.string().optional(),
  theme: z.enum(["dark", "light"]).default("dark"),
  primary_color: z.string().default("142 71% 45%"),
  stat_1_number: z.string().default("+15"),
  stat_1_label: z.string().default("Projetos Ativos"),
  stat_2_number: z.string().default("5+"),
  stat_2_label: z.string().default("Anos de Experiência"),
  hero_phrase_start: z.string().default("Data is the"),
  hero_phrase_strike: z.string().default("Future"),
  hero_phrase_end: z.string().default("Present."),
  contact_form_key: z.string().optional(),
});

export type Profile = z.infer<typeof ProfileSchema>;

export const ProjectCategoryEnum = z.enum(["Dados", "Web", "IA"]);

export const ProjectSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  category: ProjectCategoryEnum,
  description: z.string().min(1, "Description is required"),
  technologies: z.array(z.string()).default([]),
  image_url: z.string().optional(),
  business_problem: z.string().optional(),
  context: z.string().optional(),
  premises: z.array(z.string()).default([]),
  strategy: z.array(z.string()).default([]),
  insights: z.array(z.string()).default([]),
  results: z.array(z.string()).default([]),
  next_steps: z.array(z.string()).default([]),
  github_url: z.string().optional(),
  demo_url: z.string().optional(),
  display_order: z.number().default(0),
  is_published: z.boolean().default(true),
  business_problem_image: z.string().optional(),
  context_image: z.string().optional(),
  premises_image: z.string().optional(),
  strategy_image: z.string().optional(),
  results_image: z.string().optional(),
  next_steps_image: z.string().optional(),
  gallery_images: z.array(z.string()).default([]),
  markdown: z.string().optional(),
  card_problem: z.string().optional(),
  card_solution: z.string().optional(),
  card_result: z.string().optional(),
  created_at: z.string().datetime().optional(),
});

export type Project = z.infer<typeof ProjectSchema>;
export type ProjectCategory = z.infer<typeof ProjectCategoryEnum>;

export const TechnologySchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  items: z.array(z.string()).default([]),
  description: z.string().optional(),
  icon: z.string().default("Zap"),
  color: z.string().default("text-primary"),
  created_at: z.string().datetime().optional(),
});

export type Technology = z.infer<typeof TechnologySchema>;
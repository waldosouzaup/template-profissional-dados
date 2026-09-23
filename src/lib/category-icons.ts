import {
  BarChart3, Bot, Brain, Cloud, Code2, Cpu, Database, FolderOpen, Globe, Layers, Server, Shield,
  ShoppingCart, Smartphone, Terminal, Workflow, type LucideIcon,
} from "lucide-react";

// Icons offered when creating/editing a project category; the name is what gets stored.
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  FolderOpen, Database, Globe, Brain, Cloud, Server, Terminal, Code2, Cpu, Shield, BarChart3,
  Smartphone, Layers, Workflow, Bot, ShoppingCart,
};

export const CATEGORY_ICON_NAMES = Object.keys(CATEGORY_ICONS);

export const getCategoryIcon = (name?: string): LucideIcon => (name && CATEGORY_ICONS[name]) || FolderOpen;

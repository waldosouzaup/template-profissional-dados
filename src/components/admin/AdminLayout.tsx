import { useEffect, useState } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { LogOut, LayoutDashboard, FolderOpen, BookOpen, FileText, GraduationCap, Briefcase, User, Cpu, Loader2, Settings as SettingsIcon, Milestone } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/admin", icon: FolderOpen, label: "Projetos" },
  { to: "/admin/journey", icon: Milestone, label: "Jornada" },
  { to: "/admin/books", icon: BookOpen, label: "Livros" },
  { to: "/admin/contents", icon: FileText, label: "Conteúdos" },
  { to: "/admin/education", icon: GraduationCap, label: "Formação" },
  { to: "/admin/courses", icon: GraduationCap, label: "Cursos" },
  { to: "/admin/experiences", icon: Briefcase, label: "Experiências" },
  { to: "/admin/custom-pages", icon: FileText, label: "Páginas Custom." },
  { to: "/admin/profiles", icon: User, label: "Perfil" },
  { to: "/admin/technologies", icon: Cpu, label: "Tecnologias" },
  { to: "/admin/settings", icon: SettingsIcon, label: "Configurações" },
];

export default function AdminLayout() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/admin/login");
      } else {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) navigate("/admin/login");
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-secondary/50 border-r border-border p-6 flex flex-col shrink-0">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground">Admin Pro</span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-border">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair do painel
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

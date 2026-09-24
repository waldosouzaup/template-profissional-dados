import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProjectsGallery from "./pages/ProjectsGallery";
import ProjectDetail from "./pages/ProjectDetail";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogTrail from "./pages/BlogTrail";
import Contact from "./pages/Contact";
import Navbar from "./components/portfolio/Navbar";
import BackToTop from "./components/BackToTop";

// Admin
import AdminLogin from "./pages/admin/Login";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AboutAdmin from "./pages/admin/AboutAdmin";
import { legacyAboutRoutes } from "./pages/admin/about-sections";
import AdminProjectForm from "./pages/admin/ProjectForm";
import ContentsDashboard from "./pages/admin/ContentsDashboard";
import ContentForm from "./pages/admin/ContentForm";
import ProfileForm from "./pages/admin/ProfileForm";
import AdminSettings from "./pages/admin/Settings";
import CustomPagesDashboard from "./pages/admin/CustomPagesDashboard";
import CustomPageForm from "./pages/admin/CustomPageForm";
import CustomPageView from "./pages/CustomPageView";
import useDynamicFavicon from "./hooks/useDynamicFavicon";
import TrackingTags from "./components/TrackingTags";

const queryClient = new QueryClient();

const FaviconUpdater = () => {
  useDynamicFavicon();
  return null;
};

import { ThemeProvider } from "./components/ThemeProvider";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <FaviconUpdater />
        <ThemeProvider />
        <TrackingTags />
        <Navbar />
        <BackToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/projects" element={<ProjectsGallery />} />
          <Route path="/projects/:idOrSlug" element={<ProjectDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/trilha/:slug" element={<BlogTrail />} />
          <Route path="/blog/:idOrSlug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/p/:slug" element={<CustomPageView />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="projects/new" element={<AdminProjectForm />} />
            <Route path="projects/:id" element={<AdminProjectForm />} />

            {/* Sobre: one page mirroring /about; old list and form URLs land on its sections */}
            <Route path="about" element={<AboutAdmin />} />
            {legacyAboutRoutes()}

            {/* Contents */}
            <Route path="contents" element={<ContentsDashboard />} />
            <Route path="contents/new" element={<ContentForm />} />
            <Route path="contents/:id" element={<ContentForm />} />
            
            {/* Custom Pages */}
            <Route path="custom-pages" element={<CustomPagesDashboard />} />
            <Route path="custom-pages/new" element={<CustomPageForm />} />
            <Route path="custom-pages/:id" element={<CustomPageForm />} />
            
            {/* Profile */}
            <Route path="profiles" element={<ProfileForm />} />
            
            {/* Skills are managed inside Perfil (Home); old links land on that section */}
            <Route path="technologies/*" element={<Navigate to="/admin/profiles#skills" replace />} />
            
            {/* Settings */}
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

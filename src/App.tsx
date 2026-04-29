import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProjectsGallery from "./pages/ProjectsGallery";
import ProjectDetail from "./pages/ProjectDetail";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Navbar from "./components/portfolio/Navbar";

// Admin
import AdminLogin from "./pages/admin/Login";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProjectForm from "./pages/admin/ProjectForm";
import BooksDashboard from "./pages/admin/BooksDashboard";
import BookForm from "./pages/admin/BookForm";
import ContentsDashboard from "./pages/admin/ContentsDashboard";
import ContentForm from "./pages/admin/ContentForm";
import CoursesDashboard from "./pages/admin/CoursesDashboard";
import CourseForm from "./pages/admin/CourseForm";
import ExperiencesDashboard from "./pages/admin/ExperiencesDashboard";
import ExperienceForm from "./pages/admin/ExperienceForm";
import ProfileForm from "./pages/admin/ProfileForm";
import TechnologiesDashboard from "./pages/admin/TechnologiesDashboard";
import TechnologyForm from "./pages/admin/TechnologyForm";
import EducationDashboard from "./pages/admin/EducationDashboard";
import EducationForm from "./pages/admin/EducationForm";
import AdminSettings from "./pages/admin/Settings";
import useDynamicFavicon from "./hooks/useDynamicFavicon";

const queryClient = new QueryClient();

const FaviconUpdater = () => {
  useDynamicFavicon();
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <FaviconUpdater />
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/projects" element={<ProjectsGallery />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:idOrSlug" element={<BlogPost />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="projects/new" element={<AdminProjectForm />} />
            <Route path="projects/:id" element={<AdminProjectForm />} />
            
            {/* Books */}
            <Route path="books" element={<BooksDashboard />} />
            <Route path="books/new" element={<BookForm />} />
            <Route path="books/:id" element={<BookForm />} />
            
            {/* Contents */}
            <Route path="contents" element={<ContentsDashboard />} />
            <Route path="contents/new" element={<ContentForm />} />
            <Route path="contents/:id" element={<ContentForm />} />
            
            {/* Courses */}
            <Route path="courses" element={<CoursesDashboard />} />
            <Route path="courses/new" element={<CourseForm />} />
            <Route path="courses/:id" element={<CourseForm />} />
            
            {/* Experiences */}
            <Route path="experiences" element={<ExperiencesDashboard />} />
            <Route path="experiences/new" element={<ExperienceForm />} />
            <Route path="experiences/:id" element={<ExperienceForm />} />
            
            {/* Education */}
            <Route path="education" element={<EducationDashboard />} />
            <Route path="education/new" element={<EducationForm />} />
            <Route path="education/:id" element={<EducationForm />} />
            
            {/* Profile */}
            <Route path="profiles" element={<ProfileForm />} />
            
            {/* Technologies */}
            <Route path="technologies" element={<TechnologiesDashboard />} />
            <Route path="technologies/new" element={<TechnologyForm />} />
            <Route path="technologies/:id" element={<TechnologyForm />} />
            
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

import { Download, MessageCircle, Info, BookOpen } from "lucide-react";
import { useProfiles } from "@/hooks/useProfile";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const { data: profiles = [], isLoading } = useProfiles();
  const profile = profiles[0];
  
  const profileName = profile?.full_name || "Waldo Eller";
  const heroTitle = profile?.hero_title || `Eu sou ${profileName.split(' ')[0]} ${profileName.split(' ')[1]},`;
  const currentFocus = profile?.current_focus || "Data, Technology & AI";
  const bioSummary = profile?.bio_summary || "Transformando dados em decisões que geram resultado real";
  const cvUrl = profile?.cv_url || "";

  return (
    <section className="animate-fade-up delay-100">
      {/* Removed Available Badge */}
      {/* Main Headline */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-2">
        {heroTitle}
      </h1>
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight">
        {currentFocus}
      </h2>
      
      {/* Pitch */}
      <p className="text-lg text-muted-foreground mt-6 max-w-2xl leading-relaxed">
        {bioSummary}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mt-8">
        {cvUrl ? (
          <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
            <Download className="w-5 h-5" />
            CV
          </a>
        ) : (
          <span className="btn-primary opacity-50 cursor-not-allowed">
            <Download className="w-5 h-5" />
            CV
          </span>
        )}
        <a href="#contact" className="btn-secondary">
          <MessageCircle className="w-5 h-5" />
          Contato
        </a>
        <Link to="/about" className="btn-secondary">
          <Info className="w-5 h-5" />
          Sobre
        </Link>
        <Link to="/blog" className="btn-secondary">
          <BookOpen className="w-5 h-5" />
          Blog
        </Link>
      </div>
      
      {/* Stats */}
      <div className="stats-grid mt-12">
        <div className="stat-item">
          <p className="stat-number">+15</p>
          <p className="stat-label">Projetos Ativos</p>
        </div>
        <div className="stat-item">
          <p className="stat-number">5+</p>
          <p className="stat-label">Anos de Experiência</p>
        </div>
        <div className="stat-item col-span-2 flex items-center justify-center bg-card/30 rounded-2xl border border-foreground/5 p-4">
          <p className="stat-number-small">
            Data is the <span className="line-through text-muted-foreground font-normal mx-1">Future</span> Present.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
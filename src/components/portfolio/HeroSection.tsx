import { Download, MessageCircle } from "lucide-react";
import { useProfiles } from "@/hooks/useProfile";

const HeroSection = () => {
  const { data: profiles = [], isLoading } = useProfiles();
  const profile = profiles[0];
  
  const profileName = profile?.full_name || "Waldo Eller";
  const currentFocus = profile?.current_focus || "Data, Technology & AI";
  const bioSummary = profile?.bio_summary || "Transformando dados em decisões que geram resultado real";

  return (
    <section className="animate-fade-up delay-100">
      {/* Available to work badge */}
      <div className="flex items-center gap-2 mb-6">
        <span className="available-badge">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Disponível para novos desafios.
        </span>
      </div>
      
      {/* Greeting */}
      <p className="text-muted-foreground text-lg mb-4">👋 Say Hello</p>
      
      {/* Main Headline */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-2">
        Eu sou {profileName.split(' ')[0]} {profileName.split(' ')[1]},
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
        <a href="/cv-waldo-eller.pdf" download className="btn-primary">
          <Download className="w-5 h-5" />
          Download CV
        </a>
        <a href="#contact" className="btn-secondary">
          <MessageCircle className="w-5 h-5" />
          Entre em Contato
        </a>
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
        <div className="stat-item">
          <p className="stat-number">3+</p>
          <p className="stat-label">Anos de Experiência</p>
        </div>
        <div className="stat-item">
          <p className="stat-number-small">Data is the Future Present.</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
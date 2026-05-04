import { Download, MessageCircle, Info, BookOpen } from "lucide-react";
import { useProfiles } from "@/hooks/useProfile";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const { data: profiles = [], isLoading } = useProfiles();
  const profile = profiles[0];
  
  if (isLoading) {
    return (
      <section className="animate-pulse">
        <div className="h-12 md:h-16 bg-secondary rounded-xl w-3/4 mb-4" />
        <div className="h-12 md:h-16 bg-secondary rounded-xl w-1/2 mb-6" />
        <div className="h-4 bg-secondary rounded w-2/3 mb-2" />
        <div className="h-4 bg-secondary rounded w-1/2 mb-8" />
        <div className="flex gap-4 mb-12">
          <div className="h-12 w-24 bg-secondary rounded-lg" />
          <div className="h-12 w-24 bg-secondary rounded-lg" />
        </div>
      </section>
    );
  }

  const profileName = profile?.full_name || "";
  const heroTitle = profile?.hero_title || (profileName ? `Eu sou ${profileName.split(' ')[0]} ${profileName.split(' ')[1]},` : "");
  const currentFocus = profile?.current_focus || "";
  const bioSummary = profile?.bio_summary || "";
  const cvUrl = profile?.cv_url || "";
  const stat1Number = profile?.stat_1_number || "+15";
  const stat1Label = profile?.stat_1_label || "Projetos Ativos";
  const stat2Number = profile?.stat_2_number || "5+";
  const stat2Label = profile?.stat_2_label || "Anos de Experiência";
  const phraseStart = profile?.hero_phrase_start || "Data is the";
  const phraseStrike = profile?.hero_phrase_strike || "Future";
  const phraseEnd = profile?.hero_phrase_end || "Present.";

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
        <Link to="/contact" className="btn-secondary">
          <MessageCircle className="w-5 h-5" />
          Contato
        </Link>
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
          <p className="stat-number">{stat1Number}</p>
          <p className="stat-label">{stat1Label}</p>
        </div>
        <div className="stat-item">
          <p className="stat-number">{stat2Number}</p>
          <p className="stat-label">{stat2Label}</p>
        </div>
        <div className="stat-item col-span-2 flex items-center justify-center bg-card/30 rounded-2xl border border-foreground/5 p-4">
          <p className="stat-number-small">
            {phraseStart} <span className="line-through text-muted-foreground font-normal mx-1">{phraseStrike}</span> {phraseEnd}
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

import { useProfiles } from "@/hooks/useProfile";

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
    </section>
  );
};

export default HeroSection;

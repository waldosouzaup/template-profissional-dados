import ProfileCard from "@/components/portfolio/ProfileCard";
import HeroSection from "@/components/portfolio/HeroSection";

import ProjectsSection from "@/components/portfolio/ProjectsSection";
import SkillsSection from "@/components/portfolio/SkillsSection";
import ContactSection from "@/components/portfolio/ContactSection";
import FooterSection from "@/components/portfolio/FooterSection";
import SEOHead from "@/components/SEOHead";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pt-16">
      <SEOHead
        title="Waldo Eller | Especialista em Dados, Tecnologia e IA"
        description="Portfolio e Blog de Waldo Eller, Especialista em Dados, Tecnologia e IA. Fundador da NoCode StartUp e criador do maior ecossistema de NoCode IA do Brasil."
        canonical="https://waldoeller.com/"
        ogType="website"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Waldo Eller",
          jobTitle: "Especialista em Dados, Tecnologia e IA",
          url: "https://waldoeller.com",
          sameAs: [],
          knowsAbout: ["Dados", "Inteligência Artificial", "Tecnologia", "NoCode"],
        }}
      />
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column - Profile Card */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <ProfileCard />
          </aside>

          {/* Right Column - Main Content */}
          <main className="lg:col-span-8 xl:col-span-9">
            <HeroSection />

            <ProjectsSection />
            <SkillsSection />
            <ContactSection />
            <FooterSection />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
import ProfileCard from "@/components/portfolio/ProfileCard";
import HeroSection from "@/components/portfolio/HeroSection";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import ProjectsSection from "@/components/portfolio/ProjectsSection";
import SkillsSection from "@/components/portfolio/SkillsSection";
import FooterSection from "@/components/portfolio/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column - Profile Card */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <ProfileCard />
          </aside>

          {/* Right Column - Main Content */}
          <main className="lg:col-span-8 xl:col-span-9">
            <HeroSection />
            <ExperienceSection />
            <ProjectsSection />
            <SkillsSection />
            <FooterSection />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;

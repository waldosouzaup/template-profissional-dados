import { Mail, Linkedin, Github } from "lucide-react";
import { useProfiles } from "@/hooks/useProfile";

const ContactSection = () => {
  const { data: profiles = [] } = useProfiles();
  const profile = profiles[0];
  
  const email = profile?.email || "contato@waldoeller.com";

  return (
    <section id="contact" className="animate-fade-up delay-500 mt-20">
      {/* Section Header */}
      <div className="section-header">
        <div className="section-icon">
          <Mail className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">Vamos Conversar</h3>
      </div>

      {/* Contact Info */}
      <div className="space-y-4">
        <div className="contact-info-item">
          <span className="contact-label">Email</span>
          <a href={`mailto:${email}`} className="contact-value hover:text-primary transition-colors">
            {email}
          </a>
        </div>
        
        <div className="contact-info-item">
          <span className="contact-label">LinkedIn</span>
          <a href="https://linkedin.com/in/waldoeller" target="_blank" rel="noopener noreferrer" className="contact-value hover:text-primary transition-colors">
            in/waldoeller
          </a>
        </div>
        
        <div className="contact-info-item">
          <span className="contact-label">GitHub</span>
          <a href="https://github.com/waldosouzaup" target="_blank" rel="noopener noreferrer" className="contact-value hover:text-primary transition-colors">
            /waldosouzaup
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
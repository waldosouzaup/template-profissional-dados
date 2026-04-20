import { Github, Linkedin, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { useProfiles } from "@/hooks/useProfile";

const socialLinks = [
  { icon: Github, href: "https://github.com/waldosouzaup", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/waldoeller", label: "LinkedIn" },
  { icon: Instagram, href: "https://www.instagram.com/waldo.eller", label: "Instagram" },
];

const FooterSection = () => {
  const { data: profiles = [] } = useProfiles();
  const profile = profiles[0];
  
  const profileName = profile?.full_name || "Waldo Eller";
  const currentFocus = profile?.current_focus || "Data, Technology & AI";

  return (
    <footer className="animate-fade-up delay-500 mt-20 pt-10 border-t border-border">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Social Links */}
        <div className="flex items-center gap-4">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              aria-label={social.label}
            >
              <social.icon className="w-5 h-5 text-foreground transition-colors" />
            </a>
          ))}
        </div>

        {/* Copyright & Admin Link */}
        <div className="flex flex-col items-center sm:items-end gap-2 text-right">
          <p className="text-sm text-muted-foreground">
            © 2026 {profileName} | {currentFocus}
          </p>
          <Link to="/admin/login" className="text-[10px] text-muted-foreground/50 hover:text-primary transition-colors">
            Acesso Administrativo
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;

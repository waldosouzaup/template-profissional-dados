import { Youtube, Linkedin, Instagram } from "lucide-react";

const socialLinks = [
  { icon: Youtube, href: "https://www.youtube.com/@nocodestartup", label: "YouTube" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/matheuscastelobranco/", label: "LinkedIn" },
  { icon: Instagram, href: "https://www.instagram.com/mat_castelo/", label: "Instagram" },
];

const FooterSection = () => {
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

        {/* Copyright */}
        <p className="text-sm text-muted-foreground">
          © 2025 Matheus Castelo | NoCode StartUp
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;

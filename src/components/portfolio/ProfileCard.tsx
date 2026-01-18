import { Youtube, Linkedin, Instagram } from "lucide-react";
import profilePhoto from "@/assets/profile-photo.jpg";

const socialLinks = [
  { icon: Youtube, href: "https://www.youtube.com/@nocodestartup", label: "YouTube" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/matheuscastelobranco/", label: "LinkedIn" },
  { icon: Instagram, href: "https://www.instagram.com/mat_castelo/", label: "Instagram" },
];

const ProfileCard = () => {
  return (
    <div className="profile-card animate-fade-up sticky top-8">
      {/* Profile Image */}
      <div className="w-full aspect-square rounded-2xl overflow-hidden bg-secondary mb-2">
        <img
          src={profilePhoto}
          alt="Matheus Castelo"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Name */}
      <h2 className="text-2xl font-bold text-foreground mt-2">Matheus Castelo</h2>

      {/* Social Links */}
      <div className="flex items-center gap-3 mt-2">
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
    </div>
  );
};

export default ProfileCard;

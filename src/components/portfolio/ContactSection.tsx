import { useState } from "react";
import { Mail, Send, User, MessageSquare } from "lucide-react";
import { useProfiles } from "@/hooks/useProfile";
import { toast } from "sonner";

const ContactSection = () => {
  const { data: profiles = [], isLoading } = useProfiles();
  const profile = profiles[0];
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);

  if (isLoading) {
    return (
      <section className="animate-pulse mt-20">
        <div className="h-8 bg-secondary rounded w-48 mb-6" />
        <div className="h-12 bg-secondary rounded-xl w-full mb-4" />
        <div className="h-40 bg-secondary rounded-xl w-full" />
      </section>
    );
  }

  const email = profile?.email || "";
  const contactKey = profile?.contact_form_key || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    setIsSending(true);

    if (contactKey) {
      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: contactKey,
            name: formData.name,
            email: formData.email,
            message: formData.message,
            subject: `Contato via Portfólio - ${formData.name}`,
            from_name: formData.name,
            replyto: formData.email,
          }),
        });

        const result = await response.json();
        if (result.success) {
          toast.success("Mensagem enviada com sucesso!");
          setFormData({ name: "", email: "", message: "" });
        } else {
          toast.error("Erro ao enviar mensagem. Tente novamente.");
        }
      } catch (error) {
        console.error("Error sending form:", error);
        toast.error("Erro de conexão. Verifique sua internet.");
      } finally {
        setIsSending(false);
      }
    } else {
      // Fallback to mailto if no key is configured
      const subject = encodeURIComponent(`Contato via Portfólio - ${formData.name}`);
      const body = encodeURIComponent(
        `Nome: ${formData.name}\nEmail: ${formData.email}\n\nMensagem:\n${formData.message}`
      );
      
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
      
      setTimeout(() => {
        setIsSending(false);
        setFormData({ name: "", email: "", message: "" });
        toast.success("Cliente de email aberto! Envie sua mensagem.");
      }, 1000);
    }
  };

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
      <div className="mb-6">
        <div className="contact-info-item">
          <span className="contact-label">Email</span>
          <a href={`mailto:${email}`} className="contact-value hover:text-primary transition-colors">
            {email}
          </a>
        </div>
      </div>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Seu nome"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-primary/50"
              style={{
                background: 'hsl(0 0% 8%)',
                border: '1px solid hsl(0 0% 18%)',
              }}
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              placeholder="Seu email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-primary/50"
              style={{
                background: 'hsl(0 0% 8%)',
                border: '1px solid hsl(0 0% 18%)',
              }}
              required
            />
          </div>
        </div>

        {/* Message */}
        <div className="relative">
          <div className="absolute left-4 top-4 text-muted-foreground">
            <MessageSquare className="w-4 h-4" />
          </div>
          <textarea
            placeholder="Sua mensagem..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={4}
            className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
            style={{
              background: 'hsl(0 0% 8%)',
              border: '1px solid hsl(0 0% 18%)',
            }}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSending}
          className="btn-primary w-full sm:w-auto justify-center"
        >
          <Send className="w-4 h-4" />
          {isSending ? "Enviando..." : "Enviar mensagem"}
        </button>
      </form>
    </section>
  );
};

export default ContactSection;
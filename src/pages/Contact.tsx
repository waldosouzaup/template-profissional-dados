import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  Phone,
  Send,
  User,
} from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { useProfiles } from "@/hooks/useProfile";
import { toast } from "sonner";

const Contact = () => {
  const { data: profiles = [], isLoading } = useProfiles();
  const profile = profiles[0];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const email = profile?.email || "";
  const phone = profile?.phone || "";
  const contactKey = profile?.contact_form_key || "";
  const contactLocations = ["Brasília, DF", "Belo Horizonte - MG"];

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
            subject: `Contato via Portfolio - ${formData.name}`,
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
        toast.error("Erro de conexao. Verifique sua internet.");
      } finally {
        setIsSending(false);
      }
    } else {
      const subject = encodeURIComponent(`Contato via Portfolio - ${formData.name}`);
      const body = encodeURIComponent(
        `Nome: ${formData.name}\nEmail: ${formData.email}\n\nMensagem:\n${formData.message}`,
      );

      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;

      setTimeout(() => {
        setIsSending(false);
        setFormData({ name: "", email: "", message: "" });
        toast.success("Cliente de email aberto! Envie sua mensagem.");
      }, 1000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/25">
            Carregando contato
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-foreground/20 pt-16">
      <SEOHead
        title={`Contato - ${profile?.full_name || "Waldo Eller"}`}
        description={
          profile?.bio_summary ||
          "Entre em contato para projetos, consultorias e conversas sobre Dados, IA e Tecnologia."
        }
        canonical="https://waldoeller.com/contact"
        ogType="website"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contato",
          url: "https://waldoeller.com/contact",
          about: profile?.full_name || "Waldo Eller",
        }}
      />

      <section className="pt-24 pb-16 px-8 sm:px-12 lg:px-20 max-w-[1400px] mx-auto animate-[fadeInUp_0.6s_ease-out_both]">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-foreground/35 hover:text-foreground/70 transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para home
        </Link>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-foreground/30">
            Contato
          </p>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-light tracking-tight text-foreground leading-[1.05] max-w-4xl">
          Vamos conversar sobre o seu proximo <span className="text-primary italic">projeto</span>.
        </h1>
      </section>

      <main className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16">
          <aside className="animate-[fadeInUp_0.7s_ease-out_0.1s_both]">
            <div className="sticky top-28 space-y-6">
              <div className="glass-panel p-6 rounded-2xl border border-foreground/[0.06]">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-foreground/30">
                      Canais
                    </p>
                    <h2 className="text-xl font-light text-foreground">Fale comigo</h2>
                  </div>
                </div>

                <div className="space-y-5">
                  {email && (
                    <a
                      href={`mailto:${email}`}
                      className="flex items-start gap-4 text-foreground/55 hover:text-primary transition-colors"
                    >
                      <Mail className="w-5 h-5 mt-0.5 shrink-0" />
                      <span className="text-sm leading-relaxed">{email}</span>
                    </a>
                  )}

                  {phone && (
                    <a
                      href={`tel:${phone}`}
                      className="flex items-start gap-4 text-foreground/55 hover:text-primary transition-colors"
                    >
                      <Phone className="w-5 h-5 mt-0.5 shrink-0" />
                      <span className="text-sm leading-relaxed">{phone}</span>
                    </a>
                  )}

                  <div className="flex items-start gap-4 text-foreground/55">
                    <MapPin className="w-5 h-5 mt-0.5 shrink-0" />
                    <div className="space-y-1">
                      {contactLocations.map((city) => (
                        <p key={city} className="text-sm leading-relaxed">
                          {city}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-foreground/[0.06] pt-6">
                <p className="text-sm text-foreground/40 leading-relaxed">
                  Use o formulario para projetos, parcerias, consultorias ou apenas para
                  abrir uma boa conversa sobre dados, automacao e IA.
                </p>
              </div>
            </div>
          </aside>

          <section className="animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
            <form
              onSubmit={handleSubmit}
              className="glass-panel p-6 sm:p-8 rounded-2xl border border-foreground/[0.06] space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-foreground bg-card border border-border placeholder:text-muted-foreground/60 transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-primary/50"
                    required
                  />
                </div>

                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    placeholder="Seu email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-foreground bg-card border border-border placeholder:text-muted-foreground/60 transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-primary/50"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-4 top-4 text-muted-foreground">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <textarea
                  placeholder="Sua mensagem..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={8}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-foreground bg-card border border-border placeholder:text-muted-foreground/60 transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="btn-primary w-full sm:w-auto justify-center"
              >
                {isSending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {isSending ? "Enviando..." : "Enviar mensagem"}
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Contact;

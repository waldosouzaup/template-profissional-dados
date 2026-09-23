import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Award, Loader2, Palette, Phone, Send, Sparkles, UserRound, Zap } from "lucide-react";
import { useProfiles } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { HOME_SECTION_DEFAULTS } from "@/lib/home-sections";
import SkillsManager from "@/components/admin/SkillsManager";
import CoursesManager from "@/components/admin/CoursesManager";
import { Field, GroupHeading, SectionCard, SectionIndex, SubsectionLabel } from "@/components/admin/page-sections";

const SECTION_INDEX = [
  { group: "Identidade", sections: [{ id: "perfil", title: "Perfil" }, { id: "marca", title: "Marca" }] },
  {
    group: "Página inicial",
    sections: [{ id: "hero", title: "Destaque (Hero)" }, { id: "skills", title: "Skills & Tecnologias" }, { id: "certificacoes", title: "Certificações" }],
  },
  { group: "Contato", sections: [{ id: "dados-contato", title: "Dados de contato" }, { id: "formulario-contato", title: "Formulário de contato" }] },
];

export default function ProfileForm() {
  const { data: profiles = [], isLoading, updateProfile, isUpdating } = useProfiles();
  const profile = profiles[0];
  const { hash } = useLocation();

  // Deep links such as /admin/profiles#skills (old Skills menu) land on the right section.
  useEffect(() => {
    if (!isLoading && hash) document.getElementById(hash.slice(1))?.scrollIntoView({ block: "start" });
  }, [hash, isLoading]);

  const [formData, setFormData] = useState({
    ...HOME_SECTION_DEFAULTS,
    full_name: "",
    bio_summary: "",
    phone: "",
    email: "",
    avatar_url: "",
    location: "",
    current_focus: "",
    cv_url: "",
    favicon_url: "",
    hero_title: "",
    contact_form_key: "",
    navbar_icon: "",
    navbar_logo_url: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        skills_title: profile.skills_title ?? HOME_SECTION_DEFAULTS.skills_title,
        skills_description: profile.skills_description ?? HOME_SECTION_DEFAULTS.skills_description,
        certifications_title: profile.certifications_title ?? HOME_SECTION_DEFAULTS.certifications_title,
        certifications_description: profile.certifications_description ?? HOME_SECTION_DEFAULTS.certifications_description,
        full_name: profile.full_name || "",
        bio_summary: profile.bio_summary || "",
        phone: profile.phone || "",
        email: profile.email || "",
        avatar_url: profile.avatar_url || "",
        location: profile.location || "",
        current_focus: profile.current_focus || "",
        cv_url: profile.cv_url || "",
        favicon_url: profile.favicon_url || "",
        hero_title: profile.hero_title || "",
        contact_form_key: profile.contact_form_key || "",
        navbar_icon: profile.navbar_icon || "",
        navbar_logo_url: profile.navbar_logo_url || "",
      });
    }
  }, [profile]);

  const bind = (key: keyof typeof formData) => ({
    id: key,
    value: formData[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFormData((prev) => ({ ...prev, [key]: e.target.value })),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (profile) {
        // Spread the stored profile first so columns not edited here (theme, tracking tags...) are kept.
        await updateProfile({ ...profile, ...formData });
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  if (isLoading) {
    return <div className="text-muted-foreground animate-pulse">Carregando...</div>;
  }

  return (
    <div className="animate-fade-up max-w-5xl">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-foreground">Perfil (Home)</h1>
        <p className="text-muted-foreground mt-1">Sua identidade, a página inicial e os dados de contato exibidos no site.</p>
      </header>

      <div className="lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-10">
        <SectionIndex label="Seções do perfil" groups={SECTION_INDEX} />

        <form onSubmit={handleSubmit} className="min-w-0 space-y-12">
          <section aria-labelledby="grupo-identidade" className="space-y-5">
            <GroupHeading id="grupo-identidade">Identidade</GroupHeading>

            <SectionCard id="perfil" icon={UserRound} title="Perfil" description="Nome, foto e localização aparecem no card de perfil, no rodapé e na página Sobre.">
              <ImageUpload
                label="Foto de perfil"
                value={formData.avatar_url}
                onChange={(url) => setFormData((prev) => ({ ...prev, avatar_url: url }))}
                path="profile"
              />
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field id="full_name" label="Nome completo">
                  <Input {...bind("full_name")} placeholder="Seu nome" />
                </Field>
                <Field id="location" label="Localização">
                  <Input {...bind("location")} placeholder="Cidade, UF" />
                </Field>
              </div>
            </SectionCard>

            <SectionCard id="marca" icon={Palette} title="Marca" description="Ícone da aba do navegador e logo da barra de navegação do site.">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <ImageUpload
                    label="Favicon"
                    value={formData.favicon_url}
                    onChange={(url) => setFormData((prev) => ({ ...prev, favicon_url: url }))}
                    path="favicon"
                  />
                  <p className="text-xs text-muted-foreground">PNG quadrado, de preferência 512×512px.</p>
                </div>
                <div className="space-y-2">
                  <ImageUpload
                    label="Logo da navbar"
                    value={formData.navbar_logo_url}
                    onChange={(url) => setFormData((prev) => ({ ...prev, navbar_logo_url: url }))}
                    path="portfolio"
                  />
                  <p className="text-xs text-muted-foreground">Se enviada, substitui o ícone na barra de navegação.</p>
                </div>
              </div>
              <Field
                id="navbar_icon"
                label="Ícone da navbar (fallback)"
                hint="Nome de um ícone Lucide em PascalCase (ex.: Database, Terminal). Usado quando não há logo."
              >
                <Input {...bind("navbar_icon")} placeholder="Ex: Database" />
              </Field>
            </SectionCard>
          </section>

          <section aria-labelledby="grupo-home" className="space-y-5">
            <GroupHeading id="grupo-home">Página inicial</GroupHeading>

            <SectionCard id="hero" icon={Sparkles} title="Destaque (Hero)" description="A primeira dobra da página inicial: título, destaque, apresentação e botão de CV.">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field id="hero_title" label="Título principal">
                  <Input {...bind("hero_title")} placeholder="Ex: Infraestrutura Linux e" />
                </Field>
                <Field id="current_focus" label="Foco atual (destaque em verde)" hint="Também aparece no rodapé e na página Sobre.">
                  <Input {...bind("current_focus")} placeholder="Ex: Cloud/DevOps" />
                </Field>
              </div>
              <Field id="bio_summary" label="Bio resumida" hint="Texto de apresentação abaixo do título; também usado como descrição do site.">
                <Textarea {...bind("bio_summary")} placeholder="Resumo da sua bio" rows={3} />
              </Field>
              <Field id="cv_url" label="Link do CV (PDF)" hint="Usado no botão CV da página inicial.">
                <Input {...bind("cv_url")} placeholder="https://exemplo.com/meu-cv.pdf" />
              </Field>
            </SectionCard>

            <SectionCard id="skills" icon={Zap} title="Skills & Tecnologias" description="Título, descrição e as skills exibidas na Home, agrupadas por categoria.">
              <SubsectionLabel title="Textos da seção" hint="Salvos pelo botão Salvar Alterações." />
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field id="skills_title" label="Título de Skills">
                  <Input {...bind("skills_title")} required />
                </Field>
                <Field id="skills_description" label="Descrição de Skills">
                  <Textarea {...bind("skills_description")} rows={2} />
                </Field>
              </div>
              <SubsectionLabel title="Skills" hint="Cadastre, edite e organize as skills por categoria." />
              <SkillsManager />
            </SectionCard>

            <SectionCard id="certificacoes" icon={Award} title="Certificações" description="Título, descrição e quais cursos aparecem como certificações na Home.">
              <SubsectionLabel title="Textos da seção" hint="Salvos pelo botão Salvar Alterações." />
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field id="certifications_title" label="Título de Certificações">
                  <Input {...bind("certifications_title")} required />
                </Field>
                <Field id="certifications_description" label="Descrição de Certificações">
                  <Textarea {...bind("certifications_description")} rows={2} />
                </Field>
              </div>
              <SubsectionLabel title="Certificações" hint="Ligue o interruptor para destacar o curso na Home." />
              <CoursesManager context="home" />
            </SectionCard>
          </section>

          <section aria-labelledby="grupo-contato" className="space-y-5">
            <GroupHeading id="grupo-contato">Contato</GroupHeading>

            <SectionCard id="dados-contato" icon={Phone} title="Dados de contato" description="Exibidos na página de contato e na página Sobre.">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field id="phone" label="Telefone">
                  <Input {...bind("phone")} placeholder="(00) 0 0000-0000" />
                </Field>
                <Field id="email" label="E-mail">
                  <Input {...bind("email")} type="email" placeholder="voce@exemplo.com" />
                </Field>
              </div>
            </SectionCard>

            <SectionCard id="formulario-contato" icon={Send} title="Formulário de contato" description="Permite que o formulário da página de contato envie e-mails diretamente.">
              <Field
                id="contact_form_key"
                label="Chave de acesso Web3Forms"
                hint={
                  <>
                    Crie uma chave gratuita em{" "}
                    <a href="https://web3forms.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      web3forms.com
                    </a>
                    . Sem ela, o formulário abre o e-mail do visitante.
                  </>
                }
              >
                <Input {...bind("contact_form_key")} placeholder="Seu Access Key do Web3Forms" className="font-mono text-sm" />
              </Field>
            </SectionCard>
          </section>

          <div className="sticky bottom-0 z-10 -mx-2 flex items-center justify-between gap-4 rounded-xl border border-border bg-background/85 px-4 py-3 backdrop-blur-md">
            <p className="hidden text-xs text-muted-foreground sm:block">As alterações valem para todo o site.</p>
            <Button type="submit" disabled={isUpdating} className="w-full sm:w-auto">
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Alterações
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

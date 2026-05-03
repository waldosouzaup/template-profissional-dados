import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfiles } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/ImageUpload";

export default function ProfileForm() {
  const navigate = useNavigate();
  const { data: profiles = [], isLoading, updateProfile, isUpdating } = useProfiles();
  
  const profile = profiles[0];
  
  const [formData, setFormData] = useState({
    full_name: "",
    bio_summary: "",
    phone: "",
    email: "",
    avatar_url: "",
    location: "",
    current_focus: "",
    about_title: "",
    cv_url: "",
    favicon_url: "",
    hero_title: "",
    stat_1_number: "",
    stat_1_label: "",
    stat_2_number: "",
    stat_2_label: "",
    hero_phrase_start: "",
    hero_phrase_strike: "",
    hero_phrase_end: "",
    contact_form_key: "",
    navbar_icon: "",
    navbar_logo_url: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        bio_summary: profile.bio_summary || "",
        phone: profile.phone || "",
        email: profile.email || "",
        avatar_url: profile.avatar_url || "",
        location: profile.location || "",
        current_focus: profile.current_focus || "",
        about_title: profile.about_title || "",
        cv_url: profile.cv_url || "",
        favicon_url: profile.favicon_url || "",
        hero_title: profile.hero_title || "",
        stat_1_number: profile.stat_1_number || "",
        stat_1_label: profile.stat_1_label || "",
        stat_2_number: profile.stat_2_number || "",
        stat_2_label: profile.stat_2_label || "",
        hero_phrase_start: profile.hero_phrase_start || "",
        hero_phrase_strike: profile.hero_phrase_strike || "",
        hero_phrase_end: profile.hero_phrase_end || "",
        contact_form_key: profile.contact_form_key || "",
        navbar_icon: profile.navbar_icon || "",
        navbar_logo_url: profile.navbar_logo_url || "",
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (profile) {
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
    <div className="max-w-2xl animate-fade-up">
      <Card>
        <CardHeader>
          <CardTitle>Editar Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* INFORMAÇÕES PESSOAIS */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b border-border pb-2">Informações Pessoais</h3>
              <div>
                <label className="text-sm font-medium text-foreground">Nome Completo</label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Seu nome"
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Localização</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Cidade, UF"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Foco Atual</label>
                  <Input
                    value={formData.current_focus}
                    onChange={(e) => setFormData({ ...formData, current_focus: e.target.value })}
                    placeholder="Foco atual"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* CONTATO */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b border-border pb-2">Contato</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Telefone</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Telefone"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email"
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground">Link do CV (PDF para Download)</label>
                <Input
                  value={formData.cv_url}
                  onChange={(e) => setFormData({ ...formData, cv_url: e.target.value })}
                  placeholder="https://exemplo.com/meu-cv.pdf"
                  className="mt-1"
                />
                <p className="text-[10px] text-muted-foreground mt-1">
                  Cole aqui o link do PDF do seu currículo. Este link será usado no botão CV da página inicial.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Chave de Acesso Web3Forms (Para o Form de Contato)</label>
                <Input
                  value={formData.contact_form_key}
                  onChange={(e) => setFormData({ ...formData, contact_form_key: e.target.value })}
                  placeholder="Seu Access Key do Web3Forms"
                  className="mt-1"
                />
                <p className="text-[10px] text-muted-foreground mt-1">
                  Para que o formulário de contato envie e-mails diretamente, crie uma chave gratuita em <a href="https://web3forms.com/" target="_blank" className="text-primary hover:underline">web3forms.com</a>.
                </p>
              </div>
            </div>

            {/* TEXTOS E PÁGINAS */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b border-border pb-2">Textos das Páginas</h3>
              <div>
                <label className="text-sm font-medium text-foreground">Título Principal da Home (Hero)</label>
                <Input
                  value={formData.hero_title}
                  onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                  placeholder="Ex: Eu sou Waldo Eller,"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Bio Resumida (Página Inicial)</label>
                <Textarea
                  value={formData.bio_summary}
                  onChange={(e) => setFormData({ ...formData, bio_summary: e.target.value })}
                  placeholder="Resumo da sua bio"
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Título da Página Sobre</label>
                <Input
                  value={formData.about_title}
                  onChange={(e) => setFormData({ ...formData, about_title: e.target.value })}
                  placeholder="Título da página Sobre"
                  className="mt-1"
                />
              </div>
            </div>

            {/* ESTATÍSTICAS E FRASE (HERO) */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b border-border pb-2">Estatísticas e Frase (Hero)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Estatística 1 (Número)</label>
                  <Input
                    value={formData.stat_1_number}
                    onChange={(e) => setFormData({ ...formData, stat_1_number: e.target.value })}
                    placeholder="Ex: +15"
                  />
                  <label className="text-sm font-medium text-foreground">Estatística 1 (Label)</label>
                  <Input
                    value={formData.stat_1_label}
                    onChange={(e) => setFormData({ ...formData, stat_1_label: e.target.value })}
                    placeholder="Ex: Projetos Ativos"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Estatística 2 (Número)</label>
                  <Input
                    value={formData.stat_2_number}
                    onChange={(e) => setFormData({ ...formData, stat_2_number: e.target.value })}
                    placeholder="Ex: 5+"
                  />
                  <label className="text-sm font-medium text-foreground">Estatística 2 (Label)</label>
                  <Input
                    value={formData.stat_2_label}
                    onChange={(e) => setFormData({ ...formData, stat_2_label: e.target.value })}
                    placeholder="Ex: Anos de Experiência"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-sm font-medium text-foreground">Frase do Hero (Efeito de Risco)</label>
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    value={formData.hero_phrase_start}
                    onChange={(e) => setFormData({ ...formData, hero_phrase_start: e.target.value })}
                    placeholder="Ex: Data is the"
                  />
                  <Input
                    value={formData.hero_phrase_strike}
                    onChange={(e) => setFormData({ ...formData, hero_phrase_strike: e.target.value })}
                    placeholder="Ex: Future"
                  />
                  <Input
                    value={formData.hero_phrase_end}
                    onChange={(e) => setFormData({ ...formData, hero_phrase_end: e.target.value })}
                    placeholder="Ex: Present."
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">
                  A frase será montada como: [Início] [Riscado] [Fim]
                </p>
              </div>
            </div>

            {/* MÍDIA & BRANDING */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b border-border pb-2">Mídia & Branding</h3>
              <div>
                <ImageUpload
                  label="Foto de Perfil (Avatar)"
                  value={formData.avatar_url}
                  onChange={(url) => setFormData({ ...formData, avatar_url: url })}
                  path="profile"
                />
              </div>
              
              <div className="pt-4">
                <ImageUpload
                  label="Favicon do Site"
                  value={formData.favicon_url}
                  onChange={(url) => setFormData({ ...formData, favicon_url: url })}
                  path="favicon"
                />
                <p className="text-[10px] text-muted-foreground mt-1">
                  Envie uma imagem PNG (idealmente 512×512px) para usar como ícone do site no navegador.
                </p>
              </div>

              <div className="pt-4">
                <ImageUpload
                  label="Logo da Navbar"
                  value={formData.navbar_logo_url}
                  onChange={(url) => setFormData({ ...formData, navbar_logo_url: url })}
                  path="portfolio"
                />
                <p className="text-[10px] text-muted-foreground mt-1">
                  Se enviado, a logo substituirá o ícone na barra de navegação.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Ícone da Navbar (Fallback)</label>
                <Input
                  value={formData.navbar_icon}
                  onChange={(e) => setFormData({ ...formData, navbar_icon: e.target.value })}
                  placeholder="Ex: Database, Code, Terminal (nome do ícone Lucide)"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Nome do ícone da biblioteca Lucide React (em PascalCase). Usado se não houver logo.
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 pt-6 border-t border-border">
              <Button type="submit" disabled={isUpdating} className="w-full sm:w-auto">
                {isUpdating ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
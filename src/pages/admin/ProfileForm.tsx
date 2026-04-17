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
    bio_detailed: "",
    phone: "",
    email: "",
    avatar_url: "",
    location: "",
    current_focus: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        bio_summary: profile.bio_summary || "",
        bio_detailed: profile.bio_detailed || "",
        phone: profile.phone || "",
        email: profile.email || "",
        avatar_url: profile.avatar_url || "",
        location: profile.location || "",
        current_focus: profile.current_focus || "",
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Nome Completo</label>
              <Input
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Seu nome"
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground">Bio Resumida</label>
              <Textarea
                value={formData.bio_summary}
                onChange={(e) => setFormData({ ...formData, bio_summary: e.target.value })}
                placeholder="Resumo da sua bio"
                className="mt-1"
                rows={2}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground">Bio Detalhada</label>
              <Textarea
                value={formData.bio_detailed}
                onChange={(e) => setFormData({ ...formData, bio_detailed: e.target.value })}
                placeholder="Bio detalhada"
                className="mt-1"
                rows={5}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
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
              <ImageUpload
                label="Foto de Perfil (Avatar)"
                value={formData.avatar_url}
                onChange={(url) => setFormData({ ...formData, avatar_url: url })}
                path="profile"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
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
            
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Book, Code2, HelpCircle, Info, Settings as SettingsIcon, Loader2 } from "lucide-react";
import { useProfiles } from "@/hooks/useProfile";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import AppearanceSettings from "@/components/admin/AppearanceSettings";

export default function Settings() {
  return (
    <div className="animate-fade-up space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <SettingsIcon className="w-8 h-8 text-primary" />
          Configurações
        </h1>
        <p className="text-muted-foreground mt-1">Personalize a aparência e veja as instruções do sistema.</p>
      </div>

      <AppearanceSettings />
      <TrackingSettings />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="w-5 h-5 text-primary" />
            Manual do Usuário
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-invert max-w-none">
          <div className="space-y-6 text-muted-foreground">
            <section>
              <h3 className="text-foreground flex items-center gap-2">
                <Info className="w-4 h-4" />
                Como gerenciar Projetos
              </h3>
              <p>
                A aba de <strong>Projetos</strong> permite que você adicione, edite ou remova itens do seu portfólio. 
                Ao criar um novo projeto, você pode definir imagens, tecnologias utilizadas e uma descrição detalhada em Markdown.
              </p>
            </section>

            <section>
              <h3 className="text-foreground flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                Dicas de Markdown
              </h3>
              <p>
                Em campos que aceitam Markdown (como Bio Detalhada e Descrição de Projetos), você pode usar:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><code># Título</code> para títulos grandes</li>
                <li><code>## Subtítulo</code> para títulos menores</li>
                <li><code>**Texto em negrito**</code></li>
                <li><code>*Texto em itálico*</code></li>
                <li><code>[Link](https://exemplo.com)</code> para links</li>
                <li><code>- Item</code> para listas</li>
              </ul>
            </section>

            <section>
              <h3 className="text-foreground flex items-center gap-2">
                <Info className="w-4 h-4" />
                Configurações de SEO e Branding
              </h3>
              <p>
                Na aba <strong>Perfil</strong>, você pode gerenciar a identidade visual do seu site:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Favicon:</strong> O ícone que aparece na aba do navegador. Recomenda-se PNG 512x512px.</li>
                <li><strong>Logo da Navbar:</strong> Você pode fazer o upload de uma imagem para ser sua logo principal no topo do site.</li>
                <li><strong>Ícone da Navbar:</strong> Caso não queira usar uma imagem, pode escolher um nome de ícone da biblioteca Lucide (ex: Database, Code). Ele servirá como fallback se não houver logo.</li>
              </ul>
              <p className="mt-2 text-xs">
                Certifique-se de preencher a bio resumida para que as redes sociais e o Google exibam a descrição correta do seu site.
              </p>
            </section>

            <section>
              <h3 className="text-foreground">Imagens</h3>
              <p>
                Ao enviar imagens, procure usar formatos otimizados (WebP ou JPG) para garantir que seu site carregue rapidamente para os visitantes.
              </p>
            </section>

            <section>
              <h3 className="text-foreground flex items-center gap-2">
                <Code2 className="w-4 h-4" />
                Tags de Rastreamento
              </h3>
              <p>
                Na aba <strong>Configurações</strong>, cole snippets completos de Google Tag,
                Google Analytics, Google Tag Manager, Pixel da Meta ou tags equivalentes. Os
                scripts serão aplicados automaticamente no site público após salvar.
              </p>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TrackingSettings() {
  const { data: profiles = [], updateProfile, isUpdating } = useProfiles();
  const profile = profiles[0];
  const [trackingTags, setTrackingTags] = useState("");

  useEffect(() => {
    if (profile) {
      setTrackingTags(profile.tracking_tags || "");
    }
  }, [profile]);

  const handleSave = async () => {
    if (!profile) return;

    await updateProfile({
      ...profile,
      tracking_tags: trackingTags,
    });
  };

  if (!profile) return null;

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-primary" />
          Tags de Rastreamento
        </CardTitle>
        <CardDescription>
          Insira snippets completos de ferramentas como Google Tag, Google Analytics, Google Tag
          Manager, Pixel da Meta ou plataformas semelhantes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tracking-tags">Snippets HTML/JavaScript</Label>
          <Textarea
            id="tracking-tags"
            value={trackingTags}
            onChange={(event) => setTrackingTags(event.target.value)}
            placeholder={`<!-- Google tag (gtag.js) -->\n<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>\n<script>\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n  gtag('config', 'G-XXXXXXXXXX');\n</script>`}
            className="min-h-[260px] font-mono text-xs"
          />
          <p className="text-xs text-muted-foreground">
            Cole apenas tags de provedores confiáveis. Este conteúdo será injetado no site público
            para habilitar mensuração, remarketing e pixels.
          </p>
        </div>

        <Button onClick={handleSave} disabled={isUpdating} className="w-full sm:w-auto">
          {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Salvar Tags
        </Button>
      </CardContent>
    </Card>
  );
}

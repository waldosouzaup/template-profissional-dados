import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Book, HelpCircle, Info, Settings as SettingsIcon, Palette, Moon, Sun, Loader2 } from "lucide-react";
import { useProfiles } from "@/hooks/useProfile";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

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

      <ThemeSettings />

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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const THEME_COLORS = [
  { name: "Verde (Padrão)", value: "142 71% 45%", hex: "#22c55e" },
  { name: "Azul", value: "221 83% 53%", hex: "#3b82f6" },
  { name: "Roxo", value: "262 83% 58%", hex: "#8b5cf6" },
  { name: "Laranja", value: "24 98% 50%", hex: "#f97316" },
  { name: "Rosa", value: "346 87% 43%", hex: "#e11d48" },
  { name: "Amarelo", value: "45 93% 47%", hex: "#eab308" },
];

function ThemeSettings() {
  const { data: profiles = [], updateProfile, isUpdating } = useProfiles();
  const profile = profiles[0];
  
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [color, setColor] = useState("142 71% 45%");

  useEffect(() => {
    if (profile) {
      setTheme(profile.theme as "dark" | "light" || "dark");
      setColor(profile.primary_color || "142 71% 45%");
    }
  }, [profile]);

  const handleSave = async () => {
    if (!profile) return;
    await updateProfile({
      ...profile,
      theme,
      primary_color: color,
    });
  };

  if (!profile) return null;

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          Aparência do Portfólio
        </CardTitle>
        <CardDescription>
          Escolha o tema (Claro/Escuro) e a cor de destaque principal do projeto.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        
        {/* Tema */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Tema</Label>
          <RadioGroup 
            value={theme} 
            onValueChange={(val: "dark" | "light") => setTheme(val)}
            className="flex gap-4"
          >
            <div className={`flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50'}`} onClick={() => setTheme('dark')}>
              <RadioGroupItem value="dark" id="dark" className="sr-only" />
              <div className="flex flex-col items-center gap-2">
                <Moon className={`w-6 h-6 ${theme === 'dark' ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`font-medium ${theme === 'dark' ? 'text-foreground' : 'text-muted-foreground'}`}>Dark Mode</span>
              </div>
            </div>
            
            <div className={`flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50'}`} onClick={() => setTheme('light')}>
              <RadioGroupItem value="light" id="light" className="sr-only" />
              <div className="flex flex-col items-center gap-2">
                <Sun className={`w-6 h-6 ${theme === 'light' ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`font-medium ${theme === 'light' ? 'text-foreground' : 'text-muted-foreground'}`}>Light Mode</span>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Cores */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Cor de Destaque</Label>
          <div className="flex flex-wrap gap-3">
            {THEME_COLORS.map((c) => (
              <button
                key={c.name}
                onClick={() => setColor(c.value)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  color === c.value 
                    ? "ring-2 ring-offset-2 ring-offset-background ring-foreground scale-110" 
                    : "hover:scale-110 ring-1 ring-border"
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        <Button onClick={handleSave} disabled={isUpdating} className="w-full sm:w-auto">
          {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Salvar Aparência
        </Button>
      </CardContent>
    </Card>
  );
}

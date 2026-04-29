import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, HelpCircle, Info, Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <div className="animate-fade-up space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <SettingsIcon className="w-8 h-8 text-primary" />
          Configurações
        </h1>
        <p className="text-muted-foreground mt-1">Configurações gerais e documentação.</p>
      </div>

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
              <h3 className="text-foreground">Configurações de SEO</h3>
              <p>
                Na aba <strong>Perfil</strong>, você pode alterar o título do site e o <strong>Favicon</strong> (o ícone que aparece na aba do navegador).
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

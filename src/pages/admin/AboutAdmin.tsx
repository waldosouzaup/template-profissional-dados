import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Award, BookOpen, Briefcase, ExternalLink, GraduationCap, Loader2, UserRound } from "lucide-react";
import { useProfiles } from "@/hooks/useProfile";
import { useEducationList } from "@/hooks/useEducation";
import { useExperiences } from "@/hooks/useExperiences";
import { useBooks } from "@/hooks/useBooks";
import { useCourses } from "@/hooks/useCourses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import EntityManager from "@/components/admin/EntityManager";
import EducationEditor from "@/components/admin/EducationEditor";
import ExperienceEditor from "@/components/admin/ExperienceEditor";
import BookEditor from "@/components/admin/BookEditor";
import CoursesManager from "@/components/admin/CoursesManager";
import { Field, SectionCard, SectionIndex } from "@/components/admin/page-sections";
import { findExperienceIcon } from "@/lib/experience-icons";
import type { Book, Education, Experience } from "@/types/database";

// Same order as the public /about page.
const SECTIONS = [
  { id: "apresentacao", title: "Título e apresentação" },
  { id: "formacao", title: "Formação Acadêmica" },
  { id: "experiencias", title: "Experiências Profissionais" },
  { id: "livros", title: "Livros" },
  { id: "cursos", title: "Cursos Complementares" },
];

const joinParts = (...parts: (string | undefined)[]) => parts.filter(Boolean).join(" · ");

function IntroForm() {
  const { data: profiles = [], updateProfile, isUpdating } = useProfiles();
  const profile = profiles[0];
  const [aboutTitle, setAboutTitle] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (profile) {
      setAboutTitle(profile.about_title || "");
      setBio(profile.bio_detailed || "");
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profile) await updateProfile({ ...profile, about_title: aboutTitle, bio_detailed: bio });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field id="about_title" label="Título da página" hint="A última palavra aparece destacada em verde.">
        <Input id="about_title" value={aboutTitle} onChange={(e) => setAboutTitle(e.target.value)} placeholder="Ex: Paixão por transformar dados em conhecimento" />
      </Field>
      <Field id="bio_detailed" label="Apresentação" hint="Texto de abertura da página. Aceita Markdown: **negrito**, listas e links.">
        <Textarea id="bio_detailed" value={bio} onChange={(e) => setBio(e.target.value)} rows={8} />
      </Field>
      <div className="flex justify-end">
        <Button type="submit" disabled={isUpdating}>
          {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Salvar título e apresentação
        </Button>
      </div>
    </form>
  );
}

function EducationList() {
  const { data = [], isLoading, deleteEducation } = useEducationList();
  return (
    <EntityManager<Education>
      items={data}
      isLoading={isLoading}
      primary={(item) => item.title}
      secondary={(item) => joinParts(item.institution, item.period)}
      hint="Ordenadas pelo campo Ordem · alterações salvas na hora."
      labels={{
        add: "Adicionar formação", newTitle: "Nova formação", editTitle: "Editar formação",
        dialogDescription: "Aparece em Formação Acadêmica na página Sobre.",
        empty: "Nenhuma formação cadastrada.", deleteTitle: "Excluir formação?",
        deleteDescription: (item) => `"${item.title}" sai da página Sobre. Esta ação não pode ser desfeita.`,
      }}
      renderEditor={(item, close) => <EducationEditor education={item} onDone={close} onCancel={close} />}
      onDelete={(item) => deleteEducation(item.id)}
    />
  );
}

function ExperienceList() {
  const { data = [], isLoading, deleteExperience } = useExperiences();
  return (
    <EntityManager<Experience>
      items={data}
      isLoading={isLoading}
      primary={(item) => item.title}
      secondary={(item) => joinParts(item.institution, item.period)}
      leading={(item) => {
        const { icon: Icon, label } = findExperienceIcon(item.icon_type);
        return (
          <span title={label} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/25">
            <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
          </span>
        );
      }}
      hint="Ordenadas pelo campo Ordem · alterações salvas na hora."
      labels={{
        add: "Adicionar experiência", newTitle: "Nova experiência", editTitle: "Editar experiência",
        dialogDescription: "Aparece em Experiências Profissionais na página Sobre.",
        empty: "Nenhuma experiência cadastrada.", deleteTitle: "Excluir experiência?",
        deleteDescription: (item) => `"${item.title}" sai da página Sobre. Esta ação não pode ser desfeita.`,
      }}
      renderEditor={(item, close) => <ExperienceEditor experience={item} onDone={close} onCancel={close} />}
      onDelete={(item) => deleteExperience(item.id)}
    />
  );
}

function BookList() {
  const { data = [], isLoading, deleteBook } = useBooks();
  return (
    <EntityManager<Book>
      items={data}
      isLoading={isLoading}
      primary={(item) => item.title}
      secondary={(item) => item.author}
      leading={(item) =>
        item.image_url ? (
          <img src={item.image_url} alt="" className="h-10 w-8 shrink-0 rounded object-cover" />
        ) : (
          <div className="flex h-10 w-8 shrink-0 items-center justify-center rounded bg-secondary">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </div>
        )
      }
      labels={{
        add: "Adicionar livro", newTitle: "Novo livro", editTitle: "Editar livro",
        dialogDescription: "Aparece em Livros na página Sobre.",
        empty: "Nenhum livro cadastrado.", deleteTitle: "Excluir livro?",
        deleteDescription: (item) => `"${item.title}" sai da página Sobre. Esta ação não pode ser desfeita.`,
      }}
      renderEditor={(item, close) => <BookEditor book={item} onDone={close} onCancel={close} />}
      onDelete={(item) => deleteBook(item.id)}
    />
  );
}

export default function AboutAdmin() {
  const { hash } = useLocation();
  // Lists above the target grow when their data arrives, so scrolling earlier would land short of it.
  const isLoading = [useProfiles(), useEducationList(), useExperiences(), useBooks(), useCourses()].some((query) => query.isLoading);

  // Old list URLs redirect here with an anchor (e.g. #livros).
  useEffect(() => {
    if (hash && !isLoading) document.getElementById(hash.slice(1))?.scrollIntoView({ block: "start" });
  }, [hash, isLoading]);

  return (
    <div className="animate-fade-up max-w-5xl">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sobre</h1>
          <p className="text-muted-foreground mt-1">Tudo o que aparece na página Sobre, na mesma ordem do site.</p>
        </div>
        <a href="/about" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
          Ver página <ExternalLink className="h-4 w-4" />
        </a>
      </header>

      <div className="lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-10">
        <SectionIndex label="Seções da página Sobre" groups={[{ sections: SECTIONS }]} />

        <div className="min-w-0 space-y-6">
          <SectionCard id="apresentacao" icon={UserRound} title="Título e apresentação" description="O topo da página: título e texto de abertura.">
            <IntroForm />
          </SectionCard>
          <SectionCard id="formacao" icon={GraduationCap} title="Formação Acadêmica" description="Graduações, pós e cursos técnicos.">
            <EducationList />
          </SectionCard>
          <SectionCard id="experiencias" icon={Briefcase} title="Experiências Profissionais" description="Cargos e empresas por onde você passou.">
            <ExperienceList />
          </SectionCard>
          <SectionCard id="livros" icon={BookOpen} title="Livros" description="Livros que marcaram sua formação.">
            <BookList />
          </SectionCard>
          <SectionCard id="cursos" icon={Award} title="Cursos Complementares" description="Cursos e certificações. Ligue o interruptor para destacá-los também na Home.">
            <CoursesManager context="about" />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

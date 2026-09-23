import { useCourses } from "@/hooks/useCourses";
import { Switch } from "@/components/ui/switch";
import EntityManager from "@/components/admin/EntityManager";
import CourseEditor from "@/components/admin/CourseEditor";
import type { Course } from "@/types/database";

// The same courses feed the Sobre page (Cursos Complementares) and, when switched on, the Home (Certificações).
const COPY = {
  home: {
    add: "Adicionar certificação", newTitle: "Nova certificação", editTitle: "Editar certificação",
    dialogDescription: "O curso também aparece na página Sobre, em Cursos Complementares.", defaultShowOnHome: true,
  },
  about: {
    add: "Adicionar curso", newTitle: "Novo curso", editTitle: "Editar curso",
    dialogDescription: "Aparece em Cursos Complementares na página Sobre. Marque para destacar também na Home.", defaultShowOnHome: false,
  },
};

export default function CoursesManager({ context }: { context: keyof typeof COPY }) {
  const { data: courses = [], isLoading, updateCourse, deleteCourse } = useCourses();
  const copy = COPY[context];
  const onHome = courses.filter((course) => course.show_on_home).length;

  return (
    <EntityManager<Course>
      items={courses}
      isLoading={isLoading}
      primary={(course) => course.title}
      secondary={(course) => course.period}
      leading={(course) => (
        <Switch
          checked={!!course.show_on_home}
          onCheckedChange={(checked) => updateCourse({ ...course, show_on_home: checked })}
          aria-label={`Exibir ${course.title} na Home`}
        />
      )}
      hint={`${onHome} de ${courses.length} cursos exibidos na Home · alterações salvas na hora.`}
      labels={{
        add: copy.add,
        newTitle: copy.newTitle,
        editTitle: copy.editTitle,
        dialogDescription: copy.dialogDescription,
        empty: "Nenhum curso cadastrado ainda.",
        deleteTitle: "Excluir curso?",
        deleteDescription: (course) =>
          `"${course.title}" sai da página Sobre e da Home. Para tirar só da Home, desligue o interruptor. Esta ação não pode ser desfeita.`,
      }}
      renderEditor={(course, close) => (
        <CourseEditor course={course} defaultShowOnHome={copy.defaultShowOnHome} onDone={close} onCancel={close} />
      )}
      onDelete={(course) => deleteCourse(course.id)}
    />
  );
}

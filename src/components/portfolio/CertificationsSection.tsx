import { Award, ExternalLink, Loader2 } from "lucide-react";
import { useCourses } from "@/hooks/useCourses";
import { useProfiles } from "@/hooks/useProfile";
import { HOME_SECTION_DEFAULTS } from "@/lib/home-sections";

const CertificationsSection = () => {
  const { data: courses = [], isLoading, isError } = useCourses();
  const { data: profiles = [] } = useProfiles();
  const profile = profiles[0];
  const certifications = courses.filter((course) => course.show_on_home);

  return (
    <section aria-labelledby="certifications-heading" className="animate-fade-up mt-16">
      <div className="section-header">
        <div className="section-icon"><Award className="w-5 h-5 text-primary" /></div>
        <h2 id="certifications-heading" className="text-xl font-semibold text-foreground">
          {profile?.certifications_title || HOME_SECTION_DEFAULTS.certifications_title}
        </h2>
      </div>
      <p className="mb-8 text-sm text-muted-foreground leading-relaxed">
        {profile?.certifications_description ?? HOME_SECTION_DEFAULTS.certifications_description}
      </p>
      {isLoading ? (
        <div role="status" className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary" /><span className="sr-only">Carregando certificações</span>
        </div>
      ) : isError ? (
        <p role="alert" className="text-sm text-muted-foreground">Não foi possível carregar as certificações.</p>
      ) : certifications.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhuma certificação publicada no momento.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {certifications.map((course) => (
            <article key={course.id} className="rounded-xl border border-border bg-card p-5 flex flex-col min-w-0">
              {course.certificate_url && (
                <img src={course.certificate_url} alt={`Certificado: ${course.title}`} loading="lazy"
                  className="w-full aspect-video object-contain rounded-lg bg-secondary/30 mb-4" />
              )}
              <h3 className="font-semibold text-foreground break-words">{course.title}</h3>
              {course.period && <p className="text-xs text-primary mt-1">{course.period}</p>}
              {course.description && <p className="text-sm text-muted-foreground mt-3 break-words">{course.description}</p>}
              {!!course.topics?.length && (
                <ul className="flex flex-wrap gap-2 mt-3">
                  {course.topics.map((topic, index) => <li key={`${topic}-${index}`} className="text-xs rounded-md bg-primary/10 text-primary px-2 py-1">{topic}</li>)}
                </ul>
              )}
              {course.certificate_url && (
                <div className="mt-auto pt-5">
                  <a href={course.certificate_url} target="_blank" rel="noopener noreferrer"
                    aria-label={`Ver certificado: ${course.title}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                    Ver certificado <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default CertificationsSection;

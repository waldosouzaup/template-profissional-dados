import type { LucideIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Shared building blocks for admin pages that mirror a public page section by section.

export const SectionCard = ({ id, icon: Icon, title, description, children }: {
  id: string; icon: LucideIcon; title: string; description: string; children: React.ReactNode;
}) => (
  <Card id={id} className="scroll-mt-24">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-lg">
        <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
        {title}
      </CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="space-y-5">{children}</CardContent>
  </Card>
);

export const Field = ({ id, label, hint, children }: { id: string; label: string; hint?: React.ReactNode; children: React.ReactNode }) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    {children}
    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
  </div>
);

export const SubsectionLabel = ({ title, hint }: { title: string; hint: string }) => (
  <div className="border-t border-border pt-5 first:border-t-0 first:pt-0">
    <p className="text-sm font-semibold text-foreground">{title}</p>
    <p className="text-xs text-muted-foreground">{hint}</p>
  </div>
);

export const GroupHeading = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <h2 id={id} className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{children}</h2>
);

export interface IndexGroup {
  group?: string;
  sections: { id: string; title: string }[];
}

export const SectionIndex = ({ label, groups }: { label: string; groups: IndexGroup[] }) => {
  const scrollToSection = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav aria-label={label} className="hidden lg:block">
      <div className="sticky top-24 space-y-6">
        {groups.map(({ group, sections }) => (
          <div key={group ?? sections[0].id}>
            {group && <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{group}</p>}
            <ul className="space-y-1 border-l border-border">
              {sections.map(({ id, title }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => scrollToSection(e, id)}
                    className="-ml-px block border-l border-transparent py-1 pl-4 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                  >
                    {title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
};

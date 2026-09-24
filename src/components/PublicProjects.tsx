import { useEffect, useState } from "react";
import { Globe, ExternalLink, User } from "lucide-react";
import { getPublicProjects, type PublicProject } from "@/lib/admin.functions";
import { useI18n } from "@/lib/providers";

export function usePublicProjects() {
  const [projects, setProjects] = useState<PublicProject[]>([]);
  useEffect(() => {
    getPublicProjects().then((r) => setProjects(r.projects)).catch(() => {});
  }, []);
  return projects;
}

export function ProjectGrid({ projects }: { projects: PublicProject[] }) {
  const { lang } = useI18n();
  const en = lang === "en";
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => (
        <article key={p.id} className={`relative flex flex-col rounded-xl border bg-card p-5 ${p.award_rank ? "border-primary ring-1 ring-primary" : "border-border"}`}>
          {p.award_rank && (
            <div className="absolute -top-3 left-4 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow">
              🏆 {p.award_rank === 1 ? (en ? "Winner · 1st place" : "Primé · 1er prix") : (en ? "Winner · 2nd place" : "Primé · 2e prix")}
            </div>
          )}
          {p.image_url && <img src={p.image_url} alt={p.project_name ?? p.team_name} className="mb-4 h-40 w-full rounded-md border border-border object-cover" />}
          <div className="font-mono text-xs uppercase tracking-widest text-primary">{p.team_name}</div>
          <h3 className="mt-1 text-lg font-bold">{p.project_name ?? p.team_name}</h3>
          {p.team_leader && (
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <User className="h-3 w-3" /> {en ? "Team leader" : "Chef d'équipe"} : {p.team_leader}
            </div>
          )}
          {p.description && <p className="mt-3 flex-1 whitespace-pre-line text-sm text-muted-foreground">{p.description}</p>}
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {p.website_url && <Pill href={p.website_url} icon={Globe} label={en ? "View project" : "Voir le projet"} />}
            {p.docs_url && <Pill href={p.docs_url} icon={ExternalLink} label="Docs" />}
          </div>
        </article>
      ))}
    </div>
  );
}

function Pill({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 hover:border-primary hover:text-primary">
      <Icon className="h-3 w-3" /> {label}
    </a>
  );
}

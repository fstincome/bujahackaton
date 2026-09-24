import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink, FileText, Github, Globe, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/providers";

type Submission = {
  id: string;
  team_name: string;
  contact_email: string | null;
  team_leader?: string | null;
  project_name?: string | null;
  slides_link?: string | null;
  is_public?: boolean;
  award_rank?: number | null;
  github_backend_url?: string | null;
  members: string | null;
  description: string | null;
  website_url: string | null;
  github_url: string | null;
  preview_image_url: string | null;
  slides_pdf_url: string | null;
  docs_url: string | null;
  created_at: string;
};

export function ProjectsAdmin() {
  const { t } = useI18n();
  const [rows, setRows] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [signed, setSigned] = useState<Record<string, string>>({});

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("project_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    const list = (data ?? []) as Submission[];
    setRows(list);
    const paths = list.flatMap((r) => [r.preview_image_url, r.slides_pdf_url].filter(Boolean) as string[]);
    if (paths.length) {
      const { data: urls } = await supabase.storage.from("projects").createSignedUrls(paths, 60 * 60);
      const map: Record<string, string> = {};
      (urls ?? []).forEach((u) => {
        if (u.path && u.signedUrl) map[u.path] = u.signedUrl;
      });
      setSigned(map);
    }
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function setRank(r: Submission, rank: 1 | 2) {
    const next = r.award_rank === rank ? null : rank;
    if (next) await supabase.from("project_submissions").update({ award_rank: null } as any).eq("award_rank", next);
    const { error } = await supabase.from("project_submissions").update({ award_rank: next } as any).eq("id", r.id);
    if (!error) setRows((rs) => rs.map((x) => (x.id === r.id ? { ...x, award_rank: next } : x.award_rank === next ? { ...x, award_rank: null } : x)));
  }

  async function togglePublic(r: Submission) {
    const next = !r.is_public;
    const { error } = await supabase.from("project_submissions").update({ is_public: next } as any).eq("id", r.id);
    if (!error) setRows((rs) => rs.map((x) => (x.id === r.id ? { ...x, is_public: next } : x)));
    else alert(error.message);
  }

  async function remove(id: string) {
    if (!confirm(t("proj.admin.delete"))) return;
    const { error } = await supabase.from("project_submissions").delete().eq("id", id);
    if (!error) setRows((r) => r.filter((x) => x.id !== id));
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{t("proj.admin.title")}</h3>
      {loading ? (
        <div className="py-8 text-center text-sm text-muted-foreground">{t("loading")}</div>
      ) : rows.length === 0 ? (
        <div className="py-8 text-center text-sm text-muted-foreground">{t("proj.admin.empty")}</div>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {rows.map((r) => (
            <div key={r.id} className="rounded-lg border border-border bg-background p-4">
              {r.preview_image_url && signed[r.preview_image_url] && (
                <img
                  src={signed[r.preview_image_url]}
                  alt={r.team_name}
                  className="mb-3 h-40 w-full rounded-md border border-border object-cover"
                />
              )}
              <div className="flex items-start justify-between gap-2">
                <div>
                  {r.project_name && <div className="font-semibold">{r.project_name}</div>}
                  <div className={r.project_name ? "text-sm" : "font-semibold"}>{r.team_name}</div>
                  {r.team_leader && <div className="text-xs text-muted-foreground">Chef : {r.team_leader}</div>}
                  {r.contact_email && <div className="text-xs text-muted-foreground">{r.contact_email}</div>}
                  {r.members && <div className="mt-1 text-xs text-muted-foreground">{r.members}</div>}
                </div>
                <button onClick={() => remove(r.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {r.description && <p className="mt-2 text-sm text-muted-foreground">{r.description}</p>}
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {r.website_url && <LinkPill href={r.website_url} icon={Globe} label="Web" />}
                {r.github_url && <LinkPill href={r.github_url} icon={Github} label={r.github_backend_url ? "GitHub front" : "GitHub"} />}
                {r.github_backend_url && <LinkPill href={r.github_backend_url} icon={Github} label="GitHub back" />}
                {r.docs_url && <LinkPill href={r.docs_url} icon={ExternalLink} label="Docs" />}
                {r.slides_link && <LinkPill href={r.slides_link} icon={FileText} label="Slides" />}
                {r.slides_pdf_url && signed[r.slides_pdf_url] && (
                  <LinkPill href={signed[r.slides_pdf_url]} icon={FileText} label={r.slides_pdf_url.split(".").pop()?.toUpperCase() ?? "PDF"} />
                )}
              </div>
              <div className="mt-3 flex items-center gap-2">
                {r.is_public && <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-mono uppercase text-primary">{t("proj.isPublic")}</span>}
                <button onClick={() => togglePublic(r)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold ${r.is_public ? "border border-border hover:border-destructive" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}>
                  {r.is_public ? t("proj.makePrivate") : t("proj.makePublic")}
                </button>
                {([1, 2] as const).map((k) => (
                  <button key={k} onClick={() => setRank(r, k)}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold ${r.award_rank === k ? "bg-accent text-accent-foreground ring-1 ring-primary" : "border border-border hover:border-primary"}`}>
                    🏆 {k === 1 ? "1er" : "2e"}
                  </button>
                ))}
              </div>
              <div className="mt-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {new Date(r.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LinkPill({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 font-medium hover:border-primary hover:text-primary"
    >
      <Icon className="h-3 w-3" /> {label}
    </a>
  );
}

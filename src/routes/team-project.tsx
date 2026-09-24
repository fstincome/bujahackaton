import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Rocket, Upload } from "lucide-react";
import { useI18n } from "@/lib/providers";
import { getSelectedParticipants, type SelectedParticipant } from "@/lib/admin.functions";

export const Route = createFileRoute("/team-project")({
  component: TeamProjectPage,
  head: () => ({
    meta: [
      { title: "Projet d'équipe — BOOTCAMP GITEGA" },
      { name: "description", content: "Formulaire réservé aux chefs d'équipe pour compléter leur projet." },
      { property: "og:title", content: "Projet d'équipe — BOOTCAMP GITEGA" },
      { property: "og:description", content: "Formulaire réservé aux chefs d'équipe." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

const url = z.string().trim().url().max(500);
const schema = z.object({
  team_leader: z.string().trim().min(2).max(150),
  team_name: z.string().trim().min(1).max(150),
  project_name: z.string().trim().min(2).max(150),
  website_url: url,
  github_url: url,
  github_backend_url: url.optional().or(z.literal("")),
  description: z.string().trim().min(10).max(2000),
  slides_link: url.optional().or(z.literal("")),
});

const L = {
  fr: {
    kicker: "Réservé aux chefs d'équipe",
    title: "Compléter le projet de l'équipe",
    leader: "Chef d'équipe *",
    team: "Équipe *",
    pick: "— Choisir —",
    project: "Nom du projet *",
    web: "Lien web (Vercel, Netlify…) *",
    github: "GitHub — frontend (ou projet complet) *",
    githubBack: "GitHub — backend (si séparé)",
    desc: "Que fait le projet ? *",
    design: "Design du projet (image mise en avant) *",
    designFile: "Choisir une image (PNG, JPG, WebP — 5 Mo max)",
    slides: "Présentation *",
    upload: "Téléverser un fichier",
    link: "Lien public (Google Slides…)",
    file: "Choisir un fichier .pptx ou .pdf (25 Mo max)",
    submit: "Envoyer le projet",
    sending: "Envoi…",
    ok: "Projet envoyé, merci !",
    needSlides: "Ajoutez une présentation (fichier ou lien).",
    needDesign: "Ajoutez l'image du design du projet.",
  },
  en: {
    kicker: "Team leaders only",
    title: "Complete your team's project",
    leader: "Team leader *",
    team: "Team *",
    pick: "— Select —",
    project: "Project name *",
    web: "Web link (Vercel, Netlify…) *",
    github: "GitHub — frontend (or full project) *",
    githubBack: "GitHub — backend (if separate)",
    desc: "What does the project do? *",
    design: "Project design (featured image) *",
    designFile: "Pick an image (PNG, JPG, WebP — 5 MB max)",
    slides: "Presentation *",
    upload: "Upload a file",
    link: "Public link (Google Slides…)",
    file: "Pick a .pptx or .pdf file (25 MB max)",
    submit: "Submit project",
    sending: "Sending…",
    ok: "Project submitted, thank you!",
    needSlides: "Add a presentation (file or link).",
    needDesign: "Add the project design image.",
  },
};

function TeamProjectPage() {
  const { lang } = useI18n();
  const s = L[lang === "en" ? "en" : "fr"];
  const navigate = useNavigate();
  const [people, setPeople] = useState<SelectedParticipant[]>([]);
  const [team, setTeam] = useState("");
  const [mode, setMode] = useState<"upload" | "link">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    getSelectedParticipants().then((r) => setPeople(r.participants)).catch(() => {});
  }, []);

  const teams = useMemo(
    () => Array.from(new Set(people.map((p) => (p.group_name ?? "").trim()).filter(Boolean))).sort(),
    [people],
  );
  const leaders = useMemo(
    () => (team ? people.filter((p) => (p.group_name ?? "").trim() === team) : people),
    [people, team],
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      team_leader: String(fd.get("team_leader") ?? ""),
      team_name: team,
      project_name: String(fd.get("project_name") ?? ""),
      website_url: String(fd.get("website_url") ?? ""),
      github_url: String(fd.get("github_url") ?? ""),
      github_backend_url: String(fd.get("github_backend_url") ?? ""),
      description: String(fd.get("description") ?? ""),
      slides_link: mode === "link" ? String(fd.get("slides_link") ?? "") : "",
    });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
      setErrors(errs);
      return;
    }
    if ((mode === "upload" && !file) || (mode === "link" && !parsed.data.slides_link)) {
      setErrors({ slides: s.needSlides });
      return;
    }
    if (!designFile) {
      setErrors({ design: s.needDesign });
      return;
    }
    setLoading(true);
    try {
      if (designFile.size > 5 * 1024 * 1024) throw new Error("Image: 5 MB max");
      if (!designFile.type.startsWith("image/")) throw new Error("Image uniquement / image only");
      const imgExt = (designFile.name.split(".").pop() || "png").toLowerCase();
      const imgPath = `previews/${crypto.randomUUID()}.${imgExt}`;
      const { error: imgErr } = await supabase.storage.from("projects").upload(imgPath, designFile, {
        contentType: designFile.type,
      });
      if (imgErr) throw imgErr;

      let slides_pdf_url: string | null = null;
      if (mode === "upload" && file) {
        if (file.size > 25 * 1024 * 1024) throw new Error("25 MB max");
        const ext = (file.name.split(".").pop() || "pdf").toLowerCase();
        if (!["pdf", "pptx", "ppt"].includes(ext)) throw new Error(".pdf / .pptx");
        const path = `slides/${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage.from("projects").upload(path, file, {
          contentType: file.type || "application/octet-stream",
        });
        if (error) throw error;
        slides_pdf_url = path;
      }
      const { error } = await supabase.from("project_submissions").insert({
        team_leader: parsed.data.team_leader,
        team_name: parsed.data.team_name,
        project_name: parsed.data.project_name,
        website_url: parsed.data.website_url,
        github_url: parsed.data.github_url,
        github_backend_url: parsed.data.github_backend_url || null,
        description: parsed.data.description,
        slides_link: parsed.data.slides_link || null,
        slides_pdf_url,
        preview_image_url: imgPath,
      } as any);
      if (error) throw error;
      toast.success(s.ok);
      navigate({ to: "/" });
    } catch (err: any) {
      toast.error("Error: " + (err?.message ?? String(err)));
    } finally {
      setLoading(false);
    }
  }

  const field =
    "w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="rounded-2xl border border-border bg-card p-8 md:p-10">
        <div className="font-mono text-xs uppercase tracking-widest text-primary">{s.kicker}</div>
        <h1 className="mt-2 text-3xl font-bold">{s.title}</h1>

        <form onSubmit={onSubmit} className="mt-8 grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label={s.team} error={errors.team_name}>
              <select required value={team} onChange={(e) => setTeam(e.target.value)} className={field}>
                <option value="">{s.pick}</option>
                {teams.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label={s.leader} error={errors.team_leader}>
              <select name="team_leader" required defaultValue="" className={field}>
                <option value="">{s.pick}</option>
                {leaders.map((p) => <option key={p.full_name} value={p.full_name}>{p.full_name}</option>)}
              </select>
            </Field>
          </div>
          <Field label={s.project} error={errors.project_name}>
            <input name="project_name" required maxLength={150} className={field} />
          </Field>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label={s.web} error={errors.website_url}>
              <input name="website_url" type="url" required className={field} placeholder="https://mon-projet.vercel.app" />
            </Field>
            <Field label={s.github} error={errors.github_url}>
              <input name="github_url" type="url" required className={field} placeholder="https://github.com/..." />
            </Field>
          </div>
          <Field label={s.githubBack} error={errors.github_backend_url}>
            <input name="github_backend_url" type="url" className={field} placeholder="https://github.com/.../backend" />
          </Field>
          <Field label={s.desc} error={errors.description}>
            <textarea name="description" required rows={5} maxLength={2000} className={field} />
          </Field>

          <div>
            <span className="mb-1.5 block text-xs font-mono uppercase tracking-wider text-muted-foreground">{s.design}</span>
            <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-input bg-background px-3 py-2.5 text-sm hover:border-primary">
              <Upload className="h-4 w-4 text-primary" />
              <span className="truncate">{designFile ? designFile.name : s.designFile}</span>
              <input type="file" className="hidden" accept="image/png,image/jpeg,image/webp,image/*"
                onChange={(e) => setDesignFile(e.target.files?.[0] ?? null)} />
            </label>
            {designFile && (
              <img src={URL.createObjectURL(designFile)} alt="" className="mt-2 h-32 w-full rounded-md border border-border object-cover" />
            )}
            {errors.design && <span className="mt-1 block text-xs text-destructive">{errors.design}</span>}
          </div>

          <div>
            <span className="mb-1.5 block text-xs font-mono uppercase tracking-wider text-muted-foreground">{s.slides}</span>
            <div className="mb-3 flex gap-2">
              {(["upload", "link"] as const).map((m) => (
                <button key={m} type="button" onClick={() => setMode(m)}
                  className={`rounded-full border px-3 py-1 text-xs ${mode === m ? "border-primary bg-primary text-primary-foreground" : "border-input"}`}>
                  {m === "upload" ? s.upload : s.link}
                </button>
              ))}
            </div>
            {mode === "upload" ? (
              <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-input bg-background px-3 py-2.5 text-sm hover:border-primary">
                <Upload className="h-4 w-4 text-primary" />
                <span className="truncate">{file ? file.name : s.file}</span>
                <input type="file" className="hidden"
                  accept=".pdf,.pptx,.ppt,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
              </label>
            ) : (
              <input name="slides_link" type="url" className={field} placeholder="https://docs.google.com/presentation/..." />
            )}
            {(errors.slides || errors.slides_link) && (
              <span className="mt-1 block text-xs text-destructive">{errors.slides || errors.slides_link}</span>
            )}
          </div>

          <button type="submit" disabled={loading}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
            <Rocket className="h-4 w-4" /> {loading ? s.sending : s.submit}
          </button>
        </form>
      </div>
    </main>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-mono uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Rocket, ArrowLeft, Upload } from "lucide-react";
import { useI18n } from "@/lib/providers";

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
  head: () => ({
    meta: [
      { title: "Soumettre votre projet — BOOTCAMP GITEGA" },
      {
        name: "description",
        content:
          "Déposez le projet de votre équipe pendant le hackathon du Bootcamp Bitcoin de Gitega : liens, aperçu, présentation PDF et documentation.",
      },
      { property: "og:title", content: "Soumettre votre projet — BOOTCAMP GITEGA" },
      {
        property: "og:description",
        content: "Dépôt des projets du hackathon : liens, aperçu, présentation PDF et documentation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const urlOpt = z.string().trim().url().max(500).optional().or(z.literal(""));

const schema = z.object({
  team_name: z.string().trim().min(2).max(150),
  contact_email: z.string().trim().email().max(255),
  members: z.string().trim().max(500).optional().or(z.literal("")),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  website_url: urlOpt,
  github_url: urlOpt,
  docs_url: urlOpt,
});

function ProjectsPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [image, setImage] = useState<File | null>(null);
  const [slides, setSlides] = useState<File | null>(null);

  async function upload(file: File, prefix: string) {
    const ext = file.name.split(".").pop() || "bin";
    const path = `${prefix}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("projects").upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    if (error) throw error;
    return path;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    const fd = new FormData(e.currentTarget);
    const raw = {
      team_name: String(fd.get("team_name") ?? ""),
      contact_email: String(fd.get("contact_email") ?? ""),
      members: String(fd.get("members") ?? ""),
      description: String(fd.get("description") ?? ""),
      website_url: String(fd.get("website_url") ?? ""),
      github_url: String(fd.get("github_url") ?? ""),
      docs_url: String(fd.get("docs_url") ?? ""),
    };
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        errs[String(i.path[0])] = i.message;
      });
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      let preview_image_url: string | null = null;
      let slides_pdf_url: string | null = null;
      if (image || slides) {
        setUploading(true);
        if (image) preview_image_url = await upload(image, "previews");
        if (slides) slides_pdf_url = await upload(slides, "slides");
        setUploading(false);
      }
      const { error } = await supabase.from("project_submissions").insert({
        ...parsed.data,
        members: parsed.data.members || null,
        description: parsed.data.description || null,
        website_url: parsed.data.website_url || null,
        github_url: parsed.data.github_url || null,
        docs_url: parsed.data.docs_url || null,
        preview_image_url,
        slides_pdf_url,
      });
      if (error) throw error;
      toast.success(t("proj.success"));
      navigate({ to: "/" });
    } catch (err: any) {
      toast.error("Error: " + (err?.message ?? String(err)));
    } finally {
      setUploading(false);
      setLoading(false);
    }
  }

  const field =
    "w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> {t("back")}
      </Link>
      <div className="mt-6 rounded-2xl border border-border bg-card p-8 md:p-10">
        <div className="font-mono text-xs uppercase tracking-widest text-primary">{t("proj.kicker")}</div>
        <h1 className="mt-2 text-3xl font-bold">{t("proj.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("proj.subtitle")}</p>

        <form onSubmit={onSubmit} className="mt-8 grid gap-5">
          <Field label={t("proj.team")} error={errors.team_name}>
            <input name="team_name" required maxLength={150} className={field} />
          </Field>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label={t("proj.email")} error={errors.contact_email}>
              <input name="contact_email" type="email" required maxLength={255} className={field} placeholder="team@email.com" />
            </Field>
            <Field label={t("proj.members")} error={errors.members}>
              <input name="members" maxLength={500} className={field} placeholder={t("proj.members.ph")} />
            </Field>
          </div>
          <Field label={t("proj.desc")} error={errors.description}>
            <textarea name="description" rows={4} maxLength={2000} className={field} placeholder={t("proj.desc.ph")} />
          </Field>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label={t("proj.web")} error={errors.website_url}>
              <input name="website_url" type="url" className={field} placeholder="https://..." />
            </Field>
            <Field label={t("proj.github")} error={errors.github_url}>
              <input name="github_url" type="url" className={field} placeholder="https://github.com/..." />
            </Field>
          </div>
          <Field label={t("proj.docs")} error={errors.docs_url}>
            <input name="docs_url" type="url" className={field} placeholder="https://..." />
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <FileField
              label={t("proj.image")}
              help={t("proj.image.help")}
              accept="image/*"
              file={image}
              onPick={setImage}
            />
            <FileField
              label={t("proj.slides")}
              help={t("proj.slides.help")}
              accept="application/pdf"
              file={slides}
              onPick={setSlides}
            />
          </div>

          {uploading && <p className="text-xs text-muted-foreground">{t("proj.uploading")}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 disabled:opacity-60"
          >
            <Rocket className="h-4 w-4" />
            {loading ? t("proj.submitting") : t("proj.submit")}
          </button>
        </form>
      </div>
    </main>
  );
}

function FileField({
  label,
  help,
  accept,
  file,
  onPick,
}: {
  label: string;
  help: string;
  accept: string;
  file: File | null;
  onPick: (f: File | null) => void;
}) {
  return (
    <div>
      <span className="mb-1.5 block text-xs font-mono uppercase tracking-wider text-muted-foreground">{label}</span>
      <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-input bg-background px-3 py-2.5 text-sm hover:border-primary">
        <Upload className="h-4 w-4 text-primary" />
        <span className="truncate">{file ? file.name : help}</span>
        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => onPick(e.target.files?.[0] ?? null)}
        />
      </label>
    </div>
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

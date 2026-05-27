import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Zap, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

const schema = z.object({
  full_name: z.string().trim().min(2, "Nom requis").max(120),
  email: z.string().trim().email("Email invalide").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  profession: z.string().trim().max(120).optional().or(z.literal("")),
  experience_level: z.enum(["beginner", "intermediate", "advanced"]),
  hackathon_choice: z.enum(["hackathon1", "hackathon2", "both"]),
  motivation: z.string().trim().max(1000).optional().or(z.literal("")),
});

function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    const fd = new FormData(e.currentTarget);
    const raw = Object.fromEntries(fd.entries());
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { errs[String(i.path[0])] = i.message; });
      setErrors(errs);
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("registrations").insert(parsed.data);
    setLoading(false);
    if (error) { toast.error("Erreur : " + error.message); return; }
    toast.success("Candidature envoyée ! Nous reviendrons vers vous bientôt.");
    navigate({ to: "/dashboard" });
  }

  const field = "w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Retour
      </Link>
      <div className="mt-6 rounded-2xl border border-border bg-card p-8 md:p-10">
        <div className="font-mono text-xs uppercase tracking-widest text-primary">// Candidature</div>
        <h1 className="mt-2 text-3xl font-bold">Inscription au Bootcamp</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          30 places. Workshops + 2 hackathons à Bujumbura, 5-6 juin 2026.
        </p>

        <form onSubmit={onSubmit} className="mt-8 grid gap-5">
          <Field label="Nom complet *" error={errors.full_name}>
            <input name="full_name" required maxLength={120} className={field} placeholder="Jean Niyongabo" />
          </Field>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Email *" error={errors.email}>
              <input name="email" type="email" required maxLength={255} className={field} placeholder="vous@email.com" />
            </Field>
            <Field label="Téléphone" error={errors.phone}>
              <input name="phone" className={field} placeholder="+257 ..." />
            </Field>
          </div>
          <Field label="Profession / Étudiant en" error={errors.profession}>
            <input name="profession" className={field} placeholder="Développeur, étudiant en informatique..." />
          </Field>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Niveau en Bitcoin/Dev *">
              <select name="experience_level" defaultValue="beginner" className={field} required>
                <option value="beginner">Débutant</option>
                <option value="intermediate">Intermédiaire</option>
                <option value="advanced">Avancé</option>
              </select>
            </Field>
            <Field label="Hackathon visé *">
              <select name="hackathon_choice" defaultValue="both" className={field} required>
                <option value="both">Les deux (5 & 6 juin)</option>
                <option value="hackathon1">Hackathon #1 — 5 juin</option>
                <option value="hackathon2">Hackathon #2 — 6 juin</option>
              </select>
            </Field>
          </div>
          <Field label="Motivation" error={errors.motivation}>
            <textarea name="motivation" rows={4} maxLength={1000} className={field}
              placeholder="Pourquoi voulez-vous participer ? Quel projet aimeriez-vous construire ?" />
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 disabled:opacity-60"
          >
            <Zap className="h-4 w-4" />
            {loading ? "Envoi..." : "Envoyer ma candidature"}
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

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Zap, ArrowLeft, Check, CalendarClock } from "lucide-react";
import { useI18n } from "@/lib/providers";
import { isRegistrationClosed } from "@/lib/deadline";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

const LANGUAGES = [
  "JavaScript", "TypeScript", "Python", "Rust", "Go", "Java", "C", "C++",
  "C#", "PHP", "Ruby", "Kotlin", "Swift", "Dart", "Solidity", "HTML/CSS",
];

const schema = z.object({
  full_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  group_name: z.string().trim().min(2).max(150),
  profession: z.string().trim().max(120).optional().or(z.literal("")),
  experience_level: z.enum(["beginner", "intermediate", "advanced"]),
  dev_role: z.enum(["backend", "frontend", "fullstack"]),
  languages: z.array(z.string().min(1).max(40)).max(20),
  available_all_days: z.literal(true),
  has_laptop: z.boolean(),
  problem_idea: z.string().trim().max(1000).optional().or(z.literal("")),
  motivation: z.string().trim().max(1000).optional().or(z.literal("")),
});

function RegisterPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [languages, setLanguages] = useState<string[]>([]);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    setClosed(isRegistrationClosed());
  }, []);

  function toggleLang(l: string) {
    setLanguages((prev) => (prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    const fd = new FormData(e.currentTarget);
    const raw = {
      ...Object.fromEntries(fd.entries()),
      languages,
      available_all_days: fd.get("available_all_days") === "on",
      has_laptop: fd.get("has_laptop") === "on",
    };
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
    if (error) { toast.error("Error: " + error.message); return; }
    toast.success(t("reg.success"));
    navigate({ to: "/" });
  }


  const field = "w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> {t("back")}
      </Link>
      <div className="mt-6 rounded-2xl border border-border bg-card p-8 md:p-10">
        <div className="font-mono text-xs uppercase tracking-widest text-primary">{t("reg.kicker")}</div>
        <h1 className="mt-2 text-3xl font-bold">{t("reg.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("reg.subtitle")}</p>

        {closed ? (
          <div className="mt-6 rounded-lg border border-destructive/40 bg-destructive/10 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-destructive">
              <CalendarClock className="h-4 w-4" /> {t("reg.closed.title")}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{t("reg.closed.help")}</p>
          </div>
        ) : (
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 font-mono text-xs text-primary">
            <CalendarClock className="h-3.5 w-3.5" /> {t("reg.deadline")}
          </div>
        )}


        <form onSubmit={onSubmit} className="mt-8 grid gap-5">
          <Field label={t("reg.full_name")} error={errors.full_name}>
            <input name="full_name" required maxLength={120} className={field} placeholder="Jean Niyongabo" />
          </Field>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label={t("reg.email")} error={errors.email}>
              <input name="email" type="email" required maxLength={255} className={field} placeholder="you@email.com" />
            </Field>
            <Field label={t("reg.phone")} error={errors.phone}>
              <input name="phone" className={field} placeholder="+257 ..." />
            </Field>
          </div>
          <Field label={t("reg.profession")} error={errors.profession}>
            <input name="profession" className={field} />
          </Field>
          <Field label={t("reg.group")} error={errors.group_name}>
            <input name="group_name" required maxLength={150} className={field} placeholder={t("reg.group.ph")} />
          </Field>
          <Field label={t("reg.level")}>
            <select name="experience_level" defaultValue="beginner" className={field} required>
              <option value="beginner">{t("level.beginner")}</option>
              <option value="intermediate">{t("level.intermediate")}</option>
              <option value="advanced">{t("level.advanced")}</option>
            </select>
          </Field>


          <Field label={t("reg.role")} error={errors.dev_role}>
            <div className="grid grid-cols-3 gap-2">
              {(["backend", "frontend", "fullstack"] as const).map((r) => (
                <label key={r} className="relative">
                  <input type="radio" name="dev_role" value={r} required className="peer sr-only" />
                  <span className="block cursor-pointer rounded-md border border-input bg-background px-3 py-2.5 text-center text-sm transition hover:border-primary peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary peer-checked:font-semibold">
                    {t(`role.${r}`)}
                  </span>
                </label>
              ))}
            </div>
          </Field>

          <Field label={t("reg.langs")} error={errors.languages}>
            <p className="mb-2 text-xs text-muted-foreground">{t("reg.langs.help")}</p>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((l) => {
                const active = languages.includes(l);
                return (
                  <button
                    key={l}
                    type="button"
                    onClick={() => toggleLang(l)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-input bg-background text-foreground hover:border-primary/50"
                    }`}
                  >
                    {active && <Check className="h-3 w-3" />}
                    {l}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label={t("reg.problem")} error={errors.problem_idea}>
            <textarea name="problem_idea" rows={3} maxLength={1000} className={field} placeholder={t("reg.problem.ph")} />
          </Field>

          <Field label={t("reg.motivation")} error={errors.motivation}>
            <textarea name="motivation" rows={4} maxLength={1000} className={field} placeholder={t("reg.motivation.ph")} />
          </Field>

          <div className="grid gap-3 rounded-lg border border-border bg-background p-4">
            <label className="flex items-start gap-3 text-sm">
              <input type="checkbox" name="available_all_days" required className="mt-0.5 h-4 w-4 accent-primary" />
              <span>
                <span className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{t("reg.avail")}</span>
                {t("reg.avail.help")}
              </span>
            </label>
            {errors.available_all_days && <span className="text-xs text-destructive">{t("reg.avail.help")}</span>}
            <label className="flex items-start gap-3 text-sm">
              <input type="checkbox" name="has_laptop" className="mt-0.5 h-4 w-4 accent-primary" />
              <span>
                <span className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{t("reg.laptop")}</span>
                {t("reg.laptop.help")}
              </span>
            </label>
          </div>


          <button
            type="submit"
            disabled={loading || closed}
            title={closed ? t("reg.closed.title") : undefined}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Zap className="h-4 w-4" />
            {loading ? t("reg.submitting") : t("reg.submit")}
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

import { createFileRoute, useNavigate, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ensureAdminAccount } from "@/lib/admin.functions";
import { toast } from "sonner";
import { ArrowLeft, Lock } from "lucide-react";
import { useI18n } from "@/lib/providers";

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) throw redirect({ to: "/dashboard" });
  },
  component: LoginPage,
});

function LoginPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    let { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error && /invalid|credentials/i.test(error.message)) {
      try {
        await ensureAdminAccount({ data: { email, password } });
        const retry = await supabase.auth.signInWithPassword({ email, password });
        error = retry.error;
      } catch (e: any) {
        toast.error(e.message ?? "Init failed.");
        setLoading(false);
        return;
      }
    }
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success(t("login.success"));
    navigate({ to: "/dashboard" });
  }

  const field = "w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <main className="mx-auto max-w-md px-6 py-20">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> {t("back")}
      </Link>
      <div className="mt-6 rounded-2xl border border-border bg-card p-8">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Lock className="h-5 w-5" />
          </span>
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-primary">{t("login.kicker")}</div>
            <h1 className="text-2xl font-bold">{t("login.title")}</h1>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">{t("login.subtitle")}</p>
        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <label className="block">
            <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-muted-foreground">{t("login.email")}</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={field} autoComplete="email" />
          </label>
          <label className="block">
            <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-muted-foreground">{t("login.password")}</span>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={field} autoComplete="current-password" />
          </label>
          <button type="submit" disabled={loading}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 disabled:opacity-60">
            {loading ? t("login.submitting") : t("login.submit")}
          </button>
        </form>
      </div>
    </main>
  );
}

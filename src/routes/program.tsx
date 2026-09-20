import { createFileRoute, Link } from "@tanstack/react-router";
import { Code2, Network, Shield, Trophy, Zap } from "lucide-react";
import { useI18n } from "@/lib/providers";
import { useCohort } from "@/lib/useCohort";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/program")({
  component: ProgramPage,
  head: () => ({
    meta: [
      { title: "Programme — BOOTCAMP GITEGA" },
      { name: "description", content: "Les quatre axes du bootcamp Bitcoin de Gitega : fondamentaux, Lightning, sécurité et hackathon." },
      { property: "og:title", content: "Programme — BOOTCAMP GITEGA" },
      { property: "og:description", content: "Les quatre axes du bootcamp Bitcoin de Gitega : fondamentaux, Lightning, sécurité et hackathon." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function ProgramPage() {
  const { t } = useI18n();
  const { dayOffset } = useCohort();

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <PageHeader kicker={t("program.kicker")} title={t("program.title")} subtitle={t("program.subtitle")} />

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Shield, t: t("prog.1.t"), d: t("prog.1.d"), n: "01" },
          { icon: Network, t: t("prog.2.t"), d: t("prog.2.d"), n: "02" },
          { icon: Code2, t: t("prog.3.t"), d: t("prog.3.d"), n: "03" },
          { icon: Trophy, t: t("prog.4.t"), d: t("prog.4.d"), n: "04" },
        ].map(({ icon: Icon, t: ti, d, n }) => (
          <div key={ti} className="group relative rounded-xl border border-border bg-card p-6 transition hover:border-primary/50">
            <div className="absolute right-4 top-4 font-mono text-xs text-muted-foreground">{n}</div>
            <Icon className="h-8 w-8 text-primary" />
            <h3 className="mt-4 text-lg font-semibold">{ti}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>

      <div className="mt-20">
        <div className="text-center">
          <div className="font-mono text-xs uppercase tracking-widest text-primary">{t("sched.kicker")}</div>
          <h2 className="mt-3 text-3xl font-bold">{t("sched.title")}</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {[
            { d: dayOffset(0), m: t("sched.month"), tt: t("sched.h1.t"), s: t("sched.h1.s") },
            { d: dayOffset(3), m: t("sched.month"), tt: t("sched.h2.t"), s: t("sched.h2.s") },
          ].map((e) => (
            <div key={e.tt} className="flex items-center gap-6 rounded-xl border border-border bg-card p-6">
              <div className="flex h-24 w-24 flex-col items-center justify-center rounded-lg bg-primary/10 border border-primary/30">
                <div className="text-3xl font-bold text-primary">{e.d}</div>
                <div className="font-mono text-[10px] text-primary">{e.m}</div>
              </div>
              <div>
                <h3 className="text-xl font-semibold">{e.tt}</h3>
                <p className="text-sm text-muted-foreground">{e.s}</p>
                <div className="mt-2 font-mono text-xs text-muted-foreground">{t("sched.prizes")}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 flex flex-wrap justify-center gap-3">
        <Link to="/agenda" className="rounded-md border border-border px-6 py-3 text-sm font-semibold hover:bg-secondary">
          {t("nav.agenda")}
        </Link>
        <Link to="/register" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          <Zap className="h-4 w-4" /> {t("cta.apply")}
        </Link>
      </div>
    </main>
  );
}

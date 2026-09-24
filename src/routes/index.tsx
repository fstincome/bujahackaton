import { ProjectGrid, usePublicProjects } from "@/components/PublicProjects";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getPublicRegistrationCount } from "@/lib/admin.functions";
import { ParticipantsGrid, useSelectedParticipants } from "@/components/SelectedParticipants";
import { useI18n } from "@/lib/providers";
import { useCohort } from "@/lib/useCohort";
import heroBg from "@/assets/hero-bg.jpg";
import { Zap, Users, CalendarDays, ListChecks, GraduationCap, Mail } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const { t } = useI18n();
  const [count, setCount] = useState<number | null>(null);
  const publicProjects = usePublicProjects();
  const participants = useSelectedParticipants();
  const { totalDays } = useCohort();

  useEffect(() => {
    getPublicRegistrationCount().then((r) => setCount(r.count)).catch(() => setCount(0));
  }, []);

  const sections = [
    { to: "/program", icon: ListChecks, label: t("nav.program"), desc: t("program.subtitle") },
    { to: "/agenda", icon: CalendarDays, label: t("nav.agenda"), desc: t("agenda.subtitle") },
    { to: "/trainers", icon: GraduationCap, label: t("nav.trainers"), desc: t("trainers.title") },
    { to: "/contact", icon: Mail, label: t("nav.contacts"), desc: t("contact.subtitle") },
  ] as const;

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src={heroBg}
          alt=""
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover opacity-30 dark:opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        <div className="relative mx-auto max-w-5xl px-6 py-24 text-center md:py-32">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-mono text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            {t("hero.badge")}
          </div>
          <h1 className="mt-8 text-5xl font-bold tracking-tight md:text-7xl">
            {t("hero.title1")} <span className="text-primary text-glow">P2P</span><br />
            {t("hero.title2")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">{t("hero.subtitle")}</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90"
            >
              <Zap className="h-4 w-4" /> {t("hero.apply")}
            </Link>
            <Link to="/program" className="rounded-md border border-border px-6 py-3 text-sm font-semibold hover:bg-secondary">
              {t("hero.discover")}
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-3">
            {[
              { v: "30", l: t("stat.participants") },
              { v: String(totalDays), l: t("stat.hackathons") },
              { v: "2", l: t("stat.prize") },
            ].map((s) => (
              <div key={s.l} className="rounded-xl border border-border bg-card/60 p-5 backdrop-blur">
                <div className="text-3xl font-bold text-primary">{s.v}</div>
                <div className="mt-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section navigation cards */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {sections.map(({ to, icon: Icon, label, desc }) => (
            <Link
              key={to}
              to={to}
              className="group rounded-xl border border-border bg-card p-6 transition hover:border-primary/50"
            >
              <Icon className="h-7 w-7 text-primary" />
              <h2 className="mt-4 text-lg font-semibold group-hover:text-primary">{label}</h2>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {publicProjects.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="font-mono text-xs uppercase tracking-widest text-primary">{t("pp.kicker")}</div>
          <h2 className="mt-3 text-2xl font-bold">{t("pp.title")}</h2>
          <p className="mt-2 mb-6 text-sm text-muted-foreground">{t("pp.subtitle")}</p>
          <ProjectGrid projects={publicProjects} />
        </section>
      )}

      {/* Selected participants */}
      {participants.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <ParticipantsGrid participants={participants} />
        </section>
      )}

      {/* Outcomes + CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-8">
            <div className="font-mono text-xs uppercase tracking-widest text-primary">{t("out.kicker")}</div>
            <h3 className="mt-3 text-2xl font-bold">{t("out.title")}</h3>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              {[t("out.1"), t("out.2"), t("out.3"), t("out.4"), t("out.5")].map((o) => (
                <li key={o} className="flex gap-3"><span className="text-primary">▸</span>{o}</li>
              ))}
            </ul>
          </div>
          <div className="relative overflow-hidden rounded-xl border border-primary/40 bg-gradient-to-br from-primary/20 to-primary/5 p-8">
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="relative">
              <Users className="h-8 w-8 text-primary" />
              <h3 className="mt-4 text-2xl font-bold">{t("cta.title")}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("cta.spots")} {count !== null && (
                  <span className="font-mono text-primary">{count} {t("cta.received")}</span>
                )}
              </p>
              <Link
                to="/register"
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <Zap className="h-4 w-4" /> {t("cta.apply")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

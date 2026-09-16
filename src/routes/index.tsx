import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getPublicRegistrationCount } from "@/lib/admin.functions";
import { useI18n } from "@/lib/providers";
import { ContactSection } from "@/components/ContactSection";
import heroBg from "@/assets/hero-bg.jpg";
import { Zap, Calendar, Users, Trophy, Code2, Network, Shield, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

type Cohort = {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  venue: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  days: number;
  tagline: string | null;
  tagline_en: string | null;
  summary: string | null;
  summary_en: string | null;
  highlights: string[] | null;
  highlights_en: string[] | null;
  is_active: boolean;
};

function Landing() {
  const { t, lang } = useI18n();
  const [count, setCount] = useState<number | null>(null);
  const [speakers, setSpeakers] = useState<Array<{ id: string; name: string; role: string | null; role_en: string | null; bio: string | null; bio_en: string | null; twitter_url: string | null; avatar_url: string | null }>>([]);
  const [slots, setSlots] = useState<Array<{ id: string; day: number; start_time: string; end_time: string | null; title: string; title_en: string | null; theme: string | null; theme_en: string | null; speaker_id: string | null; sort_order: number }>>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    getPublicRegistrationCount().then((r) => setCount(r.count)).catch(() => setCount(0));
    supabase
      .from("cohorts")
      .select("id,name,slug,city,venue,location,start_date,end_date,days,tagline,tagline_en,summary,summary_en,highlights,highlights_en,is_active")
      .eq("is_public", true)
      .order("sort_order")
      .then(({ data }) => {
        if (!data || data.length === 0) return;
        const list = data as unknown as Cohort[];
        setCohorts(list);
        setSelectedId((prev) => prev ?? (list.find((c) => c.is_active)?.id ?? list[0].id));
      });
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    (async () => {
      const { data: sl } = await supabase
        .from("schedule_slots")
        .select("*")
        .eq("cohort_id", selectedId)
        .order("day").order("sort_order").order("start_time");
      setSlots((sl ?? []) as any);
      const { data: sp } = await supabase
        .from("speakers")
        .select("id,name,role,role_en,bio,bio_en,twitter_url,avatar_url,cohort_id")
        .or(`cohort_id.eq.${selectedId},cohort_id.is.null`)
        .order("sort_order");
      setSpeakers((sp ?? []) as any);
    })();
  }, [selectedId]);

  const selected = cohorts.find((c) => c.id === selectedId) ?? null;
  const activeCohort = selected;
  const highlights = (lang === "en" ? selected?.highlights_en : selected?.highlights) ?? selected?.highlights ?? [];
  const dateFmt = (d: string | null) =>
    d ? new Date(d).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", { day: "numeric", month: "long", year: "numeric" }) : "";

  const speakerName = (id: string | null) => speakers.find((s) => s.id === id)?.name ?? null;

  const totalDays = selected?.days ?? 2;
  const dayOffset = (offset: number) => {
    if (!selected?.start_date) return String(offset + 1).padStart(2, "0");
    const d = new Date(selected.start_date);
    d.setDate(d.getDate() + offset);
    return String(d.getDate()).padStart(2, "0");
  };



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
        <div className="relative mx-auto max-w-5xl px-6 py-28 text-center md:py-40">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-mono text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            {t("hero.badge")}
          </div>
          <h1 className="mt-8 text-5xl font-bold tracking-tight md:text-7xl">
            {t("hero.title1")} <span className="text-primary text-glow">P2P</span><br />
            {t("hero.title2")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            {t("hero.subtitle")}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90"
            >
              <Zap className="h-4 w-4" /> {t("hero.apply")}
            </Link>
            <a href="#program" className="rounded-md border border-border px-6 py-3 text-sm font-semibold hover:bg-secondary">
              {t("hero.discover")}
            </a>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { v: "30", l: t("stat.participants") },
              { v: String(totalDays), l: t("stat.hackathons") },
              { v: "3", l: t("stat.workshops") },
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

      {/* Program */}
      <section id="program" className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <div className="font-mono text-xs uppercase tracking-widest text-primary">{t("program.kicker")}</div>
          <h2 className="mt-3 text-4xl font-bold">{t("program.title")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{t("program.subtitle")}</p>
        </div>
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
      </section>

      {/* Schedule */}
      <section id="schedule" className="border-y border-border bg-card/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <div className="font-mono text-xs uppercase tracking-widest text-primary">{t("sched.kicker")}</div>
            <h2 className="mt-3 text-4xl font-bold">{t("sched.title")}</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              { d: dayOffset(0), m: t("sched.month"), tt: t("sched.h1.t"), s: t("sched.h1.s") },
              { d: dayOffset(3), m: t("sched.month"), tt: t("sched.h2.t"), s: t("sched.h2.s") },
            ].map((e) => (
              <div key={e.tt} className="flex items-center gap-6 rounded-xl border border-border bg-background p-6">
                <div className="flex h-24 w-24 flex-col items-center justify-center rounded-lg bg-primary/10 border border-primary/30">
                  <div className="text-3xl font-bold text-primary">{e.d}</div>
                  <div className="font-mono text-[10px] text-primary">{e.m}</div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{e.tt}</h3>
                  <p className="text-sm text-muted-foreground">{e.s}</p>
                  <div className="mt-2 font-mono text-xs text-muted-foreground">
                    <span>{t("sched.prizes")}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agenda détaillé */}
      <section id="agenda" className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <div className="font-mono text-xs uppercase tracking-widest text-primary">{t("agenda.kicker")}</div>
          <h2 className="mt-3 text-4xl font-bold">{t("agenda.title")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{t("agenda.subtitle")}</p>
          {activeCohort && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-primary">
              {activeCohort.name}{activeCohort.location ? ` · ${activeCohort.location}` : ""}
            </div>
          )}
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
            const daySlots = slots.filter((s) => s.day === day);
            return (
              <div key={day} className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-mono text-xs uppercase tracking-widest text-primary">
                  {t("agenda.day")} {day}
                </h3>
                {daySlots.length === 0 ? (
                  <div className="mt-6 text-sm text-muted-foreground">{t("agenda.empty")}</div>
                ) : (
                  <ol className="mt-6 space-y-4">
                    {daySlots.map((s) => {
                      const title = lang === "en" ? (s.title_en || s.title) : s.title;
                      const theme = lang === "en" ? (s.theme_en || s.theme) : s.theme;
                      const sp = speakerName(s.speaker_id);
                      return (
                        <li key={s.id} className="flex gap-4 border-l-2 border-primary/40 pl-4">
                          <div className="min-w-[80px] font-mono text-xs text-primary">
                            {s.start_time}{s.end_time ? `–${s.end_time}` : ""}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold">{title}</div>
                            {theme && <div className="mt-1 text-xs text-muted-foreground">{theme}</div>}
                            {sp && <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{t("agenda.by")} {sp}</div>}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </div>
            );
          })}
        </div>
      </section>



      {/* Trainers */}
      <section id="trainers" className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <div className="font-mono text-xs uppercase tracking-widest text-primary">{t("trainers.kicker")}</div>
          <h2 className="mt-3 text-4xl font-bold">{t("trainers.title")}</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {speakers.map((p) => (
            <div key={p.id} className="rounded-xl border border-border bg-card p-6 text-center">
              {p.avatar_url ? (
                <img
                  src={p.avatar_url}
                  alt={p.name}
                  loading="lazy"
                  width={96}
                  height={96}
                  className="mx-auto h-24 w-24 rounded-full object-cover border-2 border-primary/20"
                />
              ) : (
                <div className="mx-auto h-24 w-24 rounded-full bg-secondary flex items-center justify-center text-sm text-muted-foreground border-2 border-primary/20">
                  {p.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <h3 className="mt-4 font-semibold">{p.name}</h3>
              {(lang === "en" ? p.role_en || p.role : p.role) && <p className="text-xs text-muted-foreground">{lang === "en" ? p.role_en || p.role : p.role}</p>}
              {(lang === "en" ? p.bio_en || p.bio : p.bio) && <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{lang === "en" ? p.bio_en || p.bio : p.bio}</p>}
              {p.twitter_url && (
                <a href={p.twitter_url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs text-primary hover:underline">
                  @x →
                </a>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-6 text-center">
          <Sparkles className="mx-auto h-6 w-6 text-primary" />
          <p className="mt-2 text-sm">
            <strong>{t("trainers.guest")}</strong> {t("trainers.guest.body")}
          </p>
        </div>
      </section>

      {/* Outcomes + CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20">
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
              <Link to="/dashboard" className="mt-3 ml-2 inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-semibold hover:bg-secondary">
                <Calendar className="h-4 w-4" /> {t("cta.dashboard")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ContactSection />
    </main>
  );
}

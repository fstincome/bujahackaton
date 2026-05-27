import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getPublicRegistrationCount } from "@/lib/admin.functions";
import heroBg from "@/assets/hero-bg.jpg";
import { Zap, Calendar, Users, Trophy, Code2, Network, Shield, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    getPublicRegistrationCount().then((r) => setCount(r.count)).catch(() => setCount(0));
  }, []);

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src={heroBg}
          alt=""
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        <div className="relative mx-auto max-w-5xl px-6 py-28 text-center md:py-40">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-mono text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Bujumbura, Burundi · 5–6 juin 2026
          </div>
          <h1 className="mt-8 text-5xl font-bold tracking-tight md:text-7xl">
            Bitcoin <span className="text-primary text-glow">P2P</span><br />
            Hackathons
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Deux jours de hacking, trois ateliers pratiques, 30 développeurs.
            Construisons des échanges Bitcoin pair-à-pair, sans intermédiaires, propulsés par Vexl & le Lightning Network.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90"
            >
              <Zap className="h-4 w-4" /> Postuler maintenant
            </Link>
            <a href="#program" className="rounded-md border border-border px-6 py-3 text-sm font-semibold hover:bg-secondary">
              Découvrir le programme
            </a>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { v: "30", l: "Participants" },
              { v: "2", l: "Hackathons" },
              { v: "3", l: "Workshops" },
              { v: "300$", l: "Prix USDT" },
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
          <div className="font-mono text-xs uppercase tracking-widest text-primary">// Programme</div>
          <h2 className="mt-3 text-4xl font-bold">De la théorie à la pratique</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Trois ateliers préparatoires, suivis de deux hackathons d'une journée complète.
          </p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Shield, t: "Bitcoin fundamentals", d: "Échanges P2P permissionless, sans intermédiaires, ni KYC.", n: "01" },
            { icon: Network, t: "Vexl & sécurité", d: "Introduction à Vexl et sécurité dans les systèmes décentralisés.", n: "02" },
            { icon: Code2, t: "Node & Lightning", d: "Lancement d'un node Bitcoin Core et SDKs Lightning en live.", n: "03" },
            { icon: Trophy, t: "Hackathon & pitchs", d: "Team formation, mentorship, démos finales devant un jury.", n: "04" },
          ].map(({ icon: Icon, t, d, n }) => (
            <div key={t} className="group relative rounded-xl border border-border bg-card p-6 transition hover:border-primary/50">
              <div className="absolute right-4 top-4 font-mono text-xs text-muted-foreground">{n}</div>
              <Icon className="h-8 w-8 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Schedule */}
      <section id="schedule" className="border-y border-border bg-card/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <div className="font-mono text-xs uppercase tracking-widest text-primary">// Calendrier</div>
            <h2 className="mt-3 text-4xl font-bold">Deux jours, deux hackathons</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              { d: "05", m: "JUIN 2026", t: "Hackathon #1", s: "Building P2P Bitcoin tools — Vexl style" },
              { d: "06", m: "JUIN 2026", t: "Hackathon #2", s: "Lightning Network apps & pitch session" },
            ].map((e) => (
              <div key={e.t} className="flex items-center gap-6 rounded-xl border border-border bg-background p-6">
                <div className="flex h-24 w-24 flex-col items-center justify-center rounded-lg bg-primary/10 border border-primary/30">
                  <div className="text-3xl font-bold text-primary">{e.d}</div>
                  <div className="font-mono text-[10px] text-primary">{e.m}</div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{e.t}</h3>
                  <p className="text-sm text-muted-foreground">{e.s}</p>
                  <div className="mt-2 flex gap-3 font-mono text-xs text-muted-foreground">
                    <span>🏆 100 USDT — Best Pitch</span>
                    <span>⚡ 50 USDT — Best P2P solution</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trainers */}
      <section id="trainers" className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <div className="font-mono text-xs uppercase tracking-widest text-primary">// Formateurs</div>
          <h2 className="mt-3 text-4xl font-bold">L'équipe</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { n: "Advaxe Ndayisenga", r: "Lead Trainer · Free Tech Institute", x: "https://x.com/AdvaxeIr" },
            { n: "Belyi Nobel Kubwayo", r: "Trainer · Free Tech Institute", x: "https://x.com/belyi_nobel" },
            { n: "Wilfried Cubahiro", r: "Trainer · Free Tech Institute" },
          ].map((p) => (
            <div key={p.n} className="rounded-xl border border-border bg-card p-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                {p.n.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </div>
              <h3 className="mt-4 font-semibold">{p.n}</h3>
              <p className="text-xs text-muted-foreground">{p.r}</p>
              {p.x && (
                <a href={p.x} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs text-primary hover:underline">
                  @x →
                </a>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-6 text-center">
          <Sparkles className="mx-auto h-6 w-6 text-primary" />
          <p className="mt-2 text-sm">
            <strong>Guest speaker remote :</strong> intervention en ligne d'un représentant Vexl
          </p>
        </div>
      </section>

      {/* Outcomes + CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-8">
            <div className="font-mono text-xs uppercase tracking-widest text-primary">// Objectifs</div>
            <h3 className="mt-3 text-2xl font-bold">Résultats attendus</h3>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              {[
                "2 prototypes Bitcoin P2P fonctionnels",
                "30 participants formés & certifiés",
                "70% interagissent avec un node Bitcoin Core",
                "10+ transactions P2P pendant l'évènement",
                "2 projets sélectionnés pour mentorat post-hackathon",
              ].map((o) => (
                <li key={o} className="flex gap-3"><span className="text-primary">▸</span>{o}</li>
              ))}
            </ul>
          </div>
          <div className="relative overflow-hidden rounded-xl border border-primary/40 bg-gradient-to-br from-primary/20 to-primary/5 p-8">
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="relative">
              <Users className="h-8 w-8 text-primary" />
              <h3 className="mt-4 text-2xl font-bold">Rejoignez la cohorte</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                30 places disponibles. {count !== null && (
                  <span className="font-mono text-primary">{count} candidature{count > 1 ? "s" : ""} reçue{count > 1 ? "s" : ""}.</span>
                )}
              </p>
              <Link
                to="/register"
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <Zap className="h-4 w-4" /> Déposer ma candidature
              </Link>
              <Link to="/dashboard" className="mt-3 ml-2 inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-semibold hover:bg-secondary">
                <Calendar className="h-4 w-4" /> Voir le dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

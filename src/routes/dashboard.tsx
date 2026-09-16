import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Users, CheckCircle2, Clock, TrendingUp, LogOut } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, Legend } from "recharts";
import { useI18n } from "@/lib/providers";
import { SpeakersAdmin } from "@/components/SpeakersAdmin";
import { ScheduleAdmin } from "@/components/ScheduleAdmin";
import { CohortsAdmin } from "@/components/CohortsAdmin";
import { ContactMessagesAdmin } from "@/components/ContactMessagesAdmin";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/login" });
  },
  component: Dashboard,
});

type Registration = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  profession: string | null;
  group_name: string | null;
  experience_level: string;
  motivation: string | null;
  hackathon_choice: string;
  status: string;
  created_at: string;
};

const STATUS_COLORS: Record<string, string> = {
  pending: "oklch(0.75 0.17 55)",
  accepted: "oklch(0.65 0.15 145)",
  rejected: "oklch(0.6 0.22 25)",
  waitlist: "oklch(0.7 0.12 200)",
};

function Dashboard() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [rows, setRows] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  async function logout() {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  }

  const [filter, setFilter] = useState<string>("all");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setRows(data as Registration[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from("registrations").update({ status }).eq("id", id);
    if (!error) setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
  }

  const stats = useMemo(() => {
    const total = rows.length;
    const accepted = rows.filter((r) => r.status === "accepted").length;
    const pending = rows.filter((r) => r.status === "pending").length;
    const spots = Math.max(0, 30 - accepted);
    return { total, accepted, pending, spots };
  }, [rows]);

  const byHackathon = useMemo(() => ([
    { name: "Hack #1", value: rows.filter((r) => r.hackathon_choice === "hackathon1").length },
    { name: "Hack #2", value: rows.filter((r) => r.hackathon_choice === "hackathon2").length },
    { name: t("hack.both.short"), value: rows.filter((r) => r.hackathon_choice === "both").length },
  ]), [rows, t]);

  const byLevel = useMemo(() => ([
    { name: t("level.beginner"), value: rows.filter((r) => r.experience_level === "beginner").length },
    { name: t("level.intermediate"), value: rows.filter((r) => r.experience_level === "intermediate").length },
    { name: t("level.advanced"), value: rows.filter((r) => r.experience_level === "advanced").length },
  ]), [rows, t]);

  const filtered = filter === "all" ? rows : rows.filter((r) => r.status === filter);

  function levelLabel(l: string) {
    return { beginner: t("level.beginner"), intermediate: t("level.intermediate"), advanced: t("level.advanced") }[l] ?? l;
  }
  function hackLabel(h: string) {
    return { hackathon1: "Hack #1", hackathon2: "Hack #2", both: t("hack.both.short") }[h] ?? h;
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> {t("back")}
      </Link>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-primary">{t("dash.kicker")}</div>
          <h1 className="mt-2 text-3xl font-bold">{t("dash.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("dash.subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/register" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            {t("dash.new")}
          </Link>
          <button onClick={logout} className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary">
            <LogOut className="h-4 w-4" /> {t("dash.logout")}
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Kpi icon={Users} label={t("kpi.total")} value={stats.total} accent="oklch(0.75 0.17 55)" />
        <Kpi icon={CheckCircle2} label={t("kpi.accepted")} value={stats.accepted} accent="oklch(0.65 0.15 145)" />
        <Kpi icon={Clock} label={t("kpi.pending")} value={stats.pending} accent="oklch(0.7 0.12 200)" />
        <Kpi icon={TrendingUp} label={t("kpi.spots")} value={stats.spots} accent="oklch(0.75 0.17 55)" />
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card title={t("chart.hack")}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byHackathon}>
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="value" fill="oklch(0.75 0.17 55)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title={t("chart.level")}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byLevel} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={3}>
                  {byLevel.map((_, i) => (
                    <Cell key={i} fill={["oklch(0.75 0.17 55)", "oklch(0.7 0.12 200)", "oklch(0.65 0.15 145)"][i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Filters + table */}
      <Card title={t("table.title")} className="mt-6">
        <div className="mb-4 flex flex-wrap gap-2">
          {(["all", "pending", "accepted", "waitlist", "rejected"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-md border px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition ${
                filter === s ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(`filter.${s}`)} {s !== "all" && `(${rows.filter((r) => r.status === s).length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">{t("loading")}</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            {t("table.empty")} {filter !== "all" && `(${t(`filter.${filter}`)})`}.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 pr-4">{t("th.candidate")}</th>
                  <th className="py-3 pr-4">{t("th.group")}</th>
                  <th className="py-3 pr-4">{t("th.level")}</th>
                  <th className="py-3 pr-4">{t("th.hackathon")}</th>
                  <th className="py-3 pr-4">{t("th.date")}</th>
                  <th className="py-3 pr-4">{t("th.status")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="py-3 pr-4">
                      <div className="font-medium">{r.full_name}</div>
                      <div className="text-xs text-muted-foreground">{r.email}</div>
                      {r.profession && <div className="text-xs text-muted-foreground">{r.profession}</div>}
                    </td>
                    <td className="py-3 pr-4 text-xs">{levelLabel(r.experience_level)}</td>
                    <td className="py-3 pr-4 text-xs">{hackLabel(r.hackathon_choice)}</td>
                    <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US")}
                    </td>
                    <td className="py-3 pr-4">
                      <select
                        value={r.status}
                        onChange={(e) => updateStatus(r.id, e.target.value)}
                        className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                        style={{ color: STATUS_COLORS[r.status] }}
                      >
                        <option value="pending">{t("status.pending")}</option>
                        <option value="accepted">{t("status.accepted")}</option>
                        <option value="waitlist">{t("status.waitlist")}</option>
                        <option value="rejected">{t("status.rejected")}</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="mt-6">
        <CohortsAdmin />
      </div>

      <div className="mt-6">
        <ScheduleAdmin />
      </div>

      <div className="mt-6">
        <SpeakersAdmin />
      </div>

      <div className="mt-6">
        <ContactMessagesAdmin />
      </div>
    </main>
  );
}

function Kpi({ icon: Icon, label, value, accent }: { icon: any; label: string; value: number; accent: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4" style={{ color: accent }} />
      </div>
      <div className="mt-3 text-3xl font-bold" style={{ color: accent }}>{value}</div>
    </div>
  );
}

function Card({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-border bg-card p-6 ${className}`}>
      <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

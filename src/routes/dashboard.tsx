import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Users, CheckCircle2, Clock, TrendingUp, LogOut, Download } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, Legend } from "recharts";
import { useI18n } from "@/lib/providers";
import { Button } from "@/components/ui/button";
import { SpeakersAdmin } from "@/components/SpeakersAdmin";
import { ScheduleAdmin } from "@/components/ScheduleAdmin";
import { CohortsAdmin } from "@/components/CohortsAdmin";
import { ContactMessagesAdmin } from "@/components/ContactMessagesAdmin";
import { ProjectsAdmin } from "@/components/ProjectsAdmin";
import { LayoutDashboard, Layers, CalendarDays, Mic, FolderGit2, Mail } from "lucide-react";

const NAV = [
  ["overview", LayoutDashboard, "Candidatures", "Applications"],
  ["cohorts", Layers, "Cohortes", "Cohorts"],
  ["schedule", CalendarDays, "Agenda", "Schedule"],
  ["speakers", Mic, "Formateurs", "Trainers"],
  ["projects", FolderGit2, "Projets soumis", "Submitted projects"],
  ["messages", Mail, "Messages", "Messages"],
] as const;

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
  problem_idea: string | null;
  dev_role: string | null;
  languages: string[] | null;
  available_all_days: boolean | null;
  has_laptop: boolean | null;
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
    { name: t("role.backend"), value: rows.filter((r) => r.dev_role === "backend").length },
    { name: t("role.frontend"), value: rows.filter((r) => r.dev_role === "frontend").length },
    { name: t("role.fullstack"), value: rows.filter((r) => r.dev_role === "fullstack").length },
  ]), [rows, t]);

  const byLevel = useMemo(() => ([
    { name: t("level.beginner"), value: rows.filter((r) => r.experience_level === "beginner").length },
    { name: t("level.intermediate"), value: rows.filter((r) => r.experience_level === "intermediate").length },
    { name: t("level.advanced"), value: rows.filter((r) => r.experience_level === "advanced").length },
  ]), [rows, t]);

  const [search, setSearch] = useState("");
  const [section, setSection] = useState<(typeof NAV)[number][0]>("overview");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const searched = useMemo(() => {
    const q = search.trim().toLowerCase();
    const base = filter === "all" ? rows : rows.filter((r) => r.status === filter);
    if (!q) return base;
    return base.filter((r) =>
      [r.full_name, r.email, r.phone, r.profession, r.group_name, r.experience_level, r.dev_role, r.status]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [rows, filter, search]);

  const totalPages = Math.max(1, Math.ceil(searched.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const filtered = searched.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function levelLabel(l: string) {
    return { beginner: t("level.beginner"), intermediate: t("level.intermediate"), advanced: t("level.advanced") }[l] ?? l;
  }
  function hackLabel(h: string | null) {
    if (!h) return "—";
    return { backend: t("role.backend"), frontend: t("role.frontend"), fullstack: t("role.fullstack") }[h] ?? h;
  }

  function exportData() {
    return searched.map((r) => ({
      [t("th.candidate")]: r.full_name,
      [t("login.email")]: r.email,
      [t("reg.phone")]: r.phone ?? "",
      [t("reg.profession")]: r.profession ?? "",
      [t("th.group")]: r.group_name ?? "",
      [t("th.level")]: levelLabel(r.experience_level),
      [t("th.hackathon")]: hackLabel(r.dev_role),
      [t("reg.langs")]: r.languages?.join(", ") ?? "",
      [t("th.avail")]: r.available_all_days ? t("yes") : t("no"),
      [t("th.laptop")]: r.has_laptop ? t("yes") : t("no"),
      [t("reg.problem")]: r.problem_idea ?? "",
      [t("reg.motivation")]: r.motivation ?? "",
      [t("th.date")]: new Date(r.created_at).toLocaleString(lang === "fr" ? "fr-FR" : "en-US"),
      [t("th.status")]: t(`status.${r.status}`),
    }));
  }

  function exportFilename(extension: "csv" | "xlsx") {
    return `candidatures-${filter}-${new Date().toISOString().slice(0, 10)}.${extension}`;
  }

  function downloadCsv() {
    const data = exportData();
    if (data.length === 0) return;
    const headers = Object.keys(data[0]);
    const escape = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    const csv = [headers.map(escape).join(","), ...data.map((row) => headers.map((header) => escape(row[header])).join(","))].join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = exportFilename("csv");
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function downloadExcel() {
    const data = exportData();
    if (data.length === 0) return;
    const XLSX = await import("xlsx");
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    worksheet["!cols"] = Object.keys(data[0]).map((header) => ({ wch: Math.min(45, Math.max(header.length + 2, 14)) }));
    XLSX.utils.book_append_sheet(workbook, worksheet, t("table.export.sheet"));
    XLSX.writeFile(workbook, exportFilename("xlsx"), { compression: true });
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

      <div className="mt-8 flex flex-col gap-6 md:flex-row">
        <aside className="md:w-56 md:shrink-0">
          <nav className="flex gap-1 overflow-x-auto md:sticky md:top-24 md:flex-col">
            {NAV.map(([key, Icon, fr, en]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSection(key)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition ${
                  section === key ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" /> {lang === "fr" ? fr : en}
              </button>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 flex-1">
      {section === "overview" && (<>
      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
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
        <input
          type="search"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder={t("table.search")}
          className="mb-4 w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {(["all", "pending", "accepted", "waitlist", "rejected"] as const).map((s) => (
              <Button
                key={s}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => { setFilter(s); setPage(1); }}
                className={`font-mono uppercase ${filter === s ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground"}`}
              >
                {t(`filter.${s}`)} {s !== "all" && `(${rows.filter((r) => r.status === s).length})`}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={downloadCsv} disabled={searched.length === 0}>
              <Download /> CSV
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={downloadExcel} disabled={searched.length === 0}>
              <Download /> Excel
            </Button>
          </div>
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
                  <th className="py-3 pr-4">{t("th.avail")}</th>
                  <th className="py-3 pr-4">{t("th.laptop")}</th>
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
                    <td className="py-3 pr-4 text-xs">{r.group_name ?? "—"}</td>
                    <td className="py-3 pr-4 text-xs">{levelLabel(r.experience_level)}</td>
                    <td className="py-3 pr-4 text-xs">{hackLabel(r.dev_role)}</td>
                    <td className="py-3 pr-4 text-xs">{r.available_all_days ? t("yes") : t("no")}</td>
                    <td className="py-3 pr-4 text-xs">{r.has_laptop ? t("yes") : t("no")}</td>
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

        {!loading && searched.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">
              {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, searched.length)} / {searched.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="rounded-md border border-border px-3 py-1.5 text-xs font-mono text-muted-foreground transition hover:text-foreground disabled:opacity-40"
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`rounded-md border px-3 py-1.5 text-xs font-mono transition ${
                    n === safePage ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="rounded-md border border-border px-3 py-1.5 text-xs font-mono text-muted-foreground transition hover:text-foreground disabled:opacity-40"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </Card>
      </>)}

      {section === "cohorts" && <CohortsAdmin />}
      {section === "schedule" && <ScheduleAdmin />}
      {section === "speakers" && <SpeakersAdmin />}
      {section === "projects" && <ProjectsAdmin />}
      {section === "messages" && <ContactMessagesAdmin />}
        </div>
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

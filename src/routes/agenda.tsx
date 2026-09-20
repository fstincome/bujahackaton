import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/providers";
import { useCohort } from "@/lib/useCohort";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/agenda")({
  component: AgendaPage,
  head: () => ({
    meta: [
      { title: "Agenda détaillé — BOOTCAMP GITEGA" },
      { name: "description", content: "Le déroulé jour par jour du bootcamp Bitcoin de Gitega, du 21 au 25 septembre 2026, de 15h à 19h." },
      { property: "og:title", content: "Agenda détaillé — BOOTCAMP GITEGA" },
      { property: "og:description", content: "Le déroulé jour par jour du bootcamp Bitcoin de Gitega, du 21 au 25 septembre 2026." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function AgendaPage() {
  const { t, lang } = useI18n();
  const { selected, slots, totalDays, speakerName } = useCohort();

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <PageHeader
        kicker={t("agenda.kicker")}
        title={t("agenda.title")}
        subtitle={t("agenda.subtitle")}
        badge={selected ? `${selected.name}${selected.location ? ` · ${selected.location}` : ""}` : undefined}
      />
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
    </main>
  );
}

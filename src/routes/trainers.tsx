import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/providers";
import { useCohort } from "@/lib/useCohort";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/trainers")({
  component: TrainersPage,
  head: () => ({
    meta: [
      { title: "Formateurs — BOOTCAMP GITEGA" },
      { name: "description", content: "Les formateurs et intervenants du bootcamp Bitcoin de Gitega." },
      { property: "og:title", content: "Formateurs — BOOTCAMP GITEGA" },
      { property: "og:description", content: "Les formateurs et intervenants du bootcamp Bitcoin de Gitega." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function TrainersPage() {
  const { t, lang } = useI18n();
  const { speakers } = useCohort();

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <PageHeader kicker={t("trainers.kicker")} title={t("trainers.title")} />

      {speakers.length > 0 ? (
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
              {(lang === "en" ? p.role_en || p.role : p.role) && (
                <p className="text-xs text-muted-foreground">{lang === "en" ? p.role_en || p.role : p.role}</p>
              )}
              {(lang === "en" ? p.bio_en || p.bio : p.bio) && (
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{lang === "en" ? p.bio_en || p.bio : p.bio}</p>
              )}
              {p.twitter_url && (
                <a href={p.twitter_url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs text-primary hover:underline">
                  @x →
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-12 text-center text-sm text-muted-foreground">{t("trainers.soon")}</p>
      )}

    </main>
  );
}

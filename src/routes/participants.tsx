import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { ParticipantsList, useSelectedParticipants } from "@/components/SelectedParticipants";
import { useI18n } from "@/lib/providers";

export const Route = createFileRoute("/participants")({
  component: ParticipantsPage,
  head: () => {
    const fr = {
      title: "Participants sélectionnés — Bootcamp Gitega",
      description:
        "Découvrez les candidats retenus pour le Bootcamp Bitcoin de Gitega, du 21 au 25 septembre 2026 à l'Université Polytechnique de Gitega.",
    };
    const en = {
      title: "Selected participants — Gitega Bootcamp",
      description:
        "Meet the candidates selected for the Gitega Bitcoin Bootcamp, 21–25 September 2026 at the Polytechnic University of Gitega.",
    };
    const c = fr;
    return {
      meta: [
        { title: c.title },
        { name: "description", content: c.description },
        { property: "og:title", content: c.title },
        { property: "og:description", content: c.description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
});

function ParticipantsPage() {
  const { t } = useI18n();
  const participants = useSelectedParticipants();
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <PageHeader
        kicker={t("sel.kicker")}
        title={t("sel.title")}
        subtitle={t("sel.subtitle")}
      />
      <div className="mt-8">
        {participants.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("sel.subtitle")}</p>
        ) : (
          <ParticipantsList participants={participants} />
        )}
      </div>
    </main>
  );
}

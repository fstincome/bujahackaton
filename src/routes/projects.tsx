import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { ProjectGrid, usePublicProjects } from "@/components/PublicProjects";
import { useI18n } from "@/lib/providers";

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
  head: () => ({
    meta: [
      { title: "Projets des équipes — BOOTCAMP GITEGA" },
      { name: "description", content: "Découvrez les projets réalisés par les équipes du Bootcamp Bitcoin de Gitega." },
      { property: "og:title", content: "Projets des équipes — BOOTCAMP GITEGA" },
      { property: "og:description", content: "Les projets réalisés par les équipes du Bootcamp Bitcoin de Gitega." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function ProjectsPage() {
  const { t } = useI18n();
  const projects = usePublicProjects();
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <PageHeader kicker={t("pp.kicker")} title={t("pp.title")} subtitle={t("pp.subtitle")} />
      <div className="mt-10">
        {projects.length ? <ProjectGrid projects={projects} /> : <p className="text-sm text-muted-foreground">{t("pp.empty")}</p>}
      </div>
    </main>
  );
}

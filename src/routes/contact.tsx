import { createFileRoute } from "@tanstack/react-router";
import { ContactSection } from "@/components/ContactSection";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — BOOTCAMP GITEGA" },
      { name: "description", content: "Écrivez à l'équipe du bootcamp Bitcoin de Gitega : questions, partenariats, presse." },
      { property: "og:title", content: "Contact — BOOTCAMP GITEGA" },
      { property: "og:description", content: "Écrivez à l'équipe du bootcamp Bitcoin de Gitega : questions, partenariats, presse." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function ContactPage() {
  return (
    <main className="py-6">
      <ContactSection />
    </main>
  );
}

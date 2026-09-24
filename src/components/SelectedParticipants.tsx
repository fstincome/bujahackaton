import { useEffect, useState } from "react";
import { BadgeCheck } from "lucide-react";
import { getSelectedParticipants, type SelectedParticipant } from "@/lib/admin.functions";
import { useI18n } from "@/lib/providers";

export function useSelectedParticipants() {
  const [participants, setParticipants] = useState<SelectedParticipant[]>([]);
  useEffect(() => {
    getSelectedParticipants()
      .then((r) => setParticipants(r.participants ?? []))
      .catch(() => setParticipants([]));
  }, []);
  return participants;
}

export function roleLabel(role: string | null | undefined) {
  if (!role) return null;
  if (role === "fullstack") return "Full stack";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export function ParticipantsList({ participants }: { participants: SelectedParticipant[] }) {
  if (participants.length === 0) return null;
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {participants.map((p) => (
        <div key={p.full_name} className="flex items-start gap-3 rounded-lg border border-border bg-background/40 px-4 py-3">
          <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div>
            <div className="text-sm font-semibold">{p.full_name}</div>
            {roleLabel(p.dev_role) && (
              <div className="font-mono text-xs text-muted-foreground">{roleLabel(p.dev_role)}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ParticipantsGrid({ participants }: { participants: SelectedParticipant[] }) {
  const { t } = useI18n();
  if (participants.length === 0) return null;
  return (
    <div className="rounded-xl border border-border bg-card p-8">
      <div className="font-mono text-xs uppercase tracking-widest text-primary">{t("sel.kicker")}</div>
      <h2 className="mt-3 text-2xl font-bold">{t("sel.title")}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{t("sel.subtitle")}</p>
      <div className="mt-6">
        <ParticipantsList participants={participants} />
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Save, Trash2, X } from "lucide-react";
import { useI18n } from "@/lib/providers";

export type Slot = {
  id: string;
  day: number;
  start_time: string;
  end_time: string | null;
  title: string;
  title_en: string | null;
  theme: string | null;
  theme_en: string | null;
  speaker_id: string | null;
  sort_order: number;
};

type Speaker = { id: string; name: string };

export function ScheduleAdmin() {
  const { t } = useI18n();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [{ data: s }, { data: sp }] = await Promise.all([
      supabase.from("schedule_slots").select("*").order("day").order("sort_order").order("start_time"),
      supabase.from("speakers").select("id,name").order("sort_order"),
    ]);
    if (s) setSlots(s as Slot[]);
    if (sp) setSpeakers(sp as Speaker[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function addNew(day: number) {
    const count = slots.filter((x) => x.day === day).length;
    const { data, error } = await supabase
      .from("schedule_slots")
      .insert({ day, start_time: "09:00", title: "Nouveau créneau", sort_order: count + 1 })
      .select()
      .single();
    if (!error && data) setSlots((s) => [...s, data as Slot]);
  }

  async function remove(id: string) {
    if (!confirm(t("sa.confirmDelete"))) return;
    const { error } = await supabase.from("schedule_slots").delete().eq("id", id);
    if (!error) setSlots((s) => s.filter((x) => x.id !== id));
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{t("sa.title")}</h3>
      {loading ? (
        <div className="py-8 text-center text-sm text-muted-foreground">{t("loading")}</div>
      ) : (
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          {[1, 2].map((day) => (
            <div key={day}>
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{t("sa.day")} {day} — {day === 1 ? "5" : "6"} juin</h4>
                <button
                  onClick={() => addNew(day)}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="h-3.5 w-3.5" /> {t("sa.add")}
                </button>
              </div>
              <div className="mt-3 space-y-3">
                {slots.filter((s) => s.day === day).map((slot) => (
                  <SlotCard
                    key={slot.id}
                    slot={slot}
                    speakers={speakers}
                    onChange={(u) => setSlots((arr) => arr.map((x) => (x.id === u.id ? u : x)))}
                    onDelete={() => remove(slot.id)}
                  />
                ))}
                {slots.filter((s) => s.day === day).length === 0 && (
                  <div className="rounded-md border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                    {t("sa.empty")}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SlotCard({
  slot, speakers, onChange, onDelete,
}: {
  slot: Slot; speakers: Speaker[]; onChange: (s: Slot) => void; onDelete: () => void;
}) {
  const { t } = useI18n();
  const [draft, setDraft] = useState(slot);
  const [saving, setSaving] = useState(false);

  const dirty = JSON.stringify(draft) !== JSON.stringify(slot);

  async function save() {
    setSaving(true);
    const { data, error } = await supabase
      .from("schedule_slots")
      .update({
        start_time: draft.start_time,
        end_time: draft.end_time,
        title: draft.title,
        title_en: draft.title_en,
        theme: draft.theme,
        theme_en: draft.theme_en,
        speaker_id: draft.speaker_id,
        sort_order: draft.sort_order,
        updated_at: new Date().toISOString(),
      })
      .eq("id", draft.id)
      .select()
      .single();
    setSaving(false);
    if (!error && data) {
      const u = data as Slot;
      setDraft(u);
      onChange(u);
    } else if (error) alert(error.message);
  }

  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="flex items-start gap-2">
        <div className="grid flex-1 grid-cols-2 gap-2">
          <Field label={t("sa.start")} value={draft.start_time} onChange={(v) => setDraft({ ...draft, start_time: v })} placeholder="09:00" />
          <Field label={t("sa.end")} value={draft.end_time ?? ""} onChange={(v) => setDraft({ ...draft, end_time: v })} placeholder="10:30" />
        </div>
        <button onClick={onDelete} className="mt-5 text-muted-foreground hover:text-destructive" title={t("sa.delete")}>
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-2 space-y-2">
        <Field label={`${t("sa.titleField")} (FR)`} value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
        <Field label={`${t("sa.titleField")} (EN)`} value={draft.title_en ?? ""} onChange={(v) => setDraft({ ...draft, title_en: v })} />
        <Field label={`${t("sa.theme")} (FR)`} value={draft.theme ?? ""} onChange={(v) => setDraft({ ...draft, theme: v })} />
        <Field label={`${t("sa.theme")} (EN)`} value={draft.theme_en ?? ""} onChange={(v) => setDraft({ ...draft, theme_en: v })} />
        <div>
          <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{t("sa.speaker")}</label>
          <select
            value={draft.speaker_id ?? ""}
            onChange={(e) => setDraft({ ...draft, speaker_id: e.target.value || null })}
            className="mt-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-xs"
          >
            <option value="">— {t("sa.noSpeaker")} —</option>
            {speakers.map((sp) => (
              <option key={sp.id} value={sp.id}>{sp.name}</option>
            ))}
          </select>
        </div>
        <Field label={t("sa.order")} value={String(draft.sort_order)} onChange={(v) => setDraft({ ...draft, sort_order: parseInt(v) || 0 })} type="number" />
      </div>
      <div className="mt-3 flex gap-2">
        <button
          onClick={save}
          disabled={!dirty || saving}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <Save className="h-3.5 w-3.5" /> {saving ? t("speakers.saving") : t("speakers.save")}
        </button>
        {dirty && (
          <button onClick={() => setDraft(slot)} className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1.5 text-xs">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-xs"
      />
    </div>
  );
}

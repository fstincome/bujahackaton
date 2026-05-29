import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Save, Trash2, Star } from "lucide-react";

export type Cohort = {
  id: string;
  name: string;
  slug: string;
  start_date: string | null;
  end_date: string | null;
  location: string | null;
  is_active: boolean;
  sort_order: number;
};

export function CohortsAdmin({ onChange }: { onChange?: (cohorts: Cohort[]) => void }) {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("cohorts").select("*").order("sort_order");
    if (data) {
      setCohorts(data as Cohort[]);
      onChange?.(data as Cohort[]);
    }
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function add() {
    const n = cohorts.length + 1;
    const { data } = await supabase
      .from("cohorts")
      .insert({ name: `Cohorte ${n}`, slug: `cohorte-${n}-${Date.now()}`, sort_order: n })
      .select()
      .single();
    if (data) {
      const next = [...cohorts, data as Cohort];
      setCohorts(next);
      onChange?.(next);
    }
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cette cohorte ? Tous ses créneaux seront supprimés.")) return;
    await supabase.from("cohorts").delete().eq("id", id);
    const next = cohorts.filter((c) => c.id !== id);
    setCohorts(next);
    onChange?.(next);
  }

  async function setActive(id: string) {
    await supabase.from("cohorts").update({ is_active: false }).neq("id", id);
    await supabase.from("cohorts").update({ is_active: true }).eq("id", id);
    const next = cohorts.map((c) => ({ ...c, is_active: c.id === id }));
    setCohorts(next);
    onChange?.(next);
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Cohortes</h3>
        <button onClick={add} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90">
          <Plus className="h-3.5 w-3.5" /> Nouvelle cohorte
        </button>
      </div>
      {loading ? (
        <div className="py-6 text-center text-sm text-muted-foreground">Chargement…</div>
      ) : (
        <div className="mt-4 space-y-3">
          {cohorts.map((c) => (
            <CohortCard
              key={c.id}
              cohort={c}
              onChange={(u) => {
                const next = cohorts.map((x) => (x.id === u.id ? u : x));
                setCohorts(next);
                onChange?.(next);
              }}
              onDelete={() => remove(c.id)}
              onActivate={() => setActive(c.id)}
            />
          ))}
          {cohorts.length === 0 && (
            <div className="rounded-md border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
              Aucune cohorte. Créez-en une pour démarrer.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CohortCard({ cohort, onChange, onDelete, onActivate }: { cohort: Cohort; onChange: (c: Cohort) => void; onDelete: () => void; onActivate: () => void }) {
  const [draft, setDraft] = useState(cohort);
  const [saving, setSaving] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(cohort);

  async function save() {
    setSaving(true);
    const { data, error } = await supabase
      .from("cohorts")
      .update({
        name: draft.name,
        slug: draft.slug,
        start_date: draft.start_date,
        end_date: draft.end_date,
        location: draft.location,
        sort_order: draft.sort_order,
        updated_at: new Date().toISOString(),
      })
      .eq("id", draft.id)
      .select()
      .single();
    setSaving(false);
    if (!error && data) {
      setDraft(data as Cohort);
      onChange(data as Cohort);
    } else if (error) alert(error.message);
  }

  return (
    <div className={`rounded-lg border p-3 ${cohort.is_active ? "border-primary/50 bg-primary/5" : "border-border bg-background"}`}>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <Field label="Nom" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
        <Field label="Slug" value={draft.slug} onChange={(v) => setDraft({ ...draft, slug: v })} />
        <Field label="Début" type="date" value={draft.start_date ?? ""} onChange={(v) => setDraft({ ...draft, start_date: v || null })} />
        <Field label="Fin" type="date" value={draft.end_date ?? ""} onChange={(v) => setDraft({ ...draft, end_date: v || null })} />
        <div className="col-span-2 md:col-span-3">
          <Field label="Lieu" value={draft.location ?? ""} onChange={(v) => setDraft({ ...draft, location: v || null })} />
        </div>
        <Field label="Ordre" type="number" value={String(draft.sort_order)} onChange={(v) => setDraft({ ...draft, sort_order: parseInt(v) || 0 })} />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={save} disabled={!dirty || saving} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
          <Save className="h-3.5 w-3.5" /> {saving ? "…" : "Enregistrer"}
        </button>
        <button onClick={onActivate} disabled={cohort.is_active} className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs hover:bg-secondary disabled:opacity-50">
          <Star className="h-3.5 w-3.5" /> {cohort.is_active ? "Active" : "Définir active"}
        </button>
        <button onClick={onDelete} className="ml-auto inline-flex items-center gap-1 rounded-md border border-border px-2 py-1.5 text-xs text-muted-foreground hover:text-destructive">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-xs" />
    </div>
  );
}

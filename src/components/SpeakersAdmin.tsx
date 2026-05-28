import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Save, Trash2, Upload, X } from "lucide-react";
import { useI18n } from "@/lib/providers";

export type Speaker = {
  id: string;
  name: string;
  role: string | null;
  role_en: string | null;
  bio: string | null;
  bio_en: string | null;
  twitter_url: string | null;
  avatar_url: string | null;
  sort_order: number;
};

export function SpeakersAdmin() {
  const { t } = useI18n();
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("speakers").select("*").order("sort_order");
    if (data) setSpeakers(data as Speaker[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function addNew() {
    const { data, error } = await supabase
      .from("speakers")
      .insert({ name: "New speaker", sort_order: speakers.length + 1 })
      .select()
      .single();
    if (!error && data) setSpeakers((s) => [...s, data as Speaker]);
  }

  async function remove(id: string) {
    if (!confirm(t("speakers.confirmDelete"))) return;
    const { error } = await supabase.from("speakers").delete().eq("id", id);
    if (!error) setSpeakers((s) => s.filter((x) => x.id !== id));
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{t("speakers.admin.title")}</h3>
        <button
          onClick={addNew}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-3.5 w-3.5" /> {t("speakers.add")}
        </button>
      </div>
      {loading ? (
        <div className="py-8 text-center text-sm text-muted-foreground">{t("loading")}</div>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {speakers.map((sp) => (
            <SpeakerCard key={sp.id} speaker={sp} onChange={(u) => setSpeakers((arr) => arr.map((x) => x.id === u.id ? u : x))} onDelete={() => remove(sp.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function SpeakerCard({ speaker, onChange, onDelete }: { speaker: Speaker; onChange: (s: Speaker) => void; onDelete: () => void }) {
  const { t } = useI18n();
  const [draft, setDraft] = useState(speaker);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const dirty =
    draft.name !== speaker.name ||
    draft.role !== speaker.role ||
    draft.role_en !== speaker.role_en ||
    draft.bio !== speaker.bio ||
    draft.bio_en !== speaker.bio_en ||
    draft.twitter_url !== speaker.twitter_url ||
    draft.sort_order !== speaker.sort_order;

  async function save() {
    setSaving(true);
    const { data, error } = await supabase
      .from("speakers")
      .update({
        name: draft.name,
        role: draft.role,
        role_en: draft.role_en,
        bio: draft.bio,
        bio_en: draft.bio_en,
        twitter_url: draft.twitter_url,
        sort_order: draft.sort_order,
        updated_at: new Date().toISOString(),
      })
      .eq("id", draft.id)
      .select()
      .single();
    setSaving(false);
    if (!error && data) {
      const s = data as Speaker;
      setDraft(s);
      onChange(s);
    } else if (error) {
      alert(error.message);
    }
  }

  async function uploadAvatar(file: File) {
    setUploading(true);
    const ext = file.name.split(".").pop() || "png";
    const path = `${draft.id}-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("speakers").upload(path, file, { upsert: true, contentType: file.type });
    if (upErr) { setUploading(false); alert(upErr.message); return; }
    const { data: pub } = supabase.storage.from("speakers").getPublicUrl(path);
    const url = pub.publicUrl;
    const { data, error } = await supabase.from("speakers").update({ avatar_url: url, updated_at: new Date().toISOString() }).eq("id", draft.id).select().single();
    setUploading(false);
    if (!error && data) {
      const s = data as Speaker;
      setDraft(s);
      onChange(s);
    }
  }

  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <div className="flex items-start gap-3">
        <div className="relative">
          {draft.avatar_url ? (
            <img src={draft.avatar_url} alt={draft.name} className="h-16 w-16 rounded-full object-cover border border-border" />
          ) : (
            <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center text-xs text-muted-foreground">N/A</div>
          )}
          <button
            onClick={() => fileRef.current?.click()}
            className="absolute -bottom-1 -right-1 rounded-full bg-primary p-1.5 text-primary-foreground hover:bg-primary/90"
            title={t("speakers.uploadAvatar")}
          >
            <Upload className="h-3 w-3" />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) uploadAvatar(f);
              e.target.value = "";
            }}
          />
        </div>
        <button onClick={onDelete} className="ml-auto text-muted-foreground hover:text-destructive" title={t("speakers.delete")}>
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      {uploading && <div className="mt-2 text-xs text-muted-foreground">{t("speakers.uploading")}…</div>}

      <div className="mt-3 space-y-2">
        <Field label={t("speakers.name")} value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
        <Field label={`${t("speakers.role")} (FR)`} value={draft.role ?? ""} onChange={(v) => setDraft({ ...draft, role: v })} />
        <Field label={`${t("speakers.role")} (EN)`} value={draft.role_en ?? ""} onChange={(v) => setDraft({ ...draft, role_en: v })} />
        <Field label={t("speakers.twitter")} value={draft.twitter_url ?? ""} onChange={(v) => setDraft({ ...draft, twitter_url: v })} placeholder="https://x.com/..." />
        <div>
          <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{t("speakers.bio")} (FR)</label>
          <textarea
            value={draft.bio ?? ""}
            onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
            rows={3}
            className="mt-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-xs"
          />
        </div>
        <div>
          <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{t("speakers.bio")} (EN)</label>
          <textarea
            value={draft.bio_en ?? ""}
            onChange={(e) => setDraft({ ...draft, bio_en: e.target.value })}
            rows={3}
            className="mt-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-xs"
          />
        </div>
        <Field label={t("speakers.order")} value={String(draft.sort_order)} onChange={(v) => setDraft({ ...draft, sort_order: parseInt(v) || 0 })} type="number" />
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
          <button onClick={() => setDraft(speaker)} className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1.5 text-xs">
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

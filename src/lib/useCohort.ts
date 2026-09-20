import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/providers";

export type Cohort = {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  venue: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  days: number;
  tagline: string | null;
  tagline_en: string | null;
  summary: string | null;
  summary_en: string | null;
  highlights: string[] | null;
  highlights_en: string[] | null;
  is_active: boolean;
};

export type Speaker = {
  id: string;
  name: string;
  role: string | null;
  role_en: string | null;
  bio: string | null;
  bio_en: string | null;
  twitter_url: string | null;
  avatar_url: string | null;
};

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

export function useCohort() {
  const { lang } = useI18n();
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);

  useEffect(() => {
    supabase
      .from("cohorts")
      .select("id,name,slug,city,venue,location,start_date,end_date,days,tagline,tagline_en,summary,summary_en,highlights,highlights_en,is_active")
      .eq("is_public", true)
      .order("sort_order")
      .then(({ data }) => {
        if (!data || data.length === 0) return;
        const list = data as unknown as Cohort[];
        setCohorts(list);
        setSelectedId((prev) => prev ?? (list.find((c) => c.is_active)?.id ?? list[0].id));
      });
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    (async () => {
      const { data: sl } = await supabase
        .from("schedule_slots")
        .select("*")
        .eq("cohort_id", selectedId)
        .order("day").order("sort_order").order("start_time");
      setSlots((sl ?? []) as any);
      const { data: sp } = await supabase
        .from("speakers")
        .select("id,name,role,role_en,bio,bio_en,twitter_url,avatar_url,cohort_id")
        .or(`cohort_id.eq.${selectedId},cohort_id.is.null`)
        .order("sort_order");
      setSpeakers((sp ?? []) as any);
    })();
  }, [selectedId]);

  const selected = cohorts.find((c) => c.id === selectedId) ?? null;
  const totalDays = selected?.days ?? 2;

  const dayOffset = (offset: number) => {
    if (!selected?.start_date) return String(offset + 1).padStart(2, "0");
    const d = new Date(selected.start_date);
    d.setDate(d.getDate() + offset);
    return String(d.getDate()).padStart(2, "0");
  };

  const highlights = (lang === "en" ? selected?.highlights_en : selected?.highlights) ?? selected?.highlights ?? [];
  const speakerName = (id: string | null) => speakers.find((s) => s.id === id)?.name ?? null;

  return { cohorts, selected, selectedId, setSelectedId, slots, speakers, totalDays, dayOffset, highlights, speakerName };
}

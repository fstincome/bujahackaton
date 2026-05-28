
CREATE TABLE public.schedule_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  day INTEGER NOT NULL CHECK (day IN (1, 2)),
  start_time TEXT NOT NULL,
  end_time TEXT,
  title TEXT NOT NULL DEFAULT '',
  title_en TEXT,
  theme TEXT,
  theme_en TEXT,
  speaker_id UUID REFERENCES public.speakers(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.schedule_slots TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.schedule_slots TO authenticated;
GRANT ALL ON public.schedule_slots TO service_role;

ALTER TABLE public.schedule_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view schedule slots"
ON public.schedule_slots FOR SELECT
USING (true);

CREATE POLICY "Authenticated can insert schedule slots"
ON public.schedule_slots FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated can update schedule slots"
ON public.schedule_slots FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated can delete schedule slots"
ON public.schedule_slots FOR DELETE TO authenticated
USING (true);

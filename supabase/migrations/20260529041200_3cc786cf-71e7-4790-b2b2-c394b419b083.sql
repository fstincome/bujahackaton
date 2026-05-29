
CREATE TABLE public.cohorts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  start_date date,
  end_date date,
  location text,
  is_active boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.cohorts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cohorts TO authenticated;
GRANT ALL ON public.cohorts TO service_role;

ALTER TABLE public.cohorts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view cohorts" ON public.cohorts FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert cohorts" ON public.cohorts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update cohorts" ON public.cohorts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete cohorts" ON public.cohorts FOR DELETE TO authenticated USING (true);

-- Seed the first cohort
INSERT INTO public.cohorts (name, slug, start_date, end_date, location, is_active, sort_order)
VALUES ('Bujumbura 2026', 'bujumbura-2026', '2026-06-05', '2026-06-06', 'Hôtel Emeraude, Bujumbura', true, 1);

-- Link existing data
ALTER TABLE public.schedule_slots ADD COLUMN cohort_id uuid REFERENCES public.cohorts(id) ON DELETE CASCADE;
ALTER TABLE public.speakers ADD COLUMN cohort_id uuid REFERENCES public.cohorts(id) ON DELETE SET NULL;
ALTER TABLE public.registrations ADD COLUMN cohort_id uuid REFERENCES public.cohorts(id) ON DELETE SET NULL;

UPDATE public.schedule_slots SET cohort_id = (SELECT id FROM public.cohorts WHERE slug = 'bujumbura-2026');
UPDATE public.speakers SET cohort_id = (SELECT id FROM public.cohorts WHERE slug = 'bujumbura-2026');
UPDATE public.registrations SET cohort_id = (SELECT id FROM public.cohorts WHERE slug = 'bujumbura-2026');

CREATE INDEX idx_schedule_slots_cohort ON public.schedule_slots(cohort_id);
CREATE INDEX idx_speakers_cohort ON public.speakers(cohort_id);
CREATE INDEX idx_registrations_cohort ON public.registrations(cohort_id);

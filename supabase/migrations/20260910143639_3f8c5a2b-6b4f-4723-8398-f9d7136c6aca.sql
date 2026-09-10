ALTER TABLE public.cohorts
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS venue text,
  ADD COLUMN IF NOT EXISTS tagline text,
  ADD COLUMN IF NOT EXISTS tagline_en text,
  ADD COLUMN IF NOT EXISTS summary text,
  ADD COLUMN IF NOT EXISTS summary_en text,
  ADD COLUMN IF NOT EXISTS highlights text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS highlights_en text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS days integer NOT NULL DEFAULT 2,
  ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT true;

CREATE INDEX IF NOT EXISTS registrations_cohort_id_idx ON public.registrations (cohort_id);
CREATE INDEX IF NOT EXISTS schedule_slots_cohort_id_idx ON public.schedule_slots (cohort_id);
CREATE INDEX IF NOT EXISTS speakers_cohort_id_idx ON public.speakers (cohort_id);
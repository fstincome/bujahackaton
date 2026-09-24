ALTER TABLE public.project_submissions
  ADD COLUMN IF NOT EXISTS team_leader text,
  ADD COLUMN IF NOT EXISTS project_name text,
  ADD COLUMN IF NOT EXISTS slides_link text;
ALTER TABLE public.project_submissions ALTER COLUMN contact_email DROP NOT NULL;
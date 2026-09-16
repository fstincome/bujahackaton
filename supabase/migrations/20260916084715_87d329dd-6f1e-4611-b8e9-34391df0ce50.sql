CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TABLE public.project_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cohort_id uuid REFERENCES public.cohorts(id) ON DELETE SET NULL,
  team_name text NOT NULL,
  contact_email text NOT NULL,
  members text,
  description text,
  website_url text,
  github_url text,
  preview_image_url text,
  slides_pdf_url text,
  docs_url text,
  status text NOT NULL DEFAULT 'submitted',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT INSERT ON public.project_submissions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_submissions TO authenticated;
GRANT ALL ON public.project_submissions TO service_role;

ALTER TABLE public.project_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a project"
ON public.project_submissions FOR INSERT TO anon, authenticated
WITH CHECK (
  length(trim(team_name)) BETWEEN 2 AND 150
  AND length(trim(contact_email)) BETWEEN 3 AND 255
  AND coalesce(length(description), 0) <= 2000
  AND coalesce(length(members), 0) <= 500
  AND coalesce(length(website_url), 0) <= 500
  AND coalesce(length(github_url), 0) <= 500
  AND coalesce(length(preview_image_url), 0) <= 1000
  AND coalesce(length(slides_pdf_url), 0) <= 1000
  AND coalesce(length(docs_url), 0) <= 500
);

CREATE POLICY "Admins can view project submissions"
ON public.project_submissions FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update project submissions"
ON public.project_submissions FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete project submissions"
ON public.project_submissions FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_project_submissions_cohort ON public.project_submissions(cohort_id);

CREATE TRIGGER update_project_submissions_updated_at
BEFORE UPDATE ON public.project_submissions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
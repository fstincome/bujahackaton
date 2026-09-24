ALTER TABLE public.project_submissions ADD COLUMN IF NOT EXISTS github_backend_url text;
DROP POLICY IF EXISTS "Anyone can submit a project" ON public.project_submissions;
CREATE POLICY "Anyone can submit a project" ON public.project_submissions FOR INSERT TO anon, authenticated
WITH CHECK (
  length(trim(team_name)) BETWEEN 1 AND 150
  AND (contact_email IS NULL OR length(trim(contact_email)) BETWEEN 3 AND 255)
  AND COALESCE(length(description),0) <= 2000 AND COALESCE(length(members),0) <= 500
  AND COALESCE(length(website_url),0) <= 500 AND COALESCE(length(github_url),0) <= 500
  AND COALESCE(length(github_backend_url),0) <= 500 AND COALESCE(length(slides_link),0) <= 500
  AND COALESCE(length(team_leader),0) <= 150 AND COALESCE(length(project_name),0) <= 150
  AND COALESCE(length(preview_image_url),0) <= 1000 AND COALESCE(length(slides_pdf_url),0) <= 1000
  AND COALESCE(length(docs_url),0) <= 500
);
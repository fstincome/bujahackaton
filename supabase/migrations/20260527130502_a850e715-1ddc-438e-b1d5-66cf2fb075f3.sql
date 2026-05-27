
CREATE TABLE public.registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  profession text,
  experience_level text NOT NULL DEFAULT 'beginner',
  motivation text,
  hackathon_choice text NOT NULL DEFAULT 'both',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.registrations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.registrations TO authenticated;
GRANT ALL ON public.registrations TO service_role;

ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can register" ON public.registrations
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Anyone can view registrations" ON public.registrations
  FOR SELECT TO anon, authenticated USING (true);


-- Speakers table
CREATE TABLE public.speakers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  role text,
  bio text,
  twitter_url text,
  avatar_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.speakers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.speakers TO authenticated;
GRANT ALL ON public.speakers TO service_role;

ALTER TABLE public.speakers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view speakers" ON public.speakers FOR SELECT USING (true);
CREATE POLICY "Admins can insert speakers" ON public.speakers FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update speakers" ON public.speakers FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete speakers" ON public.speakers FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Storage bucket for speaker avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('speakers', 'speakers', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Speaker avatars publicly readable" ON storage.objects FOR SELECT USING (bucket_id = 'speakers');
CREATE POLICY "Admins can upload speaker avatars" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'speakers' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update speaker avatars" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'speakers' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete speaker avatars" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'speakers' AND has_role(auth.uid(), 'admin'::app_role));

-- Seed initial speakers
INSERT INTO public.speakers (name, role, bio, twitter_url, avatar_url, sort_order) VALUES
('Advaxe Ndayisenga', 'Lead Trainer', 'Passionné par l''éducation Bitcoin et le développement communautaire en Afrique.', 'https://x.com/AdvaxeIr', '/speakers/advaxe.png', 1),
('Belyi Nobel Kubwayo', 'Trainer', 'Expert en développement logiciel et applications décentralisées.', 'https://x.com/belyi_nobel', '/speakers/belyi.png', 2),
('Wilfried Cubahiro', 'Trainer', 'Spécialiste en sécurité et infrastructure réseau.', NULL, '/speakers/wilfried.png', 3);

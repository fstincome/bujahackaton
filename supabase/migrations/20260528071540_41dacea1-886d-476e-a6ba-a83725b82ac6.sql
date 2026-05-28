
DROP POLICY IF EXISTS "Admins can upload speaker avatars" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update speaker avatars" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete speaker avatars" ON storage.objects;

CREATE POLICY "Authenticated can upload speaker avatars" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'speakers');

CREATE POLICY "Authenticated can update speaker avatars" ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id = 'speakers') WITH CHECK (bucket_id = 'speakers');

CREATE POLICY "Authenticated can delete speaker avatars" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'speakers');

DROP POLICY IF EXISTS "Admins can insert speakers" ON public.speakers;
DROP POLICY IF EXISTS "Admins can update speakers" ON public.speakers;
DROP POLICY IF EXISTS "Admins can delete speakers" ON public.speakers;

CREATE POLICY "Authenticated can insert speakers" ON public.speakers
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can update speakers" ON public.speakers
FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated can delete speakers" ON public.speakers
FOR DELETE TO authenticated USING (true);

CREATE POLICY "Anyone can upload project files"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'projects');

CREATE POLICY "Admins can read project files"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'projects' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete project files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'projects' AND public.has_role(auth.uid(), 'admin'));
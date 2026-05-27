
DROP POLICY IF EXISTS "Anyone can view registrations" ON public.registrations;

REVOKE SELECT ON public.registrations FROM anon;

CREATE POLICY "Authenticated can view registrations" ON public.registrations
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can update registrations" ON public.registrations
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated can delete registrations" ON public.registrations
  FOR DELETE TO authenticated USING (true);

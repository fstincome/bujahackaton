GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT SELECT, UPDATE, DELETE ON public.registrations TO authenticated;
GRANT SELECT ON public.registrations TO anon;
GRANT ALL ON public.registrations TO service_role;
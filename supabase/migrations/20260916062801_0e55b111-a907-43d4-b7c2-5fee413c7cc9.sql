ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS group_name text;

DELETE FROM public.speakers;

UPDATE public.cohorts SET
  is_active = true,
  days = 5,
  city = 'Gitega',
  venue = 'Université Polytechnique de Gitega (UPG)',
  location = 'Université Polytechnique de Gitega (UPG), Gitega',
  start_date = '2026-09-21',
  end_date = '2026-09-25',
  tagline = '30 jeunes Burundais, cinq jours, une approche 100% pratique.',
  tagline_en = '30 young Burundians, five days, a fully hands-on approach.',
  summary = 'Trois jours de formations, dont une session hybride sur la sécurité logicielle, suivis du hackathon. Les deux premières équipes sont primées.',
  summary_en = 'Three days of training, including a hybrid session on software security, followed by the hackathon. The top two teams win prizes.',
  highlights = ARRAY['30 jeunes Burundais sélectionnés','Cinq jours, approche 100% pratique','Trois jours de formations','Session hybride sur la sécurité logicielle','Les deux premières équipes sont primées'],
  highlights_en = ARRAY['30 selected young Burundians','Five days, fully hands-on','Three days of training','Hybrid session on software security','The top two teams win prizes']
WHERE slug ILIKE '%gitega%';

UPDATE public.cohorts SET is_active = false WHERE slug NOT ILIKE '%gitega%';
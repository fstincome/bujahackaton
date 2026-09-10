ALTER TABLE public.schedule_slots DROP CONSTRAINT IF EXISTS schedule_slots_day_check;
ALTER TABLE public.schedule_slots ADD CONSTRAINT schedule_slots_day_check CHECK (day >= 1 AND day <= 14);
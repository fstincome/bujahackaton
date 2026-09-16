alter table public.registrations
  add column if not exists available_all_days boolean not null default false,
  add column if not exists has_laptop boolean not null default false,
  add column if not exists problem_idea text;

alter table public.registrations alter column hackathon_choice set default 'bootcamp';
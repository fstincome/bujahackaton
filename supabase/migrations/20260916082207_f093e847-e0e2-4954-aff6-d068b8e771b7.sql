UPDATE public.cohorts
SET
  summary = replace(summary, 'répartis en 5 équipes', 'répartis en équipes'),
  summary_en = replace(summary_en, 'in 5 teams', 'in teams'),
  highlights = ARRAY(
    SELECT replace(item, 'Hackathon en 5 équipes', 'Hackathon en équipes')
    FROM unnest(highlights) AS item
  ),
  highlights_en = ARRAY(
    SELECT replace(item, 'Hackathon with 5 teams', 'Hackathon in teams')
    FROM unnest(highlights_en) AS item
  )
WHERE id = '1b6067ae-21fb-40a9-a4fc-0fc1df28287d';

UPDATE public.schedule_slots
SET
  title = replace(replace(title, 'Constitution des 5 équipes', 'Constitution des équipes'), 'Pitchs des 5 équipes devant le jury', 'Pitchs des équipes devant le jury'),
  title_en = replace(replace(title_en, 'Forming the 5 teams', 'Forming the teams'), 'Pitches from the 5 teams', 'Pitches from the teams'),
  theme = replace(theme, 'Attribution des 5 mentors', 'Attribution des mentors'),
  theme_en = replace(replace(theme_en, 'Assigning the 5 mentors', 'Assigning mentors'), 'About 12 minutes per team, demo included', 'Team pitches with demonstrations')
WHERE cohort_id = '1b6067ae-21fb-40a9-a4fc-0fc1df28287d';
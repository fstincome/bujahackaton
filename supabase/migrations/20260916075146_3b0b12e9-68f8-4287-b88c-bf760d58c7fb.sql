update cohorts set is_public = false where id = '533380e6-cdb7-4cb3-98aa-8be8d9cd386a';

update cohorts set
  tagline = 'Construire l''avenir du Bitcoin au Burundi',
  tagline_en = 'Building the future of Bitcoin in Burundi',
  summary = 'Cinq jours (15h–19h) pour former 30 jeunes Burundais répartis en 5 équipes à l''usage pratique de Bitcoin et du Lightning Network, avec l''API Blink et les passerelles mobile money locales Lumicash et Afripay. Formateur : Advaxe NDAYISENGA, Free Tech Institute.',
  summary_en = 'Five days (3–7 PM) training 30 young Burundians in 5 teams on hands-on Bitcoin and Lightning Network use, with the Blink API and local mobile money gateways Lumicash and Afripay. Trainer: Advaxe NDAYISENGA, Free Tech Institute.',
  highlights = array['Fondamentaux Bitcoin et introduction au Lightning Network','Sécurité, auto-garde et API Blink','Lumicash et Afripay : ponts vers le mobile money local','Hackathon en 5 équipes avec un mentor par équipe','Demo Day, certification et remise des prix aux 2 meilleures équipes'],
  highlights_en = array['Bitcoin fundamentals and Lightning Network introduction','Security, self-custody and the Blink API','Lumicash and Afripay: bridges to local mobile money','Hackathon with 5 teams and one mentor per team','Demo Day, certification and prizes for the top 2 teams']
where id = '1b6067ae-21fb-40a9-a4fc-0fc1df28287d';

delete from schedule_slots where cohort_id = '1b6067ae-21fb-40a9-a4fc-0fc1df28287d';

insert into schedule_slots (cohort_id, day, start_time, end_time, title, title_en, theme, theme_en, sort_order) values
('1b6067ae-21fb-40a9-a4fc-0fc1df28287d',1,'15:00','15:15','Accueil et présentation du bootcamp','Welcome and bootcamp introduction','Objectifs et mentors Free Tech Institute','Goals and Free Tech Institute mentors',1),
('1b6067ae-21fb-40a9-a4fc-0fc1df28287d',1,'15:15','16:15','Qu''est-ce que Bitcoin ?','What is Bitcoin?','Décentralisation, consensus — aperçu on-chain à titre informatif','Decentralization, consensus — on-chain overview for information only',2),
('1b6067ae-21fb-40a9-a4fc-0fc1df28287d',1,'16:15','16:30','Pause','Break',null,null,3),
('1b6067ae-21fb-40a9-a4fc-0fc1df28287d',1,'16:30','17:45','Introduction au Lightning Network','Introduction to the Lightning Network','Paiements instantanés, canaux, pertinence pour le Burundi','Instant payments, channels, relevance for Burundi',4),
('1b6067ae-21fb-40a9-a4fc-0fc1df28287d',1,'17:45','19:00','Panorama des outils : Blink, Lumicash, Afripay','Tooling overview: Blink, Lumicash, Afripay','Questions / réponses','Q&A',5),
('1b6067ae-21fb-40a9-a4fc-0fc1df28287d',2,'15:00','16:00','Sécurité des actifs numériques','Digital asset security','Clés privées, seed phrase, erreurs fréquentes','Private keys, seed phrase, common mistakes',1),
('1b6067ae-21fb-40a9-a4fc-0fc1df28287d',2,'16:00','16:15','Pause','Break',null,null,2),
('1b6067ae-21fb-40a9-a4fc-0fc1df28287d',2,'16:15','17:30','Démonstration de l''API Blink','Blink API demonstration','Création d''un wallet Lightning, envoi et réception','Creating a Lightning wallet, sending and receiving',3),
('1b6067ae-21fb-40a9-a4fc-0fc1df28287d',2,'17:30','19:00','Atelier guidé : premier paiement Lightning','Guided workshop: first Lightning payment','Chaque participant réalise un paiement test via Blink','Each participant makes a test payment via Blink',4),
('1b6067ae-21fb-40a9-a4fc-0fc1df28287d',3,'15:00','16:00','« Le numérique entre vos mains »','"Digital in your hands"','Sécurité individuelle et confiance collective : concevoir des apps décentralisées utiles','Individual security and collective trust: designing useful decentralized apps',1),
('1b6067ae-21fb-40a9-a4fc-0fc1df28287d',3,'16:00','16:15','Pause','Break',null,null,2),
('1b6067ae-21fb-40a9-a4fc-0fc1df28287d',3,'16:15','17:00','Exploration de Lumicash','Exploring Lumicash','Passerelle entre Lightning Network et mobile money local','Bridge between Lightning Network and local mobile money',3),
('1b6067ae-21fb-40a9-a4fc-0fc1df28287d',3,'17:00','17:30','Exploration d''Afripay','Exploring Afripay','Cas d''usage mobile money, philosophie permissionless','Mobile money use cases, permissionless philosophy',4),
('1b6067ae-21fb-40a9-a4fc-0fc1df28287d',3,'17:30','18:00','Atelier terrain','Field workshop','Identification en petits groupes d''un problème réel','Small groups identify a real-world problem',5),
('1b6067ae-21fb-40a9-a4fc-0fc1df28287d',3,'18:00','19:00','Constitution des 5 équipes','Forming the 5 teams','Attribution des 5 mentors et validation des cas d''usage','Assigning the 5 mentors and validating use cases',6),
('1b6067ae-21fb-40a9-a4fc-0fc1df28287d',4,'15:00','15:15','Lancement du hackathon','Hackathon kickoff','Critères du jury, fiches de suivi des mentors','Jury criteria, mentor tracking sheets',1),
('1b6067ae-21fb-40a9-a4fc-0fc1df28287d',4,'15:15','17:00','Développement : mise en place technique','Development: technical setup','Comptes API et environnement de travail','API accounts and working environment',2),
('1b6067ae-21fb-40a9-a4fc-0fc1df28287d',4,'17:00','17:15','Pause','Break',null,null,3),
('1b6067ae-21fb-40a9-a4fc-0fc1df28287d',4,'17:15','19:00','Développement : construction du prototype','Development: building the prototype','Coaching individuel par équipe (mentors FTI)','One-on-one team coaching (FTI mentors)',4),
('1b6067ae-21fb-40a9-a4fc-0fc1df28287d',5,'15:00','17:00','Finalisation des prototypes','Finalizing the prototypes','Suite et fin du développement','Development wrap-up',1),
('1b6067ae-21fb-40a9-a4fc-0fc1df28287d',5,'17:00','17:15','Pause','Break',null,null,2),
('1b6067ae-21fb-40a9-a4fc-0fc1df28287d',5,'17:15','18:15','Pitchs des 5 équipes devant le jury','Pitches from the 5 teams','Environ 12 minutes par équipe, démo incluse','About 12 minutes per team, demo included',3),
('1b6067ae-21fb-40a9-a4fc-0fc1df28287d',5,'18:15','18:35','Délibération du jury','Jury deliberation',null,null,4),
('1b6067ae-21fb-40a9-a4fc-0fc1df28287d',5,'18:35','18:50','Annonce des 2 meilleurs projets','Announcing the top 2 projects','Remise des récompenses','Prize ceremony',5),
('1b6067ae-21fb-40a9-a4fc-0fc1df28287d',5,'18:50','19:00','Graduation','Graduation','Remise des certificats et clôture du bootcamp','Certificates and bootcamp closing',6);
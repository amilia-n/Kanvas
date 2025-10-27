BEGIN;

-- -------------------------
-- Majors
-- -------------------------
INSERT INTO majors (code, name) VALUES
('CS','Computer Science'),
('ACC','Accounting'),
('STAT','Statistics'),
('FIN','Finance'),
('ENGR','Engineering'),
('BIOL','Biology'),
('ECON','Economics'),
('ARCH','Architecture'),
('MATH','Mathematics'),
('DES','Graphic Design'),
('POL','Political Science'),
('HIST','History'),
('CHEM','Chemistry'),
('PHYS','Physics'),
('BCHM','Biochemistry')
ON CONFLICT (code) DO NOTHING;

-- ---------
-- Terms
-- ---------
INSERT INTO terms (code, starts_on, ends_on) VALUES
('FALL23',   DATE '2023-08-28', DATE '2023-12-15'),
('SPRING24', DATE '2024-01-22', DATE '2024-05-10'),
('FALL24',   DATE '2024-08-26', DATE '2024-12-13'),
('SPRING25', DATE '2025-01-21', DATE '2025-05-09'),
('FALL25',   DATE '2025-08-25', DATE '2025-12-12'),
('SPRING26', DATE '2026-01-23', DATE '2026-05-08')
ON CONFLICT (code) DO NOTHING;

-- -------------------
-- Faculty whitelist
-- -------------------
INSERT INTO faculty_registry (email, teacher_number, first_name, last_name, active) VALUES
('atur@faculty.kanvas.edu','T-521834','Alan','Turing',TRUE), -- CHEM + CHEME
('blis@faculty.kanvas.edu','T-547210','Barbara','Liskov',TRUE),  -- MATH + PHYS
('dknu@faculty.kanvas.edu','T-563492','Donald','Knuth',TRUE), -- CS
('enoe@faculty.kanvas.edu','T-574118','Emmy','Noether',TRUE),  -- BIOE + BIOL
('ghop@faculty.kanvas.edu','T-589603','Grace','Hopper',TRUE), --CEE + ARCH
('csha@faculty.kanvas.edu','T-592471','Claude','Shannon',TRUE), --MECH
('hlam@faculty.kanvas.edu','T-603958','Hedy','Lamarr',TRUE), --AERO
('jbac@faculty.kanvas.edu','T-615327','John','Backus',TRUE), --ECON
('nwir@faculty.kanvas.edu','T-628409','Niklaus','Wirth',TRUE), --MSE
('alov@faculty.kanvas.edu','T-639175','Ada','Lovelace',TRUE) --POLS + BCS
ON CONFLICT (email) DO NOTHING;

-- -----------
-- Courses 
-- -----------
INSERT INTO courses (code, name) VALUES
  ('CEE',   'Civil & Environmental Engineering'),
  ('MECH',  'Mechanical Engineering'),
  ('MSE',   'Materials Science & Engineering'),
  ('ARCH',  'Architecture'),
  ('CHEM',  'Chemistry'),
  ('CS',    'Computer Science'),
  ('BIOL',  'Biology'),
  ('PHYS',  'Physics'),
  ('BCS',   'Brain & Cognitive Sciences'),
  ('CHEME', 'Chemical Engineering'),
  ('ECON',  'Economics'),
  ('AERO',  'Aeronautics & Astronautics'),
  ('POLS',  'Political Science'),
  ('MATH',  'Mathematics'),
  ('BIOE',  'Biological Engineering')
ON CONFLICT (code) DO NOTHING;

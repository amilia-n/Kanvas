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


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


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

-- =================
-- COURSE OFFERINGS 
-- =================

INSERT INTO course_offering
  (course_id, term_id, teacher_id, code, name, description, credits, section, total_seats)
VALUES
-- CEE 
((SELECT id FROM courses WHERE code='CEE'), (SELECT id FROM terms WHERE code='FALL25'), NULL,
 'CEE101', 'Engineering Computation and Data Science',
 'Presents engineering problems in a computational setting with emphasis on data science and problem abstraction. Covers exploratory data analysis and visualization, filtering, regression. Building basic machine learning models (classifiers, decision trees, clustering) for smart city applications. Labs and programming projects focused on analytics problems faced by cities, infrastructure, and environment.',
 4, 'A', 28),
((SELECT id FROM courses WHERE code='CEE'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'CEE201', 'Introduction to Computer Programming and Numerical Methods for Engineering Applications',
 'Presents the fundamentals of computing and computer programming (procedural and object-oriented programming) in an engineering context. Introduces logical operations, floating-point arithmetic, data structures, induction, iteration, and recursion. Computational methods for interpolation, regression, root finding, sorting, searching, and the solution of linear systems of equations and ordinary differential equations. Control of sensors and visualization of scientific data. Draws examples from engineering and scientific applications. Students use the Python programming environment to complete weekly assignments.',
 4, 'B', 28),
((SELECT id FROM courses WHERE code='CEE'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'CEE202', 'Engineering Computation and Data Science',
 'Presents engineering problems in a computational setting with emphasis on data science and problem abstraction. Covers exploratory data analysis and visualization, filtering, regression. Building basic machine learning models (classifiers, decision trees, clustering) for smart city applications. Labs and programming projects focused on analytics problems faced by cities, infrastructure and environment. Programming experience in a language is required.',
 4, 'C', 28),
((SELECT id FROM courses WHERE code='CEE'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'CEE230', 'Startup Sustainable Tech',
 'Provides a practical introduction to key innovations in the fields of civil and environmental engineering that are currently having an impact. Structured around the different aspects of starting and maintaining a company in the first years after incorporation. Key topics include idea protection, team formation, and seed funds. Guest speakers who are involved in the startup process or are successful entrepreneurs present. Under faculty supervision, students work on case studies in areas such as renewable energy, sustainable design, food security, climate change, new infrastructures, and transportation. Concludes with the writing of a SBIR/STTR-type grant or business model.',
 3, 'D', 20),
((SELECT id FROM courses WHERE code='CEE'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'CEE240', 'Probability and Causal Inference',
 'Introduces probability and causal inference with an emphasis on understanding, quantifying, and modeling uncertainty and cause-effect relationships in an engineering context. Topics in the first half include events and their probability, the total probability and Bayes theorems, discrete and continuous random variables and vectors, and conditional analysis. Topics in the second half include covariance, correlation, regression analysis, causality analysis, structural causal models, interventions, and hypothesis testing. Concepts illustrated through data and applications.',
 4, 'E', 28),

((SELECT id FROM courses WHERE code='CEE'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'CEE241', 'Causal Inference for Data Analysis',
 'Introduces causal inference with an emphasis on probabilistic systems analysis. Readings about conceptual and mathematical background are given in advanced of each class. Focused on understanding theory based on real-world applications. The subject is project-based and focused on cause-effect relationships, understanding why probabilistic outcomes happen. Topics include correlation analysis, Reichenbach''s principle, Simpson''s paradox, structural causal models and graphs, interventions, do-calculus, average causal effects, dealing with missing information, mediation, and hypothesis testing.',
 4, 'F', 28),
((SELECT id FROM courses WHERE code='CEE'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'CEE250', 'Introduction to Network Models',
 'Provides an introduction to complex networks, their structure, and function, with examples from engineering, applied mathematics and social sciences. Topics include spectral graph theory, notions of centrality, random graph models, contagion phenomena, cascades and diffusion, and opinion dynamics.',
 3, 'G', 20),

-- MECH
((SELECT id FROM courses WHERE code='MECH'), (SELECT id FROM terms WHERE code='FALL25'), NULL,
 'MECH110', 'Designing for the Future: Earth, Sea, and Space',
 'Student teams formulate and complete space/earth/ocean exploration-based design projects with weekly milestones. Introduces core engineering themes, principles, and modes of thinking. Specialized learning modules enable teams to focus on the knowledge required to complete their projects, such as machine elements, electronics, design process, visualization and communication. Includes exercises in written and oral communication and team building. Examples of projects include surveying a lake for millfoil, from a remote controlled aircraft, and then sending out robotic harvesters to clear the invasive growth; and exploration to search for the evidence of life on a moon of Jupiter, with scientists participating through teleoperation and supervisory control of robots.',
 4, 'B', 28),
((SELECT id FROM courses WHERE code='MECH'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'MECH210', 'Explorations in Mechanical Engineering',
 'Broad introduction to the various aspects of mechanical engineering, including mechanics, design, controls, energy, ocean engineering, bioengineering, and micro/nano engineering through a variety of experiences, including discussions led by faculty, students, and industry experts. Reviews research opportunities and undergraduate major options in Course 2 as well as a variety of career paths pursued by alumni. Subject can count toward the 6-unit discovery-focused credit limit for first year students.',
 3, 'A', 20),

((SELECT id FROM courses WHERE code='MECH'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'MECH221', 'Mechanics and Materials I',
 'Introduction to statics and the mechanics of deformable solids. Emphasis on the three basic principles of equilibrium, geometric compatibility, and material behavior. Stress and its relation to force and moment; strain and its relation to displacement; linear elasticity with thermal expansion. Failure modes. Application to simple engineering structures such as rods, shafts, beams, and trusses. Application to biomechanics of natural materials and structures.',
 4, 'C', 28),
((SELECT id FROM courses WHERE code='MECH'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'MECH222', 'Mechanics and Materials II',
 'Introduces mechanical behavior of engineering materials, and the use of materials in mechanical design. Emphasizes the fundamentals of mechanical behavior of materials, as well as design with materials. Major topics: elasticity, plasticity, limit analysis, fatigue, fracture, and creep. Materials selection. Laboratory experiments involving projects related to materials in mechanical design.',
 4, 'D', 28),
((SELECT id FROM courses WHERE code='MECH'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'MECH231', 'Engineering Mathematics: Linear Algebra and ODEs',
 'Introduction to linear algebra and ordinary differential equations (ODEs), including general numerical approaches to solving systems of equations. Linear systems of equations, existence and uniqueness of solutions, Gaussian elimination. Initial value problems, 1st and 2nd order systems, forward and backward Euler, RK4. Eigenproblems, eigenvalues and eigenvectors, including complex numbers, functions, vectors and matrices.',
 5, 'E', 30),

-- MSE 
((SELECT id FROM courses WHERE code='MSE'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'MSE110', 'Introduction to Symbolic and Mathematical Computing',
 'Introduces fundamental computational techniques and applications of mathematics to prepare students for materials science and engineering curriculum. Covers elementary programming concepts, including data analysis and visualization. Students study computation/visualization and math techniques and apply them in computational software to gain familiarity with techniques used in subsequent subjects. Uses examples from material science and engineering applications, particularly from structure and mechanics of materials, including linear algebra, tensor transformations, review of calculus of several variables, numerical solutions to differential questions, and random walks.',
 3, 'A', 20),
((SELECT id FROM courses WHERE code='MSE'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'MSE210', 'Introduction to Modeling and Simulation',
 'Basic concepts of computer modeling and simulation in science and engineering. Uses techniques and software for simulation, data analysis and visualization. Continuum, mesoscale, atomistic and quantum methods used to study fundamental and applied problems in physics, chemistry, materials science, mechanics, engineering, and biology. Examples drawn from the disciplines above are used to understand or characterize complex structures and materials, and complement experimental observations.',
 4, 'B', 28),
((SELECT id FROM courses WHERE code='MSE'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'MSE220', 'Mathematics, Modeling, and Visualization for Materials Scientists',
 'Covers mathematics and modeling skills required for a comprehensive understanding of materials science concepts and modeling them. Visualization techniques are covered to enhance communication of fundamental materials science concepts and research results. Presents a wide variety of mathematical and computational techniques motivated by materials science examples, such as: structure, crystallography, continuum mechanics, quantum mechanics and solid-state physics, classical and and statistical thermodynamics, optical properties, fracture, defects, kinetics, and phase transformations. Instruction is given with symbolic mathematical software. Students may use software to complete assignments.',
 4, 'C', 28),

-- ARCH
((SELECT id FROM courses WHERE code='ARCH'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'ARCH101', 'Design Studio: How to Design',
 'Introduces fundamental design principles as a way to demystify design and provide a basic introduction to all aspects of the process. Stimulates creativity, abstract thinking, representation, iteration, and design development. Equips students with skills to have more effective communication with designers, and develops their ability to apply the foundations of design to any discipline.',
 4, 'A', 28),
((SELECT id FROM courses WHERE code='ARCH'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'ARCH110', 'Introduction to Architectural Design Techniques',
 'Introduces the tools, techniques, and technologies of design across a range of projects in a studio environment. Explores concepts related to form, function, materials, tools, and physical environments through project-based exercises. Develops familiarity with design process, critical observation, and the translation of design concepts into digital and physical reality. Utilizing traditional and contemporary techniques and tools, faculty across various design disciplines expose students to a unique cross-section of inquiry.',
 4, 'B', 28),
((SELECT id FROM courses WHERE code='ARCH'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'ARCH201', 'Architecture Design Studio I',
 'Provides instruction in architectural design and project development within design constraints including architectural program and site. Students engage the design process through various 2-dimensional and 3-dimensional media. Working directly with representational and model making techniques, students gain experience in the conceptual, formal, spatial and material aspects of architecture.',
 5, 'C', 30),
((SELECT id FROM courses WHERE code='ARCH'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'ARCH202', 'Architecture Design Studio II',
 'Provides instruction in architectural design and project development with an emphasis on social, cultural, or civic programs. Builds on foundational design skills with more complex constraints and contexts. Integrates aspects of architectural theory, building technology, and computation into the design process.',
 5, 'D', 30),

-- CHEM 
((SELECT id FROM courses WHERE code='CHEM'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'CHEM101', 'Principles of Chemical Science',
 'Introduction to chemistry, with emphasis on basic principles of atomic and molecular electronic structure, thermodynamics, acid-base and redox equilibria, chemical kinetics, and catalysis. Introduction to the chemistry of biological, inorganic, and organic molecules.',
 5, 'A', 30),
((SELECT id FROM courses WHERE code='CHEM'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'CHEM102', 'Principles of Chemical Science (Advanced)',
 'Introduction to chemistry for students who have taken two or more years of high school chemistry. Emphasis on basic principles of atomic and molecular electronic structure, thermodynamics, acid-base and redox equilibria, chemical kinetics, and catalysis. Applications of basic principles to problems in metal coordination chemistry, organic chemistry, and biological chemistry.',
 5, 'B', 30),
((SELECT id FROM courses WHERE code='CHEM'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'CHEM201', 'Organic Chemistry I',
 'Introduction to organic chemistry. Development of basic principles to understand the structure and reactivity of organic molecules. Emphasis on substitution and elimination reactions and chemistry of the carbonyl group. Introduction to the chemistry of aromatic compounds.',
 5, 'C', 30),
((SELECT id FROM courses WHERE code='CHEM'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'CHEM202', 'Organic Chemistry II',
 'Focuses on synthesis, structure determination, mechanism, and the relationships between structure and reactivity. Selected topics illustrate the role of organic chemistry in biological systems and in the chemical industry.',
 5, 'D', 30),
((SELECT id FROM courses WHERE code='CHEM'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'CHEM230', 'Introduction to Biological Chemistry',
 'Chemical and physical properties of the cell and its building blocks. Structures of proteins and principles of catalysis. The chemistry of organic/inorganic cofactors required for chemical transformations within the cell. Basic principles of metabolism and regulation in pathways, including glycolysis, gluconeogenesis, fatty acid synthesis/degradation, pentose phosphate pathway, Krebs cycle and oxidative phosphorylation, DNA replication, and transcription and translation.',
 4, 'E', 28),
((SELECT id FROM courses WHERE code='CHEM'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'CHEM240', 'Fundamentals of Chemical Biology',
 'Spanning the fields of biology, chemistry, and engineering, this class introduces students to the principles of chemical biology and the application of chemical and physical methods and reagents to the study and manipulation of biological systems. Topics include nucleic acid structure, recognition, and manipulation; protein folding and stability, and proteostasis; bioorthogonal reactions and activity-based protein profiling; chemical genetics and small-molecule inhibitor screening; fluorescent probes for biological analysis and imaging; and unnatural amino acid mutagenesis. The class will also discuss the logic of dynamic post-translational modification reactions with an emphasis on chemical biology approaches for studying complex processes including glycosylation, phosphorylation, and lipidation. ',
 4, 'F', 28),

-- CS 
((SELECT id FROM courses WHERE code='CS'), (SELECT id FROM terms WHERE code='SPRING25'), NULL, 
 'CS101', 'Introduction to Programming and Computer Science',
 'Develops foundational skills in programming and in computational modeling. Covers widely used programming concepts in Python, including mutability, function objects, and object-oriented programming. Introduces algorithmic complexity and some common libraries. Throughout, demonstrates using computation to help understand real-world phenomena; topics include optimization problems, building simulations, and statistical modeling.',
 4, 'A', 28),
((SELECT id FROM courses WHERE code='CS'), (SELECT id FROM terms WHERE code='SPRING25'), NULL, 
 'CS102','Introduction to computer science and programming.', 
 'Students develop skills to program and use computational techniques to solve problems. Topics include: the notion of computation, Python, simple algorithms and data structures, object-oriented programming, testing and debugging, and algorithmic complexity.',
 4, 'B', 28),
((SELECT id FROM courses WHERE code='CS'), (SELECT id FROM terms WHERE code='SPRING25'), NULL, 
 'CS103', 'Introduction to Computer Science and Programming',
 'Introduction to computer science and programming for students with no programming experience. Students develop skills to program and use computational techniques to solve problems. Topics include the notion of computation, Python, simple algorithms and data structures, testing and debugging, and algorithmic complexity.',
 4, 'D', 28),
 ((SELECT id FROM courses WHERE code='CS'), (SELECT id FROM terms WHERE code='SPRING25'), NULL, 
 'CS111', 'Fundamentals of Programming',
 'Introduces fundamental concepts of programming. Designed to develop skills in applying basic methods from programming languages to abstract problems. Topics include programming and Python basics, computational concepts, software engineering, algorithmic techniques, data types, and recursion.',
 4, 'K', 28),
 ((SELECT id FROM courses WHERE code='CS'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'CS201', 'Introduction to Computational Thinking and Data Science',
 'Provides an introduction to using computation to build models that can be used to help understand real-world phenomena. Topics include optimization problems, simulation models, and statistical models.',
 4, 'L', 28),
((SELECT id FROM courses WHERE code='CS'), (SELECT id FROM terms WHERE code='SPRING26'), NULL, 
 'CS201', 'Introduction to Computational Thinking and Data Science',
 'Provides an introduction to using computation to build models that can be used to help understand real-world phenomena. Topics include optimization problems, simulation models, and statistical models.',
 4, 'C', 28),
((SELECT id FROM courses WHERE code='CS'), (SELECT id FROM terms WHERE code='SPRING26'), NULL, 
 'CS210', 'Software Construction',
 'Introduces fundamental principles and techniques of software development: how to write software that is safe from bugs, easy to understand, and ready for change. Topics include specifications and invariants; testing, test-case generation, and coverage; abstract data types and representation independence; design patterns for object-oriented programming; concurrent programming, including message passing and shared memory concurrency, and defending against races and deadlock; and functional programming with immutable data and higher-order functions.',
 4, 'F', 28),
((SELECT id FROM courses WHERE code='CS'), (SELECT id FROM terms WHERE code='SPRING26'), NULL, 
 'CS220', 'Software Design',
 'Provides design-focused instruction on how to build complex software applications. Design topics include classic human-computer interaction (HCI) design tactics (need finding, heuristic evaluation, prototyping, user testing), conceptual design (inventing, modeling and evaluating constituent concepts), social and ethical implications, abstract data modeling, and visual design. Implementation topics include reactive front-ends, web services, and databases.',
 4, 'G', 28),
((SELECT id FROM courses WHERE code='CS'), (SELECT id FROM terms WHERE code='SPRING26'), NULL, 
 'CS230', 'Software Performance Engineering',
 'Project-based introduction to building efficient, high-performance and scalable software systems. Topics include performance analysis, algorithmic techniques for high performance, instruction-level optimizations, vectorization, cache and memory hierarchy optimization, and parallel programming.',
 4, 'H', 28),
((SELECT id FROM courses WHERE code='CS'), (SELECT id FROM terms WHERE code='SPRING26'), NULL, 
 'CS240', 'Algorithm Engineering',
 'Covers the theory and practice of algorithms and data structures. Topics include models of computation, algorithm design and analysis, and performance engineering of algorithm implementations. Presents the design and implementation of sequential, parallel, cache-efficient, and external-memory algorithms. Illustrates many of the principles of algorithm engineering in the context of parallel algorithms and graph problems.',
 4, 'I', 28),

-- BIOL 
((SELECT id FROM courses WHERE code='BIOL'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'BIOL101', 'Introductory Biology',
 'Discusses core principles including: chemical bonding and molecular interactions, protein structure/function and basic thermodynamics, how information flows in the cell, genetics, tools for studying and manipulating genetic material, sequencing, cell biology, evolution, and how the body fights off harmful disease-causing agents. Expands upon the core principles to include specializations such as fluorescent cell imaging, neuroscience, cell cycle, cancer, stem cells, and aging.',
 5, 'A', 30),
((SELECT id FROM courses WHERE code='BIOL'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'BIOL120', 'Fundamentals of Experimental Molecular Biology',
 'Introduces the experimental concepts and methods of molecular biology. Covers basic principles of experimental design and data analysis, with an emphasis on the acquisition of practical laboratory experience.',
 3, 'B', 20),
((SELECT id FROM courses WHERE code='BIOL'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'BIOL220', 'Applied Molecular Biology Laboratory',
 'Laboratory-based exploration of modern experimental molecular biology. Specific experimental system studied may vary from term to term, depending on instructor. Emphasizes concepts of experimental design, data analysis and communication in biology and how these concepts are applied in the biotechnology industry.',
 3, 'C', 20),

-- PHYS
((SELECT id FROM courses WHERE code='PHYS'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'PHYS110', 'Exploring Physics Using Python',
 'Reviews and reinforces CS topics, making connections and studying interesting physical systems (from abstract knowledge of concepts to modeling, coding, and evaluating results) that are relevant to physicists.',
 3, 'A', 20),
((SELECT id FROM courses WHERE code='PHYS'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'PHYS151', 'Physics I',
 'Introduces classical mechanics. Space and time: straight-line kinematics; motion in a plane; forces and equilibrium; experimental basis of Newton''s laws; particle dynamics; universal gravitation; collisions and conservation laws; work and potential energy; vibrational motion; conservative forces; inertial forces and non-inertial frames; central force motions; rigid bodies and rotational dynamics.',
 5, 'B', 30),
((SELECT id FROM courses WHERE code='PHYS'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'PHYS152', 'Physics II',
 'Introduction to electromagnetism and electrostatics: electric charge, Coulomb''s law, electric structure of matter; conductors and dielectrics. Concepts of electrostatic field and potential, electrostatic energy. Electric currents, magnetic fields and Ampere''s law. Magnetic materials. Time-varying fields and Faraday''s law of induction. Basic electric circuits. Electromagnetic waves and Maxwell''s equations.',
 5, 'C', 30),
((SELECT id FROM courses WHERE code='PHYS'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'PHYS253', 'Physics III (Vibrations, Waves, and Optics)',
 'Mechanical vibrations and waves; simple harmonic motion, superposition, forced vibrations and resonance, coupled oscillations, and normal modes; vibrations of continuous systems; reflection and refraction; phase and group velocity. Optics; wave solutions to Maxwell''s equations; polarization; Snell''s Law, interference, Huygens''s principle, Fraunhofer diffraction, and gratings.',
 4, 'D', 28),

-- BCS 
((SELECT id FROM courses WHERE code='BCS'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'BCS101', 'Introduction to Psychological Science',
 'A survey of the scientific study of human nature, including how the mind works, and how the brain supports the mind. Topics include the mental and neural bases of perception, emotion, learning, memory, cognition, child development, personality, psychopathology, and social interaction. Consideration of how such knowledge relates to debates about nature and nurture, free will, consciousness, human differences, self, and society.',
 4, 'A', 28),
((SELECT id FROM courses WHERE code='BCS'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'BCS110', 'Introduction to Neuroscience',
 'Introduction to the mammalian nervous system, with emphasis on the structure and function of the human brain. Topics include the function of nerve cells, sensory systems, control of movement, learning and memory, and diseases of the brain.',
 4, 'B', 28),
((SELECT id FROM courses WHERE code='BCS'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'BCS201', 'Systems Neuroscience Core I',
 'Survey of brain and behavioral studies. Examines principles underlying the structure and function of the nervous system, with a focus on systems approaches. Topics include development of the nervous system and its connections, sensory systems of the brain, the motor system, higher cortical functions, and behavioral and cellular analyses of learning and memory.',
 4, 'C', 28),
((SELECT id FROM courses WHERE code='BCS'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'BCS210', 'Cognitive Science',
 'Intensive survey of cognitive science. Topics include visual perception, language, memory, cognitive architecture, learning, reasoning, decision-making, and cognitive development. Topics covered from behavioral, computational, and neural perspectives.',
 4, 'D', 28),

-- CHEME 
((SELECT id FROM courses WHERE code='CHEME'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'CHEME110', 'Foundations of Entrepreneurship for Engineers',
 'Studies economic and leadership foundations of entrepreneurship as they relate to engineering. Case studies illustrate major impacts of engineering on the world and examine the leaders responsible for such impacts. Authors include Franklin, Keynes, Leonardo, Lincoln, Locke, Machiavelli, Marx, Schmidt, Schumpeter, Smith, Thiel, and Tocqueville. Discusses topics such as the difference between an entrepreneur and a manager, the entrepreneur as founder, and characteristics of principled entrepreneurship.',
 3, 'A', 20),
((SELECT id FROM courses WHERE code='CHEME'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'CHEME220', 'Advances in Biomanufacturing',
 'Seminar examines how biopharmaceuticals, an increasingly important class of pharmaceuticals, are manufactured. Topics range from fundamental bioprocesses to new technologies to the economics of biomanufacturing. Also covers the impact of globalization on regulation and quality approaches as well as supply chain integrity.',
 3, 'B', 20),
((SELECT id FROM courses WHERE code='CHEME'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'CHEME230', 'A Philosophical History of Energy',
 'Philosophic and historical approach to conceptions of energy through the 19th century. Relation of long standing scientific and philosophic problems in the field of energy to 21st-century debates. Topics include the development of thermodynamics and kinetic theories, the foundation of the scientific project, the classical view of energy, and the harnessing of nature.',
 3, 'C', 20),

-- ECON
((SELECT id FROM courses WHERE code='ECON'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'ECON101', 'Principles of Microeconomics',
 'Introduces microeconomic concepts and analysis, supply and demand analysis, theories of the firm and individual behavior, competition and monopoly, and welfare economics. Applications to problems of current economic policy.',
 4, 'A', 28),
((SELECT id FROM courses WHERE code='ECON'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'ECON102', 'Principles of Macroeconomics',
 'Provides an overview of macroeconomic issues including the determination of national income, economic growth, unemployment, inflation, interest rates, and exchange rates. Introduces basic macroeconomic models and illustrates key principles through applications to the experience of the US and other economies. Explores a range of current policy debates, such as the economic effects of monetary and fiscal policy, the causes of and policy responses to financial crises, the burden of the national debt, and the government policies that affect long-term growth in living standards.',
 4, 'B', 28),
((SELECT id FROM courses WHERE code='ECON'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'ECON201', 'Microeconomic Theory and Public Policy',
 'Students master and apply economic theory, causal inference, and contemporary evidence to analyze policy challenges. These include the effect of minimum wages on employment, the value of healthcare, the power and limitations of free markets, the benefits and costs of international trade, the causes and remedies of externalities, the consequences of adverse selection in insurance markets, the impacts of labor market discrimination, and the application of machine learning to supplement to decision-making.',
 4, 'C', 28),

-- AERO 
((SELECT id FROM courses WHERE code='AERO'), (SELECT id FROM terms WHERE code='FALL25'), NULL,
 'AERO201', 'Unified Engineering: Materials and Structures',
 'Presents fundamental principles and methods of materials and structures for aerospace engineering, and engineering analysis and design concepts applied to aerospace systems. Topics include statics; analysis of trusses; analysis of statically determinate and indeterminate systems; stress-strain behavior of materials; analysis of beam bending, buckling, and torsion; material and structural failure, including plasticity, fracture, fatigue, and their physical causes. Experiential lab and aerospace system projects provide additional aerospace context.',
 5, 'A', 30),
((SELECT id FROM courses WHERE code='AERO'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'AERO202', 'Unified Engineering: Signals and Systems',
 'Presents fundamental principles and methods of signals and systems for aerospace engineering, and engineering analysis and design concepts applied to aerospace systems. Topics include linear and time invariant systems; convolution; Fourier and Laplace transform analysis in continuous and discrete time; modulation, filtering, and sampling; and an introduction to feedback control. Experiential lab and system projects provide additional aerospace context. Labs, projects, and assignments involve the use of software such as MATLAB and/or Python.',
 5, 'B', 30),
((SELECT id FROM courses WHERE code='AERO'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'AERO203', 'Unified Engineering: Fluid Dynamics',
 'Presents fundamental principles and methods of fluid dynamics for aerospace engineering, and engineering analysis and design concepts applied to aerospace systems. Topics include aircraft and aerodynamic performance, conservation laws for fluid flows, quasi-one-dimensional compressible flows, shock and expansion waves, streamline curvature, potential flow modeling, an introduction to three-dimensional wings and induced drag. Experiential lab and aerospace system projects provide additional aerospace context.',
 5, 'C', 30),
((SELECT id FROM courses WHERE code='AERO'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'AERO204', 'Unified Engineering: Thermodynamics and Propulsion',
 'Presents fundamental principles and methods of thermodynamics for aerospace engineering, and engineering analysis and design concepts applied to aerospace systems. Topics include thermodynamic state of a system, forms of energy, work, heat, the first law of thermodynamics, heat engines, reversible and irreversible processes, entropy and the second law of thermodynamics, ideal and non-ideal cycle analysis, two-phase systems, and introductions to thermochemistry and heat transfer. Experiential lab and aerospace system projects provide additional aerospace context.',
 5, 'D', 30),

-- POLS 
((SELECT id FROM courses WHERE code='POLS'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'POLS101', 'Justice',
 'Provides an introduction to contemporary political thought centered around the ideal of justice and the realities of injustice. Examines what a just society might look like and how we should understand various forms of oppression and domination. Studies three theories of justice (utilitarianism, libertarianism, and egalitarian liberalism) and brings them into conversation with other traditions of political thought (critical theory, communitarianism, republicanism, and post-structuralism). Readings cover foundational debates about equality, freedom, recognition, and power.',
 4, 'A', 28),
((SELECT id FROM courses WHERE code='POLS'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'POLS102', 'Philosophy of Law',
 'Examines fundamental issues in philosophy of law, such as the nature and limits of law and a legal system, and the relation of law to morality, with particular emphasis on the philosophical issues and problems associated with privacy, liberty, justice, punishment, and responsibility. Historical and contemporary readings, including court cases. Instruction and practice in oral and written communication provided.',
 4, 'B', 28),
 ((SELECT id FROM courses WHERE code='POLS'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'POLS103', 'Introduction to Political Thought',
 'Examines major texts in the history of political thought and considers how they contribute to a broader conversation about freedom, equality, democracy, rights, and the role of politics in human life. Areas covered may include ancient, modern, contemporary, or American political thought.',
 4, 'C', 28),
 ((SELECT id FROM courses WHERE code='POLS'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'POLS104', 'American Political Thought',
 'Examines political thought from the American colonial period through the 20th century. Considers the influences that gave rise to American political ideas and the implication of those ideas in a modern context, with particular emphasis on issues of liberty, equality, and the role of values from a liberal democratic lens.',
 4, 'D', 28),
 ((SELECT id FROM courses WHERE code='POLS'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'POLS105', 'Libertarianism',
 'Explores the history of the ideal of individual liberty in light of contemporary arguments over the proper scope of the regulatory state. Surveys the political theory of freedom and its relationship to other dominant norms (e.g., property, equality, community, republicanism, innovation, and the pursuit of wealth). Revisits the diversity of modern libertarian movements with attention to issues such as abolitionism and the Civil Rights revolution, religious liberty, the right to bear arms, and LGBTQ rights. Concludes with a set of policy and legal/constitutional debates about the role of government in regulating the financial markets, artificial intelligence, and/or the internet.',
 4, 'B', 28),

-- MATH 
((SELECT id FROM courses WHERE code='MATH'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'MATH151', 'Calculus I',
 'Differentiation and integration of functions of one variable, with applications. Informal treatment of limits and continuity. Differentiation: definition, rules, application to graphing, rates, approximations, and extremum problems. Indefinite integration; separable first-order differential equations. Definite integral; fundamental theorem of calculus. Applications of integration to geometry and science. Elementary functions. Techniques of integration. Polar coordinates. L''Hopital''s rule. Improper integrals. Infinite series: geometric, p-harmonic, simple comparison tests, power series for some elementary functions.',
5, 'A', 30),
((SELECT id FROM courses WHERE code='MATH'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'MATH152', 'Calculus II',
 'Calculus of several variables. Topics as in 18.02 but with more focus on mathematical concepts. Vector algebra, dot product, matrices, determinant. Functions of several variables, continuity, differentiability, derivative. Parametrized curves, arc length, curvature, torsion. Vector fields, gradient, curl, divergence. Multiple integrals, change of variables, line integrals, surface integrals. Stokes'' theorem in one, two, and three dimensions.',
 5, 'B', 30),
 ((SELECT id FROM courses WHERE code='MATH'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'MATH153', 'Differential Equations',
 'Covers much of the same material as 18.03 with more emphasis on theory. The point of view is rigorous and results are proven. Local existence and uniqueness of solutions.',
 5, 'B', 30),
 ((SELECT id FROM courses WHERE code='MATH'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'MATH160', 'Introduction to Probability and Statistics',
 'A unified introduction to probability, Bayesian inference, and frequentist statistics. Topics include: combinatorics, random variables, (joint) distributions, covariance, central limit theorem; Bayesian updating, odds, posterior prediction; significance tests, confidence intervals, bootstrapping, regression. Students also develop computational skills and statistical thinking by using R to simulate, analyze, and visualize data; and by exploring privacy, fairness, and causality in contemporary media and research.',
 4, 'B', 28),
 ((SELECT id FROM courses WHERE code='MATH'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'MATH161', 'Linear Algebra',
 'Basic subject on matrix theory and linear algebra, emphasizing topics useful in other disciplines, including systems of equations, vector spaces, determinants, eigenvalues, singular value decomposition, and positive definite matrices. Applications to least-squares approximations, stability of differential equations, networks, Fourier transforms, and Markov processes. Uses linear algebra software.',
 5, 'B', 30),
 ((SELECT id FROM courses WHERE code='MATH'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'MATH165', 'Mathematics for Computer Science',
 'Elementary discrete mathematics for science and engineering, with a focus on mathematical tools and proof techniques useful in computer science. Topics include logical notation, sets, relations, elementary graph theory, state machines and invariants, induction and proofs by contradiction, recurrences, asymptotic notation, elementary analysis of algorithms, elementary number theory and cryptography, permutations and combinations, counting tools, and discrete probability.',
 5, 'B', 30),

-- BIOE  
((SELECT id FROM courses WHERE code='BIOE'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'BIOE101', 'Introduction to Professional Success and Leadership in BE',
 'Interactive introduction to the discipline of Biological Engineering through presentations by alumni practitioners, with additional panels and discussions on skills for professional development. Presentations emphasize the roles of communication through writing and speaking, building and maintaining professional networks, and interpersonal and leadership skills in building successful careers. Provides practical advice about how to prepare for job searches and graduate or professional school applications from an informed viewpoint.',
 4, 'A', 28),
((SELECT id FROM courses WHERE code='BIOE'), (SELECT id FROM terms WHERE code='FALL25'), NULL, 
 'BIOE102', 'Introduction to Concepts in Biological Engineering',
 'Introduction to scientific advances in the field of biological engineering. Topics covered include drug discovery and delivery, applications of genetic engineering, creation and uses of biomaterials, and development of biological technology to mitigate human disease and environmental problems. Discusses each selected topic from different angles, highlighting research conducted from the nano- to macro- level to highlight the breadth of biological engineering applications. Students have the opportunity to select a topic of interest and explore that topic in more depth.',
 4, 'B', 28)
ON CONFLICT (code, term_id, section) DO NOTHING;

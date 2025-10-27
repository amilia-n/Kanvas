import argon2 from "argon2";
import pool from "./pool.js";

const DEFAULT_PW = "password123";

const faculty = [
  {
    first: "Alan",
    last: "Turing",
    email: "atur@faculty.kanvas.edu",
    teacher_number: "T-521834",
  },
  {
    first: "Barbara",
    last: "Liskov",
    email: "blis@faculty.kanvas.edu",
    teacher_number: "T-547210",
  },
  {
    first: "Donald",
    last: "Knuth",
    email: "dknu@faculty.kanvas.edu",
    teacher_number: "T-563492",
  },
  {
    first: "Emmy",
    last: "Noether",
    email: "enoe@faculty.kanvas.edu",
    teacher_number: "T-574118",
  },
  {
    first: "Grace",
    last: "Hopper",
    email: "ghop@faculty.kanvas.edu",
    teacher_number: "T-589603",
  },
  {
    first: "Claude",
    last: "Shannon",
    email: "csha@faculty.kanvas.edu",
    teacher_number: "T-592471",
  },
  {
    first: "Hedy",
    last: "Lamarr",
    email: "hlam@faculty.kanvas.edu",
    teacher_number: "T-603958",
  },
  {
    first: "John",
    last: "Backus",
    email: "jbac@faculty.kanvas.edu",
    teacher_number: "T-615327",
  },
  {
    first: "Niklaus",
    last: "Wirth",
    email: "nwir@faculty.kanvas.edu",
    teacher_number: "T-628409",
  },
  {
    first: "Ada",
    last: "Lovelace",
    email: "alov@faculty.kanvas.edu",
    teacher_number: "T-639175",
  },
];

const students = [
  ["Alice", "Johnson", "ajoh@kanvas.edu", "CS", "2025001"],
  ["Brian", "Kim", "bkim@kanvas.edu", "STAT", "2025002"],
  ["Chloe", "Garcia", "cgar@kanvas.edu", "MATH", "2025003"],
  ["Daniel", "Davis", "ddav@kanvas.edu", "ENGR", "2025004"],
  ["Emma", "Anderson", "eand@kanvas.edu", "CS", "2025005"],
  ["Felix", "Thompson", "ftho@kanvas.edu", "STAT", "2025006"],
  ["Gram", "Hernandez", "gher@kanvas.edu", "MATH", "2025007"],
  ["Henry", "Martinez", "hmar@kanvas.edu", "ENGR", "2025008"],
  ["Ivy", "Jones", "ijon@kanvas.edu", "CS", "2025009"],
  ["Jack", "Khan", "jkha@kanvas.edu", "STAT", "2025010"],
  ["Kara", "Lopez", "klop@kanvas.edu", "MATH", "2025011"],
  ["Liam", "Wilson", "lwil@kanvas.edu", "ENGR", "2025012"],
  ["Max", "Clark", "mcla@kanvas.edu", "CS", "2025013"],
  ["Noah", "Lee", "nlee@kanvas.edu", "STAT", "2025014"],
  ["Olivia", "Allen", "oall@kanvas.edu", "MATH", "2025015"],
  ["Parker", "Patel", "ppat@kanvas.edu", "ENGR", "2025016"],
  ["Quinn", "Gutierrez", "qgut@kanvas.edu", "CS", "2025017"],
  ["Riley", "Wang", "rwan@kanvas.edu", "STAT", "2025018"],
  ["Sophia", "Moore", "smoo@kanvas.edu", "MATH", "2025019"],
  ["Theo", "Taylor", "ttay@kanvas.edu", "ENGR", "2025020"],
  ["Ura", "White", "uwhi@kanvas.edu", "CS", "2025021"],
  ["Victor", "Harris", "vhar@kanvas.edu", "STAT", "2025022"],
  ["Willow", "Robinson", "wrob@kanvas.edu", "MATH", "2025023"],
  ["Xavier", "Yang", "xyan@kanvas.edu", "ENGR", "2025024"],
  ["Xara", "Young", "xyou@kanvas.edu", "CS", "2025025"],
  ["Zane", "Zimmer", "zzim@kanvas.edu", "STAT", "2025026"],
  ["Ava", "Adams", "aada@kanvas.edu", "MATH", "2025027"],
  ["Beau", "Bell", "bbel@kanvas.edu", "ENGR", "2025028"],
  ["Cora", "Chan", "ccha@kanvas.edu", "CS", "2025029"],
  ["Don", "Diaz", "ddia@kanvas.edu", "STAT", "2025030"],
];

const ALL_STUDENT_EMAILS = students.map((s) => s[2]);

const CURRENT = [
  {
    code: "CS201",
    section: "L",
    term: "FALL25",
    teacher_email: "dknu@faculty.kanvas.edu",
    materials: [
      [
        "Syllabus (CS201 FA25)",
        "https://materials.example.com/cs201/syllabus.pdf",
      ],
      [
        "Week 1 Slides — Modeling & Simulation",
        "https://materials.example.com/cs201/wk1-slides.pdf",
      ],
    ],
    students: ALL_STUDENT_EMAILS,
    assignments: [
      ["Check-in Quiz", 50],
      ["Modeling Lab 1", 50],
    ],
  },
];

async function q(c, sql, p) {
  return c.query(sql, p);
}

async function getId(c, sql, arg) {
  const r = await q(c, sql, [arg]);
  return r.rowCount ? r.rows[0].id : null;
}

const getTermId = (c, code) =>
  getId(c, `SELECT id FROM terms WHERE code=$1`, code);

const getUserIdByEmail = (c, email) =>
  getId(c, `SELECT id FROM users WHERE email=$1`, email);

function deptFromOfferingCode(code) {
  const m = code.match(/^[A-Z]+/);
  return m ? m[0] : null;
}

function teacherEmailByDept(dept) {
  if (!dept) return null;
  if (/^CEE/.test(dept) || /^ARCH/.test(dept)) return "ghop@faculty.kanvas.edu";
  if (/^MECH/.test(dept)) return "csha@faculty.kanvas.edu";
  if (/^MSE/.test(dept)) return "nwir@faculty.kanvas.edu";
  if (/^CHEM/.test(dept) || /^CHEME/.test(dept))
    return "atur@faculty.kanvas.edu";
  if (/^CS/.test(dept)) return "dknu@faculty.kanvas.edu";
  if (/^BIOL/.test(dept) || /^BIOE/.test(dept))
    return "enoe@faculty.kanvas.edu";
  if (/^PHYS/.test(dept) || /^MATH/.test(dept))
    return "blis@faculty.kanvas.edu";
  if (/^BCS/.test(dept) || /^POLS/.test(dept)) return "alov@faculty.kanvas.edu";
  if (/^ECON/.test(dept)) return "jbac@faculty.kanvas.edu";
  if (/^AERO/.test(dept)) return "hlam@faculty.kanvas.edu";
  return null;
}

async function resolveCourseIdFromOfferingCode(c, code) {
  const { rows } = await q(
    c,
    `SELECT id FROM courses WHERE code = substring($1 from '^[A-Z]+') LIMIT 1`,
    [code]
  );
  return rows[0]?.id || null;
}

async function getCanonicalMeta(c, code) {
  const r = await q(
    c,
    `SELECT name, description, credits, course_id
     FROM course_offering
     WHERE code=$1
     ORDER BY id DESC
     LIMIT 1`,
    [code]
  );
  if (r.rowCount) return r.rows[0];
  const course_id = await resolveCourseIdFromOfferingCode(c, code);
  if (!course_id) return null;
  return {
    name: code,
    description: "(historical backfill)",
    credits: 4,
    course_id,
  };
}

async function getOfferingIdByCodeTermSection(c, { code, term, section }) {
  const { rows } = await q(
    c,
    `SELECT co.id
     FROM course_offering co
     JOIN terms t ON t.id=co.term_id
     WHERE co.code=$1 AND t.code=$2 AND co.section=$3
     LIMIT 1`,
    [code, term, section]
  );
  return rows[0]?.id || null;
}

async function ensureHistoricalOffering(
  c,
  { code, term, section = "A", seats = 200 }
) {
  const existing = await getOfferingIdByCodeTermSection(c, {
    code,
    term,
    section,
  });
  if (existing) return existing;
  const termId = await getTermId(c, term);
  const meta = await getCanonicalMeta(c, code);
  if (!termId || !meta?.course_id) return null;
  const teacherEmail = teacherEmailByDept(deptFromOfferingCode(code));
  const teacherId = teacherEmail
    ? await getUserIdByEmail(c, teacherEmail)
    : null;

  const r = await q(
    c,
    `INSERT INTO course_offering
       (course_id, term_id, teacher_id, code, name, description, credits, section, total_seats, enrollment_open, is_active)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,TRUE,TRUE)
     ON CONFLICT DO NOTHING
     RETURNING id`,
    [
      meta.course_id,
      termId,
      teacherId,
      code,
      meta.name,
      meta.description,
      meta.credits,
      section,
      seats,
    ]
  );
  if (r.rowCount) return r.rows[0].id;
  return getOfferingIdByCodeTermSection(c, { code, term, section });
}

async function upsertTeacherUsers(c, pwHash) {
  for (const f of faculty) {
    await q(
      c,
      `INSERT INTO users (role, email, password_hash, first_name, last_name, teacher_number)
       SELECT 'teacher', fr.email, $1, fr.first_name, fr.last_name, fr.teacher_number
       FROM faculty_registry fr
       WHERE fr.email=$2 AND fr.active=TRUE
       ON CONFLICT (email) DO UPDATE
         SET first_name=EXCLUDED.first_name,
             last_name=EXCLUDED.last_name,
             teacher_number=EXCLUDED.teacher_number,
             role='teacher',
             updated_at=now()`,
      [pwHash, f.email]
    );
  }
}

async function upsertStudentUsers(c, pwHash) {
  for (const [first, last, email, major_code, student_number] of students) {
    await q(
      c,
      `INSERT INTO users (role, email, password_hash, first_name, last_name, student_number)
       VALUES ('student',$1,$2,$3,$4,$5)
       ON CONFLICT (email) DO UPDATE
         SET first_name=EXCLUDED.first_name,
             last_name=EXCLUDED.last_name,
             student_number=EXCLUDED.student_number,
             role='student',
             updated_at=now()`,
      [email, pwHash, first, last, student_number]
    );
    const uid = await getUserIdByEmail(c, email);
    if (uid) {
      await q(
        c,
        `INSERT INTO user_majors (user_id, major_code)
         VALUES ($1,$2)
         ON CONFLICT DO NOTHING`,
        [uid, major_code]
      );
    }
  }
}

async function addMaterials(c, offeringId, teacherEmail, materials) {
  const teacherId = teacherEmail
    ? await getUserIdByEmail(c, teacherEmail)
    : null;
  for (const [title, url] of materials) {
    await q(
      c,
      `INSERT INTO course_materials (offering_id, title, url, uploaded_by)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT DO NOTHING`,
      [offeringId, title, url, teacherId]
    );
  }
}

async function addAssignments(c, offeringId, pack, termCode) {
  const termId = await getTermId(c, termCode);
  const { rows } = await q(
    c,
    `SELECT starts_on, ends_on FROM terms WHERE id=$1`,
    [termId]
  );
  if (!rows.length) return;
  const { starts_on, ends_on } = rows[0];
  const toDate = (d) => d.toISOString().slice(0, 10);
  const start = new Date(starts_on),
    end = new Date(ends_on);
  const day = 86_400_000,
    totalDays = Math.max(1, Math.round((end - start) / day));

  for (let i = 0; i < pack.length; i++) {
    const [title, weight] = pack[i];
    const dueOffset = Math.floor((totalDays / (pack.length + 1)) * (i + 1));
    const dueAt = new Date(start.getTime() + dueOffset * day);
    let assignedOn = new Date(dueAt.getTime() - 7 * day);
    if (assignedOn < start) assignedOn = new Date(start);
    if (dueAt <= assignedOn) dueAt.setDate(assignedOn.getDate() + 1);
    await q(
      c,
      `INSERT INTO assignments (offering_id, title, description, weight_percent, assigned_on, due_at)
       VALUES ($1,$2,NULL,$3,$4::date,$5)
       ON CONFLICT DO NOTHING`,
      [offeringId, title, weight, toDate(assignedOn), dueAt.toISOString()]
    );
  }
}

async function enrollStudents(c, offeringId, emails) {
  for (const email of emails) {
    const sid = await getUserIdByEmail(c, email);
    if (!sid) continue;
    await q(
      c,
      `INSERT INTO enrollments (offering_id, student_id, status, enrolled_at)
       VALUES ($1,$2,'enrolled', now())
       ON CONFLICT (offering_id, student_id) DO UPDATE
         SET status='enrolled',
             enrolled_at=COALESCE(enrollments.enrolled_at, now()),
             updated_at=now()`,
      [offeringId, sid]
    );
  }
}

async function filterOfferings(c, { code, term, section }) {
  const result = await c.query(
    `SELECT co.id
     FROM course_offering co
     JOIN terms t ON t.id=co.term_id
     WHERE co.code=$1 AND t.code=$2 AND co.section=$3
     LIMIT 1`,
    [code, term, section]
  );
  return result.rows[0]?.id || null;
}

const TARGET_PAST_TERM = "SPRING25"; 
const HIST_SECTION = "P";
const HIST_ASSIGN_PACK = [
  ["Quiz",   10],
  ["HW 1",   20],
  ["Essay 1",20],
  ["HW 2",   20],
  ["Final",  30],
];

async function seedPastAssignmentsForAllOfferings(c) {
  const { rows } = await q(
    c,
    `SELECT co.id AS offering_id, co.code, t.code AS term_code
     FROM course_offering co
     JOIN terms t ON t.id = co.term_id
     WHERE t.ends_on < CURRENT_DATE
       AND NOT EXISTS (SELECT 1 FROM assignments a WHERE a.offering_id = co.id)
     ORDER BY t.code, co.code, co.section`
  );

  let created = 0;
  for (const r of rows) {

    await addAssignments(c, r.offering_id, HIST_ASSIGN_PACK, r.term_code);
    
    await enrollStudents(c, r.offering_id, ALL_STUDENT_EMAILS);
    
    const teacherEmail = teacherEmailByDept(deptFromOfferingCode(r.code));
    await gradeAllAssignmentsRandomized(c, { 
      offeringId: r.offering_id, 
      courseCode: r.code, 
      teacherEmail 
    });
    
    await completeEnrollmentsForOffering(c, r.offering_id, r.term_code);
    
    created++;
  }
  return created;
}

async function getAllPrereqCodes(c){
  const currentCodes = CURRENT.map(obj => obj.code);
  
  const { rows } = await q(
    c,
    `SELECT DISTINCT co.code AS code
     FROM course_prereqs cp
     JOIN course_offering co ON co.id = cp.prereq_offering_id
     WHERE co.code != ALL($1::text[])
     ORDER BY co.code`,
    [currentCodes]
  );
  return rows.map(r => r.code);
}

function randomPassing(){ return Math.min(99, 82 + Math.floor(Math.random()*18)); } 

async function gradeAllAssignmentsRandomized(c, { offeringId, courseCode, teacherEmail }){
  const teacherId = teacherEmail ? await getUserIdByEmail(c, teacherEmail) : null;
  const a = await q(c, `SELECT id, title, due_at FROM assignments WHERE offering_id=$1 ORDER BY id`, [offeringId]);
  const st = await q(
    c,
    `SELECT e.student_id, u.email
     FROM enrollments e JOIN users u ON u.id=e.student_id
     WHERE e.offering_id=$1 AND e.status IN ('enrolled','completed')`,
    [offeringId]
  );
  for (const s of st.rows){
    for (const asn of a.rows){
      const handle = s.email.split("@")[0];
      const url = `https://files.example.com/${courseCode}/${encodeURIComponent(asn.title)}/${handle}.pdf`;
      const due = new Date(asn.due_at);
      const submittedAt = new Date(due.getTime() - 24*60*60*1000);
      await q(
        c,
        `INSERT INTO submissions (assignment_id, student_id, submission_url, submitted_at)
         VALUES ($1,$2,$3,$4)
         ON CONFLICT (assignment_id, student_id) DO UPDATE
           SET submission_url=EXCLUDED.submission_url,
               submitted_at=COALESCE(submissions.submitted_at, EXCLUDED.submitted_at),
               updated_at=now()`,
        [asn.id, s.student_id, url, submittedAt.toISOString()]
      );
      await q(
        c,
        `UPDATE submissions
         SET grade_percent=$1, graded_at=now(), graded_by=$2, updated_at=now()
         WHERE assignment_id=$3 AND student_id=$4`,
        [randomPassing(), teacherId, asn.id, s.student_id]
      );
    }
  }
}

async function completeEnrollmentsForOffering(c, offeringId, termCode){
  const termId = await getTermId(c, termCode);
  const { rows } = await q(c, `SELECT ends_on FROM terms WHERE id=$1`, [termId]);
  const endsOn = rows[0]?.ends_on;
  await q(
    c,
    `UPDATE enrollments
     SET status='completed',
         completed_at=$2::timestamp,
         updated_at=now()
     WHERE offering_id=$1`,
    [offeringId, endsOn ?? new Date().toISOString().slice(0,10)]
  );
}

async function backfillAllPrereqHistory(c){
  const codes = await getAllPrereqCodes(c);
  if (!codes.length) return;
  const termId = await getTermId(c, TARGET_PAST_TERM);
  if (!termId){
    console.warn(`Term ${TARGET_PAST_TERM} not found; skipping prereq backfill.`);
    return;
  }
  const emails = ALL_STUDENT_EMAILS;
  for (const code of codes){
    const teacherEmail = teacherEmailByDept(deptFromOfferingCode(code));
    
    const { rows: existingRows } = await q(
      c,
      `SELECT co.id, co.section
       FROM course_offering co
       JOIN terms t ON t.id = co.term_id
       WHERE co.code = $1 AND t.code = $2
       LIMIT 1`,
      [code, TARGET_PAST_TERM]
    );
    
    let offId, section;
    if (existingRows.length > 0) {
      offId = existingRows[0].id;
      section = existingRows[0].section;
      console.log(`[HIST] Using existing ${code} ${TARGET_PAST_TERM} section ${section}`);
    } else {
      offId = await ensureHistoricalOffering(c, { code, term: TARGET_PAST_TERM, section: HIST_SECTION, seats: 200 });
      section = HIST_SECTION;
    }
    
    if (!offId){
      console.warn(`Could not create historical offering for ${code} ${TARGET_PAST_TERM}`);
      continue;
    }
    
    await addMaterials(c, offId, teacherEmail, [
      [`Syllabus (${code} ${TARGET_PAST_TERM})`, `https://materials.example.com/${code.toLowerCase()}/${TARGET_PAST_TERM.toLowerCase()}/syllabus.pdf`],
      [`Week 1 Slides (${code})`,               `https://materials.example.com/${code.toLowerCase()}/${TARGET_PAST_TERM.toLowerCase()}/wk1-slides.pdf`],
    ]);
    await addAssignments(c, offId, HIST_ASSIGN_PACK, TARGET_PAST_TERM);
    await enrollStudents(c, offId, emails);
    await gradeAllAssignmentsRandomized(c, { offeringId: offId, courseCode: code, teacherEmail });
    await completeEnrollmentsForOffering(c, offId, TARGET_PAST_TERM);
    console.log(`[HIST] Backfilled ${code} ${TARGET_PAST_TERM} section ${section}`);
  }
}

async function seedCurrent(c){
  for (const cobj of CURRENT){
    const offeringId = await filterOfferings(c, { code: cobj.code, term: cobj.term, section: cobj.section });
    if (!offeringId){
      console.warn(`Skipping ${cobj.code} ${cobj.term} ${cobj.section}: not found`);
      continue;
    }
    await addMaterials(c, offeringId, cobj.teacher_email, cobj.materials);
    await addAssignments(c, offeringId, cobj.assignments, cobj.term);
    await enrollStudents(c, offeringId, cobj.students);
  }
}

async function seedMockSubmissions(c) {
  console.log("Creating 5 mock submissions for CS201-L assignments...");
  
  const offeringId = await filterOfferings(c, { code: "CS201", term: "FALL25", section: "L" });
  if (!offeringId) {
    console.warn("CS201-L not found, skipping mock submissions");
    return;
  }

  const { rows: assignments } = await q(
    c,
    `SELECT id, title, due_at FROM assignments WHERE offering_id=$1 ORDER BY id`,
    [offeringId]
  );

  if (assignments.length === 0) {
    console.warn("No assignments found for CS201-L");
    return;
  }

  const { rows: students } = await q(
    c,
    `SELECT e.student_id, u.email, u.first_name, u.last_name
     FROM enrollments e
     JOIN users u ON u.id = e.student_id
     WHERE e.offering_id = $1 AND e.status = 'enrolled'
     ORDER BY u.last_name
     LIMIT 5`,
    [offeringId]
  );

  if (students.length === 0) {
    console.warn("No students enrolled in CS201-L");
    return;
  }

  let count = 0;
  for (const assignment of assignments) {
    for (const student of students) {
      const handle = student.email.split("@")[0];
      const url = `https://files.example.com/CS201/${encodeURIComponent(assignment.title)}/${handle}.pdf`;
      const due = new Date(assignment.due_at);
      const submittedAt = new Date(due.getTime() - 48 * 60 * 60 * 1000); 

      await q(
        c,
        `INSERT INTO submissions (assignment_id, student_id, submission_url, submitted_at)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (assignment_id, student_id) DO NOTHING`,
        [assignment.id, student.student_id, url, submittedAt.toISOString()]
      );
      count++;
    }
  }

  console.log(`✓ Created ${count} mock submissions (5 students × ${assignments.length} assignments)`);
  console.log(`  Students: ${students.map(s => `${s.first_name} ${s.last_name}`).join(", ")}`);
  console.log(`  Assignments: ${assignments.map(a => a.title).join(", ")}`);
}
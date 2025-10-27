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

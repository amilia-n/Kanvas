export const queries = {
  // ====================
  // AUTH / REGISTRATION
  // ====================
  registerStudent: `
    INSERT INTO users (role, email, password_hash, first_name, last_name, student_number)
    VALUES ('student', $1, $2, $3, $4, $5)
    RETURNING id, role, email, first_name, last_name;
  `,
  findFacultyWhitelist: `
    SELECT id, email, teacher_number, first_name, last_name, active
    FROM faculty_registry
    WHERE email = $1 AND teacher_number = $2 AND active = TRUE;
  `,
  registerTeacherFromWhitelist: `
    INSERT INTO users (role, email, password_hash, first_name, last_name, teacher_number)
    VALUES ('teacher', $1, $2, $3, $4, $5)
    RETURNING id, role, email, first_name, last_name, teacher_number;
  `,
  loginByEmail: `
    SELECT id, role, password_hash
    FROM users
    WHERE email = $1;
`,
  getProfileById: `
    SELECT u.id, u.role, u.email, u.first_name, u.last_name,
           u.student_number, u.teacher_number,
           COALESCE(
             (SELECT ARRAY_AGG(um.major_code ORDER BY um.major_code)
              FROM user_majors um
              WHERE um.user_id = u.id),
            ARRAY[]::citext[]
           ) AS majors
    FROM users u
    WHERE u.id = $1;
  `,
  beginReset: `
    UPDATE users
    SET reset_token = $1, token_created_at = now()
    WHERE email = $2;
  `,
  checkReset: `
    SELECT id FROM users
    WHERE reset_token = $1
      AND token_created_at >= now() - INTERVAL '1 hour';
  `,
  finishReset: `
    UPDATE users
    SET password_hash = $1, reset_token = NULL, token_created_at = NULL, updated_at = now()
    WHERE id = $2;
  `,
  // ======
  // USERS
  // ======
  createUser: `
    INSERT INTO users (role, email, password_hash, first_name, last_name, student_number, teacher_number)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING id;
  `,
  updateUser: `
    UPDATE users
    SET email          = COALESCE($2, email),
        first_name     = COALESCE($3, first_name),
        last_name      = COALESCE($4, last_name),
        student_number = COALESCE($5, student_number),
        teacher_number = COALESCE($6, teacher_number),
        updated_at     = now()
    WHERE id = $1
    RETURNING id;
  `,
  getUser: `
    SELECT u.*
    FROM users u
    WHERE u.id = $1;
  `,
  listUsers: `
    SELECT
      u.id, u.role, u.first_name, u.last_name, u.email,
      u.student_number, u.teacher_number,
      COALESCE(string_agg(DISTINCT um.major_code, ',' ORDER BY um.major_code), '') AS majors_csv,
      u.account_created_at, u.updated_at
    FROM users u
    LEFT JOIN user_majors um ON um.user_id = u.id
    GROUP BY u.id, u.role, u.first_name, u.last_name, u.email,
             u.student_number, u.teacher_number, u.account_created_at, u.updated_at
    ORDER BY u.last_name, u.first_name
    LIMIT COALESCE($1::INT, 100) OFFSET COALESCE($2::INT, 0);
  `,
  searchUsers: `
  WITH base AS (
    SELECT u.id, u.role, u.first_name, u.last_name, u.email, u.student_number, u.teacher_number
    FROM users u
    WHERE $1::TEXT IS NULL
       OR u.id::text = $1
       OR u.email ILIKE '%'||$1||'%'
       OR u.first_name ILIKE '%'||$1||'%'
       OR u.last_name  ILIKE '%'||$1||'%'
       OR EXISTS (
            SELECT 1
            FROM user_majors um
            WHERE um.user_id = u.id
              AND um.major_code ILIKE '%'||$1||'%'
          )
  )
  SELECT b.*,
         COALESCE(string_agg(DISTINCT um.major_code, ',' ORDER BY um.major_code), '') AS majors_csv
  FROM base b
  LEFT JOIN user_majors um ON um.user_id = b.id
  GROUP BY b.id, b.role, b.first_name, b.last_name, b.email, b.student_number, b.teacher_number
  ORDER BY b.last_name, b.first_name;
`,
  deleteUser: `DELETE FROM users WHERE id = $1;`,
  searchOfferingClassmates: `
  SELECT DISTINCT u.id, u.email, u.first_name, u.last_name, u.role
  FROM users u
  JOIN enrollments e ON e.student_id = u.id
  WHERE e.offering_id = $1
    AND e.status IN ('enrolled', 'completed')
    AND ($2::TEXT IS NULL
       OR u.email ILIKE '%'||$2||'%'
       OR u.first_name ILIKE '%'||$2||'%'
       OR u.last_name  ILIKE '%'||$2||'%')
    AND u.role = 'student'
  ORDER BY u.last_name, u.first_name
  LIMIT 100;
`,
  validateOfferingHasTeacher: `
  SELECT EXISTS (
    SELECT 1 FROM course_offering 
    WHERE id = $1 AND teacher_id IS NOT NULL
  ) AS has_teacher;
`,
  // ===============
  // MAJORS / TERMS
  // ===============
  listUserMajors: `
    SELECT major_code
    FROM user_majors
    WHERE user_id = $1
    ORDER BY major_code;
  `,
  addUserMajor: `
    INSERT INTO user_majors (user_id, major_code)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING;
  `,
  removeUserMajor: `
    DELETE FROM user_majors
    WHERE user_id = $1 AND major_code = $2;
  `,
  addUserMajorsBulk: `
    INSERT INTO user_majors (user_id, major_code)
    SELECT $1, unnest($2::citext[])
    ON CONFLICT DO NOTHING;
  `,
  replaceUserMajors: `
    WITH incoming AS (
      SELECT unnest($2::citext[]) AS major_code
    ),
    to_delete AS (
      DELETE FROM user_majors um
      WHERE um.user_id = $1
        AND NOT EXISTS (SELECT 1 FROM incoming i WHERE i.major_code = um.major_code)
      RETURNING 1
    )
    INSERT INTO user_majors (user_id, major_code)
    SELECT $1, i.major_code
    FROM incoming i
    ON CONFLICT DO NOTHING;
  `,
  listMajors: `SELECT code, name FROM majors ORDER BY code;`,
  listTerms: `SELECT id, code, starts_on, ends_on FROM terms ORDER BY starts_on;`,
  getCurrentTerm: `
    SELECT id, code, starts_on, ends_on 
    FROM terms 
    WHERE starts_on <= CURRENT_DATE AND ends_on >= CURRENT_DATE
    ORDER BY starts_on
    LIMIT 1;
  `,
  getNextTerm: `
    SELECT id, code, starts_on, ends_on 
    FROM terms 
    WHERE starts_on > CURRENT_DATE
    ORDER BY starts_on
    LIMIT 1;
  `,
  findTermByCode: `SELECT id FROM terms WHERE code = $1;`,
  // ====================
  // COURSES & OFFERINGS
  // ====================
  getCourseById: `
    SELECT id, code, name, created_at, updated_at
    FROM courses
    WHERE id = $1;
  `,

  listCourses: `
    SELECT id, code, name
    FROM courses
    ORDER BY code;
  `,
  listCoursesWithOfferings: `
  SELECT 
    c.id, 
    c.code, 
    c.name,
    c.created_at,
    c.updated_at,
    COALESCE(
      json_agg(
        json_build_object(
          'id', co.id,
          'offering_code', co.code,
          'offering_name', co.name,
          'section', co.section,
          'description', co.description,
          'term_code', t.code,
          'term_id', co.term_id,
          'teacher_id', co.teacher_id,
          'teacher_name', u.first_name || ' ' || u.last_name,
          'credits', co.credits,
          'total_seats', co.total_seats,
          'seats_taken', (SELECT COUNT(*) FROM enrollments e WHERE e.offering_id = co.id AND e.status = 'enrolled'),
          'enrollment_open', co.enrollment_open,
          'is_active', co.is_active
        ) ORDER BY t.starts_on DESC, co.section
      ) FILTER (WHERE co.id IS NOT NULL),
      '[]'
    ) AS offerings
  FROM courses c
  LEFT JOIN course_offering co ON co.course_id = c.id
  LEFT JOIN terms t ON t.id = co.term_id
  LEFT JOIN users u ON u.id = co.teacher_id
  GROUP BY c.id, c.code, c.name, c.created_at, c.updated_at
  ORDER BY c.code;
`,
  getCourseIdByCode: `SELECT id FROM courses WHERE code=$1;`,

  createOffering: `
    INSERT INTO course_offering
      (course_id, term_id, teacher_id, code, name, description, section, credits, total_seats, enrollment_open, is_active)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, COALESCE($10, TRUE), COALESCE($11, TRUE))
    RETURNING id;
  `,
  updateOffering: `
    UPDATE course_offering
    SET name           = COALESCE($2, name), 
        description    = COALESCE($3, description), 
        section        = COALESCE($4, section),
        credits        = COALESCE($5, credits), 
        total_seats    = COALESCE($6, total_seats), 
        enrollment_open= COALESCE($7, enrollment_open),
        is_active      = COALESCE($8, is_active), 
        updated_at     = now()
    WHERE id = $1
    RETURNING id;
  `,
  deleteOffering: `DELETE FROM course_offering WHERE id = $1;`,
  findOffering: `
  SELECT 
    co.id,
    co.course_id,
    c.code AS course_code,
    c.name AS course_name,
    co.code AS offering_code,
    co.name AS offering_name,
    co.description,
    co.credits,
    t.code AS term_code,
    co.section,
    co.total_seats, 
    co.is_active, 
    co.enrollment_open,
    u.id AS teacher_id,
    u.first_name || ' ' || u.last_name AS teacher_name,
    COALESCE(
      (
        SELECT json_agg(
          json_build_object(
            'id', prereq_co.id,
            'code', prereq_co.code,
            'name', prereq_co.name
          )
        )
        FROM course_prereqs cp
        JOIN course_offering prereq_co ON prereq_co.id = cp.prereq_offering_id
        WHERE cp.offering_id = co.id
      ),
      '[]'::json
    ) AS prerequisites
  FROM course_offering co
  JOIN courses c ON c.id = co.course_id
  JOIN terms t ON t.id = co.term_id
  JOIN users u ON u.id = co.teacher_id
  WHERE co.id = $1;
`,
  offeringListWithSeats: `
    SELECT 
      co.id AS offering_id,
      c.code AS course_code, 
      c.name AS course_name,
      co.code AS offering_code,
      co.name AS offering_name,
      co.credits,
      t.code  AS term_code,
      co.section,
      u.first_name || ' ' || u.last_name AS teacher_name,
      co.total_seats,
      (co.total_seats - COALESCE(en.ct,0)) AS seats_left,
      co.enrollment_open, co.is_active, co.created_at
    FROM course_offering co
    JOIN courses c ON c.id = co.course_id
    JOIN terms   t ON t.id = co.term_id
    JOIN users   u ON u.id = co.teacher_id
    LEFT JOIN LATERAL (
      SELECT COUNT(*)::INT AS ct
      FROM enrollments e
      WHERE e.offering_id = co.id AND e.status = 'enrolled'
    ) en ON true
    WHERE co.is_active = TRUE
    ORDER BY t.starts_on, c.code, co.code, co.section;
  `,
  listOfferingsForCourse: `
  SELECT 
    co.id,
    co.course_id,
    co.code AS offering_code,
    co.name AS offering_name,
    co.section,
    co.credits,
    co.total_seats,
    co.enrollment_open,
    co.is_active,
    t.id AS term_id,
    t.code AS term_code,
    t.starts_on,
    t.ends_on,
    u.id AS teacher_id,
    u.first_name || ' ' || u.last_name AS teacher_name,
    (
      SELECT COUNT(*)
      FROM enrollments e
      WHERE e.offering_id = co.id AND e.status IN ('enrolled', 'completed')
    ) AS enrolled_count,
    (
      co.total_seats - (
        SELECT COUNT(*)
        FROM enrollments e
        WHERE e.offering_id = co.id AND e.status = 'enrolled'
      )
    ) AS seats_left,
    CASE
      WHEN t.starts_on > CURRENT_DATE THEN 'upcoming'
      WHEN t.starts_on <= CURRENT_DATE AND t.ends_on >= CURRENT_DATE THEN 'current'
      WHEN t.ends_on < CURRENT_DATE THEN 'past'
      ELSE 'unknown'
    END AS status
  FROM course_offering co
  JOIN courses c ON c.id = co.course_id
  JOIN terms t ON t.id = co.term_id
  JOIN users u ON u.id = co.teacher_id
  WHERE c.id = $1
    AND co.is_active = TRUE
  ORDER BY 
    CASE 
      WHEN t.starts_on <= CURRENT_DATE AND t.ends_on >= CURRENT_DATE THEN 1
      WHEN t.starts_on > CURRENT_DATE THEN 2
      ELSE 3
    END,
    t.starts_on DESC,
    co.section;
`,
  offeringEligibilityInfo: `
  SELECT
    co.course_id,
    co.is_active,
    co.enrollment_open,
    (co.total_seats - COALESCE((
      SELECT COUNT(*) FROM enrollments e
      WHERE e.offering_id = co.id AND e.status = 'enrolled'
    ),0))::int AS seats_left
  FROM course_offering co
  WHERE co.id = $1;
`,
  offeringFilter: `
  SELECT 
    co.id,
    co.course_id,
    co.code AS offering_code,
    co.name AS offering_name,
    co.description,
    co.section,
    co.credits,
    co.total_seats,
    co.enrollment_open,
    co.is_active,
    c.code AS course_code,
    c.name AS course_name,
    t.code AS term_code,
    u.first_name || ' ' || u.last_name AS teacher_name,
    (
      SELECT COUNT(*)
      FROM enrollments e
      WHERE e.offering_id = co.id AND e.status IN ('enrolled', 'completed')
    ) AS enrolled_count
  FROM course_offering co
  JOIN courses c ON c.id = co.course_id
  JOIN terms t ON t.id = co.term_id
  JOIN users u ON u.id = co.teacher_id
  WHERE ($1::BIGINT IS NULL OR co.term_id = $1)
    AND ($2::BIGINT IS NULL OR co.teacher_id = $2)
    AND ($3::TEXT IS NULL OR 
         c.code ILIKE '%'||$3||'%' OR 
         c.name ILIKE '%'||$3||'%' OR 
         co.code ILIKE '%'||$3||'%' OR 
         co.name ILIKE '%'||$3||'%' OR 
         co.description ILIKE '%'||$3||'%')
    AND ($4::TEXT IS NULL OR co.section ILIKE '%'||$4||'%')
  ORDER BY c.code, co.code, co.section
  LIMIT COALESCE($5::INT, 100) OFFSET COALESCE($6::INT, 0);
`,
  isUserInOffering: `
  SELECT EXISTS (
    SELECT 1
    FROM enrollments e
    WHERE e.offering_id = $1
      AND e.student_id = $2
      AND e.status IN ('enrolled', 'completed')
  ) AS ok;
`,
  getStudentOfferings: `
    SELECT 
      co.id,
      co.course_id,
      c.code AS course_code,
      c.name AS course_name,
      co.code AS offering_code,
      co.name AS offering_name,
      co.credits,
      t.code AS term_code,
      t.starts_on,
      t.ends_on,
      co.section,
      e.status AS enrollment_status,
      e.final_percent AS final_grade,
      u.first_name || ' ' || u.last_name AS teacher_name,
      u.email AS teacher_email,
      CASE
        WHEN e.status = 'enrolled' AND t.ends_on >= CURRENT_DATE THEN 'current'
        WHEN e.status = 'enrolled' AND t.ends_on < CURRENT_DATE  THEN 'enrolled'
        WHEN e.status = 'completed' THEN 'completed'
        ELSE e.status
      END AS status
    FROM enrollments e
    JOIN course_offering co ON co.id = e.offering_id
    JOIN courses c ON c.id = co.course_id
    JOIN terms t ON t.id = co.term_id
    JOIN users u ON u.id = co.teacher_id
    WHERE e.student_id = $1
      AND e.status IN ('enrolled', 'completed')
    ORDER BY 
      CASE 
        WHEN e.status = 'enrolled' AND t.ends_on >= CURRENT_DATE THEN 1
        WHEN e.status = 'enrolled' AND t.ends_on < CURRENT_DATE  THEN 2
        ELSE 3
      END,
      t.starts_on DESC,
      c.code, co.code, co.section;
  `,
  getTeacherOfferings: `
  SELECT 
    co.id,
    co.course_id,
    c.code AS course_code,
    c.name AS course_name,
    co.code AS offering_code,
    co.name AS offering_name,
    co.credits,
    t.code AS term_code,
    t.starts_on,
    t.ends_on,
    co.section,
    co.total_seats,
    co.enrollment_open,
    co.is_active,
    (
      SELECT COUNT(*)
      FROM enrollments e
      WHERE e.offering_id = co.id AND e.status IN ('enrolled', 'completed')
    ) AS enrolled_count,
    (
      co.total_seats - (
        SELECT COUNT(*)
        FROM enrollments e
        WHERE e.offering_id = co.id AND e.status = 'enrolled'
      )
    ) AS seats_left,
    CASE
      WHEN t.starts_on > CURRENT_DATE THEN 'upcoming'
      WHEN t.starts_on <= CURRENT_DATE AND t.ends_on >= CURRENT_DATE THEN 'current'
      WHEN t.ends_on < CURRENT_DATE THEN 'past'
      ELSE 'unknown'
    END AS status
  FROM course_offering co
  JOIN courses c ON c.id = co.course_id
  JOIN terms t ON t.id = co.term_id
  WHERE co.teacher_id = $1
    AND co.is_active = TRUE
  ORDER BY 
    CASE 
      WHEN t.starts_on <= CURRENT_DATE AND t.ends_on >= CURRENT_DATE THEN 1
      WHEN t.starts_on > CURRENT_DATE THEN 2
      ELSE 3
    END,
    t.starts_on DESC,
    c.code, co.code, co.section;
`,
  // ======================
  // ELIGIBILITY / PREREQS
  // ======================

  // ============
  // ENROLLMENTS
  // ============

  // =========================
  // ASSIGNMENTS & SUBMISSIONS
  // =========================

  // =======
  // GRADES
  // =======

  // ==========
  // MATERIALS
  // ==========
};

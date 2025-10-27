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

  // ===============
  // MAJORS / TERMS
  // ===============

  // ====================
  // COURSES & OFFERINGS
  // ====================

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

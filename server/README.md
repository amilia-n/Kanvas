# KANVAS BACKEND — Quick Start & Reference


---

## Table of Contents

* [Quick Setup](#quick-setup)
* [Project Structure](#project-structure)
* [Scripts Reference](#scripts-reference)
* [Development Guide](#development-guide)
* [Adding New Features (Example: Announcements)](#adding-new-features-example-announcements)
* [Production Migrations](#production-migrations)
* [Troubleshooting](#troubleshooting)
* [Testing](#testing)
* [Seed Logins](#seed-logins)
* [Additional Resources](#additional-resources)

---

## Quick Setup

### 🐳 Docker Setup (Recommended)

**Fastest way to get running** — no need to install PostgreSQL or Node.js locally:

```bash
# Start with seeded database (recommended for development)
npm run start:docker:seed

# Or start without seeding
npm run start:docker

# Stop when done
npm run stop:docker
```

### 📦 Local Setup

If you prefer to run locally or need to customize your environment:

```bash
# 1) Install dependencies
npm install

# 2) Copy environment template and set values
cp .env.example .env
# then edit .env: DATABASE_URL, JWT_SECRET, PORT, CORS_ORIGIN, ...

# (Tip) Generate a strong JWT secret
echo "JWT_SECRET=$(openssl rand -hex 32)" >> .env

# 3) Initialize database (schema + seeds)
npm run db:init

# 4) Start the dev server
npm run dev
# or run once
npm start
```

### Required Environment Variables

| Key            | Description                         | Example / Notes                                   |
| -------------- | ----------------------------------- | ------------------------------------------------- |
| `DATABASE_URL` | Postgres connection string          | `postgres://user:pass@localhost:5432/kanvas`      |
| `JWT_SECRET`   | Secret for signing JWTs             | Use `openssl rand -hex 32`                        |
| `PORT`         | API port                            | `8888` (default used in examples)                 |
| `CORS_ORIGIN`  | Allowed origin for browser requests | `http://localhost:5173` or your deployed frontend |

---

## Project Structure

```text
server/
├── src/
│   ├── config/
│   │   ├── env.js              # Environment variable loader & validation
│   │   └── db.js               # PostgreSQL connection configuration
│   ├── db/
│   │   ├── db.sql              # Schema: tables, triggers, indexes
│   │   ├── seed.sql            # Static data: majors, courses, faculty
│   │   ├── seed.js             # Dynamic data: users, enrollments, grades
│   │   ├── pool.js             # Shared pg.Pool connection instance
│   │   ├── queries.js          # All SQL queries (repository pattern)
│   │   ├── init.js             # Database initialization script
│   │   └── reset.js            # Database reset script (dev only)
│   ├── middleware/
│   │   ├── auth.js             # JWT verification & role-based access
│   │   ├── error.js            # Centralized error handler
│   │   └── notFound.js         # 404 handler
│   ├── utils/
│   │   ├── passwords.js        # Argon2 hashing wrapper
│   │   ├── tokens.js           # JWT signing/verification
│   │   └── http.js             # HTTP response helpers
│   ├── routes/
│   │   ├── auth.routes.js      # Authentication & registration
│   │   ├── users.routes.js     # User management
│   │   ├── courses.routes.js   # Course catalog
│   │   ├── offerings.routes.js # Course sections per term
│   │   ├── enrollments.routes.js   # Student enrollments
│   │   ├── assignments.routes.js   # Assignment management
│   │   ├── submissions.routes.js   # Student submissions
│   │   ├── grades.routes.js    # Grade viewing & GPA
│   │   └── materials.routes.js # Course materials
│   ├── controllers/            # HTTP request handlers
│   │   └── [corresponding to routes]
│   └── services/               # Business logic layer
│       └── [corresponding to routes]
├── scripts/
│   ├── db-init.sh              # Initialize database
│   ├── db-reset.sh             # Reset database (⚠️ destructive)
│   └── db-seed.sh              # Seed data only
├── server.js                   # Application entry point
├── package.json                # Dependencies & npm scripts
├── Dockerfile                  # Docker image definition
├── docker-compose.yml          # Multi-container orchestration
├── .dockerignore               # Docker build exclusions
├── .gitignore                  # Git exclusions
├── .env                        # Environment variables (DO NOT COMMIT)
└── .env.example                # Environment template
```

### Directory Highlights

| Path               | What it’s for                                                     |
| ------------------ | ----------------------------------------------------------------- |
| `src/config/`      | App config, env validation, and DB client creation                |
| `src/db/`          | SQL schema, seed data, pool, query repository, init/reset scripts |
| `src/middleware/`  | Auth, error, and 404 handlers                                     |
| `src/utils/`       | Hashing, JWT helpers, HTTP helpers                                |
| `src/routes/`      | Express routers, one per feature                                  |
| `src/controllers/` | Request handlers, thin (call services)                            |
| `src/services/`    | Business logic, DB calls via `queries.js`                         |
| `scripts/`         | Bash scripts to init/reset/seed DB                                |

---

## Scripts Reference

> **TL;DR Table**

| Script            | Purpose                              | Default Safety                                                             | Run It Like                          |
| ----------------- | ------------------------------------ | -------------------------------------------------------------------------- | ------------------------------------ |
| `db-init.sh`      | Set up DB from scratch               | Blocks in prod unless `ALLOW_DB_INIT_IN_PROD=true`                         | `npm run db:init`                    |
| `db-reset.sh`     | Wipe & recreate DB (**destructive**) | Requires confirmation; blocks in prod unless `ALLOW_DB_RESET_IN_PROD=true` | `CONFIRM_RESET=yes npm run db:reset` |
| `db-seed.sh`      | Seed data only                       | Safe; no schema drop                                                       | `npm run db:seed`                    |
| Node alternatives | Use Node instead of bash             | N/A                                                                        | See commands below                   |

### `db-init.sh` — Initialize Database

* **Purpose:** Set up database from scratch
* **Executes:**

  1. Loads `.env` → 2) Validates `psql` → 3) Applies `src/db/db.sql` → 4) Inserts `src/db/seed.sql` → 5) Runs `src/db/seed.js`
* **Usage:** `npm run db:init`
* **Safety:** Blocks in production unless `ALLOW_DB_INIT_IN_PROD=true`

### `db-reset.sh` — Reset Database ⚠️ Destructive

* **Purpose:** Drop & recreate `public` schema, then run init
* **Usage:**

  ```bash
  CONFIRM_RESET=yes npm run db:reset
  # OR
  FORCE=1 bash scripts/db-reset.sh
  ```
* **Safety:** Requires explicit confirmation; blocks in production unless `ALLOW_DB_RESET_IN_PROD=true`

### `db-seed.sh` — Seed Data Only

* **Purpose:** Rerun seeds without dropping schema
* **Usage:** `npm run db:seed`

### Node.js Alternatives (no bash)

| Command                 | What it does              |
| ----------------------- | ------------------------- |
| `npm run db:init:node`  | Node-based initialization |
| `npm run db:reset:node` | Node-based reset          |
| `node src/db/seed.js`   | Run seeding only          |

---

## Development Guide

### Typical Workflow

```bash
# 1. Start dev server with hot reload
npm run dev

# 2. Make code changes (server auto-restarts)

# 3. Test with curl
curl -X POST http://localhost:8888/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ajoh@kanvas.edu","password":"password123"}'

# 4. Check database directly
psql $DATABASE_URL -c "SELECT * FROM users LIMIT 5;"

# 5. Reset database if needed
CONFIRM_RESET=yes npm run db:reset
```

---

## Adding New Features (Example: Announcements)

> Pattern: **schema → queries → service → controller → routes → mount → reset**

1. **Schema** — `src/db/db.sql`

```sql
CREATE TABLE announcements (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  offering_id BIGINT NOT NULL REFERENCES course_offering(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  posted_by BIGINT REFERENCES users(id),
  posted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

2. **Queries** — `src/db/queries.js`

```js
export const queries = {
  // ...
  createAnnouncement: `
    INSERT INTO announcements (offering_id, title, content, posted_by)
    VALUES ($1, $2, $3, $4)
    RETURNING *;`,

  listAnnouncements: `
    SELECT *
    FROM announcements
    WHERE offering_id = $1
    ORDER BY posted_at DESC;`,
};
```

3. **Service** — `src/services/announcements.services.js`

```js
import { pool } from "../db/pool.js";
import { queries } from "../db/queries.js";

export async function createAnnouncement({ offeringId, title, content, userId }) {
  const { rows } = await pool.query(queries.createAnnouncement, [offeringId, title, content, userId]);
  return rows[0];
}

export async function listAnnouncements(offeringId) {
  const { rows } = await pool.query(queries.listAnnouncements, [offeringId]);
  return rows;
}
```

4. **Controller** — `src/controllers/announcements.controller.js`

```js
import * as svc from "../services/announcements.services.js";

export async function create(req, res, next) {
  try {
    const { offeringId, title, content } = req.body;
    const userId = req.user?.id || null;
    const result = await svc.createAnnouncement({ offeringId, title, content, userId });
    res.status(201).json(result);
  } catch (err) { next(err); }
}

export async function list(req, res, next) {
  try {
    const { offeringId } = req.params;
    const result = await svc.listAnnouncements(offeringId);
    res.json(result);
  } catch (err) { next(err); }
}
```

5. **Routes** — `src/routes/announcements.routes.js`

```js
import { Router } from "express";
import * as c from "../controllers/announcements.controller.js";
import { requireAuth } from "../middleware/auth.js";

const r = Router();
r.post("/", requireAuth, c.create);
r.get("/:offeringId", requireAuth, c.list);
export default r;
```

6. **Mount in `server.js`**

```js
import announcementsRoutes from "./src/routes/announcements.routes.js";
app.use("/api/announcements", announcementsRoutes);
```

7. **Apply schema**

```bash
CONFIRM_RESET=yes npm run db:reset
```

---

## Production Migrations

> **Do not** use `db-reset.sh` in production.

1. Create **versioned** migration files
2. Use a migration tool (e.g., **node-pg-migrate**)
3. Apply migrations **incrementally** with CI/CD safeguards

---

## Troubleshooting

| Issue / Error                             | How to Fix                                                                                                                                                                                                       |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `psql: command not found`                 | **macOS:** `brew install postgresql@16` → add to PATH:<br>`echo 'export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc`<br>**Ubuntu:** `sudo apt install postgresql-client-16` |
| `Error: Missing required env: JWT_SECRET` | Generate and append:<br>`` `echo "JWT_SECRET=$(openssl rand -hex 32)" >> .env` ``                                                                                                                                |
| `Error: connect ECONNREFUSED ::1:5432`    | Check if Postgres is running:<br>`brew services list \| grep postgresql` / `sudo systemctl status postgresql`<br>Start it:<br>`brew services start postgresql@16`<br>Test:<br>`psql postgres -c "SELECT 1;"`     |
| `relation "users" does not exist`         | Initialize DB:<br>`npm run db:init`                                                                                                                                                                              |
| Docker container crashes                  | View logs: `docker compose logs api`<br>Port conflict (8888): `lsof -i :8888` then `kill -9 <PID>`<br>DB not ready: `docker compose restart db` or `docker compose up -d --force-recreate`                       |
| `Cannot find module 'argon2'`             | Rebuild native modules: `npm rebuild argon2`<br>Or clean install: `rm -rf node_modules package-lock.json && npm install`                                                                                         |

---

## Testing

Kanvas uses a Docker-based testing pipeline to ensure consistent, isolated test environments across all machines. Running `npm test` will:

1. **Spin up a test PostgreSQL database** in Docker (separate from development DB)
2. **Seed the test database** with sample data using the existing seed scripts
3. **Run comprehensive integration tests** covering all API routes
4. **Clean up containers** automatically after tests complete

### Test Coverage

The test suite includes:
- **Authentication tests**: Login/logout flows, JWT token validation, user session management
- **Authorization tests**: Role-based access control, permission checks for different user types  
- **Route integration tests**: All major API endpoints (users, courses, assignments, etc.)
- **Database integration**: Tests verify seeded data is accessible and routes return expected data structures

Tests verify both successful operations and proper error handling (401 unauthorized, 403 forbidden, 404 not found).

### Running Tests

```bash
# Full Docker pipeline (recommended)
npm test

# Run tests directly (requires local test DB)
npm run test:run
```

<details>
<summary>🔍 <strong>Example test run output</strong> (click to expand)</summary>

```
➜  server git:(main) ✗ npm run test                                                                                                            

> server@1.0.0 test
> bash scripts/test.sh

🧪 Starting Express App Test Pipeline
📦 Building test containers...
[+] Building 1.1s (15/15) FINISHED                                                                                                             
 => [internal] load local bake definitions                                                                                                0.0s 
 => => reading from stdin 550B                                                                                                            0.0s
 => [internal] load build definition from Dockerfile.test                                                                                 0.1s
 => => transferring dockerfile: 316B                                                                                                      0.0s 
 => resolve image config for docker-image://docker.io/docker/dockerfile:1                                                                 0.2s 
 => CACHED docker-image://docker.io/docker/dockerfile:1@sha256:b6afd42430b15f2d2a4c5a02b919e98a525b785b1aaff16747d2f623364e39b6           0.0s
 => [internal] load metadata for docker.io/library/node:20-alpine                                                                         0.2s 
 => [internal] load .dockerignore                                                                                                         0.0s
 => => transferring context: 523B                                                                                                         0.0s 
 => [1/6] FROM docker.io/library/node:20-alpine@sha256:6178e78b972f79c335df281f4b7674a2d85071aae2af020ffa39f0a770265435                   0.0s 
 => [internal] load build context                                                                                                         0.1s 
 => => transferring context: 308.61kB                                                                                                     0.1s 
 => CACHED [2/6] WORKDIR /app                                                                                                             0.0s
 => CACHED [3/6] RUN apk add --no-cache python3 make g++                                                                                  0.0s 
 => CACHED [4/6] COPY package*.json ./                                                                                                    0.0s 
 => CACHED [5/6] RUN npm ci                                                                                                               0.0s 
 => CACHED [6/6] COPY . .                                                                                                                 0.0s 
 => exporting to image                                                                                                                    0.0s 
 => => exporting layers                                                                                                                   0.0s 
 => => writing image sha256:89c80c1ae4196d59034e31703f1d2ca033f522ad61bef612e27be98559f4a4e7                                              0.0s 
 => => naming to docker.io/library/server-test-runner                                                                                     0.0s 
 => resolving provenance for metadata file                                                                                                0.0s 
[+] Building 1/1
 ✔ server-test-runner  Built                                                                                                              0.0s 
🗄️ Starting test database...
[+] Running 2/2
 ✔ Network server_default    Created                                                                                                      0.0s 
 ✔ Container kanvas-test-db  Started                                                                                                      0.3s 
⏳ Waiting for test database to be ready...
/var/run/postgresql:5432 - no response
/var/run/postgresql:5432 - accepting connections
🌱 Initializing and seeding test database...
[+] Creating 1/1
 ✔ Container kanvas-test-db  Running                                                                                                      0.0s 
Applying schema (db.sql)...
Seeding base data (seed.sql)...
Running scripted seed (seed.js)...
Database initialized.
Seeding users (teachers + students) via upsert …
Assigning teachers to existing offerings…
Backfilling historical prerequisite completions…
Creating 5 assignments for all other past offerings lacking them…
Created assignments for 3 past offerings.
Seeding current FALL25 Knuth offerings (open assignments, all students)…
Seed complete
Default password for all seeded users: password123
🚀 Running tests...
[+] Creating 1/1
 ✔ Container kanvas-test-db  Running                                                                                                      0.0s 

> server@1.0.0 test:run
> vitest run


 RUN  v3.2.4 /app

 ✓ tests/auth.test.js (7 tests) 196ms
   ✓ Authentication Routes (7)
     ✓ POST /api/auth/login (4)
       ✓ should login with valid credentials 63ms
       ✓ should reject invalid credentials 3ms
       ✓ should reject missing email 2ms
       ✓ should reject missing password 7ms
     ✓ POST /api/auth/logout (1)
       ✓ should logout successfully when authenticated 46ms
     ✓ GET /api/auth/me (2)
       ✓ should return user info when authenticated 55ms
       ✓ should return 401 when not authenticated 3ms
stdout | tests/assignments.test.js > Assignments Routes > GET /api/assignments/offering/:offeringId > should return 403 for assignments for offering when not authorized for specific offering
Offering with prereqs: {
  id: '1',
  course_id: '1',
  course_code: 'CEE',
  course_name: 'Civil & Environmental Engineering',
  offering_code: 'CEE101',
  offering_name: 'Engineering Computation and Data Science',
  description: 'Presents engineering problems in a computational setting with emphasis on data science and problem abstraction. Covers exploratory data analysis and visualization, filtering, regression. Building basic machine learning models (classifiers, decision trees, clustering) for smart city applications. Labs and programming projects focused on analytics problems faced by cities, infrastructure, and environment.',     
  credits: 4,
  term_code: 'FALL25',
  section: 'A',
  total_seats: 28,
  is_active: true,
  enrollment_open: true,
  teacher_id: '5',
  teacher_name: 'Grace Hopper',
  prerequisites: [ { id: 62, code: 'MATH151', name: 'Calculus I' } ]
}

stdout | tests/assignments.test.js > Assignments Routes > GET /api/assignments/:id > should get specific assignment when authenticated
Offering with prereqs: {
  id: '1',
  course_id: '1',
  course_code: 'CEE',
  course_name: 'Civil & Environmental Engineering',
  offering_code: 'CEE101',
  offering_name: 'Engineering Computation and Data Science',
  description: 'Presents engineering problems in a computational setting with emphasis on data science and problem abstraction. Covers exploratory data analysis and visualization, filtering, regression. Building basic machine learning models (classifiers, decision trees, clustering) for smart city applications. Labs and programming projects focused on analytics problems faced by cities, infrastructure, and environment.',     
  credits: 4,
  term_code: 'FALL25',
  section: 'A',
  total_seats: 28,
  is_active: true,
  enrollment_open: true,
  teacher_id: '5',
  teacher_name: 'Grace Hopper',
  prerequisites: [ { id: 62, code: 'MATH151', name: 'Calculus I' } ]
}

 ✓ tests/courses.test.js (4 tests) 206ms
   ✓ Courses Routes (4)
     ✓ GET /api/courses (2)
       ✓ should get courses when authenticated 91ms
       ✓ should reject unauthenticated requests 2ms
     ✓ GET /api/courses/:id (2)
       ✓ should get specific course when authenticated 51ms
       ✓ should return 404 for non-existent course 47ms
 ✓ tests/users.test.js (4 tests) 223ms
   ✓ Users Routes (4)
     ✓ GET /api/users (2)
       ✓ should get users when authenticated as teacher 92ms
       ✓ should reject unauthenticated requests 5ms
     ✓ GET /api/users/:id (2)
       ✓ should return 403 when trying to access specific user (authorization required) 58ms
       ✓ should return 403 for non-existent user (authorization required) 54ms
 ✓ tests/assignments.test.js (4 tests) 227ms
   ✓ Assignments Routes (4)
     ✓ GET /api/assignments/offering/:offeringId (2)
       ✓ should return 403 for assignments for offering when not authorized for specific offering 106ms
       ✓ should reject unauthenticated requests 4ms
     ✓ GET /api/assignments/:id (2)
       ✓ should get specific assignment when authenticated 55ms
       ✓ should return 404 for non-existent assignment 43ms

 Test Files  4 passed (4)
      Tests  19 passed (19)
   Start at  02:48:59
   Duration  973ms (transform 458ms, setup 513ms, collect 1.35s, tests 852ms, environment 0ms, prepare 297ms)

🎉 All tests completed successfully!
🧹 Cleaning up test containers...
Deleted build cache objects:
xt9f10v95c0hbdnl7y3egk479
l4ohhf4q3biywcnxlf0v9sodq
luuzbx8pg465hke0321wo40h2

Total reclaimed space: 306.1kB
✅ Cleanup complete
```

</details>

---

## Seed Logins

| Role    | Email                     | Password      |
| ------- | ------------------------- | ------------- |
| Student | `ajoh@kanvas.edu`         | `password123` |
| Teacher | `atur@faculty.kanvas.edu` | `password123` |

> If login still fails, re-seed: `CONFIRM_RESET=yes npm run db:reset`

---

## Additional Resources

| Topic / Doc          | Link                                                                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| PostgreSQL 16 Docs   | [https://www.postgresql.org/docs/16/](https://www.postgresql.org/docs/16/)                                                       |
| Express 5.x API      | [https://expressjs.com/en/5x/api.html](https://expressjs.com/en/5x/api.html)                                                     |
| JWT Best Practices   | [https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/) |
| Argon2 (node-argon2) | [https://github.com/ranisalt/node-argon2](https://github.com/ranisalt/node-argon2)                                               |
| Docker Compose       | [https://docs.docker.com/compose/](https://docs.docker.com/compose/)                                                             |

---


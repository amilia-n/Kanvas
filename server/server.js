import "dotenv/config";  
import path from 'node:path';
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { config } from "./src/config/env.js";

import authRoutes from "./src/routes/auth.routes.js";
import usersRoutes from "./src/routes/users.routes.js";
import coursesRoutes from "./src/routes/courses.routes.js";
import assignmentsRoutes from "./src/routes/assignments.routes.js";
import enrollmentsRoutes from "./src/routes/enrollments.routes.js";
import gradesRoutes from "./src/routes/grades.routes.js";
import materialsRoutes from "./src/routes/materials.routes.js";
import offeringsRoutes from "./src/routes/offerings.routes.js";
import submissionsRoutes from "./src/routes/submissions.routes.js";

import notFound from "./src/middleware/notFound.js";
import errorHandler from "./src/middleware/error.js";

import cookieParser from "cookie-parser";


const app = express();
const dist = path.join(process.cwd(), '..', 'client', 'dist');
app.enable("trust proxy");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/assignments", assignmentsRoutes);
app.use("/api/enrollments", enrollmentsRoutes);
app.use("/api/grades", gradesRoutes);
app.use("/api/materials", materialsRoutes);
app.use("/api/offerings", offeringsRoutes);
app.use("/api/submissions", submissionsRoutes);

// Serve static files from the client build
app.use(express.static(dist));

// SPA fallback - serve index.html for all non-API routes
app.use((req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return next();
  }
  // Serve index.html for all other routes
  res.sendFile(path.join(dist, 'index.html'));
});

app.use(notFound);
app.use(errorHandler);

const port = Number(config.PORT) || 8888;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

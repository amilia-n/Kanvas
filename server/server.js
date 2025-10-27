import "dotenv/config";  
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { config } from "./src/config/env.js";

import cookieParser from "cookie-parser";

const app = express();
app.enable("trust proxy");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(morgan("dev"));

const port = Number(config.PORT) || 8888;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
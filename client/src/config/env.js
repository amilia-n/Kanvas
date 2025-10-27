const RAW = (import.meta.env.VITE_API_URL || "/api").trim();

const API_URL = (() => {
  if (RAW.startsWith("http")) {
    // If missing /api -> append it
    const noTrail = RAW.replace(/\/$/, "");
    return noTrail.endsWith("/api") ? noTrail : `${noTrail}/api`;
  }
  // If none -> default to "/api"
  return RAW === "/api" ? RAW : "/api";
})();

// Scheme + host + port only (used by axios baseURL)
const API_ORIGIN = (() => {
  try {
    return new URL(API_URL, window.location.origin).origin;
  } catch {
    return window.location.origin;
  }
})();

export const ENV = Object.freeze({
  API_URL,     // "http://localhost:8888/api" or "/api"
  API_ORIGIN,  // "http://localhost:8888"
  TOKEN_KEY: import.meta.env.VITE_TOKEN_STORAGE_KEY || "kanvas_token",
});

if (!import.meta.env.VITE_API_URL) {
  console.warn("[env] VITE_API_URL not set. Using relative '/api'.");
}

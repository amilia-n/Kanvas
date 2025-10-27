const LOCALE = "en-US";

export const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(+d)) return "—";
  return new Intl.DateTimeFormat(LOCALE, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
};

export const formatDateTime = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(+d)) return "—";
  return new Intl.DateTimeFormat(LOCALE, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
};

export const formatPercent = (value, digits = 1) => {
  if (value === null || value === undefined || Number.isNaN(+value)) return "—";
  return `${Number(value).toFixed(digits)}%`;
};

export const formatGPA = (value) => {
  if (value === null || value === undefined || Number.isNaN(+value)) return "—";
  return Number(value).toFixed(2);
};

// 'YYYY-MM-DD' 
export const toISODate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(+d)) return null;
  return d.toISOString().slice(0, 10);
};

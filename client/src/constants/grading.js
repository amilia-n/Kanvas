export const PASS_THRESHOLD = 77;

export const CUTS = {
  "A+": 97, A: 93, "A-": 90,
  "B+": 87, B: 83, "B-": 80,
  "C+": 77, C: 73, "C-": 70,
  "D+": 67, D: 63, "D-": 60,
  F: 0,
};

export const ORDER = ["A+","A","A-","B+","B","B-","C+","C","C-","D+","D","D-","F"];

export function letterToPercent(letter){
  const idx = ORDER.indexOf(letter);
  if (idx === -1) throw new Error(`Unknown letter grade: ${letter}`);
  const lo = CUTS[letter];
  const hi = idx === 0 ? 100 : CUTS[ORDER[idx-1]];
  return Math.round(((lo + hi) / 2) * 10) / 10;
}

export function percentToLetter(pct) {
  const v = Math.max(0, Math.min(100, Number(pct)));
  for (const k of ORDER) {
    if (v >= CUTS[k]) return k;
  }
  return "F";
}

export const passedWithCPlus = (pct) => pct >= PASS_THRESHOLD;

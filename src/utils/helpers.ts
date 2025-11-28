export const LIMIT_SECONDS = 25 * 60;

export function fmt(sec: number) {
  const s = Math.max(0, sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return [h, m, r].map((n) => n.toString().padStart(2, "0")).join(":");
}

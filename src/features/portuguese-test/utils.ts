export const fmt = (s: number) => {
  const m = Math.floor(s / 60).toString().padStart(1, "0");
  const ss = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${ss}`;
};
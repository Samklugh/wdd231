export function read(key, fallback) {
  try { return JSON.parse(localStorage.getItem(`jazz-${key}`)) ?? fallback; }
  catch { return fallback; }
}
export function save(key, value) {
  try { localStorage.setItem(`jazz-${key}`, JSON.stringify(value)); return true; }
  catch { return false; }
}

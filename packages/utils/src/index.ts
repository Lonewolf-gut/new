export function formatDate(d: Date) {
  return d.toLocaleString()
}

export function clamp(n: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, n))
}
